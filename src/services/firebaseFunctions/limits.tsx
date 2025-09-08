import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { userData } from '../interfaces/interface';

const DAILY_GENERATION_LIMIT = 10; // Total daily limit for all generations
const MAX_QUIZ_SUBMISSIONS = 5;

// Helper function to get today's date string in consistent format
function getTodayDateString(): string {
  const now = new Date();
  // Get local date in YYYY-MM-DD format without timezone conversion
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to check if it's a new day
function isNewDay(lastDate: Date | Timestamp | null): boolean {
  if (!lastDate) return true;
  
  // Convert Firestore timestamp or Date to local date string
  let lastDateObj: Date;
  if (lastDate instanceof Timestamp) {
    lastDateObj = lastDate.toDate();
  } else {
    lastDateObj = new Date(lastDate);
  }
  
  const lastYear = lastDateObj.getFullYear();
  const lastMonth = String(lastDateObj.getMonth() + 1).padStart(2, '0');
  const lastDay = String(lastDateObj.getDate()).padStart(2, '0');
  const lastDateString = `${lastYear}-${lastMonth}-${lastDay}`;
  
  const todayString = getTodayDateString();
  
  console.log('Last generation date string:', lastDateString);
  console.log('Today date string:', todayString);
  console.log('Is new day?', lastDateString !== todayString);
  
  return lastDateString !== todayString;
}

export async function checkDailyGenerationLimit(userId: string): Promise<{ canGenerate: boolean; remaining: number }> {
  try {
    console.log('checkDailyGenerationLimit called for userId:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log('User document does not exist');
      return { canGenerate: false, remaining: 0 };
    }
    
    const userData = userDoc.data() as userData;
    console.log('User data in check:', userData);
    console.log('Daily generation count:', userData.dailyGenerationCount);
    console.log('Last generation date:', userData.lastGenerationDate);
    
    // Check if it's a new day
    if (isNewDay(userData.lastGenerationDate || null)) {
      console.log('It is a new day, allowing generation');
      return { canGenerate: true, remaining: DAILY_GENERATION_LIMIT };
    }
    
    const currentCount = userData.dailyGenerationCount || 0;
    const remaining = Math.max(0, DAILY_GENERATION_LIMIT - currentCount);
    
    console.log('Current count:', currentCount);
    console.log('Remaining:', remaining);
    console.log('Can generate:', currentCount < DAILY_GENERATION_LIMIT);
    
    return {
      canGenerate: currentCount < DAILY_GENERATION_LIMIT,
      remaining: remaining
    };
  } catch (error) {
    console.error('Error checking daily generation limit:', error);
    return { canGenerate: false, remaining: 0 };
  }
}

export async function updateDailyGenerationCount(userId: string): Promise<boolean> {
  try {
    console.log('updateDailyGenerationCount called for userId:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log('User document does not exist');
      return false;
    }
    
    const userData = userDoc.data() as userData;
    const today = new Date();
    console.log('Current user data:', userData);
    console.log('Today:', today);
    console.log('Last generation date:', userData.lastGenerationDate);
    console.log('Is new day?', isNewDay(userData.lastGenerationDate || null));
    
    let newCount = 1;
    
    // If it's the same day, increment the count
    if (!isNewDay(userData.lastGenerationDate || null)) {
      newCount = (userData.dailyGenerationCount || 0) + 1;
    }
    
    console.log('New count will be:', newCount);
    
    await updateDoc(doc(db, 'users', userId), {
      dailyGenerationCount: newCount,
      lastGenerationDate: today
    });
    
    console.log('Successfully updated user document');
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
  return await updateDailyGenerationCount(userId);
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
