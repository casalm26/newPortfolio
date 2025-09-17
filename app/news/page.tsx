import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function News() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            News & Updates
          </h1>

          <p className="mt-6 md:text-xl">
            Stay informed with the latest news and updates from Tree Partner
            Solutions. We’re committed to empowering smallholder farmers in East
            Africa, combating climate change, and delivering strong investment
            returns. Our ongoing initiatives and success stories reflect our
            dedication to building a greener, more sustainable future.
          </p>

          <p className="mt-6 md:text-xl">
            We regularly publish updates on our projects, insights into our
            vision, and opportunities for investors to participate in impactful
            farming initiatives. Explore how your support helps communities
            thrive while contributing to climate resilience and environmental
            conservation.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
