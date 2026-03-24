import { supabase } from './supabase';
import { sendGAEvent } from '@next/third-parties/google';

export async function trackEvent(eventName: string, eventData: any = {}) {
  // 1. Send to Google Analytics
  sendGAEvent('event', eventName, eventData);

  // 2. Send to Supabase for the Admin Dashboard
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_data: eventData,
      user_id: user?.id || null
    });
  } catch (error) {
    console.error('Failed to track event in Supabase:', error);
  }
}
