
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-100 opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent opacity-20 blur-3xl animate-pulse-light"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16">
          
          {/* Hero Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left opacity-0 animate-fade-in">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl mb-6 text-secondary leading-tight">
              Generate Entire <span className="text-primary">Apps</span> With AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-delay-1">
              Build complete, production-ready web applications with just a conversation. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-delay-2">
              <Button size="lg" className="px-8 py-6 text-lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 opacity-0 animate-fade-in-delay-3">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${i * 100} flex items-center justify-center font-bold text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-secondary">1,000+</span> apps created this month
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 opacity-0 animate-fade-in-delay-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent opacity-20 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="AI App Generation" 
                className="rounded-3xl shadow-2xl w-full z-10 relative transform hover:-translate-y-2 transition-transform duration-300"
              />
              {/* Floating elements */}
              <div className="absolute top-0 -left-5 p-4 bg-white rounded-lg shadow-lg z-20 transform -translate-y-1/4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-bold text-green-500">10x</span>
                </div>
                <p className="text-xs text-gray-500">Faster Development</p>
              </div>
              <div className="absolute bottom-0 -right-5 p-4 bg-white rounded-lg shadow-lg z-20 transform translate-y-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span className="font-bold text-primary">AI</span>
                </div>
                <p className="text-xs text-gray-500">Powered Apps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
