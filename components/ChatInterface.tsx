import React, { useRef, useEffect } from 'react';
import { ChatMessage, Specialty } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import { SPECIALTIES } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string, imageFile?: File) => void;
  error: string | null;
  selectedSpecialty: Specialty;
}

const WelcomeScreen: React.FC<{ specialty: Specialty }> = ({ specialty }) => {
  const specialtyDetails = SPECIALTIES.find(s => s.id === specialty);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-primary-500/10 p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Meducate AI: {specialtyDetails?.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{specialtyDetails?.description} Ask me anything related to this field. You can also attach an image.</p>
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, error, selectedSpecialty }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages[messages.length-1]?.content])

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-b-lg shadow-lg overflow-hidden">
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen specialty={selectedSpecialty} />
        ) : (
          messages.map((msg, index) => <Message key={index} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="p-4 text-center text-red-500 bg-red-100 dark:bg-red-900/20 border-t border-gray-200 dark:border-gray-700">{error}</div>}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
