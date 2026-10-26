import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePitches } from '@/context/PitchesContext';
import { PitchRadarCard } from '@/components/PitchRadarCard';
import { PitchDetailModal } from '@/components/PitchDetailModal';
import { ActiveCheckInBanner } from '@/components/ActiveCheckInBanner';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Pitch } from '@/types/pitch';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PitchesScreen() {
  const {
    pitches,
    userCheckIn,
    checkIn,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    triggerSimulatedActivity,
    t,
    isRTL,
  } = usePitches();

  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);

  // Compute live totals
  const totalLivePlayers = pitches.reduce((sum, p) => sum + p.liveCount, 0);
  const activeMatchesCount = pitches.filter((p) => p.matchStatus === 'game_on').length;

  // Filtered pitches list
  const filteredPitches = pitches.filter((pitch) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = pitch.name.toLowerCase().includes(q);
      const matchHebrew = pitch.hebrewName.toLowerCase().includes(q);
      const matchArea = pitch.area.toLowerCase().includes(q);
      if (!matchName && !matchHebrew && !matchArea) return false;
    }

    // Filter chip match
    if (filter === 'active') return pitch.liveCount > 0;
    if (filter === 'nearby') return pitch.distanceKm <= 1.0;
    if (filter === 'lights') return pitch.hasLights;
    return true;
  });

  const handleOpenPitch = (pitch: Pitch) => {
    setSelectedPitch(pitch);
  };

  const handleOpenPitchById = (pitchId: string) => {
    const found = pitches.find((p) => p.id === pitchId);
    if (found) setSelectedPitch(found);
  };

  // Keep modal pitch in sync if pitches state updates
  const currentModalPitch = selectedPitch
    ? pitches.find((p) => p.id === selectedPitch.id) || selectedPitch
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Top App Header */}
        <View style={[styles.header, isRTL && styles.rowRTL]}>
          <View style={[styles.headerLeft, isRTL && styles.alignRTL]}>
            <View style={[styles.brandTitleRow, isRTL && styles.rowRTL]}>
              <Text style={styles.logoEmoji}>⚽</Text>
              <Text style={styles.appTitle}>{t('appName')}</Text>
              <View style={styles.hebrewTitleBadge}>
                <Text style={styles.hebrewTitleText}>{t('appSubname')}</Text>
              </View>
            </View>
            <Text style={[styles.tagline, isRTL && styles.textRTL]}>{t('tagline')}</Text>
          </View>

          {/* Right Header Controls: Language Toggle & Radar Ping */}
          <View style={[styles.headerRightActions, isRTL && styles.rowRTL]}>
            <LanguageToggle />

            <Pressable
              onPress={() => triggerSimulatedActivity(selectedPitch?.id)}
              style={({ pressed }) => [styles.pulseBtn, isRTL && styles.rowRTL, pressed && styles.btnPressed]}>
              <Ionicons name="flash" size={13} color="#080E1A" />
              <Text style={styles.pulseBtnText}>{t('radarPing')}</Text>
            </Pressable>
          </View>
        </View>

        {/* Active Check-In Floating Banner (if user is at pitch or en route) */}
        <ActiveCheckInBanner onPressPitch={handleOpenPitchById} />

        {/* Live Neighborhood Ticker */}
        <View style={[styles.liveTickerContainer, isRTL && styles.rowRTL]}>
          <View style={[styles.tickerPill, isRTL && styles.rowRTL]}>
            <View style={styles.pulsingDot} />
            <Text style={styles.tickerText}>
              <Text style={styles.tickerBold}>{totalLivePlayers}</Text> {t('ballersOnPitch')}
            </Text>
          </View>
          <View style={styles.tickerDivider} />
          <View style={[styles.tickerPill, isRTL && styles.rowRTL]}>
            <Text style={styles.tickerText}>
              🔥 <Text style={styles.tickerBold}>{activeMatchesCount}</Text> {t('matchesInProgress')}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, isRTL && styles.rowRTL]}>
            <Ionicons name="search" size={18} color="#6B7D96" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="#6B7D96"
              style={[styles.searchInput, isRTL && styles.textRTL]}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={16} color="#8B9BB4" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Chips Bar */}
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.filterScroll, isRTL && styles.rowRTL]}>
            <Pressable
              onPress={() => setFilter('all')}
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
                {t('allPitches')} ({pitches.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter('active')}
              style={[styles.filterChip, filter === 'active' && styles.filterChipActive]}>
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'active' && styles.filterChipTextActive,
                ]}>
                {t('activeNow')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter('nearby')}
              style={[styles.filterChip, filter === 'nearby' && styles.filterChipActive]}>
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'nearby' && styles.filterChipTextActive,
                ]}>
                {t('closest')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter('lights')}
              style={[styles.filterChip, filter === 'lights' && styles.filterChipActive]}>
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'lights' && styles.filterChipTextActive,
                ]}>
                {t('lightsOn')}
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Pitches Feed */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.five },
          ]}>
          {filteredPitches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="soccer" size={48} color="#2A3D5B" />
              <Text style={styles.emptyTitle}>{t('noPitchesFound')}</Text>
              <Text style={styles.emptyText}>{t('noPitchesDesc')}</Text>
              <Pressable
                onPress={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                style={styles.resetFilterBtn}>
                <Text style={styles.resetFilterText}>{t('resetFilters')}</Text>
              </Pressable>
            </View>
          ) : (
            filteredPitches.map((pitch) => (
              <PitchRadarCard
                key={pitch.id}
                pitch={pitch}
                isCheckedInHere={userCheckIn.pitchId === pitch.id}
                onPress={() => handleOpenPitch(pitch)}
                onQuickHeadingOver={() => {
                  checkIn(pitch.id, 'en_route', 15);
                  setSelectedPitch(pitch);
                }}
              />
            ))
          )}
        </ScrollView>

        {/* Pitch Detail Modal (Who's on pitch, Check-in station, Chat) */}
        <PitchDetailModal
          pitch={currentModalPitch}
          visible={selectedPitch !== null}
          onClose={() => setSelectedPitch(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#121C2E',
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
  headerLeft: {
    flex: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 22,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hebrewTitleBadge: {
    backgroundColor: '#053120',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00FF87',
  },
  hebrewTitleText: {
    color: '#00FF87',
    fontSize: 11,
    fontWeight: '900',
  },
  tagline: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF87',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  pulseBtnText: {
    color: '#080E1A',
    fontSize: 11,
    fontWeight: '900',
  },
  btnPressed: {
    opacity: 0.8,
  },
  liveTickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D1626',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#182740',
  },
  tickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00FF87',
  },
  tickerText: {
    color: '#A0B4C8',
    fontSize: 11,
    fontWeight: '600',
  },
  tickerBold: {
    color: '#00FF87',
    fontWeight: '900',
  },
  tickerDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#203250',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101B2E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: '#1D2F4D',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clearBtn: {
    padding: 2,
  },
  filterBar: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#121D30',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E304E',
  },
  filterChipActive: {
    backgroundColor: '#00FF87',
    borderColor: '#00FF87',
  },
  filterChipText: {
    color: '#8B9BB4',
    fontSize: 12,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#080E1A',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#8B9BB4',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetFilterBtn: {
    marginTop: 16,
    backgroundColor: '#1E2D4A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetFilterText: {
    color: '#00FF87',
    fontSize: 13,
    fontWeight: '800',
  },
});
