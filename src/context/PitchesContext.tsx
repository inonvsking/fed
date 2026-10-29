import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Pitch,
  PitchMessage,
  PitchPlayer,
  PlayerCard,
  ShoutCategory,
  UserCheckIn,
} from '@/types/pitch';
import { translations, Language, TranslationKey } from '@/constants/translations';
import { auth } from '@/services/firebase';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  seedPitchesIfEmpty,
  fetchPitchesOnce,
  subscribeToPitches,
  postPitchMessage,
  checkInToPitch,
  checkOutFromPitch,
  syncUserProfile,
  getUserProfile,
} from '@/services/pitchService';

const INITIAL_USER_CARD: PlayerCard = {
  id: 'me',
  name: 'Baller',
  nickname: 'Baller ⚽',
  position: 'ST',
  rating: 75,
  stats: {
    pac: 75,
    sho: 75,
    pas: 75,
    dri: 75,
    def: 75,
    phy: 75,
  },
  avatar: '⚽',
  favoriteClub: '',
  cardTier: 'gold',
  careerStats: {
    matches: 0,
    goals: 0,
    mvps: 0,
    cleanSheets: 0,
  },
};

const INITIAL_PITCHES: Pitch[] = [
  {
    id: 'pitch-1',
    name: 'Park HaYarkon 5v5 Turf',
    hebrewName: 'כלוב פארק הירקון',
    area: 'North Park Area',
    distanceKm: 0.4,
    surface: '4G Artificial Turf',
    surfaceHebrew: 'דשא סינתטי דור 4',
    size: '5v5',
    hasLights: true,
    hasNets: true,
    liveCount: 0,
    enRouteCount: 0,
    matchStatus: 'quiet',
    accentColor: '#00FF87',
    activePlayers: [],
    messages: [],
  },
  {
    id: 'pitch-2',
    name: 'Bloomfield Street Cage',
    hebrewName: 'כלוב בלומפילד מרכז',
    area: 'Downtown Sports Complex',
    distanceKm: 0.9,
    surface: 'Concrete Cage',
    surfaceHebrew: 'כלוב אספלט מגודר',
    size: '3v3 Cage',
    hasLights: true,
    hasNets: true,
    liveCount: 0,
    enRouteCount: 0,
    matchStatus: 'quiet',
    accentColor: '#FFD700',
    activePlayers: [],
    messages: [],
  },
  {
    id: 'pitch-3',
    name: 'South Community Turf',
    hebrewName: 'דשא סינתטי קהילתי דרום',
    area: 'Community Center',
    distanceKm: 1.4,
    surface: '4G Artificial Turf',
    surfaceHebrew: 'דשא סינתטי רך',
    size: '7v7',
    hasLights: true,
    hasNets: true,
    liveCount: 0,
    enRouteCount: 0,
    matchStatus: 'quiet',
    accentColor: '#00E5FF',
    activePlayers: [],
    messages: [],
  },
  {
    id: 'pitch-4',
    name: 'Givatayim Court',
    hebrewName: 'מגרש גבעתיים מקורה',
    area: 'Rambam Park',
    distanceKm: 2.1,
    surface: 'Futsal Hardcourt',
    surfaceHebrew: 'משטח קטרגל קשיח',
    size: '5v5',
    hasLights: true,
    hasNets: false,
    liveCount: 0,
    enRouteCount: 0,
    matchStatus: 'quiet',
    accentColor: '#FF6B6B',
    activePlayers: [],
    messages: [],
  },
  {
    id: 'pitch-5',
    name: 'Dizengoff Rooftop Pitch',
    hebrewName: 'מגרש גג דיזנגוף סנטר',
    area: 'Center City Rooftop',
    distanceKm: 2.7,
    surface: '4G Artificial Turf',
    surfaceHebrew: 'דשא מלאכותי מואר',
    size: '5v5',
    hasLights: true,
    hasNets: true,
    liveCount: 0,
    enRouteCount: 0,
    matchStatus: 'quiet',
    accentColor: '#B388FF',
    activePlayers: [],
    messages: [],
  },
];

