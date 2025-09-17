import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function Gdpr() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            GDPR Compliance
          </h1>

          <p className="mt-6 md:text-xl">
            At Tree Partner Solutions, we prioritize your privacy and are
            committed to protecting your personal data in accordance with GDPR
            regulations. Our privacy practices ensure that any information you
            share with us is handled securely and transparently.
          </p>

          <p className="mt-6 md:text-xl">
            By investing through our platform, you help foster a sustainable
            future by supporting smallholder farmers in East Africa, combating
            climate change, and earning strong returns. We are dedicated to
            maintaining your trust through compliance and responsible data
            management.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
