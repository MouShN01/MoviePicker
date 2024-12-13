import { db, auth } from "../firebase"
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const createLobby = async ({genre, type}) => {
    try{
      const user = auth.currentUser;
      console.log("User:", user)
      if(!user)
      {
        console.error("No user!")
        return null;
      }

      const docRef = await addDoc(collection(db, "lobbies"), {
        hostId:user.uid,
        hostName:user.displayName,
        guestId: null,
        status: "waiting",
        createdAt: serverTimestamp(),
        genre,
        type,
        votes:{},
      });

      console.log("Lobby create with ID: ", docRef.id);
      return docRef.id;
    } catch(error){
      console.log("Error creating lobby: ", error);
      return null;
    }
  };