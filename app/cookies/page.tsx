import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Cookies() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Cookie Policy
          </h1>

          <p className="mt-6 md:text-xl">
            At Tree Partner Solutions, we value transparency and want to inform
            you about how we use cookies on our website. Cookies help us improve
            your browsing experience and tailor our content to better suit your
            interests.
          </p>

          <p className="mt-6 md:text-xl">
            This cookie policy explains what cookies are, how we utilize them,
            and your options for managing these technologies while visiting our
            site. By continuing to use our website, you agree to our use of
            cookies as described in this policy.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
