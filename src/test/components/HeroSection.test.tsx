import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
describe('HeroSection', () => {
  it('renders the main heading', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    expect(screen.getByText(/Learn From/i)).toBeInTheDocument();
    expect(screen.getByText(/The Experts/i)).toBeInTheDocument();
    expect(screen.getByText(/Elevate/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Skills/i)).toBeInTheDocument();
  });
  it('renders the description text', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    expect(screen.getByText(/Unlock your full potential/i)).toBeInTheDocument();
  });
  it('renders the call-to-action button', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    const ctaButton = screen.getByRole('link', { name: /Start Learning/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/courses');
  });
  it('renders the floating icon', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    const icon = screen.getByAltText('Microphone');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/images/Astro3d.png');
  });
});