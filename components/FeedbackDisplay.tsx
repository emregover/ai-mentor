import React, { useState, useEffect } from 'react';
import { SalesCallFeedback, AnalysisMetric } from '../types';
import FeedbackCard from './FeedbackCard';
import { ContextIcon } from './icons/ContextIcon';
import { TonalityIcon } from './icons/TonalityIcon';
import { RapportIcon } from './icons/RapportIcon';
import { SpeedIcon } from './icons/SpeedIcon';
import { AnxietyIcon } from './icons/AnxietyIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface FeedbackDisplayProps {
  feedback: SalesCallFeedback;
  fileName: string;
  onReset: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, fileName, onReset }) => {
  const { summary, context, tonality, rapport, speed, anxiety } = feedback;
  const [speakingMetric, setSpeakingMetric] = useState<string | null>(null);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const getAndSetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer a "natural" sounding male voice if available
        let selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en-') && voice.name.toLowerCase().includes('male') && voice.name.toLowerCase().includes('natural')
        );
        // Fallback to any English male voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en-') && voice.name.toLowerCase().includes('male'));
        }
        // Fallback to some known good male voices
        if (!selectedVoice) {
            const commonMaleNames = ['david', 'mark', 'google us english', 'microsoft david'];
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-') && commonMaleNames.some(name => voice.name.toLowerCase().includes(name)));
        }
        // Final fallback to the first available English voice
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
        }
        setMaleVoice(selectedVoice || null);
      }
    };

    getAndSetVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getAndSetVoice;
    }

    return () => {
      window.speechSynthesis.cancel();
       if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleToggleSpeech = (text: string, title: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    const isCurrentlySpeaking = speakingMetric === title;

    // Always cancel current speech before starting new or stopping
    window.speechSynthesis.cancel();

    if (isCurrentlySpeaking) {
      setSpeakingMetric(null);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.onend = () => setSpeakingMetric(null);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setSpeakingMetric(null);
      };
      setSpeakingMetric(title);
      window.speechSynthesis.speak(utterance);
    }
  };


  const metrics: { title: string; data: AnalysisMetric; icon: React.ReactNode }[] = [
    { title: 'Context', data: context, icon: <ContextIcon className="h-6 w-6" /> },
    { title: 'Tonality', data: tonality, icon: <TonalityIcon className="h-6 w-6" /> },
    { title: 'Rapport', data: rapport, icon: <RapportIcon className="h-6 w-6" /> },
    { title: 'Speaking Speed', data: speed, icon: <SpeedIcon className="h-6 w-6" /> },
    { title: 'Anxiety Level', data: anxiety, icon: <AnxietyIcon className="h-6 w-6" /> },
  ];
  
  const overallScore = metrics.reduce((acc, metric) => acc + metric.data.score, 0) / metrics.length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-base-content">Analysis Complete</h2>
           <p className="text-gray-400 flex items-center gap-2 mt-1">
             <DocumentIcon className="h-5 w-5"/>
             {fileName}
           </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-base-300 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
          Analyze Another Call
        </button>
      </div>

      <div className="mb-8 p-6 bg-base-100 rounded-lg border border-base-300">
        <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-green-400">Overall Summary</h3>
        <p className="text-gray-300">{summary}</p>
         <div className="mt-4">
          <p className="text-sm text-gray-400 mb-1">Overall Score: {overallScore.toFixed(1)} / 10</p>
          <div className="w-full bg-base-300 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2.5 rounded-full" style={{ width: `${overallScore * 10}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <FeedbackCard
            key={metric.title}
            title={metric.title}
            score={metric.data.score}
            feedback={metric.data.feedback}
            icon={metric.icon}
            isSpeaking={speakingMetric === metric.title}
            onToggleSpeech={() => handleToggleSpeech(metric.data.feedback, metric.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackDisplay;