import { db, auth } from "../firebase"
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const createLobby = async () => {
    try{
      console.log("function")
      const user = auth.currentUser;
      console.log("User:", user)
      if(!user)
      {
        console.error("No user!")
        return null;
      }

      const docRef = await addDoc(collection(db, "lobbies"), {
        hostId:user.uid,
        guestId: null,
        status: "waiting",
        createdAt: serverTimestamp(),
      });

      console.log("Lobby create with ID: ", docRef.id);
      return docRef.id;
    } catch(error){
      console.log("Error creating lobby: ", error);
      return null;
    }
  };