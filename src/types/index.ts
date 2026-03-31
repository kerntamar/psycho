export type Subject = "Math" | "Hebrew" | "English" | "Vocabulary";

export interface Topic {
  id: string;
  subject: Subject;
  name: string;
  description?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  explanation: string; // AI simplified explanation
  pdfUrl?: string;
  pdfSectionId?: string;
}

export type QuestionType = "multiple_choice" | "true_false" | "fill_in_the_blank" | "open" | "vocabulary";
export type QuestionSource = "PDF" | "AI" | "Manual";

export interface Question {
  id: string;
  subject: Subject;
  topicId: string;
  lessonId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: QuestionType;
  source: QuestionSource;
  content: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

export interface Student {
  id: string;
  email: string;
  fullName: string;
  xp: number;
  streak: number;
  level: number;
}

export interface StudyPlanItem {
  id: string;
  studentId: string;
  date: string; // ISO date
  lessonId?: string;
  practiceCount?: number;
  isCompleted: boolean;
}

export interface Mistake {
  id: string;
  studentId: string;
  questionId: string;
  studentAnswer: string;
  createdAt: string;
}
