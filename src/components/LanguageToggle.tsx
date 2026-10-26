import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { usePitches } from '@/context/PitchesContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = usePitches();

  return (
    <Pressable
      onPress={toggleLanguage}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
      <Text style={styles.flagText}>{language === 'he' ? '🇮🇱' : '🇬🇧'}</Text>
      <Text style={styles.langText}>{language === 'he' ? 'עברית' : 'English'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142036',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF87',
    gap: 4,
  },
  flagText: {
    fontSize: 14,
  },
  langText: {
    color: '#00FF87',
    fontSize: 11,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
