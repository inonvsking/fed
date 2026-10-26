export type PlayerPosition = 'ST' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';

export type CardTier = 'gold' | 'neon' | 'champions';

export interface PlayerStats {
  pac: number; // Pace
  sho: number; // Shooting
  pas: number; // Passing
  dri: number; // Dribbling
  def: number; // Defense
  phy: number; // Physical
}

export interface PlayerCard {
  id: string;
  name: string;
  nickname: string;
  position: PlayerPosition;
  rating: number;
  stats: PlayerStats;
  avatar: string;
  favoriteClub: string;
  cardTier: CardTier;
}

export interface PitchPlayer {
  id: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  status: 'at_pitch' | 'en_route';
  etaMinutes?: number;
  joinedAt: string;
  rating: number;
}

export type ShoutCategory = 'need_players' | 'goalie' | 'en_route' | 'ball' | 'lights' | 'general';

export interface PitchMessage {
  id: string;
  pitchId: string;
  senderId: string;
  senderName: string;
  senderPosition: PlayerPosition;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isQuickShout?: boolean;
  shoutCategory?: ShoutCategory;
}

export type MatchStatus = 'game_on' | 'heating_up' | 'quiet' | 'empty';

export interface Pitch {
  id: string;
  name: string;
  hebrewName: string;
  area: string;
  distanceKm: number;
  surface: '4G Artificial Turf' | 'Concrete Cage' | 'Natural Grass' | 'Futsal Hardcourt';
  surfaceHebrew: string;
  size: '5v5' | '7v7' | '3v3 Cage' | 'Full 11v11';
  hasLights: boolean;
  hasNets: boolean;
  liveCount: number;
  enRouteCount: number;
  matchStatus: MatchStatus;
  activePlayers: PitchPlayer[];
  messages: PitchMessage[];
  accentColor: string;
}

export interface UserCheckIn {
  pitchId: string | null;
  pitchName: string | null;
  status: 'none' | 'at_pitch' | 'en_route';
  etaMinutes: number;
  expiresAt: number | null;
}
