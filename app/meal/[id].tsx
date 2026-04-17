/**
 * Meal Detail — /meal/[id]
 *
 * Shows the exact pictures and portions for a single meal.
 * Pushed from the Nutrition page; presents each food item as a large
 * card with a photo, portion size, plain-english portion hint, and
 * the full description from the plan.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { Palette } from '@/constants/theme';
import {
  type MealMode,
  type FoodItem,
  planForDay,
  createDefaultState,
} from '@/constants/health-data';

const initial = createDefaultState();

const MACRO_TAGS = ['Protein anchored', 'Fiber heavy', 'No bread', 'No added sugar', 'Low sodium'];

export default function MealDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; mealMode?: string }>();

  const mealMode: MealMode = (params.mealMode === '2' ? 2 : 4) as MealMode;
  const plan = planForDay(initial.selectedDay, mealMode);
  const meal = plan.meals.find((m) => m.key === params.id);

  if (!meal) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundTitle}>Meal not found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: meal.label,
          headerBackTitle: 'Nutrition',
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header ---- */}
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>{meal.label.toUpperCase()} · {meal.time}</Text>
          <Text style={styles.sectionTitle}>{meal.title}</Text>
          <View style={styles.headerMeta}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>{meal.items.length} items</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>{mealMode}-meal plan</Text>
            </View>
          </View>
        </View>

        {/* ---- Food items ---- */}
        {meal.items.map((item, idx) => (
          <FoodCard key={idx} item={item} index={idx + 1} total={meal.items.length} />
        ))}

        {/* ---- Drink lane ---- */}
        <View style={styles.drinkLane}>
          <Text style={styles.drinkTitle}>{'\uD83D\uDCA7'} Drink option</Text>
          <Text style={styles.drinkWhy}>{meal.drink}</Text>
        </View>

        {/* ---- Macro rules ---- */}
        <View style={styles.macroCard}>
          <Text style={styles.eyebrow}>MEAL RULES</Text>
          <View style={styles.macroRow}>
            {MACRO_TAGS.map((tag, idx) => (
              <View key={idx} style={styles.macroTag}>
                <Text style={styles.macroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---- Back button ---- */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹ Back to Nutrition</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Food card — photo + portion + description
// ---------------------------------------------------------------------------

function FoodCard({ item, index, total }: { item: FoodItem; index: number; total: number }) {
  return (
    <View style={styles.foodCard}>
      {/* Photo */}
      <View style={styles.foodImageBox}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.foodImage} contentFit="cover" />
        ) : (
          <View style={styles.foodImagePlaceholder} />
        )}
        <View style={styles.foodImageBadge}>
          <Text style={styles.foodImageBadgeText}>{index} / {total}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.foodBody}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.portionRow}>
          <Text style={styles.portionSize}>{item.portion}</Text>
          <Text style={styles.portionHint}>{item.portionHint}</Text>
        </View>
        <Text style={styles.foodDesc}>{item.description}</Text>
      </View>
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

  eyebrow: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8a939b', fontWeight: '800' },
  sectionTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -1.5, color: Palette.ink, lineHeight: 32 },

  headerCard: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 18,
    gap: 10,
  },
  headerMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  metaPill: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 999, backgroundColor: 'rgba(37,103,255,0.08)',
  },
  metaPillText: { fontSize: 12, fontWeight: '800', color: '#254bb7' },

  // Food card
  foodCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,250,243,0.96)',
    overflow: 'hidden',
  },
  foodImageBox: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#e7dfd0',
  },
  foodImage: { ...StyleSheet.absoluteFillObject },
  foodImagePlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#e7dfd0' },
  foodImageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(20,23,26,0.8)',
  },
  foodImageBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  foodBody: { padding: 16, gap: 8 },
  foodName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, color: Palette.ink },
  portionRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  portionSize: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: Palette.orange,
  },
  portionHint: { fontSize: 13, color: Palette.muted, fontStyle: 'italic', flexShrink: 1 },
  foodDesc: { fontSize: 14, color: '#283036', lineHeight: 21, marginTop: 4 },

  // Drink lane
  drinkLane: {
    padding: 16, borderRadius: 20,
    backgroundColor: 'rgba(237,247,255,0.92)',
    borderWidth: 1, borderColor: 'rgba(86,166,255,0.18)',
    gap: 6,
  },
  drinkTitle: { fontSize: 15, fontWeight: '900', letterSpacing: -0.2, color: Palette.ink },
  drinkWhy: { fontSize: 13.5, color: Palette.muted, lineHeight: 20 },

  // Macro
  macroCard: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 16,
    gap: 10,
  },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  macroTag: {
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 999, backgroundColor: 'rgba(20,23,26,0.05)',
  },
  macroTagText: { fontSize: 12, color: '#42505a', fontWeight: '600' },

  // Back button
  backBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  backBtnText: { fontSize: 14, fontWeight: '800', color: Palette.ink },

  // Not found
  notFoundBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 16 },
  notFoundTitle: { fontSize: 20, fontWeight: '800', color: Palette.ink },
});
