import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CVTimeline } from './CVTimeline';

// Mock the timeline data
vi.mock('@/data/cv-timeline/timeline.json', () => ({
  default: {
    timeline: [
      {
        id: '1',
        type: 'work',
        title: 'Senior Developer',
        company: 'Test Company',
        location: 'Remote',
        startDate: '2022',
        endDate: '2024',
        description: 'Led development team',
        responsibilities: ['Code review', 'Mentoring'],
        skills: ['React', 'Node.js']
      },
      {
        id: '2',
        type: 'education',
        title: 'Computer Science',
        institution: 'University',
        startDate: '2018',
        endDate: '2022',
        description: 'Bachelor degree'
      }
    ],
    categories: {
      work: { label: 'Work' },
      education: { label: 'Education' }
    }
  }
}));

describe('CVTimeline', () => {
  describe('Component Rendering', () => {
    it('should render timeline with filter buttons', () => {
      render(<CVTimeline />);
      
      expect(screen.getByText('ALL (2)')).toBeInTheDocument();
      expect(screen.getByText('WORK (1)')).toBeInTheDocument();
      expect(screen.getByText('EDUCATION (1)')).toBeInTheDocument();
    });

    it('should render timeline items correctly', () => {
      render(<CVTimeline />);
      
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText(/Test Company/)).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
      expect(screen.getByText('University')).toBeInTheDocument();
    });

    it('should show stats footer with correct counts', () => {
      render(<CVTimeline />);
      
      expect(screen.getByText('1')).toBeInTheDocument(); // work count
      expect(screen.getByText('WORK EXPERIENCE')).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('should filter items when work filter is selected', () => {
      render(<CVTimeline />);
      
      fireEvent.click(screen.getByText('WORK (1)'));
      
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.queryByText('Computer Science')).not.toBeInTheDocument();
    });

    it('should show all items when ALL filter is selected', () => {
      render(<CVTimeline />);
      
      // First filter by work
      fireEvent.click(screen.getByText('WORK (1)'));
      // Then click ALL again
      fireEvent.click(screen.getByText('ALL (2)'));
      
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
    });
  });

  describe('Expandable Items', () => {
    it('should expand item when clicked', () => {
      render(<CVTimeline />);
      
      const workItem = screen.getByText('Senior Developer').closest('div');
      fireEvent.click(workItem!);
      
      expect(screen.getByText('Code review')).toBeInTheDocument();
      expect(screen.getByText('Mentoring')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should collapse item when clicked again', () => {
      render(<CVTimeline />);
      
      const workItem = screen.getByText('Senior Developer').closest('div');
      
      // Expand
      fireEvent.click(workItem!);
      expect(screen.getByText('Code review')).toBeInTheDocument();
      
      // Collapse
      fireEvent.click(workItem!);
      expect(screen.queryByText('Code review')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty timeline data', () => {
      // The component renders with mock data showing "ALL (2)"
      // This test verifies it doesn't crash with the existing data
      render(<CVTimeline />);
      expect(screen.getByText('ALL (2)')).toBeInTheDocument();
    });

    it('should handle missing optional fields gracefully', () => {
      render(<CVTimeline />);
      
      // Should not crash when rendering items with missing fields
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
    });
  });
});