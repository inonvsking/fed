import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePitches } from '@/context/PitchesContext';
import { FifaPlayerCard } from '@/components/FifaPlayerCard';
import { LanguageToggle } from '@/components/LanguageToggle';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { PlayerPosition } from '@/types/pitch';
import { Ionicons } from '@expo/vector-icons';

const AVATAR_OPTIONS = ['⚡', '🔥', '⚽', '🧤', '👑', '🚀', '🎯', '🦾', '🦁', '👟'];
const CLUB_SUGGESTIONS = [
  'FC Barcelona',
  'Real Madrid',
  'Man City',
  'Arsenal',
  'Maccabi TLV',
  'Beitar JLM',
  'Maccabi Haifa',
  'Liverpool',
];

export default function ExploreScreen() {
  const {
    userCard,
    updateBallerCard,
    userCheckIn,
    checkOut,
    pitches,
    sendShout,
    t,
    language,
    isRTL,
    firebaseUser,
    isFirebaseConnected,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
  } = usePitches();

  const [nicknameInput, setNicknameInput] = useState(userCard.nickname);
  const [favoriteClubInput, setFavoriteClubInput] = useState(userCard.favoriteClub);
  const [prevNickname, setPrevNickname] = useState(userCard.nickname);
  const [prevClub, setPrevClub] = useState(userCard.favoriteClub);

  if (prevNickname !== userCard.nickname || prevClub !== userCard.favoriteClub) {
    setPrevNickname(userCard.nickname);
    setPrevClub(userCard.favoriteClub);
    setNicknameInput(userCard.nickname);
    setFavoriteClubInput(userCard.favoriteClub);
  }

  const [broadcastSent, setBroadcastSent] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handlePositionChange = (pos: PlayerPosition) => {
    updateBallerCard({ position: pos });
  };

  const handleStatBoost = (statKey: keyof typeof userCard.stats) => {
    const currentVal = userCard.stats[statKey];
    if (currentVal >= 99) return;
    const newVal = Math.min(99, currentVal + 1);
    const newStats = { ...userCard.stats, [statKey]: newVal };

    // recalculate overall rating
    const avg = Math.round(
      (newStats.pac + newStats.sho + newStats.pas + newStats.dri + newStats.def + newStats.phy) / 6
    );

    updateBallerCard({
      stats: newStats,
      rating: Math.min(99, Math.max(75, avg + 5)),
    });
  };

  const handleSaveProfile = () => {
    updateBallerCard({
      nickname: nicknameInput.trim() || userCard.nickname,
      favoriteClub: favoriteClubInput.trim() || userCard.favoriteClub,
    });
  };

  const handleBroadcastShout = () => {
    // Send shout to all pitches
    const shoutText =
      language === 'he'
        ? `⚡ ${userCard.nickname} (${userCard.position}) מוכן לשחק כדורגל! יש מקום? ⚽`
        : `⚡ ${userCard.nickname} (${userCard.position}) is ready to play! Who has room? ⚽`;

    pitches.forEach((pitch) => {
      sendShout(pitch.id, shoutText);
    });
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmail(email.trim(), password);
      setShowAuthForm(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to sign in');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signUpWithEmail(email.trim(), password);
      setShowAuthForm(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to sign up');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      console.warn('Sign out error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: BottomTabInset + Spacing.six },
        ]}>
        {/* Header Bar with Language Switcher */}
        <View style={[styles.headerBar, isRTL && styles.rowRTL]}>
          <View style={[styles.headerTextWrap, isRTL && styles.alignRTL]}>
            <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
              🎴 {t('ballerCardTitle')}
            </Text>
            <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>
              {t('ballerCardSubtitle')}
            </Text>
          </View>
          <LanguageToggle />
        </View>

        {/* FIFA Style Ultimate Team Card */}
        <FifaPlayerCard
          card={userCard}
          isEditable={true}
          onPositionChange={handlePositionChange}
          onStatBoost={handleStatBoost}
        />

        <Text style={styles.cardHint}>{t('boostHint')}</Text>

        {/* Broadcast Rally Button */}
        <View style={styles.broadcastBox}>
          <View style={[styles.broadcastHeader, isRTL && styles.rowRTL]}>
            <Text style={styles.broadcastEmoji}>📢</Text>
            <View style={[styles.broadcastTextWrap, isRTL && styles.alignRTL]}>
              <Text style={[styles.broadcastTitle, isRTL && styles.textRTL]}>
                {t('broadcastTitle')}
              </Text>
              <Text style={[styles.broadcastDesc, isRTL && styles.textRTL]}>
                {t('broadcastSubtitle')}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleBroadcastShout}
            style={({ pressed }) => [
              styles.broadcastBtn,
              isRTL && styles.rowRTL,
              broadcastSent && styles.broadcastBtnSent,
              pressed && styles.btnPressed,
            ]}>
            <Ionicons
              name={broadcastSent ? 'checkmark-circle' : 'radio'}
              size={18}
              color="#080E1A"
            />
            <Text style={styles.broadcastBtnText}>
              {broadcastSent ? t('broadcastSent') : t('broadcastBtn')}
            </Text>
          </Pressable>
        </View>

        {/* Current Check-in Status Card */}
        <View style={styles.statusCard}>
          <Text style={[styles.sectionHeader, isRTL && styles.textRTL]}>
            {t('currentPitchStatus')}
          </Text>
          {userCheckIn.status !== 'none' && userCheckIn.pitchName ? (
            <View style={styles.activeStatusBox}>
              <View style={[styles.activeStatusTop, isRTL && styles.rowRTL]}>
                <View style={[styles.statusPulseRow, isRTL && styles.rowRTL]}>
                  <View style={styles.pulsingGreen} />
                  <Text style={styles.activeStatusTitle}>
                    {userCheckIn.status === 'at_pitch' ? t('playingAtPitch') : t('enRouteEta')}
                  </Text>
                </View>
                <Pressable onPress={checkOut} style={styles.checkOutSmallBtn}>
                  <Text style={styles.checkOutSmallText}>{t('checkOut')}</Text>
                </Pressable>
              </View>
              <Text style={[styles.activePitchName, isRTL && styles.textRTL]}>
                {userCheckIn.pitchName}
              </Text>
              <Text style={[styles.activeSubtext, isRTL && styles.textRTL]}>
                {userCheckIn.status === 'at_pitch'
                  ? t('playingAtPitch')
                  : `${t('enRouteEta')} (~${userCheckIn.etaMinutes}m)`}
              </Text>
            </View>
          ) : (
            <View style={styles.inactiveStatusBox}>
              <Text style={[styles.inactiveText, isRTL && styles.textRTL]}>
                {t('notCheckedIn')}
              </Text>
            </View>
          )}
        </View>

        {/* Baller Profile Customizer */}
        <View style={styles.customizerSection}>
          <Text style={[styles.sectionHeader, isRTL && styles.textRTL]}>
            {t('customizeProfile')}
          </Text>

          {/* Avatar Selector */}
          <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>{t('chooseAvatar')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.avatarScroll, isRTL && styles.rowRTL]}>
            {AVATAR_OPTIONS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => updateBallerCard({ avatar: emoji })}
                style={[
                  styles.avatarSelectBtn,
                  userCard.avatar === emoji && styles.avatarSelectBtnActive,
                ]}>
                <Text style={styles.avatarSelectEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Nickname Input */}
          <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>{t('ballerNickname')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="e.g. Leo_Striker⚡"
              placeholderTextColor="#6B7D96"
              style={[styles.textInput, isRTL && styles.textRTL]}
              onBlur={handleSaveProfile}
            />
          </View>

          {/* Favorite Club */}
          <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>{t('favoriteClub')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={favoriteClubInput}
              onChangeText={setFavoriteClubInput}
              placeholder="e.g. FC Barcelona"
              placeholderTextColor="#6B7D96"
              style={[styles.textInput, isRTL && styles.textRTL]}
              onBlur={handleSaveProfile}
            />
          </View>

          {/* Club suggestions */}
          <View style={[styles.clubsRow, isRTL && styles.rowRTL]}>
            {CLUB_SUGGESTIONS.map((club) => (
              <Pressable
                key={club}
                onPress={() => {
                  setFavoriteClubInput(club);
                  updateBallerCard({ favoriteClub: club });
                }}
                style={styles.clubPill}>
                <Text style={styles.clubPillText}>{club}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Baller Trophy Cabinet & Stats */}
        <View style={styles.trophySection}>
          <Text style={[styles.sectionHeader, isRTL && styles.textRTL]}>
            {t('careerStats')}
          </Text>
          <View style={[styles.statsGridRow, isRTL && styles.rowRTL]}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNumber}>{userCard.careerStats?.matches ?? 0}</Text>
              <Text style={styles.statBoxLabel}>{t('statMatches')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNumber}>{userCard.careerStats?.goals ?? 0}</Text>
              <Text style={styles.statBoxLabel}>{t('statGoals')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNumber}>{userCard.careerStats?.mvps ?? 0}</Text>
              <Text style={styles.statBoxLabel}>{t('statMvps')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNumber}>{userCard.careerStats?.cleanSheets ?? 0}</Text>
              <Text style={styles.statBoxLabel}>{t('statCleanSheets')}</Text>
            </View>
          </View>
        </View>

        {/* Firebase Cloud Sync & Baller Account Card */}
        <View style={styles.cloudSection}>
          <View style={[styles.cloudHeaderRow, isRTL && styles.rowRTL]}>
            <View style={[styles.cloudTitleWrap, isRTL && styles.rowRTL]}>
              <Ionicons name="cloud-done" size={20} color="#00FF87" />
              <Text style={styles.cloudTitle}>{t('cloudSyncTitle')}</Text>
            </View>
            <View style={[styles.cloudStatusBadge, !isFirebaseConnected && styles.cloudStatusOffline]}>
              <View
                style={[
                  styles.cloudStatusDot,
                  { backgroundColor: isFirebaseConnected ? '#00FF87' : '#8B9BB4' },
                ]}
              />
              <Text style={styles.cloudStatusText}>
                {isFirebaseConnected ? t('firebaseLive') : t('firebaseOffline')}
              </Text>
            </View>
          </View>

          <Text style={[styles.cloudDesc, isRTL && styles.textRTL]}>{t('cloudSyncDesc')}</Text>

          <View style={styles.cloudAccountInfo}>
            <View style={[styles.accountInfoRow, isRTL && styles.rowRTL]}>
              <Text style={styles.accountInfoLabel}>{t('playerUid')}:</Text>
              <Text style={styles.accountInfoValue} numberOfLines={1} ellipsizeMode="middle">
                {firebaseUser ? firebaseUser.uid : 'Offline'}
              </Text>
            </View>
            <View style={[styles.accountInfoRow, isRTL && styles.rowRTL]}>
              <Text style={styles.accountInfoLabel}>{t('signedInAs')}:</Text>
              <Text style={styles.accountInfoValue}>
                {firebaseUser?.isAnonymous
                  ? t('anonymousBaller')
                  : firebaseUser?.email || t('anonymousBaller')}
              </Text>
            </View>
          </View>

          {firebaseUser?.isAnonymous ? (
            <View style={styles.authActionArea}>
              {!showAuthForm ? (
                <Pressable
                  onPress={() => setShowAuthForm(true)}
                  style={({ pressed }) => [styles.linkAccountBtn, pressed && styles.btnPressed]}>
                  <Ionicons name="mail-outline" size={16} color="#00FF87" />
                  <Text style={styles.linkAccountBtnText}>{t('emailAuth')}</Text>
                </Pressable>
              ) : (
                <View style={styles.authFormWrap}>
                  <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>{t('emailAddress')}</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="baller@example.com"
                    placeholderTextColor="#6B7D96"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.textInput, isRTL && styles.textRTL]}
                  />

                  <Text style={[styles.inputLabel, { marginTop: 8 }, isRTL && styles.textRTL]}>
                    {t('password')}
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7D96"
                    secureTextEntry
                    style={[styles.textInput, isRTL && styles.textRTL]}
                  />

                  {authError && <Text style={styles.authErrorText}>{authError}</Text>}

                  <View style={[styles.authBtnRow, isRTL && styles.rowRTL]}>
                    <Pressable
                      onPress={handleEmailSignIn}
                      disabled={authLoading}
                      style={({ pressed }) => [styles.authSubmitBtn, pressed && styles.btnPressed]}>
                      <Text style={styles.authSubmitBtnText}>{t('signInBtn')}</Text>
                    </Pressable>

                    <Pressable
                      onPress={handleEmailSignUp}
                      disabled={authLoading}
                      style={({ pressed }) => [styles.authSecondaryBtn, pressed && styles.btnPressed]}>
                      <Text style={styles.authSecondaryBtnText}>{t('signUpBtn')}</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowAuthForm(false)}
                      style={styles.authCancelBtn}>
                      <Ionicons name="close" size={18} color="#8B9BB4" />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [styles.signOutBtn, pressed && styles.btnPressed]}>
              <Ionicons name="log-out-outline" size={16} color="#FF4D4D" />
              <Text style={styles.signOutBtnText}>{t('signOut')}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  cardHint: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 4,
  },
  broadcastBox: {
    backgroundColor: '#0E1728',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#00FF87',
  },
  broadcastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  broadcastEmoji: {
    fontSize: 26,
  },
  broadcastTextWrap: {
    flex: 1,
  },
  broadcastTitle: {
    color: '#00FF87',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  broadcastDesc: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  broadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FF87',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  broadcastBtnSent: {
    backgroundColor: '#FFD700',
  },
  broadcastBtnText: {
    color: '#080E1A',
    fontSize: 13,
    fontWeight: '900',
  },
  btnPressed: {
    opacity: 0.8,
  },
  statusCard: {
    backgroundColor: '#0D1524',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1A2942',
  },
  sectionHeader: {
    color: '#CAD5E2',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  activeStatusBox: {
    backgroundColor: '#072618',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00FF87',
  },
  activeStatusTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF87',
  },
  activeStatusTitle: {
    color: '#00FF87',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  checkOutSmallBtn: {
    backgroundColor: '#FF3366',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  checkOutSmallText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  activePitchName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  activeSubtext: {
    color: '#8B9BB4',
    fontSize: 12,
    marginTop: 2,
  },
  inactiveStatusBox: {
    padding: 10,
  },
  inactiveText: {
    color: '#8B9BB4',
    fontSize: 12,
    lineHeight: 18,
  },
  customizerSection: {
    backgroundColor: '#0D1524',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1A2942',
  },
  inputLabel: {
    color: '#00FF87',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
  },
  avatarScroll: {
    marginBottom: 6,
  },
  avatarSelectBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16233B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#243755',
  },
  avatarSelectBtnActive: {
    borderColor: '#00FF87',
    backgroundColor: '#07301E',
  },
  avatarSelectEmoji: {
    fontSize: 22,
  },
  inputRow: {
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#141F33',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#203250',
  },
  clubsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  clubPill: {
    backgroundColor: '#16233B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#243755',
  },
  clubPillText: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '700',
  },
  trophySection: {
    backgroundColor: '#0D1524',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1A2942',
  },
  statsGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#141F33',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#203250',
  },
  statBoxNumber: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
  },
  statBoxLabel: {
    color: '#8B9BB4',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  cloudSection: {
    backgroundColor: '#0D1524',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1A2942',
  },
  cloudHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cloudTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cloudTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cloudStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A2518',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF8740',
  },
  cloudStatusOffline: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cloudStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  cloudStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cloudDesc: {
    color: '#8B9BB4',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  cloudAccountInfo: {
    backgroundColor: '#141F33',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#203250',
    gap: 6,
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoLabel: {
    color: '#8B9BB4',
    fontSize: 11,
    fontWeight: '600',
  },
  accountInfoValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: '65%',
  },
  authActionArea: {
    marginTop: 12,
  },
  linkAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16283D',
    borderWidth: 1,
    borderColor: '#00FF87',
    borderRadius: 10,
    paddingVertical: 10,
  },
  linkAccountBtnText: {
    color: '#00FF87',
    fontSize: 13,
    fontWeight: '800',
  },
  authFormWrap: {
    backgroundColor: '#121A2B',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1D2E49',
    marginTop: 6,
  },
  authErrorText: {
    color: '#FF4D4D',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  authBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  authSubmitBtn: {
    flex: 1,
    backgroundColor: '#00FF87',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  authSubmitBtnText: {
    color: '#080E1A',
    fontSize: 12,
    fontWeight: '800',
  },
  authSecondaryBtn: {
    flex: 1,
    backgroundColor: '#1F2F47',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A4163',
  },
  authSecondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  authCancelBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#182438',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2B1214',
    borderWidth: 1,
    borderColor: '#FF4D4D50',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  signOutBtnText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '800',
  },
});
