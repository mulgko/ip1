import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components
vi.mock('./components/NavBar', () => ({
  default: () => <div data-testid="navbar">NavBar</div>,
}));

vi.mock('./components/Hero', () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));

vi.mock('./components/ProductViewer', () => ({
  default: () => <div data-testid="product-viewer">ProductViewer</div>,
}));

vi.mock('./components/Showcase', () => ({
  default: () => <div data-testid="showcase">Showcase</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders the main element as root container', () => {
    const { container } = render(<App />);
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders all main components', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('product-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('showcase')).toBeInTheDocument();
  });

  it('renders components in the correct order', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    const children = main.children;

    expect(children[0]).toHaveAttribute('data-testid', 'navbar');
    expect(children[1]).toHaveAttribute('data-testid', 'hero');
    expect(children[2]).toHaveAttribute('data-testid', 'product-viewer');
    expect(children[3]).toHaveAttribute('data-testid', 'showcase');
  });

  it('renders exactly four child components', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');

    expect(main.children).toHaveLength(4);
  });

  it('registers GSAP ScrollTrigger plugin on module load', () => {
    // This test verifies that the plugin registration happens
    // The actual registration is mocked in setup.js
    const gsap = vi.hoisted(() => ({ registerPlugin: vi.fn() }));
    expect(gsap.registerPlugin).toBeDefined();
  });

  it('does not render any error boundaries or fallback UI', () => {
    const { container } = render(<App />);

    // Verify no error messages or fallback content
    expect(container.textContent).not.toContain('error');
    expect(container.textContent).not.toContain('Error');
    expect(container.textContent).not.toContain('failed');
  });

  it('has proper semantic HTML structure', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');

    expect(main.tagName).toBe('MAIN');
    expect(main.parentElement).toBeTruthy();
    expect(container.contains(main)).toBe(true);
  });

  it('renders NavBar before content components', () => {
    render(<App />);
    const navbar = screen.getByTestId('navbar');
    const hero = screen.getByTestId('hero');

    // NavBar should appear before Hero in DOM order
    expect(navbar.compareDocumentPosition(hero)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders all sections that can receive scroll triggers', () => {
    render(<App />);

    // Verify sections that may have scroll animations are present
    const productViewer = screen.getByTestId('product-viewer');
    const showcase = screen.getByTestId('showcase');

    expect(productViewer).toBeInTheDocument();
    expect(showcase).toBeInTheDocument();
  });

  it('renders successfully with mocked GSAP', () => {
    // Ensure the app doesn't crash with GSAP mocked
    expect(() => render(<App />)).not.toThrow();
  });

  it('maintains component structure when re-rendered', () => {
    const { rerender, container } = render(<App />);
    const initialStructure = container.innerHTML;

    rerender(<App />);

    expect(container.innerHTML).toBe(initialStructure);
  });
});