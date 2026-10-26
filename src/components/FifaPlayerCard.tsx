import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PlayerCard, PlayerPosition } from '@/types/pitch';
import { usePitches } from '@/context/PitchesContext';

interface FifaPlayerCardProps {
  card: PlayerCard;
  onPositionChange?: (pos: PlayerPosition) => void;
  onStatBoost?: (statKey: keyof PlayerCard['stats']) => void;
  isEditable?: boolean;
}

const POSITIONS: { pos: PlayerPosition; labelHe: string; labelEn: string }[] = [
  { pos: 'ST', labelHe: 'חלוץ', labelEn: 'ST' },
  { pos: 'LW', labelHe: 'כנף', labelEn: 'LW' },
  { pos: 'CAM', labelHe: 'התקפי', labelEn: 'CAM' },
  { pos: 'CM', labelHe: 'קשר', labelEn: 'CM' },
  { pos: 'CDM', labelHe: 'אחורי', labelEn: 'CDM' },
  { pos: 'CB', labelHe: 'בלם', labelEn: 'CB' },
  { pos: 'GK', labelHe: 'שוער', labelEn: 'GK' },
];

export function FifaPlayerCard({
  card,
  onPositionChange,
  onStatBoost,
  isEditable = false,
}: FifaPlayerCardProps) {
  const { t, language } = usePitches();

  return (
    <View style={styles.cardContainer}>
      {/* Outer Card Shield Glow */}
      <View style={[styles.cardOuter, card.cardTier === 'champions' ? styles.championsBorder : styles.goldBorder]}>
        {/* Card Header: Rating, Position, Club */}
        <View style={styles.cardHeader}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingNumber}>{card.rating}</Text>
            <Text style={styles.positionText}>{card.position}</Text>
            <View style={styles.dividerMini} />
            <Text style={styles.countryFlag}>⚽</Text>
          </View>

          {/* Player Big Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlowCircle}>
              <Text style={styles.avatarEmoji}>{card.avatar}</Text>
            </View>
            <View style={styles.cardTierBadge}>
              <Text style={styles.cardTierText}>{card.cardTier.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Player Name Banner */}
        <View style={styles.nameSection}>
          <Text style={styles.playerName} numberOfLines={1}>
            {card.nickname.toUpperCase()}
          </Text>
          <Text style={styles.clubName}>{card.favoriteClub}</Text>
        </View>

        {/* Gold Separator Line */}
        <View style={styles.goldLine} />

        {/* 6 FIFA Core Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCol}>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('pac')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.pac}</Text>
              <Text style={styles.statLabel}>PAC</Text>
            </Pressable>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('sho')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.sho}</Text>
              <Text style={styles.statLabel}>SHO</Text>
            </Pressable>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('pas')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.pas}</Text>
              <Text style={styles.statLabel}>PAS</Text>
            </Pressable>
          </View>

          <View style={styles.centerVerticalLine} />

          <View style={styles.statCol}>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('dri')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.dri}</Text>
              <Text style={styles.statLabel}>DRI</Text>
            </Pressable>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('def')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.def}</Text>
              <Text style={styles.statLabel}>DEF</Text>
            </Pressable>
            <Pressable
              disabled={!isEditable}
              onPress={() => onStatBoost?.('phy')}
              style={({ pressed }) => [styles.statRow, pressed && styles.statPressed]}>
              <Text style={styles.statVal}>{card.stats.phy}</Text>
              <Text style={styles.statLabel}>PHY</Text>
            </Pressable>
          </View>
        </View>

        {isEditable && (
          <View style={styles.positionSelectorContainer}>
            <Text style={styles.selectorHint}>{t('selectPosition')}</Text>
            <View style={styles.posPillRow}>
              {POSITIONS.map((item) => {
                const isActive = card.position === item.pos;
                const label = language === 'he' ? `${item.pos} • ${item.labelHe}` : item.pos;
                return (
                  <Pressable
                    key={item.pos}
                    onPress={() => onPositionChange?.(item.pos)}
                    style={[styles.posPill, isActive && styles.posPillActive]}>
                    <Text style={[styles.posPillText, isActive && styles.posPillTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  cardOuter: {
    width: 290,
    backgroundColor: '#0F1626',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#00FF87',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  goldBorder: {
    borderColor: '#FFD700',
  },
  championsBorder: {
    borderColor: '#00FF87',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 46,
  },
  ratingNumber: {
    color: '#FFD700',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  positionText: {
    color: '#00FF87',
    fontSize: 16,
    fontWeight: '800',
    marginTop: -4,
  },
  dividerMini: {
    width: 20,
    height: 1,
    backgroundColor: '#2A3C5B',
    marginVertical: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 8,
  },
  avatarGlowCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#16233B',
    borderWidth: 2,
    borderColor: '#00FF87',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00FF87',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  cardTierBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: -8,
  },
  cardTierText: {
    color: '#080E1A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  clubName: {
    color: '#8B9BB4',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  goldLine: {
    height: 2,
    backgroundColor: '#21334E',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  statCol: {
    flex: 1,
    gap: 4,
  },
  centerVerticalLine: {
    width: 1,
    backgroundColor: '#21334E',
    marginHorizontal: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  statPressed: {
    backgroundColor: '#1E3255',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  statLabel: {
    color: '#8B9BB4',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  positionSelectorContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#21334E',
    paddingTop: 8,
  },
  selectorHint: {
    color: '#00FF87',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  posPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  posPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#16233B',
    borderWidth: 1,
    borderColor: '#263B5D',
  },
  posPillActive: {
    backgroundColor: '#00FF87',
    borderColor: '#00FF87',
  },
  posPillText: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '800',
  },
  posPillTextActive: {
    color: '#080E1A',
  },
});
