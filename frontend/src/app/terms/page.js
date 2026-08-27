import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container-app max-w-3xl py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-1 text-sm text-slate-500">Last updated: August 25, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            By using ResumeMaster you agree to these terms. If you do not agree, do not use the service.
          </p>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">The service</h2>
            <p className="mt-2">
              ResumeMaster provides tools to build resumes and cover letters, including optional AI-assisted writing.
              Features, templates, and credit allotments may change over time.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Your account</h2>
            <p className="mt-2">
              You are responsible for keeping your login credentials secure and for activity under your account. Provide
              accurate information and do not misuse the service.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Your content</h2>
            <p className="mt-2">
              You retain ownership of the resume and letter content you create. You grant us a limited license to host
              and process that content to operate the product (including AI features you trigger).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">AI features</h2>
            <p className="mt-2">
              AI output may be inaccurate or incomplete. You are responsible for reviewing and editing all content
              before using it in job applications. AI credits are consumed when requests succeed.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Disclaimer</h2>
            <p className="mt-2">
              The service is provided “as is” without warranties of any kind. We are not liable for hiring outcomes or
              third-party decisions based on documents you create.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <p className="mt-2">
              Questions? Use our <a href="/contact" className="text-blue-600 underline">contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
