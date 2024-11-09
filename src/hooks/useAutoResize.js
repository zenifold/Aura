import { useEffect, useRef } from 'react';

export const useAutoResize = (value) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Create a hidden div to measure the content
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.height = 'auto';
    measureDiv.style.width = input.offsetWidth + 'px';
    measureDiv.style.fontSize = window.getComputedStyle(input).fontSize;
    measureDiv.style.fontFamily = window.getComputedStyle(input).fontFamily;
    measureDiv.style.padding = window.getComputedStyle(input).padding;
    measureDiv.style.whiteSpace = 'pre-wrap';
    measureDiv.style.wordBreak = 'break-word';
    document.body.appendChild(measureDiv);

    // Update content and measure
    measureDiv.textContent = value || ' ';
    const height = measureDiv.offsetHeight;

    // Set input height
    input.style.height = height + 'px';

    // Clean up
    document.body.removeChild(measureDiv);
  }, [value]);

  return inputRef;
};
