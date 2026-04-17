/**
 * Triage
 *
 * "The problem in plain sight."
 * Baseline vitals + lab values. The age ticks forward based on the stored
 * birthdate — the birthdate itself is never rendered.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Palette, FlagColors } from '@/constants/theme';
import {
  GOALS,
  LABS,
  computeAge,
  createDefaultState,
} from '@/constants/health-data';

const initial = createDefaultState();

export default function TriageScreen() {
  // -- Live age clock --
  // Recompute on mount, and re-tick once per hour so the number rolls over
  // on the day the birthday passes without needing a restart.
  const [age, setAge] = useState(() => computeAge(initial.birthdate));

  useEffect(() => {
    const id = setInterval(() => {
      setAge(computeAge(initial.birthdate));
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>TRIAGE</Text>
          <Text style={styles.sectionTitle}>The problem{'\n'}in plain sight.</Text>
          <Text style={styles.hint}>
            This is the baseline you are moving away from. Age, weight, height,
            and the lab values your doctor is flagging.
          </Text>
        </View>

        {/* ---- Vitals ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>VITALS</Text>
          <View style={styles.vitalsGrid}>
            <VitalCell label="Age" value={String(age)} />
            <VitalCell label="Height" value={initial.height} />
            <VitalCell label="Starting weight" value={`${initial.startWeight} lb`} />
            <VitalCell label="Current weight" value={`${initial.currentWeight} lb`} />
          </View>
          <View style={styles.modeBox}>
            <Text style={styles.modeLabel}>Active priority mode</Text>
            <Text style={styles.modeValue}>{GOALS[initial.goal].label}</Text>
            <Text style={styles.hint}>{GOALS[initial.goal].status}</Text>
          </View>
        </View>

        {/* ---- Labs ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>LAB VALUES</Text>
          <Text style={styles.hint}>
            Flags are based on your most recent bloodwork. Solid = protective,
            watch = mildly elevated, priority = doctor is flagging this.
          </Text>
          {LABS.map((lab) => (
            <View key={lab.name} style={styles.labRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labName}>
                  {lab.name}: <Text style={styles.labValue}>{lab.value}</Text>
                </Text>
                <Text style={styles.hint}>{lab.note}</Text>
              </View>
              <View style={[styles.flagBadge, { backgroundColor: `${FlagColors[lab.flag]}18` }]}>
                <Text style={[styles.flagText, { color: FlagColors[lab.flag] }]}>
                  {lab.flag === 'bad' ? 'PRIORITY' : lab.flag === 'warn' ? 'WATCH' : 'SOLID'}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------

function VitalCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.vitalCell}>
      <Text style={styles.vitalValue}>{value}</Text>
      <Text style={styles.vitalLabel}>{label}</Text>
    </View>
  );
}

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
  sectionTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -1.5, color: Palette.ink, lineHeight: 30 },
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  vitalCell: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  vitalValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.8, color: Palette.ink },
  vitalLabel: { fontSize: 12, color: Palette.muted, marginTop: 4, letterSpacing: 0.3 },

  modeBox: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(37,103,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(37,103,255,0.18)',
    gap: 4,
  },
  modeLabel: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#254bb7', fontWeight: '800' },
  modeValue: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4, color: Palette.ink },

  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  labName: { fontSize: 14, fontWeight: '700', color: Palette.ink },
  labValue: { fontWeight: '800' },
  flagBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  flagText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
