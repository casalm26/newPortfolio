import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { LandingProductFeaturesGrid, LandingProductFeature } from '@/components/landing';
import { Zap, Shield, Users, BarChart4, Globe, Rocket, Settings, Headphones } from 'lucide-react';

export default function Services() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Our Services
          </h1>

          <p className="mt-6 md:text-xl">
            We offer comprehensive solutions designed to help your business grow,
            optimize operations, and achieve your goals. Our expert team delivers
            cutting-edge services tailored to your unique needs.
          </p>

          {/* Services Grid */}
          <LandingProductFeaturesGrid
            title="Complete Solutions for Your Business"
            description="From strategy to implementation, we provide end-to-end services that drive results."
            className="mt-16"
          >
            <LandingProductFeature
              title="Strategy & Consulting"
              description="Expert guidance to develop winning strategies and roadmaps for your business transformation."
              leadingComponent={<BarChart4 className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Technology Solutions"
              description="Custom software development and technology implementation to streamline your operations."
              leadingComponent={<Zap className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Security & Compliance"
              description="Comprehensive security solutions and compliance management to protect your business."
              leadingComponent={<Shield className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Team Training"
              description="Professional training programs to upskill your team and maximize platform adoption."
              leadingComponent={<Users className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Global Support"
              description="24/7 worldwide support with local expertise to ensure your success anywhere."
              leadingComponent={<Globe className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Scale & Growth"
              description="Scalable solutions that grow with your business, from startup to enterprise."
              leadingComponent={<Rocket className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Custom Integration"
              description="Seamless integration with your existing systems and third-party applications."
              leadingComponent={<Settings className="h-8 w-8 text-primary-500 mb-4" />}
            />
            <LandingProductFeature
              title="Premium Support"
              description="Dedicated account management and priority support for enterprise clients."
              leadingComponent={<Headphones className="h-8 w-8 text-primary-500 mb-4" />}
            />
          </LandingProductFeaturesGrid>

          <div className="mt-16">
            <h2 className="text-3xl font-semibold mb-8">Why Choose Our Services?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Proven Track Record</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  With hundreds of successful projects and satisfied clients, we have
                  the experience and expertise to deliver exceptional results.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Tailored Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We understand that every business is unique, and we create
                  customized solutions that fit your specific requirements and goals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Expert Team</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our team consists of industry experts with deep knowledge and
                  experience across multiple domains and technologies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Ongoing Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We don't just deliver and leave. We provide continuous support
                  and maintenance to ensure your long-term success.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}