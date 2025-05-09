
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I get started with Aiana?",
    answer: "Getting started is easy! Simply sign up for an account, choose your plan, and follow our step-by-step onboarding guide. You'll be up and running in minutes."
  },
  {
    question: "Can I change my plan later?",
    answer: "Absolutely! You can upgrade, downgrade, or change your plan at any time through your account dashboard. Changes to your billing will be prorated to your current billing cycle."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial on all our plans. No credit card required to start your trial - you can explore all features risk-free."
  },
  {
    question: "How secure is my data with Aiana?",
    answer: "Your security is our top priority. We employ industry-leading security measures including end-to-end encryption, two-factor authentication, and regular security audits to ensure your data remains safe."
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with our service within the first 30 days, contact our support team for a full refund."
  },
  {
    question: "What kind of customer support do you offer?",
    answer: "We provide 24/7 customer support through email, live chat, and phone. Our dedicated support team is always ready to help you with any questions or issues you may have."
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
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our platform, features, and services.</p>
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
