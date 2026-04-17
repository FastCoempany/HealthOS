/**
 * FACE 3 — Movement
 *
 * "Move gently. Move daily. Stack the floor."
 * Shows: motion hub (video preview + reference picker), routine cards
 * (warm-up / treadmill / push / leg+calf), guardrail rules, and
 * a coverage note listing every exercise for the current phase.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';

import { Palette } from '@/constants/theme';
import {
  type MotionKey,
  MOTION_LIBRARY,
  GUARDRAILS,
  phaseForDay,
  todayMotionKeys,
  youtubeThumb,
  routineCardsForDay,
  movementCoverageNote,
  createDefaultState,
} from '@/constants/health-data';

const initial = createDefaultState();
const ALL_MOTION_KEYS = Object.keys(MOTION_LIBRARY) as MotionKey[];

export default function MovementScreen() {
  const params = useLocalSearchParams<{ motion?: string }>();
  const [selectedDay] = useState(initial.selectedDay);
  const [selectedMotion, setSelectedMotion] = useState<MotionKey>('march');

  // Accept a deep-link motion param from the Dashboard directive cards.
  useEffect(() => {
    if (params.motion && params.motion in MOTION_LIBRARY) {
      setSelectedMotion(params.motion as MotionKey);
    }
  }, [params.motion]);

  const phase = phaseForDay(selectedDay);
  const keysToday = todayMotionKeys(selectedDay);
  const routineCards = routineCardsForDay(selectedDay);
  const coverageNote = movementCoverageNote(selectedDay);
  const current = MOTION_LIBRARY[selectedMotion];
  const thumbUrl = youtubeThumb(current.source);

  const openSource = useCallback(() => {
    Linking.openURL(current.source);
  }, [current.source]);

  const openGuide = useCallback(() => {
    if (current.guide) Linking.openURL(current.guide);
  }, [current.guide]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>MOVEMENT SYSTEM</Text>
          <Text style={styles.sectionTitle}>
            Move gently.{'\n'}Move daily.{'\n'}Stack the floor.
          </Text>
          <Text style={styles.hint}>
            Day {selectedDay}. Every movement you need today is listed first. Then the real-motion reference lives below it.
          </Text>
        </View>

        {/* ---- Motion Hub (video preview) ---- */}
        <View style={styles.card}>
          <View style={styles.playerLabel}>
            <Text style={styles.playerLabelText}>REAL MOTION REFERENCE</Text>
            <Text style={styles.playerLabelDetail}>{current.title}</Text>
          </View>

          {/* Video thumbnail / preview */}
          <Pressable style={styles.playerFrame} onPress={openSource}>
            {thumbUrl ? (
              <Image source={{ uri: thumbUrl }} style={styles.thumbImage} contentFit="cover" />
            ) : (
              <View style={styles.thumbPlaceholder} />
            )}
            <View style={styles.previewOverlay}>
              <View style={styles.previewContent}>
                <View style={styles.previewTitle}>
                  <Text style={styles.previewStrong}>{current.title}</Text>
                  <Text style={styles.previewBlurb}>{current.blurb}</Text>
                </View>
                <View style={styles.playBtn}>
                  <Text style={styles.playBtnText}>Open clip</Text>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={openSource}>
              <Text style={styles.actionBtnText}>Watch source clip</Text>
            </Pressable>
            {current.guide ? (
              <Pressable style={styles.actionBtnSubtle} onPress={openGuide}>
                <Text style={styles.actionBtnSubtleText}>Open form guide</Text>
              </Pressable>
            ) : null}
          </View>

          {/* Motion detail */}
          <View style={styles.motionCopy}>
            <Text style={styles.eyebrow}>LOADED FOR DAY {selectedDay}</Text>
            <Text style={styles.motionTitle}>{current.title}</Text>
            <Text style={styles.hint}>{current.blurb}</Text>
          </View>

          {/* Today's exact motions — tappable word list */}
          <Text style={styles.miniHead}>Today's exact motions</Text>
          <View style={styles.motionWords}>
            {keysToday.map((key, idx) => (
              <React.Fragment key={key}>
                {idx > 0 && <Text style={styles.wordSep}>/</Text>}
                <Pressable onPress={() => setSelectedMotion(key)}>
                  <Text
                    style={[
                      styles.motionWord,
                      key === selectedMotion && styles.motionWordActive,
                    ]}
                  >
                    {MOTION_LIBRARY[key].title}
                  </Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>

          {/* All movement references — full list */}
          <Text style={styles.miniHead}>All movement references</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.allMotionsRow}>
              {ALL_MOTION_KEYS.map((key) => (
                <Pressable
                  key={key}
                  style={[
                    styles.motionPill,
                    key === selectedMotion && styles.motionPillActive,
                  ]}
                  onPress={() => setSelectedMotion(key)}
                >
                  <Text
                    style={[
                      styles.motionPillText,
                      key === selectedMotion && styles.motionPillTextActive,
                    ]}
                  >
                    {MOTION_LIBRARY[key].title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ---- Routine Cards ---- */}
        {routineCards.map((card) => (
          <Pressable
            key={card.title}
            style={styles.moveCard}
            onPress={() => setSelectedMotion(card.defaultKey)}
          >
            <Text style={styles.moveCardTitle}>{card.title}</Text>
            <Text style={styles.moveCardCopy}>{card.copy}</Text>
            {card.keys.length > 1 && (
              <View style={styles.moveLinks}>
                {card.keys.map((key, idx) => (
                  <React.Fragment key={key}>
                    {idx > 0 && <Text style={styles.moveLinkSep}>/</Text>}
                    <Pressable onPress={() => setSelectedMotion(key)}>
                      <Text
                        style={[
                          styles.moveLink,
                          key === selectedMotion && styles.moveLinkActive,
                        ]}
                      >
                        {MOTION_LIBRARY[key].title}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            )}
          </Pressable>
        ))}

        {/* ---- Guardrails ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>GUARDRAILS</Text>
          {GUARDRAILS.map((g) => (
            <View key={g.title} style={styles.guardCard}>
              <Text style={styles.guardTitle}>{g.title}</Text>
              <Text style={styles.hint}>{g.copy}</Text>
            </View>
          ))}
        </View>

        {/* ---- Coverage note ---- */}
        <View style={styles.funNote}>
          <Text style={styles.funNoteText}>{coverageNote}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 16 },

  card: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 16,
    gap: 10,
  },

  eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8a939b' },
  sectionTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -1.2, color: Palette.ink, lineHeight: 30 },
  miniHead: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#7b8590', fontWeight: '800', marginTop: 6 },
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Player / video preview
  playerLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerLabelText: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#79828b', fontWeight: '800' },
  playerLabelDetail: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#79828b', fontWeight: '800' },

  playerFrame: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: '#e7dfd0',
    aspectRatio: 16 / 9,
    minHeight: 200,
  },
  thumbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e7dfd0',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(18,22,27,0.35)',
  },
  previewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  previewTitle: { flex: 1, gap: 4 },
  previewStrong: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4, color: '#fff', lineHeight: 22 },
  previewBlurb: { fontSize: 14, color: 'rgba(255,255,255,0.92)', lineHeight: 20 },
  playBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Palette.orange,
  },
  playBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Action buttons
  actionRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  actionBtnText: { fontWeight: '800', fontSize: 13, color: Palette.ink },
  actionBtnSubtle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Palette.line2,
  },
  actionBtnSubtleText: { fontWeight: '800', fontSize: 13, color: Palette.muted },

  // Motion copy block
  motionCopy: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,251,246,0.96)',
    gap: 6,
  },
  motionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, color: Palette.ink },

  // Today's motion word list
  motionWords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 0,
    paddingTop: 4,
  },
  motionWord: { fontSize: 14, fontWeight: '500', color: '#4d5862', paddingVertical: 4 },
  motionWordActive: { fontWeight: '700', color: Palette.ink },
  wordSep: { marginHorizontal: 8, color: '#c3c9cf', fontSize: 14 },

  // All references horizontal pills
  allMotionsRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  motionPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  motionPillActive: { backgroundColor: Palette.blue, borderColor: Palette.blue },
  motionPillText: { fontSize: 12, fontWeight: '700', color: '#52606a' },
  motionPillTextActive: { color: '#fff' },

  // Routine cards
  moveCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,250,243,0.96)',
    gap: 8,
  },
  moveCardTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  moveCardCopy: { fontSize: 13.5, color: Palette.muted, lineHeight: 20 },
  moveLinks: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 0 },
  moveLink: { fontSize: 14, fontWeight: '500', color: '#4b5660', paddingVertical: 2 },
  moveLinkActive: { color: Palette.ink, fontWeight: '700' },
  moveLinkSep: { marginHorizontal: 10, color: '#c3c9cf', fontSize: 14 },

  // Guardrail cards
  guardCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: Palette.line,
    gap: 4,
  },
  guardTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },

  // Coverage fun note
  funNote: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,248,239,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(235,106,45,0.18)',
  },
  funNoteText: { fontSize: 13, color: '#6d4c2f', lineHeight: 19 },
});
