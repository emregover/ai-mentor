
export interface AnalysisMetric {
  score: number; // A score from 1 to 10
  feedback: string;
}

export interface SalesCallFeedback {
  summary: string;
  context: AnalysisMetric;
  tonality: AnalysisMetric;
  rapport: AnalysisMetric;
  speed: AnalysisMetric;
  anxiety: AnalysisMetric;
}
