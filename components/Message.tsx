import React, { useState, memo } from 'react';
import type { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        You
    </div>
);

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 100 2h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0v-.5a1 1 0 00-1-1H6a1 1 0 01-1-1v-3a1 1 0 011-1h1a1 1 0 100-2H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
        </svg>
    </div>
);

const LoadingDots: React.FC = () => (
    <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

const CopyButton: React.FC<{ content: string }> = ({ content }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-600/50 text-gray-200 hover:bg-gray-500 transition-opacity duration-200">
            {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};

const MemoizedMarkdown = memo(({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            className="prose prose-sm dark:prose-invert max-w-none break-words"
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold my-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className="bg-gray-500/50 rounded px-1 py-0.5 text-sm" {...props}>
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    );
});

interface MessageProps {
    message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const { role, content, imageUrl } = message;
    const isUser = role === 'user';

    const messageContainerClasses = `flex items-start gap-3 w-full ${isUser ? 'justify-end' : ''}`;
    const messageContentContainer = `flex flex-col gap-2 max-w-xl ${isUser ? 'items-end' : 'items-start'}`;
    const messageBubbleClasses = `relative p-4 rounded-2xl group ${isUser ? 'bg-primary-600 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`;

    return (
        <div className={messageContainerClasses}>
            {!isUser && <BotIcon />}
            <div className={messageContentContainer}>
                {imageUrl && (
                     <div className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <img src={imageUrl} alt="User upload" className="max-w-xs max-h-48 rounded-md" />
                    </div>
                )}
                {(content || role === 'model') && (
                    <div className={messageBubbleClasses}>
                        {content === '' && !isUser ? <LoadingDots /> : <MemoizedMarkdown content={content} />}
                        {!isUser && content && <CopyButton content={content} />}
                    </div>
                )}
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};

export default Message;