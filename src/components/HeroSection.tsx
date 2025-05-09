
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="hero" className="bg-gradient-to-r from-[#2D1B69] to-[#4A2C8F] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <img src="/lovable-uploads/193741c8-3a91-4b1d-ba08-591fcd5783ee.png" alt="BOQ-AI Logo" className="h-24 md:h-28" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-on-scroll">
            AI-Powered Building Cost Estimation
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mb-8 animate-on-scroll">
            Upload your architectural drawings and floor plans to instantly generate accurate bills of quantities and cost estimates using our advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll">
            <Link to="/dashboard">
              <Button size="lg" className="px-10 py-6 text-lg">
                Go to App
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 px-10 py-6 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
