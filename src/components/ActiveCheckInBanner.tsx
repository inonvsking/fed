import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { usePitches } from '@/context/PitchesContext';
import { Ionicons } from '@expo/vector-icons';

interface ActiveCheckInBannerProps {
  onPressPitch: (pitchId: string) => void;
}

export function ActiveCheckInBanner({ onPressPitch }: ActiveCheckInBannerProps) {
  const { userCheckIn, checkOut, pitches, t, language, isRTL } = usePitches();
  const [minutesLeft, setMinutesLeft] = useState<number>(0);

  useEffect(() => {
    if (!userCheckIn.expiresAt) return;

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((userCheckIn.expiresAt! - Date.now()) / (1000 * 60)));
      setMinutesLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000); // every 30s
    return () => clearInterval(interval);
  }, [userCheckIn.expiresAt]);

  if (userCheckIn.status === 'none' || !userCheckIn.pitchId) {
    return null;
  }

  const isAtPitch = userCheckIn.status === 'at_pitch';
  const currentPitch = pitches.find((p) => p.id === userCheckIn.pitchId);
  const displayName = currentPitch
    ? language === 'he'
      ? currentPitch.hebrewName
      : currentPitch.name
    : userCheckIn.pitchName;

  return (
    <View style={[styles.container, isRTL && styles.rowRTL]}>
      <Pressable
        onPress={() => userCheckIn.pitchId && onPressPitch(userCheckIn.pitchId)}
        style={[styles.innerPressable, isRTL && styles.rowRTL]}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{isAtPitch ? '⚽' : '🏃'}</Text>
        </View>

        <View style={[styles.textWrap, isRTL && styles.alignRTL]}>
          <View style={[styles.statusRow, isRTL && styles.rowRTL]}>
            <View style={[styles.dot, isAtPitch ? styles.dotGreen : styles.dotYellow]} />
            <Text style={styles.statusLabel}>
              {isAtPitch ? t('playingAtPitch') : `${t('enRouteEta')} (~${userCheckIn.etaMinutes}m)`}
            </Text>
          </View>
          <Text style={[styles.pitchName, isRTL && styles.textRTL]} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <View style={[styles.timerBadge, isRTL && styles.rowRTL]}>
          <Ionicons name="timer-outline" size={13} color="#FFD700" />
          <Text style={styles.timerText}>{minutesLeft}m</Text>
        </View>
      </Pressable>

      <Pressable onPress={checkOut} style={styles.leaveBtn}>
        <Ionicons name="exit-outline" size={16} color="#FF3366" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2133',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#00FF87',
    padding: 8,
    shadowColor: '#00FF87',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  alignRTL: {
    alignItems: 'flex-end',
  },
  textRTL: {
    textAlign: 'right',
  },
  innerPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#162C44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  textWrap: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: {
    backgroundColor: '#00FF87',
  },
  dotYellow: {
    backgroundColor: '#FFD700',
  },
  statusLabel: {
    color: '#00FF87',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pitchName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2940',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timerText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
  },
  leaveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26131D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
