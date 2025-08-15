import React from 'react';
import { VoiceIcon } from './icons/VoiceIcon';

interface FeedbackCardProps {
  title: string;
  score: number;
  feedback: string;
  icon: React.ReactNode;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 45; // 2 * pi * r
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColorClass = 'stroke-green-400';
  if (score < 4) strokeColorClass = 'stroke-red-400';
  else if (score < 7) strokeColorClass = 'stroke-yellow-400';

  return (
    <div className="relative h-24 w-24">
      <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-base-300"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        ></circle>
        <circle
          className={`stroke-current ${strokeColorClass} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        ></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-base-content">{score.toFixed(1)}</span>
      </div>
    </div>
  );
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, score, feedback, icon, isSpeaking, onToggleSpeech }) => {
  return (
    <div className="bg-base-100 p-6 rounded-lg border border-base-300 flex flex-col h-full hover:border-brand-primary transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-brand-primary">{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ScoreCircle score={score} />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-400 leading-relaxed">{feedback}</p>
      </div>
       <div className="mt-4 flex justify-end">
        <button
          onClick={onToggleSpeech}
          className={`p-2 rounded-full transition-all duration-200 ${
            isSpeaking 
              ? 'bg-brand-primary/20 text-brand-primary animate-pulse' 
              : 'bg-base-300/50 hover:bg-base-300 text-gray-400 hover:text-white'
          }`}
          aria-label={isSpeaking ? 'Stop reading feedback' : 'Read feedback aloud'}
        >
          <VoiceIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;