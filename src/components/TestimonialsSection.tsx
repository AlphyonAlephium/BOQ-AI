
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
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechGrowth",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "Aiana has transformed how we approach digital marketing. The analytics tools have given us insights we never had before, leading to a 40% increase in conversion rates within just three months.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "InnovateX",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "I've tried many platforms before, but Aiana stands out with its intuitive interface and powerful features. The customer support team is exceptional, always ready to help with any issues.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "SkyLoop",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "Implementing Aiana was the best decision we made this year. Our team productivity has increased dramatically, and the collaboration tools make working remotely feel seamless.",
    rating: 4
  },
  {
    name: "David Thompson",
    role: "CTO",
    company: "FutureTech",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    content: "As a tech company, we have high standards for the tools we use. Aiana exceeded our expectations with its robust API and security features. I highly recommend it to any growing business.",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what people who use Aiana every day have to say.</p>
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
