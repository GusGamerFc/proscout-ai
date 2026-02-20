
import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
        className={`
          w-full h-full transition-all duration-700 ease-out
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${props.className || ''}
        `}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
