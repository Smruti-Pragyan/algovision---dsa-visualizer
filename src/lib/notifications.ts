import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type NotificationType = 'answer' | 'upvote' | 'best_answer';

export async function sendNotification(recipientId: string, type: NotificationType, title: string, message: string, link: string) {
  if (!recipientId) return;
  
  try {
    await addDoc(collection(db, 'notifications'), {
      recipientId,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
