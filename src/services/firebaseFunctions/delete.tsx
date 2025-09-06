import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export async function deleteUser(userId: string) {
  await deleteDoc(doc(db, 'users', userId));
}

export async function deleteQuiz(userId: string, quizId: string) {
  await deleteDoc(doc(db, 'users', userId, 'quizes', quizId));
}

export async function deleteQuestion(userId: string, quizId: string, questionId: string) {
  await deleteDoc(doc(db, 'users', userId, 'quizes', quizId, 'questions', questionId));
}

export async function deleteSubmission(userId: string, quizId: string, submissionId: string) {
  await deleteDoc(doc(db, 'users', userId, 'quizes', quizId, 'submissions', submissionId));
}