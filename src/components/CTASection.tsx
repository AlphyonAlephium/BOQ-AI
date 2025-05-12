
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TechBackground } from './TechBackground';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <TechBackground className="absolute inset-0">
        {/* Additional decorative elements are inside TechBackground */}
      </TechBackground>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white opacity-0 animate-fade-in">
            Transform Blueprint Estimation Today
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join hundreds of contractors, architects, and builders who are saving time and winning more bids with AI-powered cost estimation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="px-8 py-6 text-lg bg-blue-500 hover:bg-blue-600">
              Analyze Your First Blueprint
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-white text-white hover:bg-white/10">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            No credit card required. Analyze your first project for free.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
