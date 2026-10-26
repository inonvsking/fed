import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Pitch, ShoutCategory } from '@/types/pitch';
import { usePitches } from '@/context/PitchesContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface PitchDetailModalProps {
  pitch: Pitch | null;
  visible: boolean;
  onClose: () => void;
}

export function PitchDetailModal({ pitch, visible, onClose }: PitchDetailModalProps) {
  const { userCheckIn, checkIn, checkOut, sendShout, t, language, isRTL } = usePitches();
  const [customText, setCustomText] = useState('');
  const [activeTab, setActiveTab] = useState<'players' | 'chat'>('players');

  if (!pitch) return null;

  const isCheckedInHere = userCheckIn.pitchId === pitch.id;

  const primaryName = language === 'he' ? pitch.hebrewName : pitch.name;
  const secondaryName = language === 'he' ? pitch.name : pitch.hebrewName;
  const surfaceLabel = language === 'he' ? pitch.surfaceHebrew : pitch.surface;

  const quickShouts: { text: string; category: ShoutCategory; icon: string }[] =
    language === 'he'
      ? [
          { text: t('shoutNeedOne'), category: 'need_players', icon: '⚽' },
          { text: t('shoutNeedGoalie'), category: 'goalie', icon: '🧤' },
          { text: t('shoutEnRoute'), category: 'en_route', icon: '🏃' },
          { text: t('shoutBall'), category: 'ball', icon: '👟' },
          { text: t('shoutLights'), category: 'lights', icon: '💡' },
          { text: t('shoutGameStarting'), category: 'general', icon: '🔥' },
        ]
      : [
          { text: 'Need +1 for 5v5! ⚽', category: 'need_players', icon: '⚽' },
          { text: 'Desperately need a goalie! 🧤', category: 'goalie', icon: '🧤' },
          { text: 'On my way, arriving in 10m! 🏃', category: 'en_route', icon: '🏃' },
          { text: 'Who has a size 5 ball? ⚽', category: 'ball', icon: '👟' },
          { text: 'Are the floodlights on? 💡', category: 'lights', icon: '💡' },
          { text: 'Game starting right now! 🔥', category: 'general', icon: '🔥' },
        ];

  const handleSendCustomText = () => {
    if (!customText.trim()) return;
    sendShout(pitch.id, customText.trim(), 'general');
    setCustomText('');
  };

  const handleQuickShout = (shout: (typeof quickShouts)[0]) => {
    sendShout(pitch.id, shout.text, shout.category);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        {/* Top Header Bar */}
        <View style={[styles.header, isRTL && styles.rowRTL]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={[styles.headerTitleWrap, isRTL && styles.alignRTL]}>
            <Text style={[styles.headerTitle, isRTL && styles.textRTL]} numberOfLines={1}>
              {primaryName}
            </Text>
            <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>{secondaryName}</Text>
          </View>

          <View style={[styles.headerLiveDotWrap, isRTL && styles.rowRTL]}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveCountHead}>{pitch.liveCount}</Text>
          </View>
        </View>

        {/* Check-In Action Hub Banner */}
        <View style={styles.checkInSection}>
          {isCheckedInHere ? (
            <View style={styles.activeCheckInBox}>
              <View style={[styles.activeCheckInTop, isRTL && styles.rowRTL]}>
                <View style={styles.activeCheckInPulse}>
                  <Text style={[styles.activeCheckInText, isRTL && styles.textRTL]}>
                    {t('checkedInAtThisPitch')}
                  </Text>
                </View>
                <Pressable onPress={checkOut} style={styles.checkOutBtn}>
                  <Text style={styles.checkOutBtnText}>{t('checkOut')}</Text>
                </Pressable>
              </View>
              <Text style={[styles.checkInSubtext, isRTL && styles.textRTL]}>
                {userCheckIn.status === 'at_pitch'
                  ? t('playingAtPitch')
                  : `${t('enRouteEta')} (~${userCheckIn.etaMinutes}m)`}
              </Text>
            </View>
          ) : (
            <View style={styles.readyCheckInBox}>
              <Text style={styles.checkInPrompt}>{t('areYouPlayingPrompt')}</Text>
              <View style={[styles.checkInBtnRow, isRTL && styles.rowRTL]}>
                <Pressable
                  onPress={() => checkIn(pitch.id, 'at_pitch')}
                  style={({ pressed }) => [styles.hereNowBtn, pressed && styles.btnPressed]}>
                  <Text style={styles.hereNowBtnText}>{t('imHereNow')}</Text>
                </Pressable>

                <Pressable
                  onPress={() => checkIn(pitch.id, 'en_route', 10)}
                  style={({ pressed }) => [styles.heading10Btn, pressed && styles.btnPressed]}>
                  <Text style={styles.heading10BtnText}>{t('tenMinAway')}</Text>
                </Pressable>

                <Pressable
                  onPress={() => checkIn(pitch.id, 'en_route', 20)}
                  style={({ pressed }) => [styles.heading20Btn, pressed && styles.btnPressed]}>
                  <Text style={styles.heading20BtnText}>{t('twentyMinAway')}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Section Navigation Tabs: [Who's on Pitch? (מי במגרש?)] vs [Live Pitch Chat] */}
        <View style={[styles.tabsNavRow, isRTL && styles.rowRTL]}>
          <Pressable
            onPress={() => setActiveTab('players')}
            style={[styles.tabNavItem, activeTab === 'players' && styles.tabNavItemActive, isRTL && styles.rowRTL]}>
            <MaterialCommunityIcons
              name="account-group"
              size={18}
              color={activeTab === 'players' ? '#00FF87' : '#8B9BB4'}
            />
            <Text style={[styles.tabNavText, activeTab === 'players' && styles.tabNavTextActive]}>
              {t('tabWhosThere')} ({pitch.activePlayers.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('chat')}
            style={[styles.tabNavItem, activeTab === 'chat' && styles.tabNavItemActive, isRTL && styles.rowRTL]}>
            <Ionicons
              name="chatbubbles"
              size={17}
              color={activeTab === 'chat' ? '#00FF87' : '#8B9BB4'}
            />
            <Text style={[styles.tabNavText, activeTab === 'chat' && styles.tabNavTextActive]}>
              {t('tabLiveChat')} ({pitch.messages.length})
            </Text>
          </Pressable>
        </View>

        {/* Tab 1: PLAYERS ON PITCH (מי במגרש?) */}
        {activeTab === 'players' ? (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Field Specs Bar */}
            <View style={[styles.specsCard, isRTL && styles.rowRTL]}>
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>{t('surface')}</Text>
                <Text style={styles.specVal}>{surfaceLabel}</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>{t('format')}</Text>
                <Text style={styles.specVal}>{pitch.size}</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specTitle}>{t('lights')}</Text>
                <Text style={[styles.specVal, pitch.hasLights && styles.lightsGreen]}>
                  {pitch.hasLights ? t('activeLights') : t('noLights')}
                </Text>
              </View>
            </View>

            <View style={[styles.playersListHeader, isRTL && styles.rowRTL]}>
              <Text style={styles.playersSectionTitle}>{t('ballersOnSite')}</Text>
              <Text style={styles.playersCountBadge}>
                {pitch.liveCount} {t('playing')} • {pitch.enRouteCount} {t('arriving')}
              </Text>
            </View>

            {pitch.activePlayers.length === 0 ? (
              <View style={styles.emptyPlayersState}>
                <Text style={styles.emptyIcon}>⚽</Text>
                <Text style={styles.emptyTitle}>{t('pitchQuietNow')}</Text>
                <Text style={styles.emptyDesc}>{t('beFirstPrompt')}</Text>
              </View>
            ) : (
              pitch.activePlayers.map((player) => (
                <View
                  key={player.id}
                  style={[
                    styles.playerRow,
                    player.status === 'en_route' && styles.playerRowEnRoute,
                    isRTL && styles.rowRTL,
                  ]}>
                  <View style={styles.playerAvatarBubble}>
                    <Text style={styles.playerAvatarText}>{player.avatar}</Text>
                  </View>

                  <View style={[styles.playerDetails, isRTL && styles.alignRTL]}>
                    <View style={[styles.playerNameLine, isRTL && styles.rowRTL]}>
                      <Text style={styles.playerFullName}>{player.name}</Text>
                      <View style={styles.playerPosBadge}>
                        <Text style={styles.playerPosText}>{player.position}</Text>
                      </View>
                    </View>
                    <Text style={[styles.playerJoinTime, isRTL && styles.textRTL]}>
                      {player.status === 'at_pitch'
                        ? `${t('onField')} (${player.joinedAt})`
                        : `${t('enRouteEta')} (~${player.etaMinutes}m)`}
                    </Text>
                  </View>

                  <View style={styles.playerRatingBubble}>
                    <Text style={styles.playerRatingText}>{player.rating}</Text>
                    <Text style={styles.ovrText}>OVR</Text>
                  </View>
                </View>
              ))
            )}

            {/* Quick Shout Prompt within Players tab */}
            <View style={styles.rallyBox}>
              <Text style={[styles.rallyTitle, isRTL && styles.textRTL]}>
                {t('needPlayersTitle')}
              </Text>
              <Text style={[styles.rallySubtitle, isRTL && styles.textRTL]}>
                {t('needPlayersSubtitle')}
              </Text>
              <View style={styles.quickShoutsGrid}>
                {quickShouts.map((shout, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => {
                      handleQuickShout(shout);
                      setActiveTab('chat');
                    }}
                    style={[styles.quickShoutBtn, isRTL && styles.alignRTL]}>
                    <Text style={[styles.quickShoutBtnText, isRTL && styles.textRTL]}>
                      {shout.icon} {shout.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          /* Tab 2: LIVE CHAT & QUICK SHOUTS */
          <View style={styles.chatContainer}>
            {/* Quick Shouts Carousel */}
            <View style={styles.quickShoutsBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.shoutsScroll, isRTL && styles.rowRTL]}>
                {quickShouts.map((shout, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleQuickShout(shout)}
                    style={({ pressed }) => [styles.pillShout, pressed && styles.btnPressed]}>
                    <Text style={styles.pillShoutText}>
                      {shout.icon} {shout.text}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Messages Stream */}
            <ScrollView
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}>
              {pitch.messages.map((msg) => {
                const isMine = msg.senderId === 'me';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubbleWrap,
                      isMine ? styles.myMsgWrap : styles.otherMsgWrap,
                    ]}>
                    {!isMine && (
                      <View style={styles.chatAvatar}>
                        <Text style={styles.chatAvatarText}>{msg.senderAvatar}</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isMine ? styles.myMessageBubble : styles.otherMessageBubble,
                        msg.isQuickShout && styles.quickShoutBubble,
                      ]}>
                      <View style={[styles.chatHeader, isRTL && styles.rowRTL]}>
                        <Text style={styles.chatSenderName}>{msg.senderName}</Text>
                        <View style={styles.chatPosPill}>
                          <Text style={styles.chatPosText}>{msg.senderPosition}</Text>
                        </View>
                        <Text style={styles.chatTime}>{msg.timestamp}</Text>
                      </View>

                      <Text style={[styles.chatMessageText, isRTL && styles.textRTL]}>
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Custom Shout Input */}
            <View style={[styles.inputBar, isRTL && styles.rowRTL]}>
              <TextInput
                value={customText}
                onChangeText={setCustomText}
                placeholder={t('sendShoutPlaceholder')}
                placeholderTextColor="#687B95"
                style={[styles.textInput, isRTL && styles.textRTL]}
                onSubmitEditing={handleSendCustomText}
                returnKeyType="send"
              />
              <Pressable
                onPress={handleSendCustomText}
                style={({ pressed }) => [styles.sendBtn, pressed && styles.btnPressed]}>
                <Ionicons
                  name={isRTL ? 'arrow-back' : 'send'}
                  size={17}
                  color="#080E1A"
                />
              </Pressable>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 14,
    backgroundColor: '#0E1726',
    borderBottomWidth: 1,
    borderBottomColor: '#1A273D',
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
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16233B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  headerLiveDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#063A25',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF87',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF87',
  },
  liveCountHead: {
    color: '#00FF87',
    fontSize: 14,
    fontWeight: '900',
  },
  checkInSection: {
    padding: 12,
    backgroundColor: '#0A1220',
    borderBottomWidth: 1,
    borderBottomColor: '#16233B',
  },
  readyCheckInBox: {
    backgroundColor: '#101C30',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#21334E',
  },
  checkInPrompt: {
    color: '#00FF87',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  checkInBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hereNowBtn: {
    flex: 1.2,
    backgroundColor: '#00FF87',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hereNowBtnText: {
    color: '#080E1A',
    fontSize: 13,
    fontWeight: '900',
  },
  heading10Btn: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading10BtnText: {
    color: '#080E1A',
    fontSize: 12,
    fontWeight: '900',
  },
  heading20Btn: {
    flex: 1,
    backgroundColor: '#1E2F4D',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading20BtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  activeCheckInBox: {
    backgroundColor: '#062E1D',
    borderWidth: 1.5,
    borderColor: '#00FF87',
    borderRadius: 14,
    padding: 12,
  },
  activeCheckInTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeCheckInPulse: {
    flex: 1,
  },
  activeCheckInText: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  checkOutBtn: {
    backgroundColor: '#FF3366',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  checkOutBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  checkInSubtext: {
    color: '#A0B4C8',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  tabsNavRow: {
    flexDirection: 'row',
    backgroundColor: '#0C1524',
    borderBottomWidth: 1,
    borderBottomColor: '#17253D',
  },
  tabNavItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabNavItemActive: {
    borderBottomColor: '#00FF87',
  },
  tabNavText: {
    color: '#8B9BB4',
    fontSize: 13,
    fontWeight: '800',
  },
  tabNavTextActive: {
    color: '#00FF87',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  specsCard: {
    flexDirection: 'row',
    backgroundColor: '#0F1A2D',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1D2F4B',
    marginBottom: 16,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specDivider: {
    width: 1,
    backgroundColor: '#1E3250',
  },
  specTitle: {
    color: '#8B9BB4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  specVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  lightsGreen: {
    color: '#FFD700',
  },
  playersListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playersSectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  playersCountBadge: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyPlayersState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#0C1524',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#182740',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDesc: {
    color: '#8B9BB4',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1A2D',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1C2C47',
  },
  playerRowEnRoute: {
    borderColor: '#FFD700',
    backgroundColor: '#141E2F',
  },
  playerAvatarBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#182740',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00FF87',
  },
  playerAvatarText: {
    fontSize: 18,
  },
  playerDetails: {
    flex: 1,
    marginHorizontal: 10,
  },
  playerNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerFullName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  playerPosBadge: {
    backgroundColor: '#1E3250',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  playerPosText: {
    color: '#00FF87',
    fontSize: 10,
    fontWeight: '900',
  },
  playerJoinTime: {
    color: '#8B9BB4',
    fontSize: 12,
    marginTop: 2,
  },
  playerRatingBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2942',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  playerRatingText: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '900',
  },
  ovrText: {
    color: '#8B9BB4',
    fontSize: 8,
    fontWeight: '900',
  },
  rallyBox: {
    backgroundColor: '#0F1A2D',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#263B5D',
  },
  rallyTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rallySubtitle: {
    color: '#8B9BB4',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  quickShoutsGrid: {
    gap: 6,
  },
  quickShoutBtn: {
    backgroundColor: '#182740',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#283E62',
  },
  quickShoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  chatContainer: {
    flex: 1,
  },
  quickShoutsBar: {
    backgroundColor: '#0A1220',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#17253D',
  },
  shoutsScroll: {
    paddingHorizontal: 12,
  },
  pillShout: {
    backgroundColor: '#16233B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#243755',
  },
  pillShoutText: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '800',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 14,
    gap: 10,
  },
  messageBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  myMsgWrap: {
    justifyContent: 'flex-end',
  },
  otherMsgWrap: {
    justifyContent: 'flex-start',
  },
  chatAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1A2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 14,
  },
  myMessageBubble: {
    backgroundColor: '#024D2C',
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: '#00FF87',
  },
  otherMessageBubble: {
    backgroundColor: '#111B2C',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#1D2E49',
  },
  quickShoutBubble: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  chatSenderName: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '800',
  },
  chatPosPill: {
    backgroundColor: '#16233B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  chatPosText: {
    color: '#CAD5E2',
    fontSize: 9,
    fontWeight: '800',
  },
  chatTime: {
    color: '#64748B',
    fontSize: 10,
  },
  chatMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0C1524',
    borderTopWidth: 1,
    borderTopColor: '#17253D',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#131F33',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#21334E',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#00FF87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
