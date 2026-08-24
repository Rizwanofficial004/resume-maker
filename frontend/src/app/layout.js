import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata = {
  title: {
    default: 'ResumeMaster — Build a Job-Winning Resume in Minutes',
    template: '%s | ResumeMaster',
  },
  description:
    'Create a professional, ATS-friendly resume in minutes. Modern templates, AI-powered writing help, and instant PDF & Word export.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
