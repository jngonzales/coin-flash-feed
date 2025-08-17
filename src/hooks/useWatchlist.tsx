import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  addedAt: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (crypto: Omit<WatchlistItem, 'addedAt'>) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('crypto-watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading watchlist:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (crypto: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      if (prev.some(item => item.id === crypto.id)) {
        return prev; // Already in watchlist
      }
      return [...prev, { ...crypto, addedAt: Date.now() }];
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const isInWatchlist = (id: string) => {
    return watchlist.some(item => item.id === id);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      clearWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};