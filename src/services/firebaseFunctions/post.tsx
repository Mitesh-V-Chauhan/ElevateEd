import { addDoc, collection, doc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Quiz, QuizSubmissions, userData, QuizSummary } from '../interfaces/interface';
import { FlowchartResponse } from '@/app/flowchart/page';
import { FlashcardResponse } from '@/app/flashcard/page';

export async function createUser(user: Omit<userData, 'quizes'>) {
  try {
    if(process.env.NODE_ENV === 'development') {
      console.log('CreateUser - Creating user document:', user);
    }
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      joined: user.joined instanceof Date ? Timestamp.fromDate(user.joined) : user.joined,
      quizes: [], // Initialize empty quizes array
    });
    if(process.env.NODE_ENV === 'development') {
    console.log('CreateUser - User document created successfully');
    }
    return {
      id: user.id,
      status: 200,
    };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return {
      id: null,
      status: 404,
    };
  }
}

export async function createQuiz(
  userId: string,
  quiz: Omit<Quiz, 'generatedAt' | 'updatesAt' | 'submissions' | 'total_submissions'>
) {
  try {
    const quizRef = doc(collection(db, 'users', userId, 'quizes'));
    const now = Timestamp.now();
    
    const quizData = {
      ...quiz,
      generatedAt: now,
      updatesAt: now,
      submissions: [],
      total_submissions: 0,
    };
    
    // Create the quiz document in subcollection
    await setDoc(quizRef, quizData);
    
    // Create lightweight quiz summary for the user's quizes array (without questions)
    const quizSummary: QuizSummary = {
      id: quizRef.id,
      title: quiz.title,
      quiz_type: quiz.quiz_type,
      difficulty: quiz.difficulty,
      number: quiz.number,
      list_score: quiz.list_score,
      time_limit: quiz.time_limit,
      generatedAt: now.toDate(), // Convert to Date for consistency with interface
      updatesAt: now.toDate(),
      submissions: [],
      total_submissions: 0,
    };
    
    // Update the user document to add the quiz summary to the quizes array
    await updateDoc(doc(db, 'users', userId), {
      quizes: arrayUnion(quizSummary)
    });
    if(process.env.NODE_ENV === 'development') {
    console.log('✅ Quiz created and summary added to user array:', quizRef.id);
    }
    
    return {
      id: quizRef.id,
      status: 200,
    };
  } catch (error) {
    console.error('❌ Error creating quiz:', error);
    return {
      id: "",
      status: 404,
    };
  }
}

// Optional: If you later decide to use this
// export async function addQuestion(userId: string, quizId: string, question: Question) {
//   try {
//     const ref = doc(collection(db, 'users', userId, 'quizes', quizId, 'questions'));
//     await setDoc(ref, question);
//     return {
//       id: ref.id,
//       status: 200,
//     };
//   } catch (error: any) {
//     return {
//       id: null,
//       status: 404,
//     };
//   }
// }

export async function submitQuiz(
  userId: string,
  quizId: string,
  submission: QuizSubmissions
) {
  try {
    const submissionRef = await addDoc(collection(db, 'users', userId, 'quizes', quizId, 'submissions'), submission);
    return {
      id: submissionRef.id,
      status: 200,
    };
  } catch {
    return {
      id: "",
      status: 404
    };
  }
}

interface FeedbackData {
  overallRating: number;
  experience: string;
  features: string[];
  usageFrequency: string;
  primaryUse: string;
  deviceType: string;
  mostHelpfulFeature: string;
  improvementAreas: string[];
  recommendation: number;
  additionalComments: string;
  contactEmail: string;
}


export async function submitFeedback(feedback: FeedbackData) {
  try {
    const feedbackRef = await addDoc(collection(db, 'feedback'), feedback);
    return {
      id: feedbackRef.id,
      status: 200,
    };
  } catch {
    return {
      id: "",
      status: 404
    };
  }
}


export async function saveFlowChartData(userId: string, flowChartData: FlowchartResponse) {
  try {
    const flowchartRef = await addDoc(collection(db, 'users', userId, 'flowcharts'), {
      ...flowChartData,
      generatedAt: new Date()
    });
    return {
      id: flowchartRef.id,
      status: 200,
    };
  } catch (error) {
    console.error('Error saving flowchart:', error);
    return {
      id: "",
      status: 404
    };
  }
}

export async function saveFlashcardData(userId: string, flashcardData: FlashcardResponse) {
  try {
    const flashcardRef = await addDoc(collection(db, 'users', userId, 'flashcards'), {
      ...flashcardData,
      generatedAt: new Date()
    });
    return {
      id: flashcardRef.id,
      status: 200,
    };
  } catch (error) {
    console.error('Error saving flashcard:', error);
    return {
      id: "",
      status: 404
    };
  }
}

interface FlashcardData {
  content: string;
  userId: string;
  difficulty: string;
  cardCount: number;
}

interface LocalFlashcardResponse {
  title: string;
  description: string;
  flashcards: Array<{
    id: string;
    question: string;
    answer: string;
    difficulty: "easy" | "medium" | "hard";
    category?: string;
  }>;
  totalCards: number;
  estimatedTime: number;
}

export async function postFlashcard(flashcardData: FlashcardData): Promise<LocalFlashcardResponse> {
  try {
    // Try to call the backend API
    const response = await fetch('/api/flashcard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flashcardData),
    });

    if (!response.ok) {
      throw new Error('Backend API not available');
    }

    const data = await response.json();
    
    // Save to Firebase if backend returns data
    if (flashcardData.userId) {
      await addDoc(collection(db, 'users', flashcardData.userId, 'flashcards'), {
        ...data,
        generatedAt: new Date()
      });
    }

    return data;
  } catch (error) {
    console.error('Error calling flashcard API:', error);
    throw new Error('Backend not available - will use dummy data');
  }
}