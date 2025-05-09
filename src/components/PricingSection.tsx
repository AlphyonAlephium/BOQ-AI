
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
    <div className={`bg-white rounded-xl ${isPopular ? 'shadow-2xl border-2 border-primary' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-fade-in relative overflow-hidden`}>
      {isPopular && (
        <div className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
          Most Popular
        </div>
      )}
      <div className="p-8">
        <h3 className="text-xl font-bold mb-2 text-secondary">{title}</h3>
        <div className="mb-6">
          <p className="text-4xl font-bold text-secondary">
            ${isYearly ? yearlyPrice : price}
            <span className="text-base font-normal text-gray-500">/{isYearly ? 'year' : 'month'}</span>
          </p>
          {isYearly && <p className="text-sm text-green-600 mt-1">Save ${(price * 12) - yearlyPrice} annually</p>}
        </div>
        <hr className="mb-6" />
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          variant={isPopular ? "default" : "outline"} 
          className={`w-full ${isPopular ? '' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
          size="lg"
        >
          Get Started
        </Button>
      </div>
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
      features: [
        "Generate 2 BOQs per month",
        "Basic building elements detection",
        "Community support",
        "PDF export",
      ]
    },
    {
      title: "Professional",
      price: 29,
      yearlyPrice: 290,
      features: [
        "Generate 25 BOQs per month",
        "Advanced elements detection",
        "Priority support",
        "PDF & Excel exports",
        "Custom material pricing",
        "Project comparison tools",
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: 99,
      yearlyPrice: 990,
      features: [
        "Unlimited BOQ generation",
        "Custom elements library",
        "Dedicated support manager",
        "API integration",
        "Team collaboration",
        "Advanced analytics",
        "Custom reporting",
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your construction estimation needs. All plans include core AI blueprint analysis capabilities.</p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <span className={`mr-3 ${!isYearly ? 'text-secondary font-medium' : 'text-gray-500'}`}>Monthly</span>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in transform translate-x-0 checked:translate-x-6"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
              />
              <label 
                htmlFor="toggle" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition duration-200 ease-in"
              >
                <span className="toggle-switch"></span>
              </label>
            </div>
            <span className={`ml-3 ${isYearly ? 'text-secondary font-medium' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index}
              title={plan.title}
              price={plan.price}
              yearlyPrice={plan.yearlyPrice}
              features={plan.features}
              isPopular={plan.isPopular}
              isYearly={isYearly}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
