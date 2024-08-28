// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { httpGet } from '../utils/http.ts';

interface Chat {
    id: string,
    chatName: string,
    chatPic: string
}

interface ChatContextType {
    selectedChat: Chat | null;
    setSelectedChat: (chat: Chat | null) => void;
    chats: Chat[];
    addChat: (chat: Chat[]) => void; // Add function to add a new chat
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChats = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChats must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        httpGet("chats").then((response: any) => {
            setChats(response.data as Chat[]);
        });
    }, []);

    const addChat = (chat: Chat[]) => {
        setChats(() => [...chat]);
    };

    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, chats, addChat }}>
            {children}
        </ChatContext.Provider>
    );
};
