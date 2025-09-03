import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function ShareInformation() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Share Our Mission for a Greener Future
          </h1>

          <p className="mt-6 md:text-xl">
            Invest in a greener future with Tree Partner Solutions. By
            supporting smallholder farmers in East Africa, you can play a vital
            role in combating climate change while enjoying strong returns on
            your investment.
          </p>

          <p className="mt-6 md:text-xl">
            Help us expand sustainable agriculture, improve livelihoods, and
            promote environmental resilience. Download our investment overview
            today to learn more about how your support can make a difference.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
