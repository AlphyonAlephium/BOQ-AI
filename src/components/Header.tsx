import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" onClick={() => scrollToSection('hero')} className="flex items-center">
            <img src="/lovable-uploads/193741c8-3a91-4b1d-ba08-591fcd5783ee.png" alt="BOQ-AI Logo" className="h-20 md:h-12" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#hero" onClick={e => {
          e.preventDefault();
          scrollToSection('hero');
        }} className="text-secondary hover:text-primary transition-colors">
            Home
          </a>
          <a href="#features" onClick={e => {
          e.preventDefault();
          scrollToSection('features');
        }} className="text-secondary hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#pricing" onClick={e => {
          e.preventDefault();
          scrollToSection('pricing');
        }} className="text-secondary hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#testimonials" onClick={e => {
          e.preventDefault();
          scrollToSection('testimonials');
        }} className="text-secondary hover:text-primary transition-colors">
            Testimonials
          </a>
          <a href="#faq" onClick={e => {
          e.preventDefault();
          scrollToSection('faq');
        }} className="text-secondary hover:text-primary transition-colors">
            FAQ
          </a>
          <Button className="ml-4">Get Started</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-secondary hover:text-primary transition-colors" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center gap-8 text-lg">
            <div className="mb-8">
              <img src="/lovable-uploads/193741c8-3a91-4b1d-ba08-591fcd5783ee.png" alt="BOQ-AI Logo" className="h-12" />
            </div>
            <a href="#hero" onClick={() => scrollToSection('hero')} className="text-secondary hover:text-primary transition-colors">Home</a>
            <a href="#features" onClick={() => scrollToSection('features')} className="text-secondary hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" onClick={() => scrollToSection('pricing')} className="text-secondary hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" onClick={() => scrollToSection('testimonials')} className="text-secondary hover:text-primary transition-colors">Testimonials</a>
            <a href="#faq" onClick={() => scrollToSection('faq')} className="text-secondary hover:text-primary transition-colors">FAQ</a>
            <Button className="mt-4 w-full">Get Started</Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;