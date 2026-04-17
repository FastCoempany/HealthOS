/**
 * Nutrition
 *
 * "Food plan. Eat exactly what is here."
 *
 * Sections:
 * 1. Header + 2/4 meal toggle
 * 2. Clickable meal cards → /meal/[id]
 * 3. Weekly grocery list (precise, store-ready, toggleable by meal mode)
 * 4. Snack Cheat Section (code-gated, whimsical UI, danger meters)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { Palette } from '@/constants/theme';
import {
  type MealMode,
  type Meal,
  type DangerLevel,
  type CheatSnack,
  planForDay,
  weeklyGroceryList,
  createDefaultState,
  CHEAT_CODE,
  SNACK_CATEGORIES,
} from '@/constants/health-data';

const initial = createDefaultState();

export default function NutritionScreen() {
  const router = useRouter();
  const [mealMode, setMealMode] = useState<MealMode>(initial.mealMode);
  const [selectedDay] = useState(initial.selectedDay);

  // Snack cheat section
  const [cheatInput, setCheatInput] = useState('');
  const [cheatUnlocked, setCheatUnlocked] = useState(false);

  const plan = planForDay(selectedDay, mealMode);
  const grocery = weeklyGroceryList(mealMode, initial.startWeight, initial.hydrationFactor);

  const openMeal = (mealKey: string) => {
    router.push({ pathname: '/meal/[id]', params: { id: mealKey, mealMode: String(mealMode) } });
  };

  const tryCheatCode = useCallback(() => {
    if (cheatInput.trim().toLowerCase() === CHEAT_CODE) {
      setCheatUnlocked(true);
    }
  }, [cheatInput]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header + Toggle ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>NUTRITION ENGINE</Text>
          <Text style={styles.sectionTitle}>
            Food plan.{'\n'}Eat exactly what is here.
          </Text>
          <Text style={styles.hint}>
            Tap any meal below to see exact pictures and portions for that time of day.
          </Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, mealMode === 2 && styles.toggleBtnActive]}
              onPress={() => setMealMode(2)}
            >
              <Text style={[styles.toggleText, mealMode === 2 && styles.toggleTextActive]}>2 meals</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mealMode === 4 && styles.toggleBtnActive]}
              onPress={() => setMealMode(4)}
            >
              <Text style={[styles.toggleText, mealMode === 4 && styles.toggleTextActive]}>4 meals</Text>
            </Pressable>
          </View>
        </View>

        {/* ---- Meal buttons ---- */}
        {plan.meals.map((meal) => (
          <MealButton key={meal.key} meal={meal} onPress={() => openMeal(meal.key)} />
        ))}

        {/* ---- Weekly grocery list ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>WEEKLY GROCERY LIST</Text>
          <Text style={styles.sectionTitle}>
            {mealMode}-meal week
          </Text>
          <Text style={styles.hint}>
            Take this list to the store. Quantities cover 7 full days on the {mealMode}-meal plan.
          </Text>

          {grocery.map((section, sIdx) => (
            <View key={sIdx} style={styles.grocerySection}>
              <Text style={styles.grocerySectionTitle}>{section.section}</Text>
              {section.items.map((item, iIdx) => (
                <View key={iIdx} style={styles.groceryRow}>
                  <View style={styles.groceryQtyBox}>
                    <Text style={styles.groceryQty}>{item.qty}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.groceryName}>{item.name}</Text>
                    <Text style={styles.groceryNote}>{item.note}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* ===========================================================
            SNACK CHEAT SECTION
        =========================================================== */}
        <View style={cheatUnlocked ? styles.cheatCardUnlocked : styles.cheatCardLocked}>
          {!cheatUnlocked ? (
            /* ---- Locked state ---- */
            <View style={styles.cheatLockBox}>
              <Text style={styles.cheatLockEmoji}>{'\uD83D\uDD12'}</Text>
              <Text style={styles.cheatLockTitle}>Snack Cheat Section</Text>
              <Text style={styles.cheatLockHint}>
                Enter the code to unlock hundreds of tasty late-night snacks that won't wreck the plan.
              </Text>
              <View style={styles.cheatInputRow}>
                <TextInput
                  style={styles.cheatInput}
                  placeholder="Enter code..."
                  placeholderTextColor="#999"
                  value={cheatInput}
                  onChangeText={setCheatInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  onSubmitEditing={tryCheatCode}
                />
                <Pressable style={styles.cheatSubmitBtn} onPress={tryCheatCode}>
                  <Text style={styles.cheatSubmitText}>Unlock</Text>
                </Pressable>
              </View>
              {cheatInput.length > 0 && cheatInput.trim().toLowerCase() !== CHEAT_CODE && (
                <Text style={styles.cheatWrongCode}>Nope. Try again.</Text>
              )}
            </View>
          ) : (
            /* ---- Unlocked state — whimsical UI ---- */
            <>
              <View style={styles.cheatHeader}>
                <Text style={styles.cheatHeaderEmoji}>{'\uD83C\uDF1A'}</Text>
                <Text style={styles.cheatHeaderTitle}>The Late Night Lab</Text>
                <Text style={styles.cheatHeaderSub}>
                  You cracked the code. Here are snacks that satisfy the cravings without sabotaging the mission. The danger meter tells you how close to the edge each one lives.
                </Text>
                <DangerLegend />
              </View>

              {SNACK_CATEGORIES.map((cat, cIdx) => (
                <View key={cIdx} style={styles.snackCatBox}>
                  <View style={styles.snackCatHeader}>
                    <Text style={styles.snackCatEmoji}>{cat.emoji}</Text>
                    <Text style={styles.snackCatTitle}>{cat.category}</Text>
                    <Text style={styles.snackCatCount}>{cat.snacks.length}</Text>
                  </View>
                  {cat.snacks.map((snack, sIdx) => (
                    <SnackCard key={sIdx} snack={snack} />
                  ))}
                </View>
              ))}

              <Pressable style={styles.cheatRelockBtn} onPress={() => { setCheatUnlocked(false); setCheatInput(''); }}>
                <Text style={styles.cheatRelockText}>{'\uD83D\uDD12'} Lock it back up</Text>
              </Pressable>
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MealButton({ meal, onPress }: { meal: Meal; onPress: () => void }) {
  const heroImg = meal.items[0]?.imageUrl;
  return (
    <Pressable
      style={({ pressed }) => [styles.mealButton, pressed && styles.mealButtonPressed]}
      onPress={onPress}
    >
      <View style={styles.mealHero}>
        {heroImg ? (
          <Image source={{ uri: heroImg }} style={styles.mealHeroImg} contentFit="cover" />
        ) : (
          <View style={styles.mealHeroPlaceholder} />
        )}
        <View style={styles.mealHeroOverlay}>
          <View style={styles.mealHeroTime}>
            <Text style={styles.mealHeroTimeText}>{meal.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.mealBody}>
        <Text style={styles.mealLabel}>{meal.label}</Text>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealSummary}>
          {meal.items.map((it) => `${it.portion} ${it.name.toLowerCase()}`).join(' · ')}
        </Text>
        <Text style={styles.tapHint}>See exact pictures + portions ›</Text>
      </View>
    </Pressable>
  );
}

function DangerLegend() {
  const levels: { danger: DangerLevel; label: string }[] = [
    { danger: 1, label: 'Safe' },
    { danger: 2, label: 'Fine' },
    { danger: 3, label: 'Easy...' },
    { danger: 4, label: 'Risky' },
    { danger: 5, label: 'Abort' },
  ];
  return (
    <View style={styles.legendRow}>
      {levels.map((l) => (
        <View key={l.danger} style={styles.legendItem}>
          <DangerMeter level={l.danger} />
          <Text style={styles.legendLabel}>{l.label}</Text>
        </View>
      ))}
    </View>
  );
}

function DangerMeter({ level }: { level: DangerLevel }) {
  const colors = ['#1ea35d', '#7ec850', '#f5b731', '#eb6a2d', '#d34e4e'];
  return (
    <View style={styles.meterRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            styles.meterBar,
            {
              backgroundColor: i <= level ? colors[level - 1] : 'rgba(20,23,26,0.08)',
              height: 8 + i * 3,
            },
          ]}
        />
      ))}
    </View>
  );
}

