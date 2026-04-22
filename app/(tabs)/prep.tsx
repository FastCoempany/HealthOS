/**
 * Prep
 *
 * "You bought the groceries. Now prep them without the overwhelm."
 *
 * Sections:
 * 1. Section switcher (Timeline · Ingredients · Containers · Midweek · Quick Ref)
 * 2. Prep Day Timeline
 * 3. Ingredient cards (category-filtered)
 * 4. Container map
 * 5. Midweek check
 * 6. Quick reference cards
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';

import { Palette } from '@/constants/theme';
import {
  INGREDIENT_CARDS,
  PREP_TIMELINE,
  CONTAINER_MAP_4MEAL,
  CONTAINER_MAP_2MEAL,
  MIDWEEK_CHECK,
  QUICK_REFS,
  type IngredientCard,
} from '@/constants/prep-data';
import { type MealMode } from '@/constants/health-data';

type Section = 'timeline' | 'ingredients' | 'containers' | 'midweek' | 'quickref';
type Category = 'All' | IngredientCard['category'];

export default function PrepScreen() {
  const [section, setSection] = useState<Section>('timeline');
  const [category, setCategory] = useState<Category>('All');
  const [mealMode, setMealMode] = useState<MealMode>(4);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [checkedMidweek, setCheckedMidweek] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) =>
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const toggleMidweek = (idx: number) =>
    setCheckedMidweek((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const filteredIngredients =
    category === 'All'
      ? INGREDIENT_CARDS
      : INGREDIENT_CARDS.filter((i) => i.category === category);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header + Meal Toggle ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>PREP</Text>
          <Text style={styles.sectionTitle}>
            You bought the groceries.{'\n'}Now do the prep.
          </Text>
          <Text style={styles.hint}>
            One Sunday session, ~2 hours, covers most of the week. Wednesday is a short check-in for salmon + fresh asparagus.
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

        {/* ---- Section Switcher ---- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabRow}>
            {([
              ['timeline', 'Timeline'],
              ['ingredients', 'Ingredients'],
              ['containers', 'Containers'],
              ['midweek', 'Midweek'],
              ['quickref', 'Quick Ref'],
            ] as [Section, string][]).map(([key, label]) => (
              <Pressable
                key={key}
                style={[styles.tab, section === key && styles.tabActive]}
                onPress={() => setSection(key)}
              >
                <Text style={[styles.tabText, section === key && styles.tabTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* ---- TIMELINE ---- */}
        {section === 'timeline' && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>PREP DAY TIMELINE</Text>
            <Text style={styles.hint}>
              Check each step as you finish it. Ordered by oven/stove timing so nothing waits.
            </Text>
            {PREP_TIMELINE.map((step, idx) => {
              const done = !!checkedSteps[idx];
              return (
                <Pressable
                  key={idx}
                  style={[styles.stepRow, done && styles.stepRowDone]}
                  onPress={() => toggleStep(idx)}
                >
                  <View style={[styles.stepTime, done && styles.stepTimeDone]}>
                    <Text style={[styles.stepTimeText, done && styles.stepTimeTextDone]}>
                      {step.time}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.stepTopLine}>
                      <Text style={[styles.stepTitle, done && styles.stepStrike]}>
                        {step.icon}  {step.title}
                      </Text>
                      <View style={[styles.stepCheck, done && styles.stepCheckDone]}>
                        <Text style={styles.stepCheckText}>{done ? '✓' : ''}</Text>
                      </View>
                    </View>
                    <Text style={styles.stepDetail}>{step.detail}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ---- INGREDIENTS ---- */}
        {section === 'ingredients' && (
          <>
            <View style={styles.card}>
              <Text style={styles.eyebrow}>INGREDIENTS</Text>
              <Text style={styles.hint}>
                Each card: shelf life, cook method, storage, how to tell it's gone bad.
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tabRow}>
                  {(['All', 'Protein', 'Vegetable', 'Carb', 'Fruit', 'Dairy', 'Pantry'] as Category[]).map((c) => (
                    <Pressable
                      key={c}
                      style={[styles.catChip, category === c && styles.catChipActive]}
                      onPress={() => setCategory(c)}
                    >
                      <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
            {filteredIngredients.map((item, idx) => (
              <IngredientCardView key={idx} item={item} />
            ))}
          </>
        )}

        {/* ---- CONTAINERS ---- */}
        {section === 'containers' && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>CONTAINER MAP — {mealMode}-MEAL PLAN</Text>
            <Text style={styles.hint}>
              {mealMode}-meal plan. Label each container with tape + Sharpie. Stack in fridge from front (today) to back (later in week).
            </Text>
            {(mealMode === 2 ? CONTAINER_MAP_2MEAL : CONTAINER_MAP_4MEAL).map((c, idx) => (
              <View key={idx} style={styles.containerCard}>
                <View style={styles.containerLabelRow}>
                  <Text style={styles.containerLabel}>{c.label}</Text>
                  <Text style={styles.containerDay}>{c.day} · {c.meal}</Text>
                </View>
                {c.contents.map((item, i) => (
                  <Text key={i} style={styles.containerItem}>• {item}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ---- MIDWEEK ---- */}
        {section === 'midweek' && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>WEDNESDAY CHECK-IN</Text>
            <Text style={styles.hint}>
              Tap each item as you verify or complete it.
            </Text>
            {MIDWEEK_CHECK.map((item, idx) => {
              const done = !!checkedMidweek[idx];
              return (
                <Pressable
                  key={idx}
                  style={[styles.midweekRow, done && styles.midweekRowDone]}
                  onPress={() => toggleMidweek(idx)}
                >
                  <View style={[styles.stepCheck, done && styles.stepCheckDone]}>
                    <Text style={styles.stepCheckText}>{done ? '✓' : ''}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.midweekTitle, done && styles.stepStrike]}>
                      {item.title}
                    </Text>
                    <Text style={styles.stepDetail}>{item.detail}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ---- QUICK REFERENCE ---- */}
        {section === 'quickref' && (
          <>
            {QUICK_REFS.map((ref, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.eyebrow}>{ref.title.toUpperCase()}</Text>
                {ref.items.map((item, i) => (
                  <View key={i} style={styles.refRow}>
                    <Text style={styles.refLabel}>{item.label}</Text>
                    <Text style={styles.refValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Ingredient card view
// ---------------------------------------------------------------------------

function IngredientCardView({ item }: { item: IngredientCard }) {
  return (
    <View style={styles.ingredientCard}>
      <View style={styles.ingredientHead}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <View style={styles.ingredientCatBadge}>
          <Text style={styles.ingredientCatText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.cookBadgeRow}>
        <View style={[
          styles.cookBadge,
          item.cookOrRaw === 'cook' && styles.cookBadgeCook,
          item.cookOrRaw === 'raw' && styles.cookBadgeRaw,
          item.cookOrRaw === 'either' && styles.cookBadgeEither,
        ]}>
          <Text style={styles.cookBadgeText}>
            {item.cookOrRaw === 'cook' ? 'COOK IT' : item.cookOrRaw === 'raw' ? 'EAT RAW' : 'EITHER'}
          </Text>
        </View>
      </View>

      <View style={styles.shelfBlock}>
        <ShelfLine label="Raw / unopened" value={item.rawLife} />
        <ShelfLine label="Cooked (fridge)" value={item.cookedLife} />
        <ShelfLine label="Freezer" value={item.freezerLife} />
      </View>

      <View style={styles.cookBlock}>
        <Text style={styles.cookHeading}>How to prep</Text>
        <Text style={styles.cookBody}>{item.cookMethod}</Text>
      </View>

      <View style={styles.storageBlock}>
        <Text style={styles.cookHeading}>Storage</Text>
        <Text style={styles.cookBody}>{item.storage}</Text>
      </View>

      <View style={styles.portionBlock}>
        <Text style={styles.portionLabel}>Yield</Text>
        <Text style={styles.portionValue}>{item.portionsPerPrep}</Text>
      </View>

      <View style={styles.badBlock}>
        <Text style={styles.badHeading}>Toss it if you see</Text>
        <Text style={styles.badBody}>{item.goneBadSigns}</Text>
      </View>
    </View>
  );
}

function ShelfLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.shelfLine}>
      <Text style={styles.shelfLabel}>{label}</Text>
      <Text style={styles.shelfValue}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 14 },

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

  // Tabs
  tabRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  tab: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 999, borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  tabActive: { backgroundColor: Palette.orange, borderColor: Palette.orange },
  tabText: { fontSize: 13, fontWeight: '800', color: Palette.ink },
  tabTextActive: { color: '#fff' },

  // Category chips
  catChip: {
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 999, borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  catChipActive: { backgroundColor: Palette.blue, borderColor: Palette.blue },
  catChipText: { fontSize: 12, fontWeight: '700', color: Palette.ink },
  catChipTextActive: { color: '#fff' },

  // Step row
  stepRow: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    padding: 12, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1, borderColor: Palette.line,
  },
  stepRowDone: {
    backgroundColor: 'rgba(30,163,93,0.08)',
    borderColor: 'rgba(30,163,93,0.3)',
  },
  stepTime: {
    minWidth: 52, paddingVertical: 6, paddingHorizontal: 8,
    borderRadius: 10, backgroundColor: 'rgba(37,103,255,0.08)',
    alignItems: 'center',
  },
  stepTimeDone: { backgroundColor: 'rgba(30,163,93,0.18)' },
  stepTimeText: { fontSize: 13, fontWeight: '900', color: '#254bb7' },
  stepTimeTextDone: { color: Palette.green },
  stepTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: Palette.ink, letterSpacing: -0.3, flex: 1 },
  stepDetail: { fontSize: 13, color: Palette.muted, lineHeight: 19, marginTop: 4 },
  stepStrike: { textDecorationLine: 'line-through', color: Palette.muted },
  stepCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Palette.line2,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff',
  },
  stepCheckDone: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  stepCheckText: { fontSize: 12, fontWeight: '900', color: '#fff' },

  // Ingredient card
  ingredientCard: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22, borderWidth: 1, borderColor: Palette.line,
    padding: 16, gap: 12,
  },
  ingredientHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  ingredientName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4, color: Palette.ink, flex: 1 },
  ingredientCatBadge: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 999, backgroundColor: 'rgba(20,23,26,0.06)',
  },
  ingredientCatText: { fontSize: 10, fontWeight: '800', color: Palette.muted, letterSpacing: 1 },

  cookBadgeRow: { flexDirection: 'row' },
  cookBadge: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
  },
  cookBadgeCook: { backgroundColor: 'rgba(235,106,45,0.15)' },
  cookBadgeRaw: { backgroundColor: 'rgba(30,163,93,0.15)' },
  cookBadgeEither: { backgroundColor: 'rgba(37,103,255,0.15)' },
  cookBadgeText: { fontSize: 11, fontWeight: '900', letterSpacing: 1, color: Palette.ink },

  shelfBlock: {
    padding: 12, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.65)',
    gap: 4,
  },
  shelfLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  shelfLabel: { fontSize: 12, color: Palette.muted, fontWeight: '700' },
  shelfValue: { fontSize: 12, color: Palette.ink, fontWeight: '700', flex: 1, textAlign: 'right' },

  cookBlock: { gap: 4 },
  cookHeading: {
    fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
    color: '#7b8590', fontWeight: '800',
  },
  cookBody: { fontSize: 13.5, color: '#283036', lineHeight: 20 },

  storageBlock: { gap: 4 },

  portionBlock: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 10, borderRadius: 12,
    backgroundColor: 'rgba(37,103,255,0.06)',
  },
  portionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#254bb7' },
  portionValue: { fontSize: 13, fontWeight: '800', color: Palette.ink, textAlign: 'right', flex: 1, marginLeft: 10 },

  badBlock: {
    padding: 12, borderRadius: 14,
    backgroundColor: 'rgba(211,78,78,0.06)',
    borderLeftWidth: 3, borderLeftColor: Palette.danger,
    gap: 4,
  },
  badHeading: {
    fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Palette.danger, fontWeight: '800',
  },
  badBody: { fontSize: 13, color: '#5d3030', lineHeight: 19 },

  // Container card
  containerCard: {
    padding: 14, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1, borderColor: Palette.line,
    gap: 6,
  },
  containerLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  containerLabel: {
    fontSize: 14, fontWeight: '900', letterSpacing: 1.5,
    color: Palette.orange,
  },
  containerDay: { fontSize: 12, color: Palette.muted, fontWeight: '700' },
  containerItem: { fontSize: 13, color: '#283036', lineHeight: 20 },

  // Midweek
  midweekRow: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    padding: 12, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1, borderColor: Palette.line,
  },
  midweekRowDone: {
    backgroundColor: 'rgba(30,163,93,0.08)',
    borderColor: 'rgba(30,163,93,0.3)',
  },
  midweekTitle: { fontSize: 14, fontWeight: '800', color: Palette.ink, letterSpacing: -0.2 },

  // Quick reference
  refRow: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Palette.line,
  },
  refLabel: { fontSize: 13, fontWeight: '700', color: Palette.ink, flex: 1 },
  refValue: { fontSize: 13, color: '#283036', fontWeight: '600', flex: 1.5, textAlign: 'right' },
});
