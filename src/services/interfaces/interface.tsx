import { Timestamp } from 'firebase/firestore';

export interface QuizSubmissions {
    attempt_number: number,
    time_taken: number,
    submittedAt: Date,
    answers: Record<number, string | number | boolean>,
    score: number,
}

export interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correct: number | boolean;
  explanation?: string;
}

export interface Quiz {
    id?: string,
    title: string,
    quiz_type: string,
    difficulty: string,
    number: number,
    list_score: number[],
    time_limit: number,
    generatedAt: Date,
    updatesAt: Date,
    questions: Question[],
    submissions: string[],
    total_submissions: number,
    feedback?: {
        rating: number,
        experience: string,
        improvements: string,
        submittedAt: Date
    }
}

// Lightweight version for user's quiz array (without questions)
export interface QuizSummary {
    id?: string,
    title: string,
    quiz_type: string,
    difficulty: string,
    number: number,
    list_score: number[],
    time_limit: number,
    generatedAt: Date,
    updatesAt: Date,
    submissions: string[],
    total_submissions: number,
}

export interface userData {
    id: string,
    username: string,
    email: string,
    joined: Date,
    quizes: QuizSummary[], // Changed to use QuizSummary instead of full Quiz
    dailyGenerationCount?: number, // Universal field for all daily generations
    lastGenerationDate?: Date | Timestamp, // Universal field for last generation date
    onboarding_completed?: boolean,
    location?: string,
    hearAboutUs?: string,
    primaryGoal?: string,
    educationLevel?: string,
    studyTime?: string,
    subjectsOfInterest?: string[],
    onboarding_completed_at?: string,
}

export interface currentUser {
    id: string,
    username: string,
    email: string,
    joined: Date,
    onboarding_completed?: boolean,
    location?: string,
    hearAboutUs?: string,
    primaryGoal?: string,
    educationLevel?: string,
    studyTime?: string,
    subjectsOfInterest?: string[],
    onboarding_completed_at?: string,
}

export interface Flashcard {
    id?: string;
    question: string;
    answer: string;
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
}

export interface FlashcardData {
    id?: string;
    title: string;
    description?: string;
    flashcards: Flashcard[];
    totalCards?: number;
    estimatedTime?: number;
    generatedAt?: Date | { seconds: number };
}