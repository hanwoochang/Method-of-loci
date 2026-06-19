import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Save, Image as ImageIcon, ExternalLink, Plus, Loader2 } from 'lucide-react';
import type { BookData, LinkData } from './Book';

interface BookPanelProps {
  data: BookData;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<BookData>) => void;
}

export function BookPanel({ data, onClose, onDelete, onUpdate }: BookPanelProps) {
  const PRESET_COLORS = ['#4a5568', '#3182ce', '#d69e2e', '#805ad5', '#38a169', '#e53e3e', '#718096', '#2d3748', '#b83280'];
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(data.title);
  const [contentInput, setContentInput] = useState(data.content || '');
  const [imagesInput, setImagesInput] = useState<string[]>(data.images || []);
  const [linksInput, setLinksInput] = useState<LinkData[]>(data.links || []);
  const [colorInput, setColorInput] = useState(data.color);
  const [newLinkText, setNewLinkText] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSave = () => {
    onUpdate({ title: titleInput, content: contentInput, images: imagesInput, links: linksInput, color: colorInput });
    setIsEditing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          if (isEditing) {
            setImagesInput(prev => [...prev, base64]);
          } else {
            const newImages = [...(data.images || []), base64];
            onUpdate({ images: newImages });
            setImagesInput(newImages);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (isEditing) {
      setImagesInput(prev => prev.filter((_, i) => i !== index));
    } else {
      const newImages = (data.images || []).filter((_, i) => i !== index);
      onUpdate({ images: newImages });
      setImagesInput(newImages);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkText.trim() || isAddingLink) return;
    
    let finalUrl = newLinkText.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setIsAddingLink(true);
    let linkData: LinkData = { url: finalUrl };

    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(finalUrl)}`);
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        linkData = {
          url: finalUrl,
          title: json.data.title || undefined,
          description: json.data.description || undefined,
          image: json.data.image?.url || undefined,
          siteName: json.data.publisher || undefined,
        };
      }
    } catch (e) {
      console.error('Failed to fetch link preview', e);
    } finally {
      if (isEditing) {
        setLinksInput(prev => [...prev, linkData]);
      } else {
        const newLinks = [...(data.links || []), linkData];
        onUpdate({ links: newLinks });
        setLinksInput(newLinks);
      }
      setNewLinkText('');
      setIsAddingLink(false);
    }
  };

  const removeLink = (index: number) => {
    if (isEditing) {
      setLinksInput(prev => prev.filter((_, i) => i !== index));
    } else {
      const newLinks = (data.links || []).filter((_, i) => i !== index);
      onUpdate({ links: newLinks });
      setLinksInput(newLinks);
    }
  };

  const renderImages = () => {
    const imagesToRender = isEditing ? imagesInput : (data.images || []);
    if (!imagesToRender || imagesToRender.length === 0) return null;

    return (
      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: '220px'
      }}>
        {imagesToRender.map((src, index) => (
          <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
            <img 
              src={src} 
              alt="첨부 이미지" 
              style={{
                height: '200px',
                borderRadius: '8px',
                objectFit: 'contain',
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            />
            <button
              onClick={() => removeImage(index)}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
              }}
              title="사진 삭제"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderLinks = () => {
    const linksToRender = isEditing ? linksInput : (data.links || []);
    const hasLinks = linksToRender && linksToRender.length > 0;
    
    if (!hasLinks && !isEditing) return null;

    return (
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {hasLinks && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {linksToRender.map((link, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'var(--color-text-primary)',
                    transition: 'all 0.2s',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {link.image && (
                    <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                      <img src={link.image} alt={link.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {link.title || link.url}
                    </div>
                    {link.description && (
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {link.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.5rem', fontSize: '12px', color: '#63b3ed' }}>
                      <ExternalLink size={12} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {link.siteName || new URL(link.url).hostname}
                      </span>
                    </div>
                  </div>
                </a>
                <button
                  onClick={(e) => { e.preventDefault(); removeLink(idx); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                  }}
                  title="링크 삭제"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {isEditing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              value={newLinkText}
              onChange={e => setNewLinkText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLink()}
              placeholder="https://youtube.com/..."
              disabled={isAddingLink}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
                opacity: isAddingLink ? 0.5 : 1
              }}
            />
            <button 
              onClick={handleAddLink}
              disabled={isAddingLink}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0 1rem',
                borderRadius: '6px',
                cursor: isAddingLink ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isAddingLink ? 0.5 : 1
              }}
            >
              {isAddingLink ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              추가
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '2rem'
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Main Panel */}
      <motion.div
        layoutId={`book-container-${data.id}`}
        className="glass-panel"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '80vh',
          borderRadius: '16px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: `${isEditing ? colorInput : data.color}15`,
          border: isDragOver ? '2px dashed rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                color: 'white',
                gap: '1rem'
              }}
            >
              <ImageIcon size={48} opacity={0.8} />
              <h2 className="typography-sans" style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                여기에 사진을 놓아 추가하세요
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: '6px', width: '100%', backgroundColor: isEditing ? colorInput : data.color }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--color-glass-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {isEditing ? (
              <>
                <input 
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-serif)',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--color-glass-border)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    width: '60%'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColorInput(c)}
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%', backgroundColor: c,
                        border: colorInput === c ? '2px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        padding: 0
                      }}
                      title="색상 변경"
                    />
                  ))}
                  <input 
                    type="color" 
                    value={colorInput} 
                    onChange={(e) => setColorInput(e.target.value)}
                    style={{
                      width: '24px', height: '24px', border: 'none', padding: 0, cursor: 'pointer',
                      borderRadius: '50%', background: 'transparent'
                    }}
                    title="사용자 지정 색상"
                  />
                </div>
              </>
            ) : (
              <motion.h1 
                layoutId={`title-${data.id}`}
                className="typography-serif"
                style={{ fontSize: '24px', margin: 0, color: 'var(--color-text-primary)' }}
              >
                {data.title}
              </motion.h1>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {isEditing ? (
              <button style={btnStyle} onClick={handleSave} title="저장"><Save size={18} /></button>
            ) : (
              <button style={btnStyle} onClick={() => setIsEditing(true)} title="수정"><Edit3 size={18} /></button>
            )}
            <button style={btnStyle} onClick={onClose} title="닫기"><X size={18} /></button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ delay: 0.2 }}
          style={{ 
            padding: '2rem', 
            flex: 1, 
            minHeight: 0, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          {renderImages()}
          
          {isEditing ? (
            <textarea
              value={contentInput}
              onChange={e => setContentInput(e.target.value)}
              placeholder="여기에 내용을 입력하세요. 이미지 파일은 이 패널 안으로 드래그 앤 드롭 하세요!"
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                padding: '1rem',
                borderRadius: '8px',
                resize: 'none',
                lineHeight: 1.6
              }}
            />
          ) : (
            <div style={{ flex: 1, color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {data.content ? data.content : (
                <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' }}>
                  내용이 없습니다. 사진을 드래그 앤 드롭 하거나, 우측 상단의 수정 버튼을 눌러 내용을 작성해보세요.
                </div>
              )}
            </div>
          )}
          
          <div style={{ marginTop: '1.5rem' }}>
            {renderLinks()}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const btnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: '4px',
  transition: 'background 0.2s'
};
