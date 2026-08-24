import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Logo({ className = '', href = '/' }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <FileText size={17} strokeWidth={2.2} />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        Resume<span className="text-blue-600">Master</span>
      </span>
    </Link>
  );
}
