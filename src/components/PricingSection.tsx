
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingCard = ({
  title,
  price,
  yearlyPrice,
  features,
  isPopular,
  isYearly
}: {
  title: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  isYearly: boolean;
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full relative ${isPopular ? 'border-2 border-primary transform -translate-y-2 md:-translate-y-4' : 'border border-gray-200'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-primary text-white text-sm font-semibold py-1 px-4 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">${isYearly ? yearlyPrice : price}</span>
        {price !== 0 && <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>}
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button variant={isPopular ? "default" : "outline"} className="w-full">
        {price === 0 ? 'Start Free' : 'Get Started'}
      </Button>
    </div>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  const pricingPlans = [
    {
      title: "Free",
      price: 0,
      yearlyPrice: 0,
      features: ["Generate 2 BOQs per month", "Basic building elements detection", "Community support", "PDF export"]
    },
    {
      title: "Professional",
      price: 29,
      yearlyPrice: 290,
      features: ["Generate 25 BOQs per month", "Advanced elements detection", "Priority support", "PDF & Excel exports", "Custom material pricing", "Project comparison tools"],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: 99,
      yearlyPrice: 990,
      features: ["Unlimited BOQ generation", "Custom elements library", "Dedicated support manager", "API integration", "Team collaboration", "Advanced analytics", "Custom reporting"]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your construction estimation needs. All plans include core AI blueprint analysis capabilities.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8">
            <span className={`mr-3 ${!isYearly ? 'font-semibold' : 'text-gray-500'}`}>Monthly</span>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              >
                <span className="toggle-switch absolute top-0 left-0 right-0 w-6 h-6 rounded-full transition-transform duration-200 ease-in-out"></span>
              </label>
            </div>
            <span className={`ml-3 ${isYearly ? 'font-semibold' : 'text-gray-500'}`}>Yearly <span className="text-green-500 text-xs">(Save 20%)</span></span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => <PricingCard key={index} title={plan.title} price={plan.price} yearlyPrice={plan.yearlyPrice} features={plan.features} isPopular={plan.isPopular} isYearly={isYearly} />)}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
