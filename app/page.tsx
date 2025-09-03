// @ts-nocheck
import Image from 'next/image';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { SiGithub } from '@icons-pack/react-simple-icons';
import {
  LandingPrimaryImageCtaSection,
  LandingStatsSection,
  LandingStatItem,
  LandingProductFeature,
  LandingProductFeaturesGrid,
  LandingTestimonialGrid,
  LandingBlogList,
  LandingBlogPost,
  LandingFaqSection,
  LandingTeamSection,
  LandingTeamMember,
  LandingProductProblemSolution,
  LandingWavesCtaBg,
  LandingSaleCtaSection,
  LandingAppStoreButton,
  LandingSocialProof,
} from '@/components/landing';
import {
  ArrowRight,
  Rocket,
  Globe,
  Users,
  Star,
  FileText,
  BarChart4,
  Shield,
  Zap,
  CheckCircle,
} from 'lucide-react';

export default function Page() {
  return (
    <>
      {/* Header */}
      <Header className="mb-4" />

      {/* Hero Section */}
      <LandingPrimaryImageCtaSection
        titleComponent={
          <h1 className="font-normal text-2xl md:text-3xl lg:text-4xl leading-tight md:max-w-2xl">
            Build something{' '}
            <span className="font-medium inline-block md:leading-12 px-2 md:px-4 py-1 md:py-2 bg-primary-500/20">
              amazing today
            </span>{' '}
            with our platform.
          </h1>
        }
        description="Transform your ideas into reality with our cutting-edge solutions. Join thousands of businesses that trust us to deliver exceptional results."
        ctaButtons={
          <div className="flex flex-col md:flex-row gap-4">
            <Button asChild className="w-full md:w-auto">
              <Link href="/contact">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        }
        imageSrc="/static/images/backdrop-2.webp"
        imageAlt="Business success visualization"
        imagePosition="right"
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
      />

      {/* Stats Section */}
      <LandingStatsSection
        titleComponent={
          <h2 className="text-2xl font-semibold text-center mb-8">
            Trusted by Industry Leaders
          </h2>
        }
        className="mb-16"
      >
        <LandingStatItem
          icon={<Users className="h-8 w-8" />}
          title="50,000+"
          description="Active Users"
        />
        <LandingStatItem
          icon={<Globe className="h-8 w-8" />}
          title="100+"
          description="Countries Served"
        />
        <LandingStatItem
          icon={<Star className="h-8 w-8" />}
          title="4.9/5"
          description="Customer Rating"
        />
        <LandingStatItem
          icon={<BarChart4 className="h-8 w-8" />}
          title="99.9%"
          description="Uptime Guarantee"
        />
      </LandingStatsSection>

      {/* Problem Solution Section */}
      <LandingProductProblemSolution
        title="The Challenge"
        problem="Many businesses struggle with outdated systems, inefficient processes, and the complexity of modern technology. These challenges slow growth and limit potential."
        solutionTitle="Our Solution"
        solution="We provide comprehensive solutions that streamline your operations, boost efficiency, and drive growth through innovative technology and expert support."
        className="mb-16"
      />

      {/* Features Grid */}
      <LandingProductFeaturesGrid
        title="Everything You Need to Succeed"
        description="Our platform offers a complete suite of tools and features designed to help your business thrive in today's competitive landscape."
        className="mb-16"
      >
        <LandingProductFeature
          title="Lightning Fast Performance"
          description="Experience blazing-fast speeds with our optimized infrastructure and cutting-edge technology stack."
          icon={<Zap className="h-8 w-8" />}
        />
        <LandingProductFeature
          title="Enterprise Security"
          description="Bank-level security protocols protect your data with end-to-end encryption and advanced threat detection."
          icon={<Shield className="h-8 w-8" />}
        />
        <LandingProductFeature
          title="24/7 Support"
          description="Our dedicated support team is available around the clock to help you succeed and resolve any issues."
          icon={<Users className="h-8 w-8" />}
        />
        <LandingProductFeature
          title="Advanced Analytics"
          description="Gain valuable insights with comprehensive reporting and real-time analytics dashboards."
          icon={<BarChart4 className="h-8 w-8" />}
        />
        <LandingProductFeature
          title="Seamless Integration"
          description="Connect with your existing tools and workflows through our extensive API and integration library."
          icon={<Globe className="h-8 w-8" />}
        />
        <LandingProductFeature
          title="Scalable Solution"
          description="Grow without limits with our scalable architecture that adapts to your business needs."
          icon={<Rocket className="h-8 w-8" />}
        />
      </LandingProductFeaturesGrid>

      {/* Testimonials */}
      <LandingTestimonialGrid
        title="What Our Customers Say"
        description="Don't just take our word for it. Here's what industry leaders have to say about our platform."
        className="mb-16"
        testimonialItems={[
          {
            name: 'Sarah Johnson',
            role: 'CEO',
            company: 'TechCorp Inc.',
            content:
              'This platform transformed our business operations. The efficiency gains and cost savings have been remarkable.',
            imageSrc: '/static/images/people/1.webp',
            rating: 5,
          },
          {
            name: 'Michael Chen',
            role: 'CTO',
            company: 'InnovateLabs',
            content:
              'The technical excellence and support quality exceeded our expectations. Highly recommended for any serious business.',
            imageSrc: '/static/images/people/2.webp',
            rating: 5,
          },
          {
            name: 'Emily Rodriguez',
            role: 'Operations Director',
            company: 'GlobalSolutions',
            content:
              'Implementation was smooth and the results immediate. Our productivity increased by 40% in the first month.',
            imageSrc: '/static/images/people/3.webp',
            rating: 5,
          },
        ]}
      />

      {/* Team Section */}
      <LandingTeamSection
        title="Meet Our Team"
        description="Our experienced team of professionals is dedicated to your success."
        className="mb-16"
      >
        <LandingTeamMember
          member={{
            name: "Alex Thompson",
            role: "Founder & CEO",
            imageSrc: "/static/images/people/4.webp",
            description: "Visionary leader with 15+ years of industry experience."
          }}
        />
        <LandingTeamMember
          member={{
            name: "Jessica Wu",
            role: "Head of Product",
            imageSrc: "/static/images/people/5.webp",
            description: "Product strategist focused on user experience and innovation."
          }}
        />
        <LandingTeamMember
          member={{
            name: "David Kumar",
            role: "Lead Developer",
            imageSrc: "/static/images/people/6.webp",
            description: "Technical expert ensuring platform reliability and performance."
          }}
        />
      </LandingTeamSection>

      {/* Latest Blog Posts */}
      <LandingBlogList
        title="Latest Insights"
        description="Stay updated with industry trends, tips, and company news."
        className="mb-16"
      >
        <LandingBlogPost
          post={{
            title: "10 Tips for Business Growth",
            summary: "Discover proven strategies to accelerate your business growth and reach new heights.",
            images: ["/static/images/backdrop-1.webp"],
            slug: "business-growth-tips",
            date: "2024-01-15"
          }}
        />
        <LandingBlogPost
          post={{
            title: "The Future of Technology",
            summary: "Explore emerging technologies and their impact on modern businesses.",
            images: ["/static/images/backdrop-3.webp"],
            slug: "future-of-technology",
            date: "2024-01-10"
          }}
        />
        <LandingBlogPost
          post={{
            title: "Customer Success Stories",
            summary: "Learn how our clients achieved remarkable results with our platform.",
            images: ["/static/images/backdrop-4.webp"],
            slug: "customer-success",
            date: "2024-01-05"
          }}
        />
      </LandingBlogList>

      {/* FAQ Section */}
      <LandingFaqSection
        title="Frequently Asked Questions"
        description="Find answers to common questions about our platform and services."
        className="mb-16"
        faqItems={[
          {
            question: 'How do I get started?',
            answer:
              'Getting started is easy! Simply sign up for a free account, and our onboarding team will guide you through the setup process.',
          },
          {
            question: 'What support do you offer?',
            answer:
              'We provide 24/7 customer support via chat, email, and phone. Our team of experts is always ready to help you succeed.',
          },
          {
            question: 'Can I integrate with existing tools?',
            answer:
              'Yes! Our platform offers extensive integration capabilities with popular business tools and custom APIs for seamless workflow integration.',
          },
          {
            question: 'Is there a free trial available?',
            answer:
              'Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to get started.',
          },
        ]}
      />

      {/* CTA Section */}
      <LandingSaleCtaSection
        title="Ready to Transform Your Business?"
        description="Join thousands of satisfied customers and take your business to the next level today."
        ctaHref="/contact"
        ctaLabel="Get Started Now"
        className="mb-16"
        withBackground
      />

      {/* Footer */}
      <Footer />
    </>
  );
}