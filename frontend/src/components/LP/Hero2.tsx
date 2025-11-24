import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Import images
import hero2BgImage from '@/assets/hero/hero2_bg.jpg';
import deepImage from '@/assets/hero/deep.png';
import flowerImage from '@/assets/hero/flower.png';
import guruImage from '@/assets/hero/guru.svg';

const Hero2: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center text-black my-4 sm:my-16 md:my-20 md:mt-32 mt-10"
      style={{ backgroundImage: `url(${hero2BgImage})` }}
    >
      {/* Decorative Elements */}
      <div className="w-[70px] h-[70px] md:w-[200px] md:h-[200px] absolute top-[-30px] md:top-[-100px] left-0 z-50">
        <img 
          src={deepImage} 
          alt="decorative diya" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      
      <div className="absolute w-[40px] h-[40px] md:w-[120px] md:h-[120px] bottom-[-20px] md:bottom-[-50px] left-0 rotate-12 z-50">
        <img 
          src={flowerImage} 
          alt="decorative flower" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      
      <div className="absolute w-[40px] h-[40px] md:w-[120px] md:h-[120px] right-0 top-[-20px] md:top-[-50px] rotate-[255deg] z-50">
        <img 
          src={flowerImage} 
          alt="decorative flower" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto px-4 py-8 sm:py-4 md:py-10 text-center">
        {/* Guru Image */}
        <div className="mx-auto flex justify-center mb-6 sm:mb-8">
          <div className="relative h-36 w-36 sm:h-44 sm:w-44 md:h-56 md:w-56 animate-fade-in">
            <img 
              src={guruImage} 
              alt="Guru Illustration" 
              className="w-full h-full object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="mx-auto max-w-4xl space-y-4 md:space-y-6 animate-fade-in-up">
          <p className="text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed text-gray-800 font-medium">
            At <span className="font-bold text-primary">Mantra Setu</span>, we understand that every spiritual journey begins with a sacred ritual. Be it a new beginning, a life milestone, or a moment of remembrance – Puja is not just a ceremony; it's a path to inner peace, blessings, and divine connection.
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed text-gray-800 font-medium">
            We offer end-to-end Pandit services for every occasion, guided by authentic scriptures and performed by qualified, experienced, and disciplined Vedic Pandits.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center animate-fade-in-up-delayed">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg px-6 py-3 sm:px-8 sm:py-4"
          >
            <Link to="/pandit" className="flex items-center gap-2">
              Book Online Pandit Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </div>
      </div>

     
    </section>
  );
};

export default Hero2;

