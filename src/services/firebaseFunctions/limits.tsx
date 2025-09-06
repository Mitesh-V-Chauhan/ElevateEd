import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { userData } from '../interfaces/interface';

const DAILY_QUIZ_LIMIT = 5;
const MAX_QUIZ_SUBMISSIONS = 5;

export async function checkDailyQuizLimit(userId: string): Promise<{ canCreate: boolean; remaining: number }> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { canCreate: false, remaining: 0 };
    }
    
    const userData = userDoc.data() as userData;
    const today = new Date().toDateString();
    const lastQuizDate = userData.lastQuizDate ? 
      (userData.lastQuizDate instanceof Timestamp ? 
        userData.lastQuizDate.toDate().toDateString() : 
        new Date(userData.lastQuizDate).toDateString()) : null;
    
    // If it's a new day, reset the count
    if (lastQuizDate !== today) {
      return { canCreate: true, remaining: DAILY_QUIZ_LIMIT };
    }
    
    const currentCount = userData.dailyQuizCount || 0;
    const remaining = Math.max(0, DAILY_QUIZ_LIMIT - currentCount);
    
    return {
      canCreate: currentCount < DAILY_QUIZ_LIMIT,
      remaining: remaining
    };
  } catch (error) {
    console.error('Error checking daily quiz limit:', error);
    return { canCreate: false, remaining: 0 };
  }
}

export async function updateDailyQuizCount(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data() as userData;
    const today = new Date();
    const todayString = today.toDateString();
    const lastQuizDate = userData.lastQuizDate ? 
      (userData.lastQuizDate instanceof Timestamp ? 
        userData.lastQuizDate.toDate().toDateString() : 
        new Date(userData.lastQuizDate).toDateString()) : null;
    
    let newCount = 1;
    
    // If it's the same day, increment the count
    if (lastQuizDate === todayString) {
      newCount = (userData.dailyQuizCount || 0) + 1;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      dailyQuizCount: newCount,
      lastQuizDate: today
    });
    
    return true;
  } catch (error) {
    console.error('Error updating daily quiz count:', error);
    return false;
  }
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
  DAILY_QUIZ_LIMIT,
  MAX_QUIZ_SUBMISSIONS
};
