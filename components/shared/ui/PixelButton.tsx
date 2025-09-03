import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PixelButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function PixelButton({ href, children, variant = 'primary', className }: PixelButtonProps) {
  const baseClasses = "font-pixel text-sm md:text-base px-6 py-3 border transition-all duration-75 uppercase tracking-wide inline-block text-center";
  
  const variantClasses = {
    primary: "bg-white text-black border-white hover:bg-transparent hover:text-white",
    secondary: "bg-transparent text-white border-terminal-400 hover:bg-white hover:text-black",
    outline: "bg-transparent text-terminal-400 border-terminal-400 hover:bg-terminal-400 hover:text-black"
  };

  return (
    <Link
      href={href}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}