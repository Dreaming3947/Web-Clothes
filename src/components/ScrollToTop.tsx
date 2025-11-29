import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999
          }}
          className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      )}
    </>
  );
}
