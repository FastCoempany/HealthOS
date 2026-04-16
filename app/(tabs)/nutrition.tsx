/**
 * FACE 2 — Nutrition
 *
 * "Food plan. Eat exactly what is here."
 * Shows: 2/4 meal toggle, full meal cards with items + drink lanes + macro tags,
 * grocery companion weekly list, and shop shortcuts (Amazon / Walmart / Instacart).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  SafeAreaView,
} from 'react-native';

import { Palette } from '@/constants/theme';
import {
  type MealMode,
  type Meal,
  planForDay,
  waterOz,
  bottleCount,
  groceryList,
  createDefaultState,
} from '@/constants/health-data';

const initial = createDefaultState();

// ---------------------------------------------------------------------------
// Shop search helpers
// ---------------------------------------------------------------------------

const SEARCH_URLS: Record<string, string> = {
  Amazon: 'https://www.amazon.com/s?k=',
  Walmart: 'https://www.walmart.com/search?q=',
  Instacart: 'https://www.instacart.com/store/s?k=',
};

interface ShopItem {
  label: string;
  searches: { store: string; term: string }[];
}

const SHOP_ITEMS: ShopItem[] = [
  { label: 'Chicken breast / turkey', searches: [{ store: 'Amazon', term: 'boneless skinless chicken breast' }, { store: 'Walmart', term: '99% lean ground turkey' }, { store: 'Instacart', term: 'turkey breast' }] },
  { label: 'Tuna in water / white fish', searches: [{ store: 'Amazon', term: 'low sodium tuna in water' }, { store: 'Walmart', term: 'frozen cod fillets' }, { store: 'Instacart', term: 'tuna in water no salt' }] },
  { label: 'Fat-free Greek yogurt / egg whites', searches: [{ store: 'Amazon', term: 'fat free greek yogurt' }, { store: 'Walmart', term: 'carton egg whites' }, { store: 'Instacart', term: 'fat free greek yogurt plain' }] },
  { label: 'Beans / lentils / sweet potatoes', searches: [{ store: 'Amazon', term: 'no salt added black beans' }, { store: 'Walmart', term: 'dry lentils' }, { store: 'Instacart', term: 'sweet potatoes produce' }] },
  { label: 'Vegetables', searches: [{ store: 'Instacart', term: 'broccoli produce' }, { store: 'Walmart', term: 'frozen green beans no sauce' }, { store: 'Instacart', term: 'spinach produce' }] },
  { label: 'Fruit / berries', searches: [{ store: 'Instacart', term: 'berries produce' }, { store: 'Walmart', term: 'apples produce' }, { store: 'Instacart', term: 'oranges produce' }] },
  { label: 'Sparkling water / unsweet tea', searches: [{ store: 'Amazon', term: 'unsweet sparkling water' }, { store: 'Walmart', term: 'unsweet iced tea' }, { store: 'Instacart', term: 'sparkling water case' }] },
  { label: 'Optional psyllium', searches: [{ store: 'Amazon', term: 'psyllium husk powder' }, { store: 'Walmart', term: 'psyllium fiber supplement' }, { store: 'Instacart', term: 'psyllium husk powder' }] },
];

const FOOD_EMOJIS = ['\uD83C\uDF57', '\uD83E\uDD66', '\uD83E\uDED8', '\uD83C\uDF4E', '\uD83E\uDD63', '\uD83E\uDD55'];
const MACRO_TAGS = ['Protein anchored', 'Fiber heavy', 'No bread', 'No added sugar', 'Low sodium'];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function NutritionScreen() {
  const [mealMode, setMealMode] = useState<MealMode>(initial.mealMode);
  const [selectedDay] = useState(initial.selectedDay);

  const plan = planForDay(selectedDay, mealMode);
  const startWeight = initial.startWeight;
  const hydrationFactor = initial.hydrationFactor;
  const grocery = groceryList(mealMode, startWeight, hydrationFactor);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ---- Header + Toggle ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>NUTRITION ENGINE</Text>
          <Text style={styles.sectionTitle}>
            Food plan.{'\n'}Eat exactly what is here.
          </Text>

          {/* 2/4 meal toggle */}
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, mealMode === 2 && styles.toggleBtnActive]}
              onPress={() => setMealMode(2)}
            >
              <Text style={[styles.toggleText, mealMode === 2 && styles.toggleTextActive]}>
                2 meals
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mealMode === 4 && styles.toggleBtnActive]}
              onPress={() => setMealMode(4)}
            >
              <Text style={[styles.toggleText, mealMode === 4 && styles.toggleTextActive]}>
                4 meals
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ---- Meal cards ---- */}
        {plan.meals.map((meal) => (
          <MealCard key={meal.key} meal={meal} />
        ))}

        {/* ---- Grocery companion ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>GROCERY COMPANION + SHOP SHORTCUTS</Text>
          <Text style={styles.hint}>
            The list below shifts with 2 meals vs 4 meals. The shortcuts open actual search result pages.
          </Text>

          <View style={styles.groceryHeader}>
            <Text style={styles.groceryTitle}>{mealMode}-meal week list</Text>
            <Text style={styles.hint}>
              This is the boring weekly load-out that supports the exact meals shown above.
            </Text>
          </View>

          {/* Brand logos row */}
          <View style={styles.brandRow}>
            <View style={[styles.brandLogo, { backgroundColor: '#131921' }]}>
              <Text style={styles.brandLogoText}>Amazon</Text>
            </View>
            <View style={[styles.brandLogo, { backgroundColor: '#0071dc' }]}>
              <Text style={styles.brandLogoText}>Walmart</Text>
            </View>
            <View style={[styles.brandLogo, { backgroundColor: '#43b02a' }]}>
              <Text style={styles.brandLogoText}>Instacart</Text>
            </View>
          </View>

          {/* Weekly items */}
          {grocery.map((item, idx) => (
            <View key={idx} style={styles.weekItem}>
              <View style={styles.weekIcon}>
                <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.weekLabel}>{item.label}</Text>
                <Text style={styles.hint}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ---- Shop shortcuts ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>QUICK ORDER LINKS</Text>
          {SHOP_ITEMS.map((item, idx) => (
            <View key={idx} style={styles.orderCard}>
              <Text style={styles.orderLabel}>{item.label}</Text>
              <View style={styles.linkRow}>
                {item.searches.map((s, si) => (
                  <Pressable
                    key={si}
                    style={styles.shopLink}
                    onPress={() => Linking.openURL(SEARCH_URLS[s.store] + encodeURIComponent(s.term))}
                  >
                    <Text style={styles.shopLinkText}>{s.store}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Meal card component
// ---------------------------------------------------------------------------

function MealCard({ meal }: { meal: Meal }) {
  return (
    <View style={styles.mealCard}>
      {/* Head */}
      <View style={styles.mealHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mealLabel}>{meal.label}</Text>
          <Text style={styles.hint}>{meal.title}</Text>
        </View>
        <View style={styles.timeChip}>
          <Text style={styles.timeChipText}>{meal.time}</Text>
        </View>
      </View>

      {/* Food items */}
      {meal.items.map((item, idx) => (
        <View key={idx} style={styles.foodItem}>
          <View style={styles.foodIcon}>
            <Text style={{ fontSize: 14 }}>{FOOD_EMOJIS[idx % FOOD_EMOJIS.length]}</Text>
          </View>
          <Text style={styles.foodCopy}>{item}</Text>
        </View>
      ))}

      {/* Drink lane */}
      <View style={styles.drinkLane}>
        <Text style={styles.drinkTitle}>{'\uD83D\uDCA7'} Drink option</Text>
        <Text style={styles.drinkWhy}>{meal.drink}</Text>
      </View>

      {/* Macro tags */}
      <View style={styles.macroRow}>
        {MACRO_TAGS.map((tag, idx) => (
          <View key={idx} style={styles.macroTag}>
            <Text style={styles.macroTagText}>{tag}</Text>
          </View>
        ))}
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
  miniHead: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#7b8590', fontWeight: '800' },
  hint: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Toggle
  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Palette.orange,
    borderColor: Palette.orange,
  },
  toggleText: { fontSize: 16, fontWeight: '900', color: Palette.ink },
  toggleTextActive: { color: '#fff' },

  // Meal card
  mealCard: {
    backgroundColor: 'rgba(255,250,243,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    padding: 16,
    gap: 12,
  },
  mealHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  mealLabel: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  timeChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(37,103,255,0.08)',
  },
  timeChipText: { fontSize: 12, fontWeight: '800', color: '#254bb7' },

  // Food items
  foodItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  foodIcon: {
    width: 26,
    height: 26,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30,163,93,0.09)',
  },
  foodCopy: { flex: 1, fontSize: 14, color: '#283036', lineHeight: 20 },

  // Drink lane
  drinkLane: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(237,247,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(86,166,255,0.18)',
    gap: 6,
  },
  drinkTitle: { fontSize: 14, fontWeight: '900', letterSpacing: -0.2, color: Palette.ink },
  drinkWhy: { fontSize: 13, color: Palette.muted, lineHeight: 19 },

  // Macro tags
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  macroTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(20,23,26,0.05)',
  },
  macroTagText: { fontSize: 12, color: '#42505a' },

  // Grocery companion
  groceryHeader: { gap: 4 },
  groceryTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  brandRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  brandLogo: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    minWidth: 88,
    alignItems: 'center',
  },
  brandLogoText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: -0.3 },

  weekItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  weekIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30,163,93,0.16)',
  },
  weekLabel: { fontSize: 14, fontWeight: '800', color: Palette.ink },

  // Shop shortcuts
  orderCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.55)',
    gap: 8,
  },
  orderLabel: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shopLink: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(37,103,255,0.08)',
  },
  shopLinkText: { fontSize: 12, fontWeight: '800', color: '#2448a6' },
});
