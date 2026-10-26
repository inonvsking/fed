export type Language = 'he' | 'en';

export const translations = {
  he: {
    // App Header & Branding
    appName: 'מי במגרש?',
    appSubname: 'MiBamigrash',
    tagline: 'רדאר מגרשים חי ומציאת משחקי כדורגל',
    radarPing: 'פינג רדאר',

    // Ticker & Stats
    ballersOnPitch: 'שחקנים במגרשים עכשיו',
    matchesInProgress: 'משחקים בעיצומם',

    // Search & Filters
    searchPlaceholder: 'חיפוש מגרש (פארק הירקון, כלוב, דשא...)...',
    allPitches: '🏟️ כל המגרשים',
    activeNow: '🟢 פעיל עכשיו',
    closest: '📍 קרוב אליי (<1 ק"מ)',
    lightsOn: '💡 אורות דולקים',
    noPitchesFound: 'לא נמצאו מגרשים',
    noPitchesDesc: 'אין מגרשים שתואמים את הסינון או החיפוש הנוכחי.',
    resetFilters: 'איפוס סינונים',

    // Pitch Card
    player: 'שחקן',
    players: 'שחקנים',
    live: 'במגרש',
    zeroPlayers: '0 שחקנים',
    enRoute: 'בדרך לשם',
    kmAway: 'ק"מ',
    gameInProgress: '🔥 משחק בעיצומו',
    matchHeatingUp: '⚡ המשחק מתחמם',
    pickupOpen: '⚽ פתוח למשחק',
    headingOverBtn: '🏃 אני בדרך!',
    youAreHere: '✅ אתה כאן!',
    viewPitchBtn: 'מי במגרש? ➔',

    // Active Check-In Banner
    playingAtPitch: 'משחק במגרש עכשיו',
    enRouteEta: 'בדרך לשם',
    checkOut: 'יציאה מהמגרש',

    // Pitch Detail Modal
    checkedInAtThisPitch: '🟢 אתה רשום במגרש הזה!',
    areYouPlayingPrompt: 'אתה בא לשחק?',
    imHereNow: '⚡ אני במגרש עכשיו',
    tenMinAway: '🏃 10 דק׳ הגעה',
    twentyMinAway: '⏱️ 20 דק׳ הגעה',
    tabWhosThere: 'מי במגרש?',
    tabLiveChat: 'צ׳אט חי וצעקות',
    surface: 'משטח',
    format: 'פורמט',
    lights: 'תאורה',
    activeLights: 'דולקת 💡',
    noLights: 'ללא',
    ballersOnSite: 'שחקנים במקום',
    playing: 'משחקים',
    arriving: 'מגיעים',
    pitchQuietNow: 'המגרש שקט כרגע',
    beFirstPrompt: 'היה הראשון ללחוץ "אני במגרש עכשיו" והזמן שחקנים נוספים לבוא לשחק!',
    onField: 'במגרש',
    needPlayersTitle: '📢 צריכים שחקנים עכשיו?',
    needPlayersSubtitle: 'שלח צעקה חיה ברדאר כדי להזמין עוד שחקנים למגרש!',
    sendShoutPlaceholder: 'שלח הודעה / צעקה למגרש...',

    // Quick Shouts
    shoutNeedOne: 'צריכים +1 ל-5 על 5! ⚽',
    shoutNeedGoalie: 'דחוף שוער לשער! 🧤',
    shoutEnRoute: 'אני בדרך, מגיע בעוד 10 דקות! 🏃',
    shoutBall: 'למי יש כדור מידה 5? ⚽',
    shoutLights: 'האורות במגרש דולקים? 💡',
    shoutGameStarting: 'המשחק מתחיל עכשיו! בואו! 🔥',

    // Baller Card / Profile
    ballerCardTitle: 'כרטיס שחקן',
    ballerCardSubtitle: 'זהות שחקן פיפ״א ארקייד • מי במגרש?',
    boostHint: '💡 לחץ על כל נתון (PAC, SHO, PAS, DRI, DEF, PHY) למעלה כדי לשפר את הכרטיס שלך!',
    selectPosition: 'בחר עמדה:',
    broadcastTitle: 'שידור רדאר לכל המגרשים',
    broadcastSubtitle: 'שלח התראה לכל המגרשים באזור שאתה רוצה לשחק כדורגל עכשיו!',
    broadcastBtn: 'צעקה: "אני רוצה לשחק כדורגל!"',
    broadcastSent: 'הצעקה שודרה לכל המגרשים בסביבה!',
    currentPitchStatus: 'סטטוס מגרש נוכחי',
    notCheckedIn: 'אינך רשום באף מגרש כרגע. היכנס למסך מגרשים ובחר היכן לשחק!',
    customizeProfile: 'עריכת פרופיל שחקן',
    chooseAvatar: 'בחר אימוג׳י שחקן',
    ballerNickname: 'כינוי שחקן במגרש',
    favoriteClub: 'קבוצה אהובה',
    careerStats: 'סטטיסטיקת משחקי שכונה',
    statMatches: 'משחקים',
    statGoals: 'שערים',
    statMvps: 'שחקן מצטיין',
    statCleanSheets: 'שער נקי',

    // Positions
    pos_ST: 'חלוץ (ST)',
    pos_LW: 'כנף שמאל (LW)',
    pos_RW: 'כנף ימין (RW)',
    pos_CAM: 'קשר התקפי (CAM)',
    pos_CM: 'קשר מרכזי (CM)',
    pos_CDM: 'קשר אחורי (CDM)',
    pos_CB: 'בלם (CB)',
    pos_GK: 'שוער (GK)',

    // Tabs
    tabPitches: 'מגרשים',
    tabBallerCard: 'כרטיס שחקן',
  },
  en: {
    // App Header & Branding
    appName: 'MiBamigrash',
    appSubname: 'מי במגרש?',
    tagline: 'Live Soccer Pitch Radar & Match Finder',
    radarPing: 'Radar Ping',

    // Ticker & Stats
    ballersOnPitch: 'ballers on local pitches now',
    matchesInProgress: 'matches in progress',

    // Search & Filters
    searchPlaceholder: 'Search pitches (Park HaYarkon, Cage, Turf)...',
    allPitches: '🏟️ All Pitches',
    activeNow: '🟢 Active Now',
    closest: '📍 Closest (<1 km)',
    lightsOn: '💡 Lights On',
    noPitchesFound: 'No Pitches Found',
    noPitchesDesc: 'No soccer fields match your current filter or search query.',
    resetFilters: 'Reset Filters',

    // Pitch Card
    player: 'player',
    players: 'players',
    live: 'LIVE',
    zeroPlayers: '0 PLAYERS',
    enRoute: 'EN ROUTE',
    kmAway: 'km',
    gameInProgress: '🔥 GAME IN PROGRESS',
    matchHeatingUp: '⚡ MATCH HEATING UP',
    pickupOpen: '⚽ PICKUP OPEN',
    headingOverBtn: '🏃 Heading Over',
    youAreHere: '✅ You are here!',
    viewPitchBtn: 'Who\'s there? ➔',

    // Active Check-In Banner
    playingAtPitch: 'PLAYING AT PITCH',
    enRouteEta: 'EN ROUTE',
    checkOut: 'Check Out',

    // Pitch Detail Modal
    checkedInAtThisPitch: '🟢 YOU ARE CHECKED IN AT THIS PITCH!',
    areYouPlayingPrompt: 'ARE YOU GOING TO PLAY?',
    imHereNow: '⚡ I\'m Here Now',
    tenMinAway: '🏃 10m Away',
    twentyMinAway: '⏱️ 20m Away',
    tabWhosThere: 'Who\'s on Pitch?',
    tabLiveChat: 'Live Chat & Shouts',
    surface: 'SURFACE',
    format: 'FORMAT',
    lights: 'LIGHTS',
    activeLights: 'Active 💡',
    noLights: 'None',
    ballersOnSite: 'BALLERS ON SITE',
    playing: 'Playing',
    arriving: 'Arriving',
    pitchQuietNow: 'Pitch is quiet right now',
    beFirstPrompt: 'Be the first to tap "I\'m Here Now" and rally other kids to come play!',
    onField: 'On field',
    needPlayersTitle: '📢 NEED PLAYERS RIGHT NOW?',
    needPlayersSubtitle: 'Send a live shout to summon more ballers to this field!',
    sendShoutPlaceholder: 'Send a shout to this pitch...',

    // Quick Shouts
    shoutNeedOne: 'Need +1 for 5v5! ⚽',
    shoutNeedGoalie: 'Desperately need a goalie! 🧤',
    shoutEnRoute: 'On my way, arriving in 10m! 🏃',
    shoutBall: 'Who has a size 5 ball? ⚽',
    shoutLights: 'Are the floodlights on? 💡',
    shoutGameStarting: 'Game starting right now! 🔥',

    // Baller Card / Profile
    ballerCardTitle: 'BALLER CARD',
    ballerCardSubtitle: 'Your Arcade FIFA Player Identity • מי במגרש?',
    boostHint: '💡 Tap any stat (PAC, SHO, PAS, DRI, DEF, PHY) above to boost your attributes!',
    selectPosition: 'SELECT POSITION:',
    broadcastTitle: 'BROADCAST RADAR ALERT',
    broadcastSubtitle: 'Ping all local neighborhood pitches that you are ready for a match!',
    broadcastBtn: 'Shout: "I Want to Play Soccer!"',
    broadcastSent: 'Ping Broadcasted to All Pitches!',
    currentPitchStatus: 'CURRENT PITCH STATUS',
    notCheckedIn: 'You are not currently checked in anywhere. Head to the Pitches tab to join a match!',
    customizeProfile: 'CUSTOMIZE BALLER PROFILE',
    chooseAvatar: 'CHOOSE YOUR AVATAR',
    ballerNickname: 'BALLER NICKNAME',
    favoriteClub: 'FAVORITE CLUB / TEAM',
    careerStats: 'CAREER PICKUP STATS',
    statMatches: 'MATCHES',
    statGoals: 'GOALS',
    statMvps: 'PITCH MVPS',
    statCleanSheets: 'CLEAN SHEETS',

    // Positions
    pos_ST: 'Striker (ST)',
    pos_LW: 'Left Wing (LW)',
    pos_RW: 'Right Wing (RW)',
    pos_CAM: 'Attacking Mid (CAM)',
    pos_CM: 'Center Mid (CM)',
    pos_CDM: 'Defensive Mid (CDM)',
    pos_CB: 'Center Back (CB)',
    pos_GK: 'Goalkeeper (GK)',

    // Tabs
    tabPitches: 'Pitches',
    tabBallerCard: 'Baller Card',
  },
};

export type TranslationKey = keyof typeof translations.en;
