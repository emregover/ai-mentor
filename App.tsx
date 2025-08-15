
import React, { useState, useCallback } from 'react';
import { SalesCallFeedback } from './types';
import { analyzeSalesCall } from './services/geminiService';
import FileUpload from './components/FileUpload';
import FeedbackDisplay from './components/FeedbackDisplay';
import Spinner from './components/Spinner';
import { LogoIcon } from './components/icons/LogoIcon';

const App: React.FC = () => {
  const [feedback, setFeedback] = useState<SalesCallFeedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setFileName(file.name);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          const audioMimeType = file.type;
          
          if (!process.env.API_KEY) {
            throw new Error("API key is not configured. Please set the API_KEY environment variable.");
          }

          const result = await analyzeSalesCall(base64Audio, audioMimeType);
          setFeedback(result);
        } catch (e) {
          console.error(e);
          setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
          setFeedback(null);
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the audio file.');
        setIsLoading(false);
      };
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setFeedback(null);
    setIsLoading(false);
    setError(null);
    setFileName(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-lg animate-pulse">Analyzing your sales call...</p>
          <p className="text-sm text-gray-400">{fileName}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
          <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (feedback) {
      return <FeedbackDisplay feedback={feedback} fileName={fileName || ''} onReset={handleReset} />;
    }
    return <FileUpload onFileSelect={handleFileSelect} />;
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
             <LogoIcon className="h-12 w-12 text-brand-primary" />
             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-400">
              AI Sales Mentor
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            Upload your sales call recording to get instant, actionable feedback.
          </p>
        </header>
        <main className="bg-base-200 rounded-2xl shadow-2xl shadow-black/20 p-6 sm:p-10 border border-base-300">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
