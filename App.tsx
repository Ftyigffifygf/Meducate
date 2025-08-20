import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Specialty, ChatMessage, ChatInstance } from './types';
import { SPECIALTIES } from './constants';
import { createChatSession, sendMessageStreamToAI } from './services/geminiService';
import Header from './components/Header';
import SpecialtySelector from './components/SpecialtySelector';
import ChatInterface from './components/ChatInterface';

function App(): React.ReactNode {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(Specialty.MBBS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatInstanceRef = useRef<ChatInstance | null>(null);

  useEffect(() => {
    console.log(`Initializing chat for ${selectedSpecialty}`);
    setChatHistory([]);
    setError(null);
    const newChat = createChatSession(selectedSpecialty);
    chatInstanceRef.current = {
      specialty: selectedSpecialty,
      chat: newChat
    };
  }, [selectedSpecialty]);

  const handleSendMessage = useCallback(async (message: string, imageFile?: File) => {
    if ((!message.trim() && !imageFile) || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    const userMessage: ChatMessage = { role: 'user', content: message, imageUrl };
    
    // Add user message and a placeholder for the model's streaming response
    setChatHistory(prev => [...prev, userMessage, { role: 'model', content: '' }]);

    if (!chatInstanceRef.current || chatInstanceRef.current.specialty !== selectedSpecialty) {
      console.log('Chat instance mismatch or null, re-initializing.');
      const newChat = createChatSession(selectedSpecialty);
      chatInstanceRef.current = {
        specialty: selectedSpecialty,
        chat: newChat
      };
    }

    try {
      const stream = await sendMessageStreamToAI(chatInstanceRef.current.chat, message, imageFile);
      
      let accumulatedText = "";
      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage.role === 'model') {
                lastMessage.content = accumulatedText;
            }
            return newHistory;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setChatHistory(prev => {
          const newHistory = [...prev];
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.content = `Error: ${errorMessage}`;
          }
          return newHistory;
      });
    } finally {
      setIsLoading(false);
      // Revoke the object URL to avoid memory leaks
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  }, [isLoading, selectedSpecialty]);

  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
  };

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full p-4 overflow-hidden">
        <div className="w-full max-w-5xl flex flex-col h-full">
          <SpecialtySelector
            specialties={SPECIALTIES}
            selectedSpecialty={selectedSpecialty}
            onSelect={handleSpecialtySelect}
          />
          <ChatInterface
            messages={chatHistory}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            error={error}
            selectedSpecialty={selectedSpecialty}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
