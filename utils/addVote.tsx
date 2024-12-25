import { db, auth} from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export const addVote = async (lobbyId, movieId) => {
  try{
    const user = auth.currentUser;
    const lobbyRef = doc(db, "lobbies", lobbyId);

    await updateDoc(lobbyRef, {
        [`votes.${user.uid}`]:arrayUnion(movieId),
    });

  }catch(error){
    console.error("Error handling swipe right:", error);
  }
  return { success: false};
};