function SnackCard({ snack }: { snack: CheatSnack }) {
  return (
    <View style={styles.snackCard}>
      <View style={styles.snackTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.snackName}>{snack.name}</Text>
          <Text style={styles.snackMeta}>
            {snack.portion}  ·  {snack.calories} cal
          </Text>
        </View>
        <DangerMeter level={snack.danger} />
      </View>
      <Text style={styles.snackWhy}>{snack.why}</Text>
    </View>
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
    borderRadius: 22, borderWidth: 1, borderColor: Palette.line,
    padding: 16, gap: 10,
  },

  eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8a939b', fontWeight: '800' },
  sectionTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -1.2, color: Palette.ink, lineHeight: 30 },
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Toggle
  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  toggleBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)', alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Palette.orange, borderColor: Palette.orange },
  toggleText: { fontSize: 16, fontWeight: '900', color: Palette.ink },
  toggleTextActive: { color: '#fff' },

  // Meal button
  mealButton: {
    borderRadius: 22, borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,250,243,0.96)', overflow: 'hidden',
  },
  mealButtonPressed: { borderColor: Palette.blue2, backgroundColor: 'rgba(37,103,255,0.05)' },
  mealHero: { width: '100%', height: 160, position: 'relative' },
  mealHeroImg: { ...StyleSheet.absoluteFillObject },
  mealHeroPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#e7dfd0' },
  mealHeroOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,22,27,0.18)',
    padding: 14, justifyContent: 'flex-start', alignItems: 'flex-end',
  },
  mealHeroTime: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.95)',
  },
  mealHeroTimeText: { fontSize: 12, fontWeight: '900', color: '#254bb7' },
  mealBody: { padding: 16, gap: 6 },
  mealLabel: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Palette.orange, fontWeight: '800' },
  mealTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.6, color: Palette.ink },
  mealSummary: { fontSize: 13, color: Palette.muted, lineHeight: 19 },
  tapHint: { marginTop: 6, fontSize: 12, fontWeight: '800', color: Palette.blue, letterSpacing: 0.5 },

  // Grocery list
  grocerySection: { gap: 8, marginTop: 8 },
  grocerySectionTitle: {
    fontSize: 14, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase',
    color: Palette.orange, paddingBottom: 4,
    borderBottomWidth: 2, borderBottomColor: 'rgba(235,106,45,0.25)',
  },
  groceryRow: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Palette.line,
  },
  groceryQtyBox: {
    minWidth: 100, paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 8, backgroundColor: 'rgba(37,103,255,0.06)',
  },
  groceryQty: { fontSize: 13, fontWeight: '800', color: '#254bb7' },
  groceryName: { fontSize: 14, fontWeight: '700', color: Palette.ink },
  groceryNote: { fontSize: 12, color: Palette.muted, lineHeight: 17, marginTop: 2 },

  // Snack cheat — locked
  cheatCardLocked: {
    borderRadius: 22, borderWidth: 2, borderColor: 'rgba(20,23,26,0.12)',
    borderStyle: 'dashed', padding: 24, alignItems: 'center',
    backgroundColor: 'rgba(20,23,26,0.03)',
  },
  cheatLockBox: { alignItems: 'center', gap: 12, maxWidth: 300 },
  cheatLockEmoji: { fontSize: 48 },
  cheatLockTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5, color: Palette.ink, textAlign: 'center' },
  cheatLockHint: { fontSize: 13, color: Palette.muted, textAlign: 'center', lineHeight: 19 },
  cheatInputRow: { flexDirection: 'row', gap: 8, width: '100%' },
  cheatInput: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 16, borderWidth: 1, borderColor: Palette.line,
    backgroundColor: '#fff', fontSize: 16, color: Palette.ink,
  },
  cheatSubmitBtn: {
    paddingVertical: 12, paddingHorizontal: 18,
    borderRadius: 16, backgroundColor: Palette.ink,
  },
  cheatSubmitText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  cheatWrongCode: { fontSize: 12, color: Palette.danger, fontWeight: '700' },

  // Snack cheat — unlocked
  cheatCardUnlocked: {
    borderRadius: 28, borderWidth: 2, borderColor: 'rgba(198,149,47,0.35)',
    padding: 0, overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  cheatHeader: {
    padding: 24, gap: 10, alignItems: 'center',
    backgroundColor: 'rgba(198,149,47,0.12)',
  },
  cheatHeaderEmoji: { fontSize: 56 },
  cheatHeaderTitle: {
    fontSize: 28, fontWeight: '900', letterSpacing: -1, color: '#f0e6d0', textAlign: 'center',
  },
  cheatHeaderSub: { fontSize: 13, color: 'rgba(240,230,208,0.7)', textAlign: 'center', lineHeight: 19 },

  // Legend
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 8 },
  legendItem: { alignItems: 'center', gap: 4 },
  legendLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(240,230,208,0.5)', letterSpacing: 0.5 },

  // Danger meter
  meterRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  meterBar: { width: 5, borderRadius: 2 },

  // Snack category
  snackCatBox: { padding: 16, gap: 8 },
  snackCatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(240,230,208,0.12)',
  },
  snackCatEmoji: { fontSize: 22 },
  snackCatTitle: { fontSize: 16, fontWeight: '800', color: '#f0e6d0', flex: 1 },
  snackCatCount: {
    fontSize: 11, fontWeight: '800', color: 'rgba(240,230,208,0.4)',
    paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999,
    backgroundColor: 'rgba(240,230,208,0.08)',
  },

  // Snack card
  snackCard: {
    padding: 12, borderRadius: 16,
    backgroundColor: 'rgba(240,230,208,0.06)',
    borderWidth: 1, borderColor: 'rgba(240,230,208,0.08)',
    gap: 6,
  },
  snackTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  snackName: { fontSize: 15, fontWeight: '800', color: '#f0e6d0', letterSpacing: -0.3 },
  snackMeta: { fontSize: 12, color: 'rgba(240,230,208,0.5)', marginTop: 2, fontWeight: '600' },
  snackWhy: { fontSize: 13, color: 'rgba(240,230,208,0.65)', lineHeight: 18, fontStyle: 'italic' },

  // Re-lock button
  cheatRelockBtn: {
    margin: 16, marginTop: 8, paddingVertical: 14,
    borderRadius: 16, alignItems: 'center',
    backgroundColor: 'rgba(240,230,208,0.08)',
    borderWidth: 1, borderColor: 'rgba(240,230,208,0.15)',
  },
  cheatRelockText: { fontSize: 14, fontWeight: '800', color: 'rgba(240,230,208,0.6)' },
});
