import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { LandingTeamSection, LandingTeamMember } from '@/components/landing';

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            About Our Company
          </h1>

          <p className="mt-6 md:text-xl">
            We are a forward-thinking company dedicated to delivering innovative
            solutions that help businesses thrive in today's competitive
            landscape. Our team of experts combines cutting-edge technology with
            deep industry knowledge to create exceptional results for our
            clients.
          </p>

          <p className="mt-6 md:text-xl">
            Founded with the vision of transforming how businesses operate, we
            have grown to become a trusted partner for organizations of all
            sizes. Our commitment to excellence, integrity, and customer success
            drives everything we do.
          </p>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="md:text-lg">
              To empower businesses with innovative technology solutions that
              drive growth, efficiency, and success in an ever-evolving digital
              world.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p>We constantly push boundaries to deliver cutting-edge solutions.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p>We maintain the highest standards in everything we create.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p>We build trust through honest and transparent relationships.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer Success</h3>
                <p>Your success is our success, and we're committed to helping you achieve your goals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <LandingTeamSection
          title="Meet Our Team"
          description="Our experienced team of professionals is dedicated to your success."
          className="mt-16 mb-8"
        >
          <LandingTeamMember
            name="Alex Thompson"
            role="Founder & CEO"
            imageSrc="/static/images/people/4.webp"
            description="Visionary leader with 15+ years of industry experience."
          />
          <LandingTeamMember
            name="Jessica Wu"
            role="Head of Product"
            imageSrc="/static/images/people/5.webp"
            description="Product strategist focused on user experience and innovation."
          />
          <LandingTeamMember
            name="David Kumar"
            role="Lead Developer"
            imageSrc="/static/images/people/6.webp"
            description="Technical expert ensuring platform reliability and performance."
          />
          <LandingTeamMember
            name="Sarah Martinez"
            role="Marketing Director"
            imageSrc="/static/images/people/1.webp"
            description="Creative strategist driving brand growth and customer engagement."
          />
        </LandingTeamSection>
      </div>

      <Footer />
    </div>
  );
}