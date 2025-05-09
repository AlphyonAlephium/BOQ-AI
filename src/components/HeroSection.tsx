
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
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
              AI-Powered <span className="text-primary">Blueprint</span> Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-delay-1">
              Turn building blueprints into accurate cost estimates in minutes instead of days. Save time, reduce errors, and win more bids.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-delay-2">
              <Button size="lg" className="px-8 py-6 text-lg">Go to app</Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 opacity-0 animate-fade-in-delay-3">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${i * 100} flex items-center justify-center font-bold text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-secondary">500+</span> contractors trust our estimates
              </div>
            </div>
          </div>
          
          {/* Hero Image with BOQ-AI logo overlay */}
          <div className="w-full lg:w-1/2 opacity-0 animate-fade-in-delay-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent opacity-20 rounded-3xl transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Blueprint Analysis" className="rounded-3xl shadow-2xl w-full z-10 relative transform hover:-translate-y-2 transition-transform duration-300" />
              {/* BOQ-AI logo overlay in corner */}
              <div className="absolute bottom-4 right-4 w-24 h-24 z-20">
                <img 
                  src="/lovable-uploads/193741c8-3a91-4b1d-ba08-591fcd5783ee.png" 
                  alt="BOQ-AI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute top-0 -left-5 p-4 bg-white rounded-lg shadow-lg z-20 transform -translate-y-1/4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-bold text-green-500">95%</span>
                </div>
                <p className="text-xs text-gray-500">Estimation Accuracy</p>
              </div>
              <div className="absolute bottom-0 -right-5 p-4 bg-white rounded-lg shadow-lg z-20 transform translate-y-1/4 animate-float" style={{
              animationDelay: '1.5s'
            }}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span className="font-bold text-primary">10x</span>
                </div>
                <p className="text-xs text-gray-500">Faster Estimates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
