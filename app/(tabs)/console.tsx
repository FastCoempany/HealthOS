/**
 * FACE 3 — Console
 *
 * "Do the exact day. Then close it."
 * The daily run sheet — a timeline of every task for the selected day
 * with checkboxes to mark done, and a close-out-the-day button.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';

import { Palette } from '@/constants/theme';
import {
  type MealMode,
  type DayState,
  type TimelineItem,
  timelineForDay,
  phaseForDay,
  isWeighDay,
  blockForDay,
  daysInBlock,
  createDefaultState,
} from '@/constants/health-data';

const initial = createDefaultState();

export default function ConsoleScreen() {
  const [selectedDay, setSelectedDay] = useState(initial.selectedDay);
  const [days, setDays] = useState<DayState[]>(initial.days);
  const [currentBlock, setCurrentBlock] = useState(blockForDay(initial.selectedDay));

  const mealMode: MealMode = initial.mealMode;
  const startWeight = initial.startWeight;
  const hydrationFactor = initial.hydrationFactor;

  const dayObj = days[selectedDay - 1];
  const items = timelineForDay(selectedDay, mealMode, startWeight, hydrationFactor);
  const doneCount = Object.values(dayObj.done).filter(Boolean).length;
  const totalCount = items.length;

  const { start: blockStart } = daysInBlock(currentBlock);
  const blockDays = Array.from({ length: 15 }, (_, i) => blockStart + i);

  // -- Toggle a check --
  const toggleCheck = useCallback((key: string) => {
    setDays((prev) => {
      const next = [...prev];
      const d = { ...next[selectedDay - 1] };
      d.done = { ...d.done, [key]: !d.done[key] };
      next[selectedDay - 1] = d;
      return next;
    });
  }, [selectedDay]);

  // -- Close the day --
  const closeDay = useCallback(() => {
    setDays((prev) => {
      const next = [...prev];
      const d = { ...next[selectedDay - 1] };
      d.closed = !d.closed;
      next[selectedDay - 1] = d;
      return next;
    });
  }, [selectedDay]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>DAILY CONSOLE</Text>
          <Text style={styles.sectionTitle}>
            Do the exact day.{'\n'}Then close it.
          </Text>
          <Text style={styles.hint}>
            This page is not a health diary. It is the exact run sheet for day{' '}
            {selectedDay}. Check the boxes as you do the work.
          </Text>

          {/* Status + close */}
          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {dayObj.closed
                  ? `Day ${selectedDay} is closed`
                  : `Day ${selectedDay} is open`}
              </Text>
            </View>
            <View style={styles.progressPill}>
              <Text style={styles.progressText}>
                {doneCount}/{totalCount} done
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.closeBtn, dayObj.closed && styles.closeBtnDone]}
            onPress={closeDay}
          >
            <Text style={styles.closeBtnText}>
              {dayObj.closed ? 'Re-open this day' : 'Close out this day'}
            </Text>
          </Pressable>
        </View>

        {/* ---- Day selector strip ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>SELECT DAY</Text>
          <View style={styles.blockRow}>
            {[0, 1, 2, 3].map((b) => {
              const { start } = daysInBlock(b);
              return (
                <Pressable
                  key={b}
                  style={[styles.blockPick, b === currentBlock && styles.blockPickActive]}
                  onPress={() => { setCurrentBlock(b); setSelectedDay(start); }}
                >
                  <Text style={[styles.blockPickText, b === currentBlock && styles.blockPickTextActive]}>
                    {b === 0 ? '1-15' : b === 1 ? '16-30' : b === 2 ? '31-45' : '46-60'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayStrip}>
            {blockDays.map((d) => {
              const dState = days[d - 1];
              return (
                <Pressable
                  key={d}
                  style={[
                    styles.dayChip,
                    d === selectedDay && styles.dayChipActive,
                    dState.closed && styles.dayChipClosed,
                  ]}
                  onPress={() => setSelectedDay(d)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      d === selectedDay && styles.dayChipTextActive,
                      dState.closed && styles.dayChipTextClosed,
                    ]}
                  >
                    {d}
                  </Text>
                  {dState.closed && <Text style={styles.dayClosedMark}>x</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ---- Timeline ---- */}
        {items.map((item, idx) => {
          const done = !!dayObj.done[item.key];
          return (
            <View key={item.key} style={[styles.stepCard, done && styles.stepCardDone]}>
              {/* Step number indicator */}
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, done && styles.stepDotDone]}>
                  <Text style={[styles.stepDotText, done && styles.stepDotTextDone]}>
                    {done ? '\u2713' : idx + 1}
                  </Text>
                </View>
                {idx < items.length - 1 && <View style={styles.stepLine} />}
              </View>

              {/* Step content */}
              <View style={styles.stepContent}>
                <View style={styles.stepTop}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <View style={styles.timeChip}>
                    <Text style={styles.timeChipText}>{item.time}</Text>
                  </View>
                </View>
                <Text style={styles.stepCopy}>{item.copy}</Text>

                {/* Check button */}
                <Pressable
                  style={[styles.checkBtn, done && styles.checkBtnDone]}
                  onPress={() => toggleCheck(item.key)}
                >
                  <Text style={[styles.checkBtnText, done && styles.checkBtnTextDone]}>
                    {done ? 'Done' : 'Mark done'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* ---- Weigh day reminder ---- */}
        {isWeighDay(selectedDay) && (
          <View style={styles.weighBanner}>
            <Text style={styles.weighText}>
              Day {selectedDay} is a weigh-in checkpoint. Step on the scale once. No drama.
            </Text>
          </View>
        )}

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
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Status bar
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(20,23,26,0.05)',
  },
  statusPillText: { fontSize: 13, fontWeight: '800', color: Palette.ink },
  progressPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(37,103,255,0.08)',
  },
  progressText: { fontSize: 13, fontWeight: '800', color: '#254bb7' },

  // Close button
  closeBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Palette.green,
  },
  closeBtnDone: {
    backgroundColor: Palette.muted,
  },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },

  // Day selector
  blockRow: { flexDirection: 'row', gap: 8 },
  blockPick: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  blockPickActive: { backgroundColor: Palette.blue, borderColor: Palette.blue },
  blockPickText: { fontSize: 12, fontWeight: '800', color: '#52606a', letterSpacing: 0.5 },
  blockPickTextActive: { color: '#fff' },
  dayStrip: { marginTop: 4 },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dayChipActive: { backgroundColor: Palette.orange, borderColor: Palette.orange },
  dayChipClosed: { borderColor: Palette.green },
  dayChipText: { fontSize: 14, fontWeight: '900', color: Palette.ink },
  dayChipTextActive: { color: '#fff' },
  dayChipTextClosed: {},
  dayClosedMark: { fontSize: 10, fontWeight: '900', color: Palette.green, position: 'absolute', bottom: -2 },

  // Timeline step cards
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 100,
  },
  stepCardDone: {
    opacity: 0.85,
  },
  stepIndicator: {
    width: 32,
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 2,
    borderColor: Palette.line2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotDone: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  stepDotText: { fontSize: 13, fontWeight: '800', color: Palette.muted },
  stepDotTextDone: { color: '#fff' },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: Palette.line2,
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 14,
    gap: 10,
    marginBottom: 4,
  },
  stepTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  timeChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(37,103,255,0.08)',
  },
  timeChipText: { fontSize: 12, fontWeight: '800', color: '#254bb7' },
  stepCopy: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Check button
  checkBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  checkBtnDone: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  checkBtnText: { fontSize: 13, fontWeight: '900', color: Palette.ink },
  checkBtnTextDone: { color: '#fff' },

  // Weigh day banner
  weighBanner: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(198,149,47,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(198,149,47,0.25)',
  },
  weighText: { fontSize: 14, fontWeight: '700', color: '#6d4c2f', lineHeight: 20 },
});
