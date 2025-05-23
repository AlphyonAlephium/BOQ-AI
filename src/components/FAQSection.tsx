
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is BOQ-AI and how does it work?",
    answer: "BOQ-AI is an advanced AI-powered tool that analyzes building blueprints to automatically generate accurate Bills of Quantities (BOQs). Our platform uses machine learning and computer vision to identify building elements, calculate materials needed, and provide detailed cost estimations—all from your uploaded blueprint files."
  },
  {
    question: "What types of blueprint files can I upload?",
    answer: "Our system supports various file formats including PDF, JPG, PNG, and CAD files (.dwg, .dxf). For best results, we recommend using high-resolution scans or digital blueprints with clearly visible elements and measurements."
  },
  {
    question: "How accurate are the BOQs generated by BOQ-AI?",
    answer: "BOQ-AI achieves over 95% accuracy in most standard construction projects. The accuracy depends on the quality of uploaded blueprints and the complexity of the design. Our AI continuously improves through machine learning, and you can manually adjust any elements that require fine-tuning."
  },
  {
    question: "How long does it take to analyze a blueprint?",
    answer: "Most standard residential and small commercial blueprints are processed within 2-5 minutes. Larger, more complex projects may take up to 15 minutes. The system will display real-time progress as it analyzes your documents."
  },
  {
    question: "Can BOQ-AI handle specialized construction elements?",
    answer: "Yes, BOQ-AI is trained to recognize and quantify standard building elements as well as specialized components. For industry-specific or custom elements, our Enterprise plan includes the ability to train the AI on your specific requirements and component library."
  },
  {
    question: "How secure are my blueprint files on your platform?",
    answer: "We take data security seriously. All uploads are encrypted in transit and at rest. Your blueprints and BOQs are stored securely in your account and are never shared with third parties. We offer enterprise-grade security features for professional users, including custom data retention policies."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our AI blueprint analysis platform.</p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 opacity-0 animate-fade-in">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-secondary hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
