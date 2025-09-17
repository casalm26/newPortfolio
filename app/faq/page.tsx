import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function Faq() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Frequently Asked Questions
          </h1>

          <p className="mt-6 md:text-xl">
            At Tree Partner Solutions, we are dedicated to fostering a
            sustainable future by supporting smallholder farmers in East Africa.
            Our investment platform allows you to contribute to meaningful
            climate action while earning strong returns. Below are some common
            questions we receive.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>1. What is Tree Partner Solutions?</strong>
            <br />
            We are an impact investment company focused on reforestation and
            sustainable farming initiatives in East Africa. Our goal is to
            combat climate change, empower local communities, and generate
            attractive financial returns for our investors.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>2. How does the investment process work?</strong>
            <br />
            Investors review our investment overview, select project
            opportunities aligned with their values, and contribute funds. Funds
            are then used to support smallholder farmers in planting and
            maintaining new forests, with returns generated through sustainable
            harvesting and carbon credits.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>
              3. What are the benefits of investing with Tree Partner Solutions?
            </strong>
            <br />
            By investing, you help reforestation efforts in East Africa, fight
            climate change, support local farmers, and earn competitive returns,
            all while making a positive environmental impact.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>4. Is my investment secure?</strong>
            <br />
            Yes. We perform thorough project due diligence and provide
            transparent reporting. Our projects are designed for long-term
            sustainability, ensuring your investment is managed responsibly.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>5. How can I learn more?</strong>
            <br />
            For detailed information on our projects and investment
            opportunities, download our investment overview or contact our
            support team for personalized assistance.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
