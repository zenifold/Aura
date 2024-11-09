import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TimelineScroller = ({ children, viewType }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft + clientWidth < scrollWidth);
    };

    checkScroll();
    scrollContainerRef.current?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      scrollContainerRef.current?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = viewType === 'month' 
      ? scrollContainerRef.current.clientWidth / 2 
      : scrollContainerRef.current.clientWidth / 7; // Scroll by one day in week view

    scrollContainerRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative group">
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll(-1)}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-dark-card 
          shadow-lg rounded-r-lg border border-l-0 border-surface-200 dark:border-dark-border 
          text-surface-600 dark:text-dark-text hover:bg-surface-50 dark:hover:bg-dark-hover 
          transition-all duration-200 ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll(1)}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-dark-card 
          shadow-lg rounded-l-lg border border-r-0 border-surface-200 dark:border-dark-border 
          text-surface-600 dark:text-dark-text hover:bg-surface-50 dark:hover:bg-dark-hover 
          transition-all duration-200 ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={20} />
      </button>

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-dark-border 
          scrollbar-track-transparent hover:scrollbar-thumb-surface-400 dark:hover:scrollbar-thumb-dark-hover
          scroll-smooth"
        style={{
          // Add padding to allow scrolling beyond the visible content
          paddingLeft: viewType === 'week' ? '0' : '48px',
          paddingRight: viewType === 'week' ? '0' : '48px'
        }}
      >
        <div className={viewType === 'week' ? 'min-w-[1200px]' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TimelineScroller;
