
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
    name: "Alex Rivera",
    role: "Founder",
    company: "LaunchFast",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I went from idea to working MVP in just 3 days. What would have taken months and thousands of dollars in development costs was accomplished in a fraction of the time. My investors were blown away.",
    rating: 5
  },
  {
    name: "Sophia Chen",
    role: "Product Manager",
    company: "TechNova",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As a non-technical founder, Aiana has been a game-changer. I can now iterate on product features in real-time based on user feedback without having to wait for developer resources.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    company: "DataSync",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    content: "Even as a technical founder, I use Aiana to prototype new features before committing engineering resources. It's saved us countless hours and allowed us to test ideas with users much faster.",
    rating: 4
  },
  {
    name: "Emma Wilson",
    role: "CEO",
    company: "RetailRevolution",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    content: "We've integrated Aiana into our workflow for creating internal tools. What used to take our engineering team weeks now takes a business analyst a couple of hours. The ROI is incredible.",
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
          <p className="text-gray-600 max-w-2xl mx-auto">See how founders and teams are using our AI platform to build applications faster than ever before.</p>
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
