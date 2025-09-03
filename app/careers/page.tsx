import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Careers() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Join Our Team and Help Build a Greener Future
          </h1>

          <p className="mt-6 md:text-xl">
            At Tree Partner Solutions, we're committed to making a lasting
            impact by supporting smallholder farmers in East Africa. Our mission
            is to fight climate change while providing sustainable earnings for
            our partners. Join us in creating a brighter, greener tomorrow.
          </p>

          <p className="mt-6 md:text-xl">
            As part of our team, you'll contribute to innovative solutions that
            empower communities, promote environmental stewardship, and generate
            strong returns for investors. We're looking for passionate
            individuals eager to make a difference.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
