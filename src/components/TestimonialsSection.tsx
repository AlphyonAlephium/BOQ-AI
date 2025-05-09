
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Robert Martinez",
    role: "Construction Manager",
    company: "BuildTech Solutions",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "BOQ-AI reduced our estimation time from 3 days to just 30 minutes per project. The accuracy is impressive - within 98% of our manual calculations. We've increased our bidding capacity by 400% and won 35% more contracts since implementing this tool.",
    rating: 5
  },
  {
    name: "Jennifer Chen",
    role: "Quantity Surveyor",
    company: "PrecisionBuild",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As a quantity surveyor with 15 years of experience, I was skeptical about AI tools. BOQ-AI proved me wrong. Its material recognition is extremely accurate, and I can now deliver estimates for complex projects in a single day instead of a week.",
    rating: 5
  },
  {
    name: "David Thompson",
    role: "CEO",
    company: "Apex Construction",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    content: "BOQ-AI has completely revolutionized our bidding process. We're now able to bid on 3x more projects with the same team size. The ROI was evident within just 2 months - the Enterprise plan pays for itself many times over.",
    rating: 5
  },
  {
    name: "Sarah Patel",
    role: "Project Director",
    company: "InnovaBuild",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    content: "We use BOQ-AI for all our government infrastructure projects now. The detailed breakdown of materials and labor costs has improved our bid accuracy by 40%. Our clients are impressed by the level of detail we provide in such short timeframes.",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-bold text-secondary">{testimonial.name}</h4>
            <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600">{testimonial.content}</p>
    </div>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Handles autoplay
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const nextSlide = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">See how construction professionals and quantity surveyors are using BOQ-AI to transform blueprint analysis and cost estimation.</p>
        </div>
        
        <div className="relative">
          {/* Carousel Controls */}
          <div className="absolute -top-20 right-0 flex gap-2 md:gap-4">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0 animate-fade-in">
            {[
              testimonials[activeIndex],
              testimonials[(activeIndex + 1) % testimonials.length]
            ].map((testimonial, index) => (
              <div key={index} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary scale-125' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
