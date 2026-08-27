import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container-app prose prose-slate max-w-3xl py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: August 25, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            ResumeMaster (“we”, “us”) helps you create resumes and cover letters. This policy explains what data we
            collect and how we use it.
          </p>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Information we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account details: name, email, and hashed password.</li>
              <li>Resume and cover letter content you enter in the product.</li>
              <li>Usage data such as AI feature requests and credit balance.</li>
              <li>Messages you send through the contact form.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">How we use information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To provide, maintain, and improve the service.</li>
              <li>To power AI writing features via our AI provider when you request them.</li>
              <li>To respond to support requests.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Third parties</h2>
            <p className="mt-2">
              AI features send the text you submit to our AI provider (OpenRouter / underlying models) solely to fulfill
              your request. We do not sell your personal data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Data retention &amp; deletion</h2>
            <p className="mt-2">
              We retain your account and documents while your account is active. Contact us to request account or data
              deletion.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <p className="mt-2">
              Questions about privacy? Reach us via the <a href="/contact" className="text-blue-600 underline">contact form</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
