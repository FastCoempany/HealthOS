/**
 * FACE 1 — Dashboard
 *
 * "Today's directives" — the first screen the user sees.
 * Shows: day selector, directive cards (warm-up / treadmill / strength / food),
 * hydration tracker, goal mode selector, triage panel (vitals + labs),
 * and the 60-day arc overview.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Palette, FlagColors } from '@/constants/theme';
import {
  GOALS,
  LABS,
  ARC_PHASES,
  type GoalKey,
  type MealMode,
  planForDay,
  phaseForDay,
  waterOz,
  bottleCount,
  blockForDay,
  daysInBlock,
  createDefaultState,
} from '@/constants/health-data';

// ---------------------------------------------------------------------------
// State (in-memory for mockup; will be replaced with persistent store)
// ---------------------------------------------------------------------------

const initial = createDefaultState();

export default function DashboardScreen() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState(initial.selectedDay);
  const [goal, setGoal] = useState<GoalKey>(initial.goal);
  const [mealMode, setMealMode] = useState<MealMode>(initial.mealMode);
  const [hydrationFactor, setHydrationFactor] = useState(initial.hydrationFactor);
  const [currentBlock, setCurrentBlock] = useState(blockForDay(initial.selectedDay));

  const startWeight = initial.startWeight;
  const plan = planForDay(selectedDay, mealMode);
  const phase = phaseForDay(selectedDay);
  const oz = waterOz(startWeight, hydrationFactor);
  const bottles = bottleCount(startWeight, hydrationFactor);

  // -- Day selector helpers --
  const { start: blockStart, end: blockEnd } = daysInBlock(currentBlock);
  const blockDays = Array.from({ length: 15 }, (_, i) => blockStart + i);

  const selectGoal = useCallback((key: GoalKey) => {
    const g = GOALS[key];
    setGoal(key);
    setHydrationFactor(g.x);
    setMealMode(g.meals);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header ---- */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Slow Roll Health OS</Text>
          <Text style={styles.brandSub}>Light console · 60-day directive build</Text>
        </View>

        {/* ---- Day selector strip ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>DAY SELECTOR</Text>
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
            {blockDays.map((d) => (
              <Pressable
                key={d}
                style={[styles.dayChip, d === selectedDay && styles.dayChipActive]}
                onPress={() => setSelectedDay(d)}
              >
                <Text style={[styles.dayChipText, d === selectedDay && styles.dayChipTextActive]}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.hint}>
            Day {selectedDay} · Phase {phase} of 4
          </Text>
        </View>

        {/* ---- Today's directives ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>DASHBOARD</Text>
          <Text style={styles.sectionTitle}>Today's directives</Text>
          <View style={styles.divider} />

          <DirectiveCard
            icon="*"
            title="Warm-up"
            time={plan.movementTime}
            copy={plan.movement.warmup}
          />
          <DirectiveCard
            icon="~"
            title="Treadmill"
            time={addMins(plan.movementTime, 6)}
            copy={plan.movement.treadmill}
          />
          <DirectiveCard
            icon="#"
            title="Micro-strength"
            time={addMins(plan.movementTime, 18)}
            copy={plan.movement.strength}
          />
          <DirectiveCard
            icon="+"
            title="Food plan"
            time={plan.meals[0].time}
            copy={`${mealMode} meals today · ${bottles} bottles of 16.9 oz water`}
            tags={plan.meals.map((m) => `${m.label}: ${m.title}`)}
          />
        </View>

        {/* ---- Hydration ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>HYDRATION</Text>
          <View style={styles.waterBanner}>
            <Text style={styles.waterBig}>{oz} oz/day</Text>
            <Text style={styles.waterSub}>
              That is about {bottles} bottles of 16.9 fl oz water.
            </Text>
            <Text style={styles.hint}>
              x = ounces per pound of body weight. {GOALS[goal].label} sets x to{' '}
              {hydrationFactor.toFixed(2)}.
            </Text>
          </View>

          {/* Goal chips */}
          <Text style={styles.miniHead}>Priority mode</Text>
          <View style={styles.chipRow}>
            {(Object.keys(GOALS) as GoalKey[]).map((key) => (
              <Pressable
                key={key}
                style={[styles.goalChip, key === goal && styles.goalChipActive]}
                onPress={() => selectGoal(key)}
              >
                <Text style={[styles.goalChipText, key === goal && styles.goalChipTextActive]}>
                  {GOALS[key].label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusBold}>{GOALS[goal].label} is active.</Text>
            <Text style={styles.hint}>
              {GOALS[goal].status} This mode sets x to {GOALS[goal].x.toFixed(2)} and recommends{' '}
              {GOALS[goal].meals} meals.
            </Text>
          </View>
        </View>

        {/* ---- Triage panel ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>TRIAGE</Text>
          <Text style={styles.hint}>The problem in plain sight.</Text>

          {/* Vitals */}
          <View style={styles.vitalsGrid}>
            <VitalCell label="Age" value={initial.age || '--'} />
            <VitalCell label="Height" value={initial.height} />
            <VitalCell label="Starting weight" value={String(initial.startWeight)} />
            <VitalCell label="Priority mode" value={GOALS[goal].label} />
          </View>

          {/* Labs */}
          <Text style={[styles.miniHead, { marginTop: 14 }]}>Lab values</Text>
          {LABS.map((lab) => (
            <View key={lab.name} style={styles.labRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labName}>
                  {lab.name}: {lab.value}
                </Text>
                <Text style={styles.hint}>{lab.note}</Text>
              </View>
              <Text style={[styles.labFlag, { color: FlagColors[lab.flag] }]}>
                {lab.flag === 'bad' ? 'PRIORITY' : lab.flag === 'warn' ? 'WATCH' : 'SOLID'}
              </Text>
            </View>
          ))}
        </View>

        {/* ---- 60-day arc ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>60-DAY ARC</Text>
          <Text style={styles.hint}>
            Four phases. No mystery. Just a cleaner escalation.
          </Text>
          {ARC_PHASES.map((arc, idx) => (
            <View
              key={idx}
              style={[
                styles.arcCard,
                phase === idx + 1 && styles.arcCardActive,
              ]}
            >
              <Text style={styles.arcDays}>{arc.days}</Text>
              <Text style={styles.arcTitle}>{arc.title}</Text>
              <Text style={styles.hint}>{arc.copy}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DirectiveCard({
  icon,
  title,
  time,
  copy,
  tags,
}: {
  icon: string;
  title: string;
  time: string;
  copy: string;
  tags?: string[];
}) {
  return (
    <View style={styles.todoCard}>
      <View style={styles.todoTop}>
        <View style={styles.todoIcon}>
          <Text style={styles.todoIconText}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.todoTopLine}>
            <Text style={styles.todoTitle}>{title}</Text>
            <View style={styles.timeChip}>
              <Text style={styles.timeChipText}>{time}</Text>
            </View>
          </View>
          <View style={[styles.divider, { marginVertical: 8 }]} />
          <Text style={styles.todoCopy}>{copy}</Text>
          {tags && (
            <View style={styles.tagRow}>
              {tags.map((t, i) => (
                <View key={i} style={styles.miniTag}>
                  <Text style={styles.miniTagText}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function VitalCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.vitalCell}>
      <Text style={styles.vitalValue}>{value}</Text>
      <Text style={styles.vitalLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tiny helper (simplified from HTML)
// ---------------------------------------------------------------------------

function addMins(time: string, mins: number): string {
  const [hm, period] = time.split(' ');
  const [hStr, mStr] = hm.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  let hour24 = (h % 12) + (period === 'PM' ? 12 : 0);
  const d = new Date(2000, 0, 1, hour24, m + mins);
  let outH = d.getHours();
  const outP = outH >= 12 ? 'PM' : 'AM';
  outH = outH % 12 || 12;
  return `${outH}:${String(d.getMinutes()).padStart(2, '0')} ${outP}`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 16 },

  header: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  brandTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: Palette.ink },
  brandSub: { fontSize: 13, color: Palette.muted, marginTop: 2 },

  card: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 16,
    gap: 10,
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#8a939b',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: Palette.ink,
  },
  miniHead: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#7b8590',
    fontWeight: '800',
    marginTop: 6,
  },
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },
  divider: {
    height: 1,
    backgroundColor: Palette.line2,
    borderRadius: 999,
  },

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
  blockPickActive: {
    backgroundColor: Palette.blue,
    borderColor: Palette.blue,
  },
  blockPickText: { fontSize: 12, fontWeight: '800', color: '#52606a', letterSpacing: 0.5 },
  blockPickTextActive: { color: '#fff' },
  dayStrip: { marginTop: 8 },
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
  dayChipActive: {
    backgroundColor: Palette.orange,
    borderColor: Palette.orange,
  },
  dayChipText: { fontSize: 14, fontWeight: '900', color: Palette.ink },
  dayChipTextActive: { color: '#fff' },

  // Directive cards
  todoCard: {
    borderWidth: 1,
    borderColor: Palette.line,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  todoTop: { flexDirection: 'row', gap: 12 },
  todoIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37,103,255,0.14)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  todoIconText: { fontSize: 18, fontWeight: '800', color: Palette.ink },
  todoTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3, color: Palette.ink },
  todoCopy: { fontSize: 13.5, color: '#50606c', lineHeight: 20 },
  timeChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(37,103,255,0.08)',
  },
  timeChipText: { fontSize: 12, fontWeight: '800', color: '#254bb7' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  miniTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(235,106,45,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(37,103,255,0.25)',
  },
  miniTagText: { fontSize: 11, fontWeight: '700', color: '#1b263b' },

  // Water / hydration
  waterBanner: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(238,248,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(86,166,255,0.20)',
    gap: 6,
  },
  waterBig: { fontSize: 28, fontWeight: '800', letterSpacing: -1, color: Palette.ink },
  waterSub: { fontSize: 14, color: Palette.muted, lineHeight: 20 },

  // Goal chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  goalChipActive: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  goalChipText: { fontSize: 13, fontWeight: '800', color: Palette.ink },
  goalChipTextActive: { color: '#fff' },

  // Status box
  statusBox: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: Palette.line,
    gap: 4,
  },
  statusBold: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },

  // Vitals
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  vitalCell: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  vitalValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, color: Palette.ink },
  vitalLabel: { fontSize: 12, color: Palette.muted, marginTop: 2 },

  // Labs
  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  labName: { fontSize: 14, fontWeight: '700', color: Palette.ink },
  labFlag: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  // Arc
  arcCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 4,
  },
  arcCardActive: {
    borderColor: Palette.blue,
    borderWidth: 2,
    backgroundColor: 'rgba(37,103,255,0.06)',
  },
  arcDays: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#7f8891',
  },
  arcTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
});
