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
  return;
};
const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const pricingPlans = [{
    title: "Free",
    price: 0,
    yearlyPrice: 0,
    features: ["Generate 2 BOQs per month", "Basic building elements detection", "Community support", "PDF export"]
  }, {
    title: "Professional",
    price: 29,
    yearlyPrice: 290,
    features: ["Generate 25 BOQs per month", "Advanced elements detection", "Priority support", "PDF & Excel exports", "Custom material pricing", "Project comparison tools"],
    isPopular: true
  }, {
    title: "Enterprise",
    price: 99,
    yearlyPrice: 990,
    features: ["Unlimited BOQ generation", "Custom elements library", "Dedicated support manager", "API integration", "Team collaboration", "Advanced analytics", "Custom reporting"]
  }];
  return <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your construction estimation needs. All plans include core AI blueprint analysis capabilities.</p>
          
          {/* Billing Toggle */}
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => <PricingCard key={index} title={plan.title} price={plan.price} yearlyPrice={plan.yearlyPrice} features={plan.features} isPopular={plan.isPopular} isYearly={isYearly} />)}
        </div>
      </div>
    </section>;
};
export default PricingSection;