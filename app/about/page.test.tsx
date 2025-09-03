import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './page';

// Mock the Header component
vi.mock('@/components/shared/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

describe('About Page', () => {
  describe('Page Rendering', () => {
    it('should render page title and description', () => {
      render(<About />);
      
      expect(screen.getByText('ABOUT.EXE')).toBeInTheDocument();
      expect(screen.getByText('Developer, problem solver, and technology enthusiast crafting digital experiences.')).toBeInTheDocument();
    });

    it('should render terminal command prompt', () => {
      render(<About />);
      
      expect(screen.getByText('caspian@localhost:~$ cat about.txt')).toBeInTheDocument();
    });

    it('should render bio section', () => {
      render(<About />);
      
      expect(screen.getByText(/whoami/)).toBeInTheDocument();
      expect(screen.getByText(/I'm a full-stack developer with a passion/)).toBeInTheDocument();
    });
  });

  describe('Skills Section', () => {
    it('should render skills matrix with frontend skills', () => {
      render(<About />);
      
      expect(screen.getByText(/ls -la skills/)).toBeInTheDocument();
      expect(screen.getByText('FRONTEND/')).toBeInTheDocument();
      expect(screen.getByText('React.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('Tailwind')).toBeInTheDocument();
    });

    it('should render backend skills', () => {
      render(<About />);
      
      expect(screen.getByText('BACKEND/')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Docker')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    it('should render skill progress bars', () => {
      render(<About />);
      
      // Check for progress bar characters
      expect(screen.getAllByText(/█+░*/)).toHaveLength(8); // 4 frontend + 4 backend skills
    });
  });

  describe('Philosophy Section', () => {
    it('should render development philosophy', () => {
      render(<About />);
      
      expect(screen.getByText(/cat philosophy\.md/)).toBeInTheDocument();
      expect(screen.getByText('DEVELOPMENT PHILOSOPHY')).toBeInTheDocument();
      expect(screen.getByText(/Clean, maintainable code is more valuable/)).toBeInTheDocument();
      expect(screen.getByText(/Performance matters, but premature optimization/)).toBeInTheDocument();
    });

    it('should render all philosophy points', () => {
      render(<About />);
      
      // Check for philosophy list items directly
      expect(screen.getByText('Clean, maintainable code is more valuable than clever code')).toBeInTheDocument();
      expect(screen.getByText('Performance matters, but premature optimization is the root of all evil')).toBeInTheDocument();
      expect(screen.getByText('User experience should drive technical decisions')).toBeInTheDocument();
      expect(screen.getByText('Continuous learning is essential in our ever-evolving field')).toBeInTheDocument();
    });
  });

  describe('Status Section', () => {
    it('should render current status information', () => {
      render(<About />);
      
      expect(screen.getByText(/ps aux.*current_status/)).toBeInTheDocument();
      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('AVAILABLE_FOR_OPPORTUNITIES')).toBeInTheDocument();
      expect(screen.getByText('Location:')).toBeInTheDocument();
      expect(screen.getByText('Remote / Global')).toBeInTheDocument();
    });

    it('should show availability status with proper styling', () => {
      render(<About />);
      
      const statusBadge = screen.getByText('AVAILABLE_FOR_OPPORTUNITIES');
      expect(statusBadge).toHaveClass('text-green-500');
    });
  });

  describe('Contact Information', () => {
    it('should render contact section', () => {
      render(<About />);
      
      expect(screen.getByText(/find.*contact/)).toBeInTheDocument();
      expect(screen.getByText('Interested in collaborating or discussing opportunities?')).toBeInTheDocument();
    });

    it('should render contact details', () => {
      render(<About />);
      
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('caspian@example.com')).toBeInTheDocument();
      expect(screen.getByText('GitHub:')).toBeInTheDocument();
      expect(screen.getByText('github.com/caspian')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn:')).toBeInTheDocument();
      expect(screen.getByText('linkedin.com/in/caspian')).toBeInTheDocument();
    });
  });

  describe('Terminal Styling', () => {
    it('should have matrix theme background', () => {
      const { container } = render(<About />);
      
      expect(container.firstChild).toHaveClass('min-h-screen', 'bg-black');
    });

    it('should have pixel font for terminal commands', () => {
      render(<About />);
      
      const commandPrompt = screen.getByText('caspian@localhost:~$ cat about.txt');
      expect(commandPrompt).toHaveClass('font-pixel', 'text-terminal-400');
    });

    it('should have proper terminal color scheme', () => {
      render(<About />);
      
      const title = screen.getByText('ABOUT.EXE');
      expect(title).toHaveClass('text-white', 'font-pixel');
    });

    it('should have bordered sections', () => {
      render(<About />);
      
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        if (section.querySelector('.border')) {
          expect(section).toHaveClass('border', 'border-terminal-400');
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive typography', () => {
      render(<About />);
      
      const title = screen.getByText('ABOUT.EXE');
      expect(title).toHaveClass('text-4xl', 'md:text-6xl');
    });

    it('should have responsive grid layout for skills', () => {
      render(<About />);
      
      const skillsSection = screen.getByText('FRONTEND/').closest('div');
      expect(skillsSection?.parentElement).toHaveClass('md:grid-cols-2');
    });

    it('should have responsive container padding', () => {
      const { container } = render(<About />);
      
      const main = container.querySelector('main');
      expect(main).toHaveClass('px-4', 'container', 'mx-auto');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<About />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('ABOUT.EXE');
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('should have semantic main content', () => {
      render(<About />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render without crashing', () => {
      expect(() => render(<About />)).not.toThrow();
    });

    it('should handle long text content properly', () => {
      render(<About />);
      
      // Should render long philosophy text without issues
      const longText = screen.getByText(/I'm a full-stack developer with a passion for building robust, scalable applications/);
      expect(longText).toBeInTheDocument();
    });
  });
});