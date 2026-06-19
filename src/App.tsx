import React, { useState, useRef } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { Plus, Trash2, Library, LayoutGrid, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, type BookData } from './components/Book';
import { BookPanel } from './components/BookPanel';
import './index.css';

// ---------------------------------------------
// Shelf Component
// ---------------------------------------------
function ShelfItem({ 
  shelf, 
  shelfBooks, 
  viewMode, 
  onUpdateTitle, 
  onAddBook, 
  onDeleteShelf, 
  onSelectBook, 
  onDragStartBook, 
  onDragEndBook 
}: any) {
  const controls = useDragControls();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Reorder.Item
      value={shelf}
      dragListener={false}
      dragControls={controls}
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '1rem',
        padding: '0 1rem',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            onPointerDown={(e) => controls.start(e)}
            style={{ 
              cursor: 'grab', 
              touchAction: 'none', 
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            title="드래그하여 책장 위치 변경"
          >
            <GripVertical size={24} />
          </div>
          <input
            value={shelf.title}
            onChange={(e) => onUpdateTitle(shelf.id, e.target.value)}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid transparent',
              outline: 'none',
              transition: 'border-bottom 0.2s',
              cursor: 'text',
              width: '300px'
            }}
            onFocus={(e) => e.target.style.borderBottom = '1px solid rgba(255,255,255,0.5)'}
            onBlur={(e) => e.target.style.borderBottom = '1px solid transparent'}
            title="클릭하여 책장 이름 수정"
          />
          <button 
            onClick={() => onAddBook(shelf.id)}
            title="새 책 추가"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={() => onDeleteShelf(shelf.id)}
            title="책장 삭제"
            style={{
              background: 'rgba(255,100,100,0.1)',
              border: '1px solid rgba(255,100,100,0.2)',
              color: 'rgba(255,150,150,1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,100,100,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,100,100,0.1)'}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', userSelect: 'none', WebkitUserSelect: 'none' }}>
          {shelfBooks.length} Books
        </span>
      </div>

      {/* Bookshelf Container Wrapper */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Left Scroll Arrow */}
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
          title="왼쪽으로 스크롤"
          style={{
            position: 'absolute',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            background: 'rgba(30, 20, 15, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(50, 35, 25, 0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30, 20, 15, 0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Bookshelf Scroll Container */}
        <div 
          ref={scrollRef}
          data-shelfid={shelf.id}
          className="shelf-scroll-container"
          style={{
            display: 'flex',
            gap: '8px',
            padding: '20px 140px 20px 40px',
            minHeight: '270px',
            background: 'rgba(20, 15, 10, 0.6)',
            borderBottom: '16px solid #1a100a',
            boxShadow: '0 20px 40px rgba(0,0,0,0.9), inset 0 10px 20px rgba(0,0,0,0.5)',
            borderRadius: '4px',
            alignItems: 'flex-end',
            transition: 'background 0.3s',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          {shelfBooks.map((book: any) => (
            <Book 
              key={book.id} 
              data={book} 
              onClick={() => onSelectBook(book)} 
              onDragStart={onDragStartBook}
              onDragEnd={(e, info) => onDragEndBook(e, book.id)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Right Scroll Arrow */}
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
          title="오른쪽으로 스크롤"
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            background: 'rgba(30, 20, 15, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(50, 35, 25, 0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30, 20, 15, 0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </Reorder.Item>
  );
}

const INITIAL_SHELVES = [
  { id: 'shelf-1', title: '진행 중인 프로젝트' },
  { id: 'shelf-2', title: '학습 노트' },
  { id: 'shelf-3', title: '보관함' },
];

const INITIAL_BOOKS: BookData[] = [
  { id: '1', title: 'Project Alpha', color: '#4a5568', shelfId: 'shelf-1' },
  { id: '2', title: 'React Notes', color: '#3182ce', shelfId: 'shelf-2' },
  { id: '3', title: 'Design System', color: '#d69e2e', shelfId: 'shelf-1' },
  { id: '4', title: 'Meeting Logs', color: '#805ad5', shelfId: 'shelf-1' },
  { id: '5', title: 'Ideas & Thoughts', color: '#38a169', shelfId: 'shelf-3' },
  { id: '6', title: 'Archive 2026', color: '#718096', shelfId: 'shelf-3' },
];

function App() {
  const [shelves, setShelves] = useState(INITIAL_SHELVES);
  const [books, setBooks] = useState<BookData[]>(INITIAL_BOOKS);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [isDraggingBook, setIsDraggingBook] = useState(false);
  const [viewMode, setViewMode] = useState<'spine' | 'cover'>('spine');

  const handleDragEndBook = (e: MouseEvent | TouchEvent | PointerEvent, bookId: string) => {
    setIsDraggingBook(false);
    
    let clientX = 0;
    let clientY = 0;
    
    if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else if ('changedTouches' in e && (e as TouchEvent).changedTouches.length > 0) {
      clientX = (e as TouchEvent).changedTouches[0].clientX;
      clientY = (e as TouchEvent).changedTouches[0].clientY;
    }

    // Hit-testing
    const elements = document.elementsFromPoint(clientX, clientY);
    const dropzone = elements.find(el => el.getAttribute('data-shelfid') || el.id === 'void-zone');
    
    if (dropzone) {
      if (dropzone.id === 'void-zone') {
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === bookId ? { ...book, shelfId: 'void', voidY: clientY } : book
          )
        );
      } else {
        const targetShelfId = dropzone.getAttribute('data-shelfid');
        if (targetShelfId) {
          setBooks(prevBooks => 
            prevBooks.map(book => 
              book.id === bookId ? { ...book, shelfId: targetShelfId } : book
            )
          );
        }
      }
    }
  };

  const handleAddShelf = () => {
    const newShelf = {
      id: `shelf-${Date.now()}`,
      title: '새 책장'
    };
    setShelves(prev => [...prev, newShelf]);
  };

  const handleUpdateShelfTitle = (shelfId: string, newTitle: string) => {
    setShelves(prev => prev.map(s => s.id === shelfId ? { ...s, title: newTitle } : s));
  };

  const handleDeleteShelf = (shelfId: string) => {
    if (window.confirm('이 책장과 안에 있는 모든 책을 정말 삭제하시겠습니까?')) {
      setShelves(prev => prev.filter(s => s.id !== shelfId));
      setBooks(prev => prev.filter(b => b.shelfId !== shelfId));
    }
  };

  const handleAddBook = (shelfId: string) => {
    const colors = ['#4a5568', '#3182ce', '#d69e2e', '#805ad5', '#38a169', '#e53e3e', '#718096'];
    const newBook: BookData = {
      id: Date.now().toString(),
      title: 'New Book',
      color: colors[Math.floor(Math.random() * colors.length)],
      shelfId: shelfId,
      content: ''
    };
    setBooks(prev => [...prev, newBook]);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    if (selectedBook?.id === id) {
      setSelectedBook(null);
    }
  };

  const handleUpdateBook = (id: string, updates: Partial<BookData>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    if (selectedBook?.id === id) {
      setSelectedBook(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <>
      <div className="library-background" />
      
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 2rem 0 2rem',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1000px',
          marginBottom: '2rem'
        }}>
          <h1 className="typography-serif" style={{ 
            margin: 0, 
            fontSize: '3rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            color: 'var(--color-text-primary)'
          }}>
            Method of Loci
          </h1>
          <button
            onClick={() => setViewMode(prev => prev === 'spine' ? 'cover' : 'spine')}
            title={viewMode === 'spine' ? '표지 모드로 보기' : '책등 모드로 보기'}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--color-text-primary)',
              padding: '0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            {viewMode === 'spine' ? <LayoutGrid size={22} /> : <Library size={22} />}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%', maxWidth: '1000px', paddingBottom: '6rem' }}>
          <Reorder.Group axis="y" values={shelves} onReorder={setShelves} style={{ display: 'flex', flexDirection: 'column', gap: '4rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {shelves.map((shelf) => (
              <ShelfItem
                key={shelf.id}
                shelf={shelf}
                shelfBooks={books.filter(b => b.shelfId === shelf.id)}
                viewMode={viewMode}
                onUpdateTitle={handleUpdateShelfTitle}
                onAddBook={handleAddBook}
                onDeleteShelf={handleDeleteShelf}
                onSelectBook={setSelectedBook}
                onDragStartBook={() => setIsDraggingBook(true)}
                onDragEndBook={handleDragEndBook}
              />
            ))}
          </Reorder.Group>

          {/* Add Shelf Button */}
          <button 
            onClick={handleAddShelf}
            style={{
              width: '100%',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.02)',
              border: '2px dashed rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1.2rem',
              fontFamily: 'var(--font-serif)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; 
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.border = '2px dashed rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; 
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.border = '2px dashed rgba(255,255,255,0.1)';
            }}
          >
            <Plus size={24} />
            새 책장 추가하기
          </button>
        </div>
      </div>

      {/* Void (Trash) Dropzone */}
      <AnimatePresence>
        {isDraggingBook && (
          <motion.div
            id="void-zone"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #000 30%, #333 70%, #555 100%)',
              boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 15px rgba(0,0,0,1)',
              border: '2px solid rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Trash2 size={32} color="rgba(255,255,255,0.8)" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Void Animation Container */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 110, pointerEvents: 'none' }}>
        <AnimatePresence>
          {books.filter(b => b.shelfId === 'void').map(book => (
            <motion.div
              key={`void-${book.id}`}
              initial={{ scale: 1, right: '80px', top: book.voidY ? book.voidY - 140 : 'calc(100vh - 120px)', rotate: -15, opacity: 1, filter: 'blur(0px)' }}
              animate={{ scale: 0.01, right: '40px', top: 'calc(100vh - 80px)', rotate: 360, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.55, 0.085, 0.68, 0.53] }}
              onAnimationComplete={() => handleDeleteBook(book.id)}
              style={{ position: 'absolute', transformOrigin: 'center center' }}
            >
              <Book data={book} onClick={() => {}} onDragStart={() => {}} onDragEnd={() => {}} viewMode={viewMode} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedBook && (
          <BookPanel 
            data={selectedBook} 
            onClose={() => setSelectedBook(null)}
            onDelete={() => handleDeleteBook(selectedBook.id)}
            onUpdate={(updates) => handleUpdateBook(selectedBook.id, updates)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
