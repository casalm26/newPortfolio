import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function OurTeam() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Meet Our Team
          </h1>

          <p className="mt-6 md:text-xl">
            Our dedicated team is committed to delivering exceptional results
            and innovative solutions for our clients. We bring together diverse
            expertise in technology, business strategy, and customer success to
            create impactful solutions that drive growth and transformation.
          </p>

          <p className="mt-6 md:text-xl">
            Our passionate team works tirelessly to understand your unique needs
            and develop tailored solutions that exceed expectations. Join us in
            building something amazing together—let's transform your business
            and achieve remarkable success.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
