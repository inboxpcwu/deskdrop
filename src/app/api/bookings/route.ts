import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Using a client that can read cookies if needed, but for MVP we can use the headers
  const authHeader = request.headers.get('Authorization');
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader || '' } }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await request.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items in booking' }, { status: 400 });
  }

  try {
    for (const item of items) {
      const { data: existing, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('space_id', item.space_id)
        .eq('status', 'confirmed')
        .or(`start_at.lte.${item.end_at},end_at.gte.${item.start_at}`)
        .limit(1);

      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: `Space ${item.space_name} is already booked for the selected time.` }, { status: 409 });
      }
    }

    const bookings = items.map(item => ({
      user_id: user.id,
      space_id: item.space_id,
      start_at: item.start_at,
      end_at: item.end_at,
      total_price: item.total_price,
      status: 'confirmed'
    }));

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookings)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, bookings: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
