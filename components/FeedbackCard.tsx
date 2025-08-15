
import React from 'react';

interface FeedbackCardProps {
  title: string;
  score: number;
  feedback: string;
  icon: React.ReactNode;
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

const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, score, feedback, icon }) => {
  return (
    <div className="bg-base-100 p-6 rounded-lg border border-base-300 flex flex-col h-full hover:border-brand-primary transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-brand-primary">{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ScoreCircle score={score} />
      </div>
      <div>
        <p className="text-sm text-gray-400 leading-relaxed">{feedback}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
