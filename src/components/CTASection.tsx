
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-secondary opacity-0 animate-fade-in">
            Start Building with AI Today
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of founders, teams, and developers creating applications with AI in minutes instead of months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="px-8 py-6 text-lg">
              Generate Your First App
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-white">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            No credit card required. Get started for free.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
