
import React from 'react';
import { Zap, BarChart, Lock, Users, Check, Layers } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-0 animate-fade-in`} style={{ animationDelay: `${delay * 0.2}s` }}>
      <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <Icon className="text-primary h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-secondary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant AI Analysis",
      description: "Upload blueprints and receive detailed cost estimates in minutes instead of days. Our AI identifies all materials and labor needed."
    },
    {
      icon: BarChart,
      title: "Accurate Estimates",
      description: "Get precise cost breakdowns with 95%+ accuracy, reducing risk and increasing your competitive edge when bidding on projects."
    },
    {
      icon: Layers,
      title: "Material Takeoffs",
      description: "Automatically generate complete material lists with quantities, specifications, and current market pricing from your blueprints."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects with your team, add notes, and collaborate on estimates in real-time with intuitive sharing controls."
    },
    {
      icon: Lock,
      title: "Secure Document Handling",
      description: "Your blueprints and project data are protected with enterprise-grade security and encryption. Full GDPR compliance."
    },
    {
      icon: Check,
      title: "Verified Results",
      description: "Our estimates are continuously validated against real-world projects to ensure accuracy and reliability you can count on."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our AI analyzes your blueprints to deliver comprehensive cost estimates in minutes. Upload your plans and let our technology do the heavy lifting.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
