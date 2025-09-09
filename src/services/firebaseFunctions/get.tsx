import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Question, Quiz, QuizSubmissions, QuizSummary, userData, FlashcardData } from "../interfaces/interface";
import { FlowchartResponse } from "@/app/flowchart/page";

export async function getUser(userId: string): Promise<userData | null> {
  if(process.env.NODE_ENV === 'development') {
  console.log('GetUser - Fetching user data for userId:', userId);
  }
  const userSnap = await getDoc(doc(db, 'users', userId));
  if (!userSnap.exists()) {
    if(process.env.NODE_ENV === 'development') {
    console.log('GetUser - User document does not exist');
    }
    return null;
  }
  const userData = userSnap.data() as userData;
  if(process.env.NODE_ENV === 'development') {
  console.log('GetUser - Retrieved user data:', userData);
  }
  return userData;
}

export async function getQuizzes(userId: string): Promise<Quiz[]> {
  try {
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Quiz collection path:', `users/${userId}/quizes`);
    }
    const quizSnap = await getDocs(collection(db, 'users', userId, 'quizes'));
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Quiz collection size:', quizSnap.size);
    }
    return quizSnap.docs.map(doc => ({id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.error('❌ Error in getQuizzes:', error);
    throw error;
  }
}

// Alternative function to get quizzes from user document array
export async function getQuizzesFromUserArray(userId: string): Promise<QuizSummary[]> {
  try {
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Getting quizzes from user document array');
    }
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      if(process.env.NODE_ENV === 'development') {
      console.log('❌ User document does not exist');
      }
      return [];
    }
    const userData = userDoc.data();
    const quizzes = userData?.quizes || [];
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 User document quizzes array size:', quizzes.length);
    }
    return quizzes;
  } catch (error) {
    console.error('❌ Error in getQuizzesFromUserArray:', error);
    throw error;
  }
}

export async function getQuiz(userId: string, quizId: string): Promise<Quiz | null> {
  const quizDoc = await getDoc(doc(db, 'users', userId, 'quizes', quizId));
  if (!quizDoc.exists()) return null;
  return {id: quizDoc.id, ...quizDoc.data() } as Quiz;
}

export async function getQuestions(userId: string, quizId: string): Promise<Question[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'quizes', quizId, 'questions'));
  return snap.docs.map(doc => doc.data() as Question);
}

export async function getSubmissions(userId: string, quizId: string): Promise<QuizSubmissions[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'quizes', quizId, 'submissions'));
  return snap.docs.map(doc => ({...doc.data() } as QuizSubmissions));
}

export async function getSubmission(userId: string, quizId: string, submissionId: string): Promise<QuizSubmissions | null> {
  const submissionDoc = await getDoc(doc(db, 'users', userId, 'quizes', quizId, 'submissions', submissionId));
  if (!submissionDoc.exists()) return null;
  return submissionDoc.data() as QuizSubmissions;
}

export async function getFlowChart(userId: string, flowchartId: string): Promise<FlowchartResponse | null> {
  const flowchartDoc = await getDoc(doc(db, 'users', userId, 'flowcharts', flowchartId));
  if (!flowchartDoc.exists()) return null;
  return { id: flowchartDoc.id, ...flowchartDoc.data() } as FlowchartResponse;
}

export async function getFlowChartIds(userId: string): Promise<string[]> {
  const flowchartsSnap = await getDocs(collection(db, 'users', userId, 'flowcharts'));
  return flowchartsSnap.docs.map(doc => doc.id);
}

export async function getFlowCharts(userId: string): Promise<FlowchartResponse[]> {
  try {
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Flowchart collection path:', `users/${userId}/flowcharts`);
    }
    const flowchartsSnap = await getDocs(collection(db, 'users', userId, 'flowcharts'));
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Flowchart collection size:', flowchartsSnap.size);
    console.log('🔍 Flowchart collection empty?', flowchartsSnap.empty);
    }
    const results = flowchartsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlowchartResponse));
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Mapped flowcharts:', results);
    }
    return results;
  } catch (error: unknown) {
    console.error('❌ Error in getFlowCharts:', error);
    console.error('❌ Error code:', (error as { code?: string })?.code);
    console.error('❌ Error message:', (error as { message?: string })?.message);
    
    // If it's a permission error, return empty array instead of throwing
    if ((error as { code?: string })?.code === 'permission-denied') {
      console.warn('⚠️ Permission denied for flowcharts - returning empty array');
      return [];
    }
    
    throw error;
  }
}

export async function getFlashcard(userId: string, flashcardId: string): Promise<FlashcardData | null> {
  try {
    const flashcardDoc = await getDoc(doc(db, 'users', userId, 'flashcards', flashcardId));
    if (!flashcardDoc.exists()) return null;
    return { id: flashcardDoc.id, ...flashcardDoc.data() } as FlashcardData;
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    return null;
  }
}

export async function getFlashcards(userId: string): Promise<FlashcardData[]> {
  try {
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Flashcard collection path:', `users/${userId}/flashcards`);
    }
    const flashcardsSnap = await getDocs(collection(db, 'users', userId, 'flashcards'));
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Flashcard collection size:', flashcardsSnap.size);
    }
    const results = flashcardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlashcardData));
    if(process.env.NODE_ENV === 'development') {
    console.log('🔍 Mapped flashcards:', results);
    }
    return results;
  } catch (error: unknown) {
    console.error('❌ Error in getFlashcards:', error);
    
    // If it's a permission error, return empty array instead of throwing
    if ((error as { code?: string })?.code === 'permission-denied') {
      console.warn('⚠️ Permission denied for flashcards - returning empty array');
      return [];
    }
    
    throw error;
  }
}