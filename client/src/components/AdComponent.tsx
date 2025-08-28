import { useEffect, useRef } from 'react';

interface AdComponentProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid';
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdComponent({ 
  adSlot, 
  adFormat = 'auto', 
  adLayoutKey,
  className = '',
  style = {}
}: AdComponentProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }
  }, [adSlot]);

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`}
      style={{
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px dashed #dee2e6',
        borderRadius: '8px',
        margin: '20px 0',
        position: 'relative',
        ...style
      }}
    >
      {/* Placeholder text */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#6c757d',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        Place of ad
      </div>
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6343948689807963"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(adLayoutKey && { 'data-ad-layout-key': adLayoutKey })}
      />
    </div>
  );
}

// Predefined ad components for different placements
export function FeaturedAd() {
  return (
    <AdComponent 
      adSlot="3932812397" 
      className="my-8"
      style={{ minHeight: '250px' }}
    />
  );
}

export function HorizontalAd() {
  return (
    <AdComponent 
      adSlot="8286990375" 
      className="my-6"
      style={{ minHeight: '90px' }}
    />
  );
}

export function VerticalAd() {
  return (
    <AdComponent 
      adSlot="7812347656" 
      className="my-4"
      style={{ minHeight: '600px', maxWidth: '300px', margin: '20px auto' }}
    />
  );
}

export function FluidAd() {
  return (
    <AdComponent 
      adSlot="6925004919"
      adFormat="fluid"
      adLayoutKey="-ef+6k-30-ac+ty"
      className="my-8"
      style={{ minHeight: '200px' }}
    />
  );
}

// Section divider ad
export function SectionAd() {
  return (
    <div className="w-full py-4">
      <HorizontalAd />
    </div>
  );
}

// Sidebar ad
export function SidebarAd() {
  return (
    <div className="hidden lg:block">
      <VerticalAd />
    </div>
  );
}
