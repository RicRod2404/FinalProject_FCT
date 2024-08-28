// src/contexts/FriendsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FriendsContextType {
    allFriends: string[];
    setAllFriends: React.Dispatch<React.SetStateAction<string[]>>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (context === undefined) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export const FriendsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allFriends, setAllFriends] = useState<string[]>([]);
    return (
        <FriendsContext.Provider value={{ allFriends, setAllFriends }}>
            {children}
        </FriendsContext.Provider>
    );
};