interface PitchesContextType {
  pitches: Pitch[];
  selectedPitchId: string | null;
  setSelectedPitchId: (id: string | null) => void;
  userCard: PlayerCard;
  userCheckIn: UserCheckIn;
  checkIn: (pitchId: string, type: 'at_pitch' | 'en_route', etaMinutes?: number) => void;
  checkOut: () => void;
  sendShout: (pitchId: string, text: string, category?: ShoutCategory) => void;
  updateBallerCard: (updates: Partial<PlayerCard>) => void;
  filter: 'all' | 'active' | 'nearby' | 'lights';
  setFilter: (f: 'all' | 'active' | 'nearby' | 'lights') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshRadar: () => Promise<void>;
  triggerSimulatedActivity: (pitchId?: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  firebaseUser: User | null;
  isFirebaseConnected: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const PitchesContext = createContext<PitchesContextType | undefined>(undefined);

export function PitchesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');
  const [pitches, setPitches] = useState<Pitch[]>(INITIAL_PITCHES);
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [userCard, setUserCard] = useState<PlayerCard>(INITIAL_USER_CARD);
  const [filter, setFilter] = useState<'all' | 'active' | 'nearby' | 'lights'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [userCheckIn, setUserCheckIn] = useState<UserCheckIn>({
    pitchId: null,
    pitchName: null,
    status: 'none',
    etaMinutes: 0,
    expiresAt: null,
  });

  const toggleLanguage = () => setLanguage((l) => (l === 'he' ? 'en' : 'he'));
  const t = (key: TranslationKey): string =>
    translations[language][key] ?? translations.en[key] ?? (key as string);
  const isRTL = language === 'he';

  // Initialize Firebase Authentication & Firestore Realtime Sync
  useEffect(() => {
    // 1. Auth state subscription
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsFirebaseConnected(true);

        // Fetch or initialize user profile in Firestore
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserCard(profile);
          } else {
            const initialCard: PlayerCard = {
              ...INITIAL_USER_CARD,
              id: user.uid,
            };
            setUserCard(initialCard);
            await syncUserProfile(user.uid, initialCard);
          }
        } catch (e) {
          console.warn('Failed to sync profile with Firestore:', e);
        }
      } else {
        // Automatically sign in anonymously for instantaneous baller experience
        signInAnonymously(auth).catch((err) => {
          console.warn('Anonymous sign-in error:', err);
        });
      }
    });

    // 2. Seed pitches collection if first time
    seedPitchesIfEmpty(INITIAL_PITCHES);

    // 3. Real-time Firestore Pitches subscription
    const unsubscribePitches = subscribeToPitches(
      (livePitches) => {
        if (livePitches && livePitches.length > 0) {
          setPitches(livePitches);
          setIsFirebaseConnected(true);
        }
      },
      (err) => {
        console.warn('Firestore subscription fallback:', err);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribePitches();
    };
  }, []);

  // Check-In handler (Optimistic local update + Firestore cloud sync)
  const checkIn = (pitchId: string, type: 'at_pitch' | 'en_route', etaMinutes: number = 15) => {
    const targetPitch = pitches.find((p) => p.id === pitchId);
    if (!targetPitch) return;

    const previousPitchId = userCheckIn.pitchId;
    const playerId = firebaseUser ? firebaseUser.uid : userCard.id;

    const newPlayer: PitchPlayer = {
      id: playerId,
      name: `${userCard.name} (You)`,
      position: userCard.position,
      avatar: userCard.avatar,
      status: type,
      etaMinutes: type === 'en_route' ? etaMinutes : undefined,
      joinedAt: 'just now',
      rating: userCard.rating,
    };

    // Increment career matches played if newly arriving at a pitch
    if (type === 'at_pitch' && previousPitchId !== pitchId) {
      setUserCard((prev) => {
        const nextStats = {
          matches: (prev.careerStats?.matches || 0) + 1,
          goals: prev.careerStats?.goals || 0,
          mvps: prev.careerStats?.mvps || 0,
          cleanSheets: prev.careerStats?.cleanSheets || 0,
        };
        const nextCard = { ...prev, careerStats: nextStats };
        const uid = firebaseUser ? firebaseUser.uid : prev.id;
        syncUserProfile(uid, nextCard).catch(() => {});
        return nextCard;
      });
    }

    // Remove user from any previous pitch if checked in
    setPitches((prev) =>
      prev.map((pitch) => {
        const filteredPlayers = pitch.activePlayers.filter((p) => p.id !== playerId);
        const liveCount = filteredPlayers.filter((p) => p.status === 'at_pitch').length;
        const enRouteCount = filteredPlayers.filter((p) => p.status === 'en_route').length;

        if (pitch.id === pitchId) {
          const updatedPlayers = [newPlayer, ...filteredPlayers];
          const newLive = updatedPlayers.filter((p) => p.status === 'at_pitch').length;
          const newEnRoute = updatedPlayers.filter((p) => p.status === 'en_route').length;

          const autoMsg: PitchMessage = {
            id: `msg-${Date.now()}`,
            pitchId,
            senderId: playerId,
            senderName: userCard.name,
            senderPosition: userCard.position,
            senderAvatar: userCard.avatar,
            text:
              type === 'at_pitch'
                ? `⚽ Just arrived at the pitch! Ready to play!`
                : `🏃‍♂️ Heading over now! Arriving in ~${etaMinutes} mins.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isQuickShout: true,
            shoutCategory: type === 'at_pitch' ? 'general' : 'en_route',
          };

          return {
            ...pitch,
            liveCount: newLive,
            enRouteCount: newEnRoute,
            matchStatus: newLive >= 6 ? 'game_on' : newLive >= 2 ? 'heating_up' : pitch.matchStatus,
            activePlayers: updatedPlayers,
            messages: [...pitch.messages, autoMsg],
          };
        }

        return {
          ...pitch,
          liveCount,
          enRouteCount,
          activePlayers: filteredPlayers,
        };
      })
    );

    const expiresAt = Date.now() + (type === 'at_pitch' ? 90 : etaMinutes) * 60 * 1000;
    setUserCheckIn({
      pitchId,
      pitchName: targetPitch.name,
      status: type,
      etaMinutes,
      expiresAt,
    });

    // Sync to Cloud Firestore
    checkInToPitch(targetPitch, newPlayer, previousPitchId).catch((err) => {
      console.warn('Firestore checkIn sync failed:', err);
    });
  };

  // Check-Out handler
  const checkOut = () => {
    if (!userCheckIn.pitchId) return;
    const currentPitchId = userCheckIn.pitchId;
    const targetPitch = pitches.find((p) => p.id === currentPitchId);
    const playerId = firebaseUser ? firebaseUser.uid : userCard.id;

    setPitches((prev) =>
      prev.map((pitch) => {
        if (pitch.id === currentPitchId) {
          const filtered = pitch.activePlayers.filter((p) => p.id !== playerId);
          const newLive = filtered.filter((p) => p.status === 'at_pitch').length;
          const newEnRoute = filtered.filter((p) => p.status === 'en_route').length;
          return {
            ...pitch,
            liveCount: newLive,
            enRouteCount: newEnRoute,
            matchStatus: newLive >= 6 ? 'game_on' : newLive >= 2 ? 'heating_up' : 'quiet',
            activePlayers: filtered,
          };
        }
        return pitch;
      })
    );

    setUserCheckIn({
      pitchId: null,
      pitchName: null,
      status: 'none',
      etaMinutes: 0,
      expiresAt: null,
    });

    if (targetPitch) {
      checkOutFromPitch(targetPitch, playerId).catch((err) => {
        console.warn('Firestore checkOut sync failed:', err);
      });
    }
  };

  // Send a live shout
  const sendShout = (pitchId: string, text: string, category: ShoutCategory = 'general') => {
    const targetPitch = pitches.find((p) => p.id === pitchId);
    const playerId = firebaseUser ? firebaseUser.uid : userCard.id;

    const newMsg: PitchMessage = {
      id: `shout-${Date.now()}-${Math.random()}`,
      pitchId,
      senderId: playerId,
      senderName: userCard.name,
      senderPosition: userCard.position,
      senderAvatar: userCard.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickShout: true,
      shoutCategory: category,
    };

    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === pitchId) {
          return {
            ...p,
            messages: [...p.messages, newMsg],
          };
        }
        return p;
      })
    );

    // Sync to Firestore
    if (targetPitch) {
      postPitchMessage(pitchId, newMsg, targetPitch.messages).catch((err) => {
        console.warn('Firestore shout sync failed:', err);
      });
    }
  };

  const updateBallerCard = (updates: Partial<PlayerCard>) => {
    setUserCard((prev) => {
      const nextCard = {
        ...prev,
        ...updates,
        stats: updates.stats ? { ...prev.stats, ...updates.stats } : prev.stats,
      };

      const uid = firebaseUser ? firebaseUser.uid : nextCard.id;
      syncUserProfile(uid, nextCard).catch((err) => {
        console.warn('Failed to update profile in Firestore:', err);
      });

      return nextCard;
    });
  };

  const refreshRadar = async () => {
    try {
      const fresh = await fetchPitchesOnce();
      if (fresh && fresh.length > 0) {
        setPitches(fresh);
        setIsFirebaseConnected(true);
      }
    } catch (e) {
      console.warn('Failed to refresh radar:', e);
    }
  };

  const triggerSimulatedActivity = (_targetPitchId?: string) => {
    refreshRadar();
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    setFirebaseUser(cred.user);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    setFirebaseUser(cred.user);
  };

  const signOutUser = async () => {
    await signOut(auth);
    // Automatically re-initialize with anonymous session
    const cred = await signInAnonymously(auth);
    setFirebaseUser(cred.user);
  };

  return (
    <PitchesContext.Provider
      value={{
        pitches,
        selectedPitchId,
        setSelectedPitchId,
        userCard,
        userCheckIn,
        checkIn,
        checkOut,
        sendShout,
        updateBallerCard,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        refreshRadar,
        triggerSimulatedActivity,
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
        firebaseUser,
        isFirebaseConnected,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
      }}>
      {children}
    </PitchesContext.Provider>
  );
}

export function usePitches() {
  const context = useContext(PitchesContext);
  if (!context) {
    throw new Error('usePitches must be used within a PitchesProvider');
  }
  return context;
}
