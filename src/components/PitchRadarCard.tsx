import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Pitch } from '@/types/pitch';
import { usePitches } from '@/context/PitchesContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface PitchRadarCardProps {
  pitch: Pitch;
  onPress: () => void;
  onQuickHeadingOver: () => void;
  isCheckedInHere?: boolean;
}

export function PitchRadarCard({
  pitch,
  onPress,
  onQuickHeadingOver,
  isCheckedInHere = false,
}: PitchRadarCardProps) {
  const { t, language, isRTL } = usePitches();

  const isGameOn = pitch.matchStatus === 'game_on';
  const isHeatingUp = pitch.matchStatus === 'heating_up';

  const primaryName = language === 'he' ? pitch.hebrewName : pitch.name;
  const secondaryName = language === 'he' ? pitch.name : pitch.hebrewName;
  const surfaceLabel = language === 'he' ? pitch.surfaceHebrew : pitch.surface;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isGameOn && styles.cardActiveBorder,
        isCheckedInHere && styles.cardCheckedInBorder,
        pressed && styles.cardPressed,
      ]}>
      {/* Top Banner: Status & Live Count */}
      <View style={[styles.topRow, isRTL && styles.rowRTL]}>
        <View style={[styles.badgeRow, isRTL && styles.rowRTL]}>
          {pitch.liveCount > 0 ? (
            <View style={[styles.liveBadge, isRTL && styles.rowRTL]}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveBadgeText}>
                {pitch.liveCount} {pitch.liveCount === 1 ? t('player') : t('players')} {t('live')}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyBadge}>
              <Text style={styles.emptyBadgeText}>{t('zeroPlayers')}</Text>
            </View>
          )}

          {pitch.enRouteCount > 0 && (
            <View style={styles.enRouteBadge}>
              <Text style={styles.enRouteText}>
                +{pitch.enRouteCount} {t('enRoute')}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.distanceBadge, isRTL && styles.rowRTL]}>
          <Ionicons name="location-sharp" size={12} color="#00FF87" />
          <Text style={styles.distanceText}>
            {pitch.distanceKm} {t('kmAway')}
          </Text>
        </View>
      </View>

      {/* Main Pitch Names */}
      <View style={[styles.titleSection, isRTL && styles.alignRTL]}>
        <Text style={[styles.pitchName, isRTL && styles.textRTL]}>{primaryName}</Text>
        <Text style={[styles.hebrewSubtitle, isRTL && styles.textRTL]}>{secondaryName}</Text>
      </View>

      {/* Surface & Amenities row */}
      <View style={[styles.amenitiesRow, isRTL && styles.rowRTL]}>
        <View style={[styles.amenityPill, isRTL && styles.rowRTL]}>
          <MaterialCommunityIcons name="soccer-field" size={13} color="#8B9BB4" />
          <Text style={styles.amenityText}>{pitch.size}</Text>
        </View>

        <View style={styles.amenityPill}>
          <Text style={styles.amenityText}>{surfaceLabel}</Text>
        </View>

        {pitch.hasLights && (
          <View style={[styles.amenityPill, styles.lightsPill, isRTL && styles.rowRTL]}>
            <Ionicons name="bulb-outline" size={13} color="#FFD700" />
            <Text style={styles.lightsText}>{t('lightsOn')}</Text>
          </View>
        )}
      </View>

      {/* Active Players Avatars & Latest Chat preview */}
      {pitch.activePlayers.length > 0 && (
        <View style={[styles.playersPreviewSection, isRTL && styles.rowRTL]}>
          <View style={[styles.avatarStack, isRTL && styles.rowRTL]}>
            {pitch.activePlayers.slice(0, 5).map((player, idx) => (
              <View
                key={player.id}
                style={[
                  styles.miniAvatarBubble,
                  { marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx },
                ]}>
                <Text style={styles.miniAvatarEmoji}>{player.avatar}</Text>
              </View>
            ))}
            {pitch.activePlayers.length > 5 && (
              <View style={[styles.miniAvatarBubble, styles.overflowBubble, { marginLeft: -8 }]}>
                <Text style={styles.overflowText}>+{pitch.activePlayers.length - 5}</Text>
              </View>
            )}
          </View>

          {pitch.messages.length > 0 && (
            <View style={[styles.latestChatSnippet, isRTL && styles.rowRTL]}>
              <Ionicons name="chatbubble-ellipses-outline" size={12} color="#00FF87" />
              <Text style={[styles.chatSnippetText, isRTL && styles.textRTL]} numberOfLines={1}>
                {`"${pitch.messages[pitch.messages.length - 1].text}"`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom Action Footer */}
      <View style={[styles.footerRow, isRTL && styles.rowRTL]}>
        <View style={styles.statusIndicator}>
          {isGameOn && (
            <Text style={[styles.statusGameOnText, isRTL && styles.textRTL]}>
              {t('gameInProgress')}
            </Text>
          )}
          {isHeatingUp && (
            <Text style={[styles.statusHeatingText, isRTL && styles.textRTL]}>
              {t('matchHeatingUp')}
            </Text>
          )}
          {!isGameOn && !isHeatingUp && (
            <Text style={[styles.statusQuietText, isRTL && styles.textRTL]}>
              {t('pickupOpen')}
            </Text>
          )}
        </View>

        <View style={[styles.actionButtonsRow, isRTL && styles.rowRTL]}>
          {!isCheckedInHere ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onQuickHeadingOver();
              }}
              style={({ pressed }) => [styles.headingOverBtn, pressed && styles.btnPressed]}>
              <Text style={styles.headingOverBtnText}>{t('headingOverBtn')}</Text>
            </Pressable>
          ) : (
            <View style={styles.checkedInTag}>
              <Text style={styles.checkedInTagText}>{t('youAreHere')}</Text>
            </View>
          )}

          <View style={styles.openDetailsBtn}>
            <Text style={styles.openDetailsText}>{t('viewPitchBtn')}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F1728',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#1C2942',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardActiveBorder: {
    borderColor: '#00FF87',
  },
  cardCheckedInBorder: {
    borderColor: '#FFD700',
    backgroundColor: '#121C30',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#032F1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00FF87',
    gap: 5,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00FF87',
  },
  liveBadgeText: {
    color: '#00FF87',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyBadge: {
    backgroundColor: '#16233B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emptyBadgeText: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '800',
  },
  enRouteBadge: {
    backgroundColor: '#302604',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  enRouteText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142036',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  distanceText: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '700',
  },
  titleSection: {
    marginBottom: 8,
  },
  pitchName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  hebrewSubtitle: {
    color: '#00FF87',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162238',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  amenityText: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '700',
  },
  lightsPill: {
    backgroundColor: '#26200A',
    borderColor: '#7A6000',
    borderWidth: 1,
  },
  lightsText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800',
  },
  playersPreviewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A101C',
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatarBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#16233B',
    borderWidth: 1.5,
    borderColor: '#00FF87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarEmoji: {
    fontSize: 13,
  },
  overflowBubble: {
    backgroundColor: '#203250',
    borderColor: '#FFD700',
  },
  overflowText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  latestChatSnippet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatSnippetText: {
    color: '#CAD5E2',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#172238',
    paddingTop: 10,
  },
  statusIndicator: {
    flex: 1,
  },
  statusGameOnText: {
    color: '#FF3366',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusHeatingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusQuietText: {
    color: '#00FF87',
    fontSize: 11,
    fontWeight: '800',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headingOverBtn: {
    backgroundColor: '#00FF87',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  headingOverBtnText: {
    color: '#080E1A',
    fontSize: 12,
    fontWeight: '900',
  },
  checkedInTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  checkedInTagText: {
    color: '#080E1A',
    fontSize: 11,
    fontWeight: '900',
  },
  openDetailsBtn: {
    backgroundColor: '#1E2D4A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  openDetailsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
