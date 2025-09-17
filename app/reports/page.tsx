import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function Reports() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Reports & Documents
          </h1>

          <p className="mt-6 md:text-xl">
            Explore our latest reports and documents to understand how Tree
            Partner Solutions is making a positive impact. Our detailed
            investment overviews, sustainability reports, and project updates
            provide transparency and insights into our efforts to promote a
            greener future through empowering smallholder farmers in East
            Africa.
          </p>

          <p className="mt-6 md:text-xl">
            Invest in a sustainable tomorrow today. Download our investment
            overview to learn more about the opportunities to support climate
            action while earning strong returns. Join us in making a difference
            one tree at a time.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
