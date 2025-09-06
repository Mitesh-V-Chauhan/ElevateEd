import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Question, Quiz, userData } from "../interfaces/interface";

export async function updateUser(userId: string, data: Partial<userData>) {
  try{
    console.log('UpdateUser - Updating user:', userId, 'with data:', data);
    await updateDoc(doc(db, 'users', userId), data);
    console.log('UpdateUser - Update successful');
    return {status: 200}
  }catch(error){
    console.error('UpdateUser - Update failed:', error);
    return {status: 404}
  }
}

export async function updateQuiz(userId: string, quizId: string, data: Partial<Quiz>) {
  try {
    console.log('🔄 Updating quiz:', { userId, quizId, data });
    await updateDoc(doc(db, 'users', userId, 'quizes', quizId), {
      ...data,
      updatesAt: new Date()
    });
    console.log('✅ Quiz update successful');
    return { status: 200 };
  } catch (error) {
    console.error('❌ Quiz update failed:', error);
    throw error;
  }
}

export async function updateQuestion(userId: string, quizId: string, questionId: string, data: Partial<Question>) {
  await updateDoc(doc(db, 'users', userId, 'quizes', quizId, 'questions', questionId), data);
}

