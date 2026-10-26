import React, { createContext, useContext, useState } from 'react';
import {
  Pitch,
  PitchMessage,
  PitchPlayer,
  PlayerCard,
  ShoutCategory,
  UserCheckIn,
} from '@/types/pitch';
import { translations, Language, TranslationKey } from '@/constants/translations';

const INITIAL_USER_CARD: PlayerCard = {
  id: 'me',
  name: 'Leo B.',
  nickname: 'Leo_Striker⚡',
  position: 'ST',
  rating: 88,
  stats: {
    pac: 92,
    sho: 87,
    pas: 81,
    dri: 90,
    def: 45,
    phy: 78,
  },
  avatar: '⚡',
  favoriteClub: 'FC Barcelona',
  cardTier: 'champions',
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
    liveCount: 7,
    enRouteCount: 3,
    matchStatus: 'game_on',
    accentColor: '#00FF87',
    activePlayers: [
      { id: 'p1', name: 'Tomer S.', position: 'ST', avatar: '🔥', status: 'at_pitch', joinedAt: '15m ago', rating: 86 },
      { id: 'p2', name: 'Dan "The Wall"', position: 'GK', avatar: '🧤', status: 'at_pitch', joinedAt: '25m ago', rating: 89 },
      { id: 'p3', name: 'Idan K.', position: 'CM', avatar: '🎯', status: 'at_pitch', joinedAt: '10m ago', rating: 84 },
      { id: 'p4', name: 'Noam B.', position: 'CB', avatar: '🛡️', status: 'at_pitch', joinedAt: '30m ago', rating: 82 },
      { id: 'p5', name: 'Alon M.', position: 'LW', avatar: '⚡', status: 'at_pitch', joinedAt: '5m ago', rating: 85 },
      { id: 'p6', name: 'Yuval R.', position: 'RW', avatar: '⚽', status: 'at_pitch', joinedAt: '20m ago', rating: 80 },
      { id: 'p7', name: 'Ori D.', position: 'CDM', avatar: '🦾', status: 'at_pitch', joinedAt: '40m ago', rating: 83 },
      { id: 'p8', name: 'Guy L.', position: 'ST', avatar: '🚀', status: 'en_route', etaMinutes: 10, joinedAt: 'just now', rating: 81 },
      { id: 'p9', name: 'Ben H.', position: 'CB', avatar: '🧱', status: 'en_route', etaMinutes: 15, joinedAt: '2m ago', rating: 79 },
    ],
    messages: [
      {
        id: 'm1',
        pitchId: 'pitch-1',
        senderId: 'p1',
        senderName: 'Tomer S.',
        senderPosition: 'ST',
        senderAvatar: '🔥',
        text: 'Need 1 more for a fast 5v5! Who is nearby? ⚽',
        timestamp: '17:15',
        isQuickShout: true,
        shoutCategory: 'need_players',
      },
      {
        id: 'm2',
        pitchId: 'pitch-1',
        senderId: 'p2',
        senderName: 'Dan "The Wall"',
        senderPosition: 'GK',
        senderAvatar: '🧤',
        text: 'I brought match gloves and official Champions League ball! 🧤',
        timestamp: '17:18',
        isQuickShout: false,
        shoutCategory: 'ball',
      },
      {
        id: 'm3',
        pitchId: 'pitch-1',
        senderId: 'p8',
        senderName: 'Guy L.',
        senderPosition: 'ST',
        senderAvatar: '🚀',
        text: 'Heading over now! Put me in team Yellow 🏃💨',
        timestamp: '17:22',
        isQuickShout: true,
        shoutCategory: 'en_route',
      },
    ],
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
    liveCount: 4,
    enRouteCount: 2,
    matchStatus: 'heating_up',
    accentColor: '#FFD700',
    activePlayers: [
      { id: 'b1', name: 'Yonatan P.', position: 'CAM', avatar: '👑', status: 'at_pitch', joinedAt: '12m ago', rating: 87 },
      { id: 'b2', name: 'Tal R.', position: 'CB', avatar: '🛡️', status: 'at_pitch', joinedAt: '18m ago', rating: 83 },
      { id: 'b3', name: 'Eran Z.', position: 'ST', avatar: '🎯', status: 'at_pitch', joinedAt: '5m ago', rating: 88 },
      { id: 'b4', name: 'Nadav G.', position: 'RW', avatar: '⚡', status: 'at_pitch', joinedAt: '22m ago', rating: 78 },
      { id: 'b5', name: 'Ron S.', position: 'GK', avatar: '🧤', status: 'en_route', etaMinutes: 8, joinedAt: 'just now', rating: 85 },
    ],
    messages: [
      {
        id: 'bm1',
        pitchId: 'pitch-2',
        senderId: 'b1',
        senderName: 'Yonatan P.',
        senderPosition: 'CAM',
        senderAvatar: '👑',
        text: 'King of the Court 3v3! Winner stays on 🏆',
        timestamp: '17:10',
        isQuickShout: true,
        shoutCategory: 'need_players',
      },
      {
        id: 'bm2',
        pitchId: 'pitch-2',
        senderId: 'b5',
        senderName: 'Ron S.',
        senderPosition: 'GK',
        senderAvatar: '🧤',
        text: 'On my scooter, arriving in 8 mins! Keep a spot!',
        timestamp: '17:20',
        isQuickShout: true,
        shoutCategory: 'en_route',
      },
    ],
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
    liveCount: 9,
    enRouteCount: 4,
    matchStatus: 'game_on',
    accentColor: '#00E5FF',
    activePlayers: [
      { id: 's1', name: 'Liam B.', position: 'CM', avatar: '🪄', status: 'at_pitch', joinedAt: '35m ago', rating: 84 },
      { id: 's2', name: 'Omer F.', position: 'CB', avatar: '🗿', status: 'at_pitch', joinedAt: '25m ago', rating: 81 },
      { id: 's3', name: 'Shai T.', position: 'ST', avatar: '🎯', status: 'at_pitch', joinedAt: '15m ago', rating: 83 },
      { id: 's4', name: 'Itay M.', position: 'GK', avatar: '🧤', status: 'at_pitch', joinedAt: '40m ago', rating: 88 },
    ],
    messages: [
      {
        id: 'sm1',
        pitchId: 'pitch-3',
        senderId: 's4',
        senderName: 'Itay M.',
        senderPosition: 'GK',
        senderAvatar: '🧤',
        text: 'Floodlights are fully turned on! Huge 7v7 going on 🔥',
        timestamp: '17:05',
        isQuickShout: true,
        shoutCategory: 'lights',
      },
    ],
  },
  {
    id: 'pitch-4',
    name: 'Gordon School Pitch',
    hebrewName: 'מגרש בית ספר גורדון',
    area: 'School Campus',
    distanceKm: 0.2,
    surface: 'Futsal Hardcourt',
    surfaceHebrew: 'מגרש קטרגל קשיח',
    size: '5v5',
    hasLights: false,
    hasNets: true,
    liveCount: 2,
    enRouteCount: 1,
    matchStatus: 'heating_up',
    accentColor: '#FF9100',
    activePlayers: [
      { id: 'g1', name: 'Dor N.', position: 'ST', avatar: '⚡', status: 'at_pitch', joinedAt: '8m ago', rating: 80 },
      { id: 'g2', name: 'Matan K.', position: 'CDM', avatar: '🛡️', status: 'at_pitch', joinedAt: '10m ago', rating: 79 },
    ],
    messages: [
      {
        id: 'gm1',
        pitchId: 'pitch-4',
        senderId: 'g1',
        senderName: 'Dor N.',
        senderPosition: 'ST',
        senderAvatar: '⚡',
        text: 'Just 2 of us shooting penalties! Anyone bored at home, come down! ⚽',
        timestamp: '17:24',
        isQuickShout: true,
        shoutCategory: 'need_players',
      },
    ],
  },
  {
    id: 'pitch-5',
    name: 'Dizengoff Rooftop Court',
    hebrewName: 'מגרש גג דיזנגוף',
    area: 'Urban Arena',
    distanceKm: 2.1,
    surface: '4G Artificial Turf',
    surfaceHebrew: 'דשא סינתטי פרמיום',
    size: '5v5',
    hasLights: true,
    hasNets: true,
    liveCount: 0,
    enRouteCount: 5,
    matchStatus: 'quiet',
    accentColor: '#B388FF',
    activePlayers: [],
    messages: [
      {
        id: 'dm1',
        pitchId: 'pitch-5',
        senderId: 'u1',
        senderName: 'Yoav T.',
        senderPosition: 'CAM',
        senderAvatar: '👟',
        text: 'Setting up a 5v5 match at 18:30. RSVP by clicking Heading Over!',
        timestamp: '16:50',
        isQuickShout: true,
        shoutCategory: 'general',
      },
    ],
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
  triggerSimulatedActivity: (pitchId?: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const PitchesContext = createContext<PitchesContextType | undefined>(undefined);

export function PitchesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');
  const [pitches, setPitches] = useState<Pitch[]>(INITIAL_PITCHES);
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [userCard, setUserCard] = useState<PlayerCard>(INITIAL_USER_CARD);
  const [filter, setFilter] = useState<'all' | 'active' | 'nearby' | 'lights'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Check-In handler
  const checkIn = (pitchId: string, type: 'at_pitch' | 'en_route', etaMinutes: number = 15) => {
    const targetPitch = pitches.find((p) => p.id === pitchId);
    if (!targetPitch) return;

    // Remove user from any previous pitch if checked in
    setPitches((prev) =>
      prev.map((pitch) => {
        const filteredPlayers = pitch.activePlayers.filter((p) => p.id !== userCard.id);
        const liveCount = filteredPlayers.filter((p) => p.status === 'at_pitch').length;
        const enRouteCount = filteredPlayers.filter((p) => p.status === 'en_route').length;

        if (pitch.id === pitchId) {
          const newPlayer: PitchPlayer = {
            id: userCard.id,
            name: `${userCard.name} (You)`,
            position: userCard.position,
            avatar: userCard.avatar,
            status: type,
            etaMinutes: type === 'en_route' ? etaMinutes : undefined,
            joinedAt: 'just now',
            rating: userCard.rating,
          };
          const updatedPlayers = [newPlayer, ...filteredPlayers];
          const newLive = updatedPlayers.filter((p) => p.status === 'at_pitch').length;
          const newEnRoute = updatedPlayers.filter((p) => p.status === 'en_route').length;

          // Add broadcast message
          const autoMsg: PitchMessage = {
            id: `msg-${Date.now()}`,
            pitchId,
            senderId: userCard.id,
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
  };

  // Check-Out handler
  const checkOut = () => {
    if (!userCheckIn.pitchId) return;
    const currentPitchId = userCheckIn.pitchId;

    setPitches((prev) =>
      prev.map((pitch) => {
        if (pitch.id === currentPitchId) {
          const filtered = pitch.activePlayers.filter((p) => p.id !== userCard.id);
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
  };

  // Send a live shout
  const sendShout = (pitchId: string, text: string, category: ShoutCategory = 'general') => {
    const newMsg: PitchMessage = {
      id: `shout-${Date.now()}-${Math.random()}`,
      pitchId,
      senderId: userCard.id,
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

    // If user asked for goalie or players, simulate friendly reply after 3s
    if (category === 'need_players' || category === 'goalie') {
      setTimeout(() => {
        const botReplies = [
          { name: 'Dan "The Wall"', pos: 'GK' as const, avatar: '🧤', text: "I'm already here warming up in goal! 🧤" },
          { name: 'Roy 10', pos: 'CAM' as const, avatar: '⚡', text: 'On my way with two friends! Starting in 5m! 🔥' },
          { name: 'Niv_CB', pos: 'CB' as const, avatar: '🛡️', text: 'Ball is pumped, let us know when 10 players are ready!' },
        ];
        const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];

        const botMsg: PitchMessage = {
          id: `bot-${Date.now()}`,
          pitchId,
          senderId: `bot-${Math.random()}`,
          senderName: randomReply.name,
          senderPosition: randomReply.pos,
          senderAvatar: randomReply.avatar,
          text: randomReply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isQuickShout: false,
          shoutCategory: 'general',
        };

        setPitches((currentPitches) =>
          currentPitches.map((p) =>
            p.id === pitchId ? { ...p, messages: [...p.messages, botMsg] } : p
          )
        );
      }, 2500);
    }
  };

  const updateBallerCard = (updates: Partial<PlayerCard>) => {
    setUserCard((prev) => ({
      ...prev,
      ...updates,
      stats: updates.stats ? { ...prev.stats, ...updates.stats } : prev.stats,
    }));
  };

  const triggerSimulatedActivity = (targetPitchId?: string) => {
    const pitch = targetPitchId
      ? pitches.find((p) => p.id === targetPitchId)
      : pitches[Math.floor(Math.random() * pitches.length)];
    if (!pitch) return;

    const randomShouts = [
      '🔥 Match in progress! Game is 3 - 3!',
      '👟 Brought extra pinnies/bibs if anyone needs colors!',
      '⏳ Who is coming at 18:00?',
      '🧤 Goalie here, shooting drill anyone?',
    ];
    const text = randomShouts[Math.floor(Math.random() * randomShouts.length)];

    const simMsg: PitchMessage = {
      id: `sim-${Date.now()}`,
      pitchId: pitch.id,
      senderId: 'sim-user',
      senderName: 'Squad Mate',
      senderPosition: 'CM',
      senderAvatar: '⚽',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickShout: true,
      shoutCategory: 'general',
    };

    setPitches((prev) =>
      prev.map((p) => (p.id === pitch.id ? { ...p, messages: [...p.messages, simMsg] } : p))
    );
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
        triggerSimulatedActivity,
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
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
