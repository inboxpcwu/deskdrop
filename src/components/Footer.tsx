import Link from 'next/link';
import { Mail, Globe, MessageSquare, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              DeskDrop
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The world&apos;s most community-focused co-working space network. Work from anywhere, anytime.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Browse Spaces</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Solutions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Connect</h4>
            <div className="flex gap-4">
              <Globe className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
              <Share2 className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
              <MessageSquare className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 DeskDrop. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
