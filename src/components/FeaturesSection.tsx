
import React from 'react';
import { Check, Zap, BarChart, Lock, Users, Globe } from 'lucide-react';

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
      title: "Lightning Fast",
      description: "Experience blazing speeds with our optimized platform. No more waiting around."
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Gain insights with detailed analytics that help drive your business decisions."
    },
    {
      icon: Lock,
      title: "Ultra Secure",
      description: "Rest easy knowing your data is protected with enterprise-grade security."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members in real-time across all devices."
    },
    {
      icon: Check,
      title: "Easy Integration",
      description: "Connect with your favorite tools without any hassle. We play nice with others."
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Get help whenever you need it with our 24/7 international support team."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Powerful Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our platform is packed with features that will help your business grow and succeed in today's competitive market.</p>
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
