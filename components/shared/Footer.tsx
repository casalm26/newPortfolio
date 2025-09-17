import {
  LandingFooter,
  LandingFooterColumn,
  LandingFooterLink,
} from "@/components/landing";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ className }: { className?: string }) => {
  return (
    <LandingFooter
      className={className}
      title="Tree Partner Solutions"
      description="Sustainable forestry investment in East Africa"
      withBackground={true}
      variant="primary"
      withBackgroundGlow={false}
      footnote={
        <div className="text-center p-6">
          © 2023 Tree Partner Solutions AB. All rights reserved.
        </div>
      }
      logoComponent={
        <div className="flex items-center text-primary-900 dark:text-primary-100 gap-3">
          <Image
            src="/static/images/logo.png"
            alt="Tree Partner Solutions logo"
            width={200}
            height={200}
            className="h-8 w-8 rounded-full"
          />
          Tree Partner Solutions
        </div>
      }
    >
      <LandingFooterColumn title="Company">
        <LandingFooterLink href="/about">About Us</LandingFooterLink>
        <LandingFooterLink href="/team">Our Team</LandingFooterLink>
        <LandingFooterLink href="/careers">Careers</LandingFooterLink>
        <LandingFooterLink href="/governance">Governance</LandingFooterLink>
        <LandingFooterLink href="/sustainability">
          Sustainability
        </LandingFooterLink>
      </LandingFooterColumn>

      <LandingFooterColumn title="Investors">
        <LandingFooterLink href="/investor-centre">
          Investor Centre
        </LandingFooterLink>
        <LandingFooterLink href="/reports">
          Reports & Documents
        </LandingFooterLink>
        <LandingFooterLink href="/share-information">
          Share Information
        </LandingFooterLink>
        <LandingFooterLink href="/calendar">
          Financial Calendar
        </LandingFooterLink>
      </LandingFooterColumn>

      <LandingFooterColumn title="Resources">
        <LandingFooterLink href="/news">News & Updates</LandingFooterLink>
        <LandingFooterLink href="/all-articles">Blog</LandingFooterLink>
        <LandingFooterLink href="/faq">FAQ</LandingFooterLink>
        <LandingFooterLink href="/contact">Contact Us</LandingFooterLink>
      </LandingFooterColumn>

      <LandingFooterColumn title="Legal">
        <LandingFooterLink href="/terms">Terms of Service</LandingFooterLink>
        <LandingFooterLink href="/privacy">Privacy Policy</LandingFooterLink>
        <LandingFooterLink href="/cookies">Cookie Policy</LandingFooterLink>
        <LandingFooterLink href="/gdpr">GDPR Compliance</LandingFooterLink>
      </LandingFooterColumn>
    </LandingFooter>
  );
};

export default Footer;
