import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Pitch, PitchMessage, PitchPlayer, PlayerCard } from '@/types/pitch';

const PITCHES_COLLECTION = 'pitches';
const USERS_COLLECTION = 'users';

export async function seedPitchesIfEmpty(initialPitches: Pitch[]): Promise<void> {
  try {
    const snap = await getDocs(collection(db, PITCHES_COLLECTION));
    if (snap.empty) {
      const batch = writeBatch(db);
      for (const pitch of initialPitches) {
        const pitchRef = doc(db, PITCHES_COLLECTION, pitch.id);
        batch.set(pitchRef, {
          ...pitch,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    }
  } catch (err) {
    console.warn('Error checking/seeding Firestore pitches:', err);
  }
}

export async function fetchPitchesOnce(): Promise<Pitch[]> {
  try {
    const snap = await getDocs(collection(db, PITCHES_COLLECTION));
    const pitches: Pitch[] = [];
    snap.forEach((d) => {
      const data = d.data() as Pitch;
      pitches.push({
        ...data,
        id: d.id,
        activePlayers: data.activePlayers || [],
        messages: data.messages || [],
      });
    });
    return pitches;
  } catch (err) {
    console.warn('Error fetching pitches once:', err);
    return [];
  }
}

export function subscribeToPitches(
  onUpdate: (pitches: Pitch[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, PITCHES_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const pitches: Pitch[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Pitch;
        pitches.push({
          ...data,
          id: d.id,
          activePlayers: data.activePlayers || [],
          messages: data.messages || [],
        });
      });
      onUpdate(pitches);
    },
    (err) => {
      console.warn('Firestore subscribeToPitches error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToPitchMessages(
  pitchId: string,
  onUpdate: (messages: PitchMessage[]) => void
) {
  const messagesCol = collection(db, PITCHES_COLLECTION, pitchId, 'messages');
  const q = query(messagesCol, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const msgs: PitchMessage[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      msgs.push({
        id: d.id,
        pitchId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderPosition: data.senderPosition,
        senderAvatar: data.senderAvatar,
        text: data.text,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isQuickShout: data.isQuickShout,
        shoutCategory: data.shoutCategory,
      });
    });
    // Return in chronological order
    onUpdate(msgs.reverse());
  });
}

export async function postPitchMessage(pitchId: string, message: Omit<PitchMessage, 'id'>, pitchMessages: PitchMessage[]) {
  try {
    const msgRef = doc(collection(db, PITCHES_COLLECTION, pitchId, 'messages'));
    const newMsg: PitchMessage = {
      ...message,
      id: msgRef.id,
    };

    // Save in subcollection
    await setDoc(msgRef, {
      ...message,
      createdAt: serverTimestamp(),
    });

    // Also update pitch doc's preview messages (keep last 5)
    const updatedMessages = [...pitchMessages, newMsg].slice(-5);
    const pitchRef = doc(db, PITCHES_COLLECTION, pitchId);
    await updateDoc(pitchRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp(),
    });

    return newMsg;
  } catch (err) {
    console.warn('Error posting pitch message to Firestore:', err);
    throw err;
  }
}

export async function checkInToPitch(
  pitch: Pitch,
  player: PitchPlayer,
  previousPitchId?: string | null
) {
  try {
    const batch = writeBatch(db);

    // If checked in elsewhere, remove from old pitch
    if (previousPitchId && previousPitchId !== pitch.id) {
      const oldPlayerDoc = doc(db, PITCHES_COLLECTION, previousPitchId, 'players', player.id);
      batch.delete(oldPlayerDoc);
    }

    // Add to new pitch players subcollection
    const newPlayerRef = doc(db, PITCHES_COLLECTION, pitch.id, 'players', player.id);
    batch.set(newPlayerRef, {
      ...player,
      updatedAt: serverTimestamp(),
    });

    // Calculate new activePlayers array
    const filtered = pitch.activePlayers.filter((p) => p.id !== player.id);
    const updatedPlayers = [player, ...filtered];
    const newLive = updatedPlayers.filter((p) => p.status === 'at_pitch').length;
    const newEnRoute = updatedPlayers.filter((p) => p.status === 'en_route').length;
    const newStatus = newLive >= 6 ? 'game_on' : newLive >= 2 ? 'heating_up' : pitch.matchStatus;

    // Add automated arrival/en-route shout
    const autoMsgRef = doc(collection(db, PITCHES_COLLECTION, pitch.id, 'messages'));
    const autoMsgText =
      player.status === 'at_pitch'
        ? `⚽ Just arrived at the pitch! Ready to play!`
        : `🏃‍♂️ Heading over now! Arriving in ~${player.etaMinutes || 15} mins.`;

    const autoMsg: PitchMessage = {
      id: autoMsgRef.id,
      pitchId: pitch.id,
      senderId: player.id,
      senderName: player.name,
      senderPosition: player.position,
      senderAvatar: player.avatar,
      text: autoMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickShout: true,
      shoutCategory: player.status === 'at_pitch' ? 'general' : 'en_route',
    };

    batch.set(autoMsgRef, {
      ...autoMsg,
      createdAt: serverTimestamp(),
    });

    const pitchRef = doc(db, PITCHES_COLLECTION, pitch.id);
    batch.update(pitchRef, {
      liveCount: newLive,
      enRouteCount: newEnRoute,
      matchStatus: newStatus,
      activePlayers: updatedPlayers,
      messages: [...pitch.messages, autoMsg].slice(-5),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (err) {
    console.warn('Error during check-in to Firestore:', err);
    throw err;
  }
}

export async function checkOutFromPitch(pitch: Pitch, playerId: string) {
  try {
    const batch = writeBatch(db);

    const playerDoc = doc(db, PITCHES_COLLECTION, pitch.id, 'players', playerId);
    batch.delete(playerDoc);

    const filtered = pitch.activePlayers.filter((p) => p.id !== playerId);
    const newLive = filtered.filter((p) => p.status === 'at_pitch').length;
    const newEnRoute = filtered.filter((p) => p.status === 'en_route').length;
    const newStatus = newLive >= 6 ? 'game_on' : newLive >= 2 ? 'heating_up' : 'quiet';

    const pitchRef = doc(db, PITCHES_COLLECTION, pitch.id);
    batch.update(pitchRef, {
      liveCount: newLive,
      enRouteCount: newEnRoute,
      matchStatus: newStatus,
      activePlayers: filtered,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (err) {
    console.warn('Error during check-out from Firestore:', err);
    throw err;
  }
}

export async function syncUserProfile(userId: string, card: PlayerCard): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(
      userRef,
      {
        ...card,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Error saving user profile to Firestore:', err);
  }
}

export async function getUserProfile(userId: string): Promise<PlayerCard | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as PlayerCard;
    }
  } catch (err) {
    console.warn('Error loading user profile from Firestore:', err);
  }
  return null;
}
