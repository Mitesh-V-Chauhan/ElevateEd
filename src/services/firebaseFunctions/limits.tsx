import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { userData } from '../interfaces/interface';

const DAILY_GENERATION_LIMIT = 10; // Total daily limit for all generations
const MAX_QUIZ_SUBMISSIONS = 5;

// Helper function to get today's date string in consistent format
function getTodayDateString(): string {
  const now = new Date();
  // Reset at midnight local time
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Helper function to check if it's a new day
function isNewDay(lastDate: Date | Timestamp | null): boolean {
  if (!lastDate) return true;
  
  const lastDateString = lastDate instanceof Timestamp ? 
    lastDate.toDate().toISOString().split('T')[0] : 
    new Date(lastDate).toISOString().split('T')[0];
  
  return lastDateString !== getTodayDateString();
}

export async function checkDailyGenerationLimit(userId: string): Promise<{ canGenerate: boolean; remaining: number }> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { canGenerate: false, remaining: 0 };
    }
    
    const userData = userDoc.data() as userData;
    
    // Check if it's a new day
    if (isNewDay(userData.lastGenerationDate || null)) {
      return { canGenerate: true, remaining: DAILY_GENERATION_LIMIT };
    }
    
    const currentCount = userData.dailyGenerationCount || 0;
    const remaining = Math.max(0, DAILY_GENERATION_LIMIT - currentCount);
    
    return {
      canGenerate: currentCount < DAILY_GENERATION_LIMIT,
      remaining: remaining
    };
  } catch (error) {
    console.error('Error checking daily generation limit:', error);
    return { canGenerate: false, remaining: 0 };
  }
}

export async function updateDailyGenerationCount(userId: string, generationType: 'quiz' | 'summary' | 'flashcard' | 'flowchart' | 'translation'): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data() as userData;
    const today = new Date();
    
    let newCount = 1;
    
    // If it's the same day, increment the count
    if (!isNewDay(userData.lastGenerationDate || null)) {
      newCount = (userData.dailyGenerationCount || 0) + 1;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      dailyGenerationCount: newCount,
      lastGenerationDate: today
    });
    
    return true;
  } catch (error) {
    console.error('Error updating daily generation count:', error);
    return false;
  }
}

// Backward compatibility function for quiz-specific limit checking
// Now uses the universal generation limit instead of a separate quiz limit
export async function checkDailyQuizLimit(userId: string): Promise<{ canCreate: boolean; remaining: number }> {
  const result = await checkDailyGenerationLimit(userId);
  return {
    canCreate: result.canGenerate,
    remaining: result.remaining
  };
}

// Backward compatibility function for quiz count updating
export async function updateDailyQuizCount(userId: string): Promise<boolean> {
  return await updateDailyGenerationCount(userId, 'quiz');
}

export async function checkQuizSubmissionLimit(userId: string, quizId: string): Promise<{ canSubmit: boolean; remaining: number; currentSubmissions: number }> {
  try {
    const quizDoc = await getDoc(doc(db, 'users', userId, 'quizes', quizId));
    if (!quizDoc.exists()) {
      return { canSubmit: false, remaining: 0, currentSubmissions: 0 };
    }
    
    const quizData = quizDoc.data();
    const currentSubmissions = quizData.total_submissions || 0;
    const remaining = Math.max(0, MAX_QUIZ_SUBMISSIONS - currentSubmissions);
    
    return {
      canSubmit: currentSubmissions < MAX_QUIZ_SUBMISSIONS,
      remaining: remaining,
      currentSubmissions: currentSubmissions
    };
  } catch (error) {
    console.error('Error checking quiz submission limit:', error);
    return { canSubmit: false, remaining: 0, currentSubmissions: 0 };
  }
}

export const LIMITS = {
  DAILY_GENERATION_LIMIT,
  MAX_QUIZ_SUBMISSIONS
};
