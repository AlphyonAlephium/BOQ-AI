
import React from 'react';
import { Zap, BarChart, Lock, Users, Check, Globe } from 'lucide-react';

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
      title: "AI App Generation",
      description: "Generate complete, production-ready web applications with simple text prompts. No coding required."
    },
    {
      icon: BarChart,
      title: "Rapid Prototyping",
      description: "Build and iterate on your ideas in minutes instead of days. Perfect for MVPs and proof of concepts."
    },
    {
      icon: Globe,
      title: "Multi-platform Support",
      description: "Create apps that work seamlessly across web, mobile, and desktop from a single codebase."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together on app generation and customization with intuitive sharing and permission controls."
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade security for your apps and data with SOC 2 compliance and end-to-end encryption."
    },
    {
      icon: Check,
      title: "Ready for Production",
      description: "Deploy apps to production environments with one click, complete with CI/CD and monitoring."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Create complete applications with AI. Describe what you want, and our advanced AI will build it for you - faster and easier than traditional development.</p>
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
