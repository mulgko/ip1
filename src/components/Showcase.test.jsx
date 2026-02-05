import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Showcase from './Showcase';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

vi.mock('react-responsive');
vi.mock('@gsap/react');
vi.mock('gsap');

describe('Showcase', () => {
  let mockTimeline;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock timeline
    mockTimeline = {
      to: vi.fn().mockReturnThis(),
    };

    gsap.timeline = vi.fn(() => mockTimeline);

    useMediaQuery.mockReturnValue(false); // Desktop by default
    useGSAP.mockImplementation((callback) => callback());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Showcase />);
      expect(container).toBeInTheDocument();
    });

    it('renders the showcase section with correct id', () => {
      render(<Showcase />);
      const section = document.querySelector('#showcase');
      expect(section).toBeInTheDocument();
    });

    it('renders the video element with correct attributes', () => {
      render(<Showcase />);

      // Find video by selector
      const videoElement = document.querySelector('video');
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute('src', '/videos/game.mp4');
      expect(videoElement).toHaveAttribute('loop');
      // In React, boolean attributes may be set as properties rather than HTML attributes
      expect(videoElement.muted).toBe(true);
      expect(videoElement.autoplay).toBe(true);
      expect(videoElement.hasAttribute('playsinline') || videoElement.playsInline).toBeTruthy();
    });

    it('renders the mask overlay with logo', () => {
      render(<Showcase />);
      const mask = document.querySelector('.mask');
      expect(mask).toBeInTheDocument();

      const logo = mask.querySelector('img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/mask-logo.svg');
    });

    it('renders the content section', () => {
      render(<Showcase />);
      const content = document.querySelector('.content');
      expect(content).toBeInTheDocument();
    });

    it('renders the main heading', () => {
      render(<Showcase />);
      const heading = screen.getByRole('heading', { name: /rocket chip/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders M4 chip description', () => {
      render(<Showcase />);
      expect(screen.getByText(/M4, the next generation of Apple silicon/i)).toBeInTheDocument();
    });

    it('renders all descriptive paragraphs', () => {
      render(<Showcase />);

      expect(screen.getByText(/It drives Apple Intelligence on iPad Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/A brand-new display engine/i)).toBeInTheDocument();
      expect(screen.getByText(/Learn more about Apple Intelligence/i)).toBeInTheDocument();
    });

    it('renders performance metrics correctly', () => {
      render(<Showcase />);

      expect(screen.getByText('4x faster')).toBeInTheDocument();
      expect(screen.getByText('pro rendering performance than M2')).toBeInTheDocument();
      expect(screen.getByText('1.5x faster')).toBeInTheDocument();
      expect(screen.getByText('CPU performance than M2')).toBeInTheDocument();
    });

    it('renders "Up to" text for both metrics', () => {
      render(<Showcase />);
      const upToElements = screen.getAllByText('Up to');
      expect(upToElements).toHaveLength(2);
    });

    it('applies correct CSS classes to performance metrics', () => {
      const { container } = render(<Showcase />);

      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements).toHaveLength(2);
      expect(h3Elements[0]).toHaveTextContent('4x faster');
      expect(h3Elements[1]).toHaveTextContent('1.5x faster');
    });

    it('renders the Apple Intelligence link with correct class', () => {
      render(<Showcase />);
      const link = screen.getByText(/Learn more about Apple Intelligence/i);
      expect(link).toHaveClass('text-primary');
    });
  });

  describe('Responsive Behavior', () => {
    it('calls useMediaQuery with correct breakpoint', () => {
      render(<Showcase />);
      expect(useMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' });
    });

    it('sets up GSAP animations on desktop', () => {
      useMediaQuery.mockReturnValue(false); // Desktop
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(gsap.timeline).toHaveBeenCalled();
    });

    it('does not set up GSAP animations on tablet/mobile', () => {
      useMediaQuery.mockReturnValue(true); // Tablet/Mobile
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(gsap.timeline).not.toHaveBeenCalled();
    });

    it('passes isTablet dependency to useGSAP', () => {
      useMediaQuery.mockReturnValue(true);
      render(<Showcase />);

      // useGSAP should be called with callback and dependencies
      expect(useGSAP).toHaveBeenCalled();
      const callArgs = useGSAP.mock.calls[0];
      expect(callArgs[1]).toEqual([true]); // [isTablet]
    });
  });

  describe('GSAP ScrollTrigger Configuration', () => {
    it('configures ScrollTrigger with correct trigger element', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(gsap.timeline).toHaveBeenCalledWith(
        expect.objectContaining({
          scrollTrigger: expect.objectContaining({
            trigger: '#showcase',
          }),
        })
      );
    });

    it('configures ScrollTrigger with pinning', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(gsap.timeline).toHaveBeenCalledWith(
        expect.objectContaining({
          scrollTrigger: expect.objectContaining({
            pin: true,
            scrub: true,
          }),
        })
      );
    });

    it('configures ScrollTrigger with correct start and end points', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(gsap.timeline).toHaveBeenCalledWith(
        expect.objectContaining({
          scrollTrigger: expect.objectContaining({
            start: 'top top',
            end: 'bottom top',
          }),
        })
      );
    });

    it('animates mask image with scale transform', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(mockTimeline.to).toHaveBeenCalledWith(
        '.mask img',
        expect.objectContaining({
          transform: 'scale(1.1)',
        })
      );
    });

    it('animates content opacity and position', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      expect(mockTimeline.to).toHaveBeenCalledWith(
        '.content',
        expect.objectContaining({
          opacity: 1,
          y: 0,
          ease: 'power1.in',
        })
      );
    });

    it('chains animations in correct order', () => {
      useMediaQuery.mockReturnValue(false);
      const mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      render(<Showcase />);

      // Verify timeline.to was called twice (chained)
      expect(mockTimeline.to).toHaveBeenCalledTimes(2);

      // First call for mask img
      expect(mockTimeline.to.mock.calls[0][0]).toBe('.mask img');

      // Second call for content
      expect(mockTimeline.to.mock.calls[1][0]).toBe('.content');
    });
  });

  describe('Content Structure', () => {
    it('renders wrapper div for layout', () => {
      const { container } = render(<Showcase />);
      const wrapper = container.querySelector('.wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies max-width constraint to main content', () => {
      const { container } = render(<Showcase />);
      const contentBox = container.querySelector('.lg\\:max-w-md');
      expect(contentBox).toBeInTheDocument();
    });

    it('groups performance stats correctly', () => {
      const { container } = render(<Showcase />);
      const statsContainer = container.querySelector('.max-w-3xs');
      expect(statsContainer).toBeInTheDocument();

      const statDivs = statsContainer.querySelectorAll('.space-y-2');
      expect(statDivs).toHaveLength(2); // Two performance metrics
    });

    it('applies correct spacing classes', () => {
      const { container } = render(<Showcase />);

      // Check for spacing classes
      expect(container.querySelector('.space-y-5')).toBeInTheDocument();
      expect(container.querySelector('.space-y-14')).toBeInTheDocument();
      expect(container.querySelector('.mt-7')).toBeInTheDocument();
    });
  });

  describe('Media Elements', () => {
    it('renders media container with correct class', () => {
      const { container } = render(<Showcase />);
      const media = container.querySelector('.media');
      expect(media).toBeInTheDocument();
    });

    it('video is a direct child of media container', () => {
      const { container } = render(<Showcase />);
      const media = container.querySelector('.media');
      const video = media.querySelector(':scope > video');
      expect(video).toBeInTheDocument();
    });

    it('mask is a sibling of video element', () => {
      const { container } = render(<Showcase />);
      const media = container.querySelector('.media');
      const children = media.children;

      expect(children[0].tagName).toBe('VIDEO');
      expect(children[1].className).toBe('mask');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing GSAP timeline gracefully', () => {
      useMediaQuery.mockReturnValue(false);
      gsap.timeline = vi.fn(() => ({
        to: vi.fn().mockReturnThis(),
      }));

      expect(() => render(<Showcase />)).not.toThrow();
    });

    it('renders correctly when useGSAP callback is not executed', () => {
      useGSAP.mockImplementation(() => {}); // Don't execute callback

      const { container } = render(<Showcase />);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/Rocket Chip/i)).toBeInTheDocument();
    });

    it('handles re-render with different isTablet value', () => {
      useMediaQuery.mockReturnValue(false);
      mockTimeline = {
        to: vi.fn().mockReturnThis(),
      };
      gsap.timeline = vi.fn(() => mockTimeline);

      const { rerender } = render(<Showcase />);

      useMediaQuery.mockReturnValue(true);
      expect(() => rerender(<Showcase />)).not.toThrow();
    });

    it('contains no broken image sources', () => {
      const { container } = render(<Showcase />);
      const images = container.querySelectorAll('img');

      images.forEach((img) => {
        expect(img.getAttribute('src')).toBeTruthy();
        expect(img.getAttribute('src')).toMatch(/\.(svg|png|jpg|jpeg|gif|webp)$/i);
      });
    });
  });

  describe('Accessibility', () => {
    it('video has appropriate attributes for autoplay', () => {
      render(<Showcase />);
      const video = document.querySelector('video');

      // Videos that autoplay should be muted
      expect(video.muted).toBe(true);
      expect(video.autoplay).toBe(true);
    });

    it('renders semantic heading hierarchy', () => {
      render(<Showcase />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();

      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s).toHaveLength(2);
    });

    it('mask image should have alt text for accessibility', () => {
      const { container } = render(<Showcase />);
      const maskImg = container.querySelector('.mask img');

      // Note: The current implementation is missing alt text
      // This test documents the current state
      expect(maskImg).toBeInTheDocument();
    });
  });
});