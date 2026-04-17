/**
 * Nutrition
 *
 * "Food plan. Eat exactly what is here."
 *
 * Each meal is a big clickable card that routes to /meal/[id] where the user
 * sees exact pictures and portions for that meal. The 2/4 meal toggle, grocery
 * companion, and shop shortcuts remain on this page.
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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { Palette } from '@/constants/theme';
import {
  type MealMode,
  type Meal,
  planForDay,
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

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function NutritionScreen() {
  const router = useRouter();
  const [mealMode, setMealMode] = useState<MealMode>(initial.mealMode);
  const [selectedDay] = useState(initial.selectedDay);

  const plan = planForDay(selectedDay, mealMode);
  const startWeight = initial.startWeight;
  const hydrationFactor = initial.hydrationFactor;
  const grocery = groceryList(mealMode, startWeight, hydrationFactor);

  const openMeal = (mealKey: string) => {
    router.push({ pathname: '/meal/[id]', params: { id: mealKey, mealMode: String(mealMode) } });
  };

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
            Tap any meal below to see the exact pictures and portions for that time of day.
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

        {/* ---- Meal buttons ---- */}
        {plan.meals.map((meal) => (
          <MealButton key={meal.key} meal={meal} onPress={() => openMeal(meal.key)} />
        ))}

        {/* ---- Grocery companion ---- */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>GROCERY COMPANION</Text>
          <Text style={styles.hint}>
            The list below shifts with 2 meals vs 4 meals.
          </Text>

          <View style={styles.groceryHeader}>
            <Text style={styles.groceryTitle}>{mealMode}-meal week list</Text>
            <Text style={styles.hint}>
              The boring weekly load-out that supports the exact meals shown above.
            </Text>
          </View>

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
// Meal button — big clickable card
// ---------------------------------------------------------------------------

function MealButton({ meal, onPress }: { meal: Meal; onPress: () => void }) {
  // Use the first food item's image as the meal hero shot.
  const heroImg = meal.items[0]?.imageUrl;

  return (
    <Pressable
      style={({ pressed }) => [styles.mealButton, pressed && styles.mealButtonPressed]}
      onPress={onPress}
    >
      {/* Hero image strip */}
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

      {/* Body */}
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

  // Toggle
  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  toggleBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Palette.orange, borderColor: Palette.orange },
  toggleText: { fontSize: 16, fontWeight: '900', color: Palette.ink },
  toggleTextActive: { color: '#fff' },

  // Meal button
  mealButton: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.line,
    backgroundColor: 'rgba(255,250,243,0.96)',
    overflow: 'hidden',
  },
  mealButtonPressed: {
    borderColor: Palette.blue2,
    backgroundColor: 'rgba(37,103,255,0.05)',
  },
  mealHero: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  mealHeroImg: { ...StyleSheet.absoluteFillObject },
  mealHeroPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#e7dfd0' },
  mealHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,22,27,0.18)',
    padding: 14,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  mealHeroTime: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  mealHeroTimeText: { fontSize: 12, fontWeight: '900', color: '#254bb7' },

  mealBody: { padding: 16, gap: 6 },
  mealLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Palette.orange,
    fontWeight: '800',
  },
  mealTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.6, color: Palette.ink },
  mealSummary: { fontSize: 13, color: Palette.muted, lineHeight: 19 },
  tapHint: { marginTop: 6, fontSize: 12, fontWeight: '800', color: Palette.blue, letterSpacing: 0.5 },

  // Grocery companion
  groceryHeader: { gap: 4 },
  groceryTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },

  weekItem: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    padding: 12, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1, borderColor: Palette.line,
  },
  weekIcon: {
    width: 32, height: 32, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(30,163,93,0.16)',
  },
  weekLabel: { fontSize: 14, fontWeight: '800', color: Palette.ink },

  // Shop
  brandRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  brandLogo: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 12, minWidth: 88, alignItems: 'center',
  },
  brandLogoText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: -0.3 },

  orderCard: {
    padding: 14, borderRadius: 18,
    borderWidth: 1, borderColor: Palette.line,
    backgroundColor: 'rgba(255,255,255,0.55)', gap: 8,
  },
  orderLabel: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: Palette.ink },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shopLink: {
    paddingVertical: 7, paddingHorizontal: 10,
    borderRadius: 999, backgroundColor: 'rgba(37,103,255,0.08)',
  },
  shopLinkText: { fontSize: 12, fontWeight: '800', color: '#2448a6' },
});
