import { LandingHeader, LandingHeaderMenuItem } from '@/components/landing';
import ThemeSwitch from '@/components/shared/ThemeSwitch';
import SearchButton from '@/components/search/SearchButton';
import { Button } from '@/components/shared/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ className }: { className?: string }) => {
  return (
    <LandingHeader
      className={className}
      fixed
      withBackground
      variant="primary"
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
      <LandingHeaderMenuItem href="/about">About Us</LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/investors">Investors</LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/impact">Impact</LandingHeaderMenuItem>
      <LandingHeaderMenuItem href="/contact">Contact Us</LandingHeaderMenuItem>

      <SearchButton />
      <ThemeSwitch />
    </LandingHeader>
  );
};

export default Header;
