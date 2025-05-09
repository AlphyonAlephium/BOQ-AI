
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How does the AI app generation work?",
    answer: "Our platform uses advanced AI to translate your text descriptions into fully functioning applications. You describe the app you want in plain language, and our AI generates all the necessary code, UI components, and functionality—no coding required."
  },
  {
    question: "Do I own the apps I create?",
    answer: "Yes, you fully own all intellectual property rights to the apps you generate with our platform. You're free to use them for personal or commercial purposes, modify them, and distribute them however you like."
  },
  {
    question: "Can I customize the generated apps?",
    answer: "Absolutely! After the initial generation, you can refine your app by having conversations with the AI. You can request changes to colors, layouts, functionality, and more. You can also export the code and make manual edits if you prefer."
  },
  {
    question: "What technologies are used in the generated apps?",
    answer: "Our platform generates modern web applications using React, Tailwind CSS, and other industry-standard technologies. The apps are responsive by default and follow best practices for performance and accessibility."
  },
  {
    question: "How do I deploy the apps I create?",
    answer: "We offer one-click deployment to our hosting platform where your app gets its own subdomain. For Pro and Enterprise plans, you can also connect custom domains. Additionally, you can export your app's code and deploy it to any hosting service of your choice."
  },
  {
    question: "Do I need technical knowledge to use the platform?",
    answer: "No technical knowledge is required! Our platform is designed to be accessible to users with no coding experience. However, if you do have technical skills, you'll appreciate the clean code that's generated and the ability to extend it."
  }
];

const FAQItem = ({ question, answer, isActive, onClick }: { question: string; answer: string; isActive: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        className="flex justify-between items-center w-full py-5 text-left font-medium text-secondary hover:text-primary focus:outline-none"
        onClick={onClick}
        aria-expanded={isActive}
      >
        <span>{question}</span>
        {isActive ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      <div className={`faq-answer overflow-hidden transition-all duration-300 ${isActive ? 'active' : ''}`}>
        <p className="pb-5 text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our AI app generation platform.</p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 opacity-0 animate-fade-in">
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
              isActive={activeIndex === index} 
              onClick={() => toggleFAQ(index)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
