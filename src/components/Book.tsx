import React, { useRef, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';

export interface LinkData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export interface BookData {
  id: string;
  title: string;
  color: string;
  shelfId: string;
  content?: string;
  voidY?: number;
  images?: string[];
  links?: LinkData[];
}

interface BookProps {
  data: BookData;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  viewMode?: 'spine' | 'cover';
}

export function Book({ data, onClick, onDragStart, onDragEnd, viewMode = 'spine' }: BookProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);

  const isCoverMode = viewMode === 'cover';
  const targetRotateY = isCoverMode ? -90 : (isHovered && !isDragging.current ? -75 : 0);
  const targetZ = isHovered && !isDragging.current ? 30 : 0;
  
  // Hover 시 넓이를 확장해서 옆 책들을 밀어냅니다. (표지 모드일 때도 약간 더 넓어짐)
  const targetWidth = isCoverMode 
    ? (isHovered && !isDragging.current ? 175 : 160) 
    : (isHovered && !isDragging.current ? 180 : 50);

  return (
    <motion.div
      layoutId={`book-container-${data.id}`}
      drag
      dragSnapToOrigin
      onDragStart={() => {
        isDragging.current = true;
        onDragStart();
      }}
      onDragEnd={(e, info) => {
        setTimeout(() => isDragging.current = false, 100);
        onDragEnd(e, info);
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !isDragging.current && onClick()}
      style={{
        position: 'relative',
        cursor: 'grab',
        perspective: '1200px',
        zIndex: isHovered ? 50 : (isCoverMode ? 10 : 1),
        display: 'flex',
        alignItems: 'center',
        marginRight: isCoverMode ? '15px' : '4px',
        flexShrink: 0,
      }}
      animate={{
        width: targetWidth,
      }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
    >
      <motion.div
        style={{
          position: 'relative',
          width: '50px',
          height: '230px',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
        }}
        animate={{
          rotateY: targetRotateY,
          z: targetZ,
          scale: isHovered && !isDragging.current ? 1.05 : 1,
        }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
      >
        {/* Spine */}
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '50px',
            height: '230px',
            backgroundColor: data.color,
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 10%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 90%, rgba(255,255,255,0.2) 95%, rgba(0,0,0,0.5) 100%),
              url("https://www.transparenttextures.com/patterns/black-scales.png")
            `,
            borderRadius: '2px',
            boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2), inset 2px 0 5px rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Decorative gold lines on the spine */}
          <div style={{ position: 'absolute', top: '15px', width: '80%', height: '2px', backgroundColor: '#e5b567', opacity: 0.8, boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: '22px', width: '80%', height: '1px', backgroundColor: '#e5b567', opacity: 0.6 }} />
          
          <div style={{ position: 'absolute', bottom: '22px', width: '80%', height: '1px', backgroundColor: '#e5b567', opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: '15px', width: '80%', height: '2px', backgroundColor: '#e5b567', opacity: 0.8, boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />

          <motion.span 
            layoutId={`title-${data.id}`}
            style={{
              writingMode: 'vertical-rl',
              color: '#f9e5b5',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '2px',
              fontFamily: 'var(--font-serif)',
              textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
              padding: '30px 10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data.title}
          </motion.span>
        </div>

        {/* Front Cover */}
        <div 
          style={{
            position: 'absolute',
            top: 0, left: '49px', // slightly overlapped to prevent gap
            width: '160px',
            height: '230px',
            backgroundColor: data.color,
            backgroundImage: `url("https://www.transparenttextures.com/patterns/black-scales.png")`,
            transformOrigin: 'left',
            transform: 'rotateY(90deg)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 5px 5px 15px rgba(0,0,0,0.6)',
            borderRadius: '2px 8px 8px 2px',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 15px',
            borderLeft: '2px solid rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          {/* Cover Decorative Frame */}
          <div style={{
            position: 'absolute',
            top: '10px', left: '10px', right: '10px', bottom: '10px',
            border: '2px solid rgba(229, 181, 103, 0.4)',
            borderRadius: '4px',
            pointerEvents: 'none'
          }} />

          <div style={{
            color: '#f9e5b5',
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: 1.3,
            marginBottom: 'auto',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            {data.title}
          </div>
          
          {(data.links?.[0]?.image || (data.images && data.images[0])) && (
            <div style={{
              marginTop: '15px',
              height: '80px',
              width: '100%',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              border: '1px solid rgba(229, 181, 103, 0.3)'
            }}>
              <img 
                src={data.links?.[0]?.image || (data.images && data.images[0])} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Cover Thumbnail" 
              />
            </div>
          )}
        </div>
        
        {/* Back Cover (for realistic feel when pulled out) */}
        <div style={{
            position: 'absolute',
            top: 0, left: '0',
            width: '160px',
            height: '230px',
            backgroundColor: data.color,
            backgroundImage: `url("https://www.transparenttextures.com/patterns/black-scales.png")`,
            transformOrigin: 'left',
            transform: 'rotateY(-90deg) translateZ(50px)', // moved back by width of spine (50px)
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
            borderRadius: '8px 2px 2px 8px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '2px solid rgba(0,0,0,0.3)',
            backfaceVisibility: 'hidden', // only visible from back
        }} />
      </motion.div>
    </motion.div>
  );
}
