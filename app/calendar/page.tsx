import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function Calendar() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Financial Calendar
          </h1>

          <p className="mt-6 md:text-xl">
            Stay informed with our latest investment schedules and key financial
            milestones. Our transparent timeline helps you plan your investments
            and understand how we’re working towards a greener future together.
          </p>

          <p className="mt-6 md:text-xl">
            By investing with Tree Partner Solutions, you contribute to
            supporting smallholder farmers in East Africa, combating climate
            change, and earning strong returns. Download our investment overview
            today to learn more about our impact and financial opportunities.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
