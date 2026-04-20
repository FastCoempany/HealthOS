/**
 * Slow Roll Health OS — Core data layer
 * Ported from rotaryhtml_03APR26.html
 *
 * 60-day structured health directive program.
 * 4 phases × 15 days. No mystery. Just a cleaner escalation.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GoalKey = 'stability' | 'fatloss' | 'sugar' | 'heart';
export type MealMode = 2 | 4;
export type Phase = 1 | 2 | 3 | 4;
export type LabFlag = 'good' | 'bad' | 'warn';

export interface Goal {
  label: string;
  x: number; // hydration factor (oz per lb of body weight)
  meals: MealMode;
  tip: string;
  status: string;
}

export interface Lab {
  name: string;
  value: string;
  flag: LabFlag;
  note: string;
}

export interface Meal {
  key: string;
  label: string;
  time: string;
  title: string;
  items: FoodItem[];
  drink: string;
}

export interface FoodItem {
  name: string;          // short display name (e.g. "Grilled chicken breast")
  portion: string;       // the exact portion (e.g. "8 oz")
  description: string;   // full description from the original plan
  imageUrl: string;      // photo URL for the food
  portionHint: string;   // a visual/plain-english equivalent (e.g. "roughly a deck of cards")
}

export interface MovementPlan {
  warmup: string;
  treadmill: string;
  strength: string;
}

export interface DayPlan {
  phase: Phase;
  movement: MovementPlan;
  meals: Meal[];
  movementTime: string;
}

export interface DayState {
  day: number;
  closed: boolean;
  done: Record<string, boolean>;
}

export interface AppState {
  height: string;
  startWeight: number;
  currentWeight: number;
  /**
   * ISO date string (YYYY-MM-DD). Kept backend-only — the UI shows the computed
   * age, never the birthdate itself.
   */
  birthdate: string;
  selectedDay: number;
  mealMode: MealMode;
  goal: GoalKey;
  hydrationFactor: number;
  days: DayState[];
}

export interface TimelineItem {
  key: string;
  time: string;
  title: string;
  copy: string;
}

export interface ArcPhase {
  days: string;
  title: string;
  copy: string;
}

export interface GroceryItem {
  emoji: string;
  label: string;
  detail: string;
}

export interface MotionRef {
  title: string;
  source: string;
  blurb: string;
}

export interface GuardrailItem {
  title: string;
  copy: string;
}

export type MotionKey =
  | 'march' | 'shoulder' | 'ankle' | 'sit' | 'chest' | 'hall'
  | 'treadmill' | 'wallPush' | 'inclinePush' | 'calf' | 'split';

export interface MotionRef {
  title: string;
  source: string;
  guide: string;
  blurb: string;
}

export interface RoutineCardData {
  title: string;
  defaultKey: MotionKey;
  copy: string;
  keys: MotionKey[];
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export const GOALS: Record<GoalKey, Goal> = {
  stability: {
    label: 'Stability first',
    x: 0.50,
    meals: 4,
    tip: 'Sets hydration x to 0.50, recommends 4 meals, and treats boring compliance as the victory condition.',
    status: 'Steadier rhythm. Less swing. More repeatability.',
  },
  fatloss: {
    label: 'Fat loss priority',
    x: 0.48,
    meals: 2,
    tip: 'Leans toward 2 meals, slightly tighter hydration x, larger plates, lower decision count.',
    status: 'Fewer decisions. Bigger protein plates. Cleaner deficit.',
  },
  sugar: {
    label: 'Blood sugar focus',
    x: 0.52,
    meals: 4,
    tip: 'Sets x to 0.52, recommends 4 meals, and tightens carb portions to steady energy and appetite.',
    status: 'Smaller carb loads, more even spacing, steadier appetite.',
  },
  heart: {
    label: 'Heart + BP focus',
    x: 0.50,
    meals: 4,
    tip: 'Keeps x at 0.50, holds sodium low, and emphasizes lean protein, fiber, and repetitive meal quality.',
    status: 'Lower sodium. Higher fiber. Less saturated fat nonsense.',
  },
};

// ---------------------------------------------------------------------------
// Labs (baseline blood work)
// ---------------------------------------------------------------------------

export const LABS: Lab[] = [
  { name: 'A1c', value: '6.2%', flag: 'bad', note: 'Prediabetic range' },
  { name: 'LDL', value: '148', flag: 'bad', note: 'High' },
  { name: 'Total cholesterol', value: '235', flag: 'bad', note: 'High' },
  { name: 'HDL', value: '63', flag: 'good', note: 'Protective' },
  { name: 'Triglycerides', value: '121', flag: 'good', note: 'Normal' },
  { name: 'ALT', value: '58', flag: 'warn', note: 'Mildly elevated' },
];

// ---------------------------------------------------------------------------
// 60-day arc
// ---------------------------------------------------------------------------

export const ARC_PHASES: ArcPhase[] = [
  { days: 'Days 1-15', title: 'Establish the floor', copy: 'Daily warm-up. Easy treadmill. One-round strength. Win by repetition.' },
  { days: 'Days 16-30', title: 'Build the groove', copy: 'Longer walk. Slightly firmer pace. 1-2 rounds of strength.' },
  { days: 'Days 31-45', title: 'Earn some range', copy: 'More total walking. Two real rounds. Still conversational.' },
  { days: 'Days 46-60', title: 'Make it normal', copy: 'Brisker walking, fuller strength, same boring food discipline.' },
];

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

export const GUARDRAILS: GuardrailItem[] = [
  { title: 'Breathing first', copy: 'Warm up before the treadmill. If breathing goes outside your normal asthma lane, back off.' },
  { title: 'Talk-test pace', copy: 'If you cannot say a short sentence, the treadmill is too hot for this phase.' },
  { title: 'No heroics', copy: 'The win is showing up tomorrow. Not pretending you are in a sports movie tonight.' },
  { title: 'Food plan stays clean', copy: 'No bread. No fried food. No added sugar. No added salt. No liquid calories trying to sneak in.' },
];

// ---------------------------------------------------------------------------
// Age (computed from birthdate — never shows the birthdate itself)
// ---------------------------------------------------------------------------

/**
 * Compute integer age in full years from an ISO date string.
 * `now` is injectable so the "clock" re-evaluates on every render and the
 * number ticks up the day a birthday passes.
 */
export function computeAge(birthdate: string, now: Date = new Date()): number {
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return 0;
  let age = now.getFullYear() - b.getFullYear();
  const monthDiff = now.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) {
    age -= 1;
  }
  return age;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function phaseForDay(day: number): Phase {
  if (day <= 15) return 1;
  if (day <= 30) return 2;
  if (day <= 45) return 3;
  return 4;
}

export function isWeighDay(day: number): boolean {
  return [15, 30, 45, 60].includes(day);
}

export function waterOz(startWeight: number, hydrationFactor: number): number {
  return Math.round(startWeight * hydrationFactor);
}

export function bottleCount(startWeight: number, hydrationFactor: number): string {
  return (waterOz(startWeight, hydrationFactor) / 16.9).toFixed(1);
}

export function blockForDay(day: number): number {
  return Math.floor((day - 1) / 15);
}

export function daysInBlock(block: number): { start: number; end: number } {
  return { start: block * 15 + 1, end: block * 15 + 15 };
}

// ---------------------------------------------------------------------------
// Movement plans by phase
// ---------------------------------------------------------------------------

const MOVEMENT_BY_PHASE: Record<Phase, MovementPlan> = {
  1: {
    warmup: '6 min pre-walk warm-up: 1 min easy march, 1 min shoulder rolls, 1 min ankle circles, 1 min sit-to-stand, 1 min wall chest opener, 1 min hallway walk',
    treadmill: '12-18 min easy walk · 2.2-2.8 mph · 0% incline · full talk pace',
    strength: '1 round · wall push-ups 6 · sit-to-stand 6 · calf raises 8 · march 20 sec',
  },
  2: {
    warmup: '7 min pre-walk warm-up: easy march, shoulder rolls, ankle circles, chair stands, chest opener, short walk',
    treadmill: '18-22 min easy-to-brisk walk · 2.4-3.0 mph · 0% incline · still talkable',
    strength: '1-2 rounds · wall push-ups 8 · sit-to-stand 8 · calf raises 10 · march 30 sec',
  },
  3: {
    warmup: '8 min pre-walk warm-up: same sequence with a little more range',
    treadmill: '22-28 min brisk walk · 2.8-3.3 mph · 0-1% incline only if easy',
    strength: '2 rounds · incline push-ups 8 · sit-to-stand 10 · calf raises 12 · march 35 sec',
  },
  4: {
    warmup: '8-10 min pre-walk warm-up: same sequence with smoother tempo',
    treadmill: '28-35 min brisk walk · 3.0-3.5 mph · 0-1% incline only if breathing stays calm',
    strength: '2 rounds · incline push-ups 10 · split squat to chair 6/side · calf raises 15 · march 40 sec',
  },
};

// ---------------------------------------------------------------------------
// Meal plans
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Food image library (Unsplash URLs — stable, free, and swap-friendly)
// Replace these with real photography later.
// ---------------------------------------------------------------------------

const IMG = {
  chicken:     'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
  vegetables:  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
  beans:       'https://images.unsplash.com/photo-1604935197115-8f94a1c8e142?w=800&q=80',
  sweetPotato: 'https://images.unsplash.com/photo-1596097635121-14b38c5d7a55?w=800&q=80',
  fruit:       'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800&q=80',
  blueberries: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80',
  eggWhites:   'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
  yogurt:      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  sardines:    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
  salmon:      'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80',
  salad:       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  fish:        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
  edamame:     'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=800&q=80',
  psyllium:    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
};

function meals2(): Meal[] {
  return [
    {
      key: 'meal1', label: 'Meal 1', time: '12:00 PM', title: 'Protein plate + produce',
      items: [
        { name: 'Lean protein', portion: '8 oz', description: 'Grilled chicken breast, turkey breast, wild salmon, or sardines',
          imageUrl: IMG.chicken, portionHint: 'About the size of your palm + fingers' },
        { name: 'Vegetables', portion: '2 cups', description: 'Broccoli, green beans, spinach, asparagus, purple cabbage, or mixed vegetables',
          imageUrl: IMG.vegetables, portionHint: 'Roughly two clenched fists' },
        { name: 'Smart carb', portion: '1 cup or 1 medium', description: 'Lentils, black beans, OR 1 medium sweet potato',
          imageUrl: IMG.beans, portionHint: 'One closed fist' },
        { name: 'Fruit', portion: '1 piece', description: 'Apple, orange, or 1 cup blueberries',
          imageUrl: IMG.fruit, portionHint: 'One whole piece, or a cupped hand of blueberries' },
      ],
      drink: 'Drink lane: 16.9-24 oz water or sparkling water. Hydration helps appetite control, bowel regularity, and exercise tolerance.',
    },
    {
      key: 'meal2', label: 'Meal 2', time: '6:30 PM', title: 'Protein plate + salad',
      items: [
        { name: 'Lean protein (again)', portion: '8 oz', description: 'Chicken, turkey, shrimp, wild salmon, or 99% lean ground turkey',
          imageUrl: IMG.chicken, portionHint: 'About the size of your palm + fingers' },
        { name: 'Salad or vegetables', portion: '2 cups cooked or huge salad bowl', description: 'Large bowl of salad greens, or 2 cups cooked vegetables',
          imageUrl: IMG.salad, portionHint: 'Fill the plate. Twice.' },
        { name: 'Smart carb (optional)', portion: '1 cup or 1 medium', description: 'Beans OR 1 medium sweet potato if you skipped it earlier',
          imageUrl: IMG.sweetPotato, portionHint: 'One closed fist' },
        { name: 'Greek yogurt (optional)', portion: '1 cup', description: 'Fat-free Greek yogurt with cinnamon if hunger is loud',
          imageUrl: IMG.yogurt, portionHint: 'Only if you actually need it' },
      ],
      drink: 'Drink lane: another 16.9-24 oz water or unsweet tea. Blood sugar and late-night eating go worse when hydration is sloppy.',
    },
  ];
}

function meals4(): Meal[] {
  return [
    {
      key: 'meal1', label: 'Meal 1', time: '8:30 AM', title: 'Small protein start',
      items: [
        { name: 'Egg whites or yogurt', portion: '1 cup egg whites OR 6 oz yogurt', description: '1 cup egg whites OR 6 oz fat-free Greek yogurt',
          imageUrl: IMG.eggWhites, portionHint: 'About the size of a small coffee cup' },
        { name: 'Blueberries', portion: '1 cup', description: '1 cup blueberries (fresh or frozen) — lowest glycemic berry, best for your A1c and LDL',
          imageUrl: IMG.blueberries, portionHint: 'One cupped hand' },
        { name: 'Psyllium (optional)', portion: '1 serving', description: '1 serving psyllium in water, only if your doctor is okay with it',
          imageUrl: IMG.psyllium, portionHint: 'Stir into a full glass of water' },
      ],
      drink: 'Drink lane: 16.9 oz water. The early bottle makes the total day much easier.',
    },
    {
      key: 'meal2', label: 'Meal 2', time: '12:30 PM', title: 'Lean protein lunch',
      items: [
        { name: 'Lean protein', portion: '6-7 oz', description: 'Chicken, turkey, wild salmon, or sardines',
          imageUrl: IMG.chicken, portionHint: 'Size of your palm' },
        { name: 'Vegetables', portion: '2 cups', description: '2 cups vegetables of your choice',
          imageUrl: IMG.vegetables, portionHint: 'Roughly two clenched fists' },
        { name: 'Beans or lentils', portion: '1/2 - 1 cup', description: '1/2 to 1 cup beans or lentils',
          imageUrl: IMG.beans, portionHint: 'Half to one closed fist' },
      ],
      drink: 'Drink lane: 16.9-20 oz water or sparkling water. Keeps the meal filling without adding calories.',
    },
    {
      key: 'meal3', label: 'Meal 3', time: '4:00 PM', title: 'Bridge snack',
      items: [
        { name: 'Protein (pick one)', portion: '1 serving', description: '1 can sardines in water OR 1 cup fat-free Greek yogurt OR 1 cup edamame',
          imageUrl: IMG.sardines, portionHint: 'One can, cup, or pod handful' },
        { name: 'Fruit or veg', portion: '1 serving', description: '1 piece fruit or cucumber/carrot sticks',
          imageUrl: IMG.fruit, portionHint: 'Whole fruit or a handful of sticks' },
      ],
      drink: 'Drink lane: 12-16 oz water or unsweet tea. Helps you not maul dinner.',
    },
    {
      key: 'meal4', label: 'Meal 4', time: '7:30 PM', title: 'Lean dinner',
      items: [
        { name: 'Lean protein', portion: '6-8 oz', description: '6-8 oz wild salmon, chicken, turkey, or sardines',
          imageUrl: IMG.salmon, portionHint: 'Size of your palm + fingers' },
        { name: 'Vegetables or salad', portion: '2 cups', description: '2 cups vegetables or salad',
          imageUrl: IMG.salad, portionHint: 'Pile it high' },
        { name: 'Sweet potato or beans (optional)', portion: '1 small or 1/2 cup', description: '1 small sweet potato or 1/2 cup beans if still hungry',
          imageUrl: IMG.sweetPotato, portionHint: 'Only if you genuinely still need it' },
      ],
      drink: 'Drink lane: 16.9-20 oz water. Finish the quota here, not with snacks.',
    },
  ];
}

// ---------------------------------------------------------------------------
// Grocery lists — precise weekly shopping list
// ---------------------------------------------------------------------------

export interface GrocerySection {
  section: string;
  items: GroceryLineItem[];
}

export interface GroceryLineItem {
  name: string;
  qty: string;
  note: string;
}

/**
 * Returns a precise weekly grocery list you can take straight to the store.
 * Quantities are computed from: 7 days × meal count × portion sizes.
 */
export function weeklyGroceryList(mealMode: MealMode, startWeight: number, hydrationFactor: number): GrocerySection[] {
  const wOz = waterOz(startWeight, hydrationFactor);
  const weeklyOz = wOz * 7;
  const weeklyBottles = Math.ceil(weeklyOz / 16.9);

  if (mealMode === 2) {
    // 2 meals/day: Meal 1 (12 PM) + Meal 2 (6:30 PM) × 7 days = 14 plates
    return [
      { section: 'Protein', items: [
        { name: 'Boneless skinless chicken breast', qty: '3 lb', note: 'For ~5 meals. Grill or bake in bulk. Highest protein-to-fat ratio — keeps LDL impact near zero.' },
        { name: 'Ground turkey (99% lean)', qty: '2 lb', note: 'For ~4 meals. 99% lean = almost no saturated fat. Directly relevant to your total cholesterol (235).' },
        { name: 'Wild salmon fillets (fresh or frozen)', qty: '1.5 lb', note: 'For ~3 meals. Omega-3s directly lower LDL oxidation and improve insulin sensitivity.' },
        { name: 'Canned sardines in water', qty: '4 cans (4 oz each)', note: 'Higher omega-3 than tuna, zero mercury risk, high calcium. For ~2 meals or backup.' },
        { name: 'Raw shrimp (peeled, deveined)', qty: '1 lb', note: 'Optional swap. Very low saturated fat, high selenium which supports liver function (ALT).' },
      ]},
      { section: 'Vegetables', items: [
        { name: 'Broccoli crowns', qty: '3 heads (~2 lb)', note: '~8 cups florets. Sulforaphane supports liver detox pathways (ALT) and is linked to LDL reduction.' },
        { name: 'Green beans (fresh or frozen)', qty: '2 lb bag', note: '~7 cups. High fiber slows glucose absorption — steadies blood sugar (A1c).' },
        { name: 'Baby spinach', qty: '2 containers (5 oz each)', note: 'High magnesium improves insulin sensitivity (A1c). High nitrates support blood pressure.' },
        { name: 'Asparagus', qty: '3 bunches', note: '~6 cups. Higher folate, anti-inflammatory, supports liver enzyme reduction (ALT).' },
        { name: 'Purple cabbage', qty: '1 large head', note: '~6 cups shredded. Anthocyanins directly help LDL. Lasts 2+ weeks in fridge.' },
        { name: 'Mixed salad greens', qty: '2 containers (5 oz each)', note: 'Volume + fiber. Fills the plate without spiking blood sugar.' },
        { name: 'Cucumber', qty: '2 medium', note: 'High water content, almost zero glycemic impact. Good base for salads.' },
        { name: 'Cherry tomatoes', qty: '1 pint', note: 'Lycopene is linked to reduced LDL oxidation. Better absorbed when cooked or paired with healthy fat.' },
      ]},
      { section: 'Carbs + Legumes', items: [
        { name: 'Sweet potatoes', qty: '5 medium', note: '1 per day for 5 days — bake in batch. Lower glycemic than white potatoes. High fiber steadies A1c.' },
        { name: 'Black beans (canned, no salt added)', qty: '4 cans (15 oz each)', note: '~6 cups drained. Soluble fiber directly binds cholesterol for removal (LDL). Slow-release carbs (A1c).' },
        { name: 'Dry lentils (green or brown)', qty: '1 lb bag', note: 'Cooks to ~5 cups. Highest fiber-per-calorie legume. Shown in studies to lower A1c over 8 weeks.' },
      ]},
      { section: 'Fruit', items: [
        { name: 'Apples (Fuji or Gala)', qty: '4', note: '1 per day for 4 days. Pectin (soluble fiber) binds cholesterol. Eat with skin for full benefit.' },
        { name: 'Oranges', qty: '3', note: '1 per day for 3 days. Hesperidin in the pith improves blood vessel function and supports healthy BP.' },
        { name: 'Blueberries (fresh or frozen)', qty: '2 pints', note: 'Best berry for your A1c + LDL. Anthocyanins improve insulin sensitivity and reduce LDL oxidation.' },
      ]},
      { section: 'Dairy + Extras', items: [
        { name: 'Fat-free Greek yogurt (plain)', qty: '2 large tubs (32 oz each)', note: 'High protein, probiotics support gut health which influences cholesterol metabolism. Optional if hunger gets loud.' },
        { name: 'Ground cinnamon', qty: '1 jar', note: 'Studies show cinnamon may improve fasting glucose and insulin sensitivity (A1c). Skip if stocked.' },
      ]},
      { section: 'Hydration', items: [
        { name: 'Water (16.9 oz bottles)', qty: `${weeklyBottles} bottles`, note: `${wOz} oz/day × 7 days = ${weeklyOz} oz total. Hydration directly affects blood viscosity and kidney function.` },
        { name: 'Sparkling water (unsweetened)', qty: '1 case (12 pack)', note: 'Zero calories, zero sodium. Satisfies soda cravings without touching blood sugar.' },
        { name: 'Unsweet tea bags', qty: '1 box', note: 'Green tea catechins are linked to modest LDL reduction. Any unsweet variety works.' },
      ]},
      { section: 'Seasoning (no salt)', items: [
        { name: 'Garlic powder', qty: '1 jar', note: 'Allicin supports modest cholesterol and blood pressure reduction. Skip if stocked.' },
        { name: 'Onion powder', qty: '1 jar', note: 'Quercetin (antioxidant) supports cardiovascular health. Skip if stocked.' },
        { name: 'Black pepper', qty: '1 grinder', note: 'Piperine improves absorption of other nutrients. Skip if stocked.' },
        { name: 'Lemon juice (bottled)', qty: '1 bottle', note: 'Vitamin C supports iron absorption from beans/lentils. For fish + salad.' },
        { name: 'Mrs. Dash (salt-free)', qty: '1 bottle', note: 'Zero sodium — critical for heart + BP focus. All-purpose seasoning.' },
      ]},
    ];
  }

  // 4 meals/day: Meal 1 (8:30) + Meal 2 (12:30) + Meal 3 (4:00) + Meal 4 (7:30) × 7 days = 28 eating events
  return [
    { section: 'Protein', items: [
      { name: 'Boneless skinless chicken breast', qty: '3 lb', note: 'For ~5 lunch/dinner meals. Highest protein-to-fat ratio — keeps LDL impact near zero.' },
      { name: 'Ground turkey (99% lean)', qty: '2 lb', note: 'For ~4 lunch/dinner meals. 99% lean = almost no saturated fat. Directly relevant to your total cholesterol (235).' },
      { name: 'Wild salmon fillets (fresh or frozen)', qty: '1 lb', note: 'For ~2 dinner meals. Omega-3s directly lower LDL oxidation and support liver function (ALT).' },
      { name: 'Canned sardines in water', qty: '7 cans (4 oz each)', note: '7 bridge snack options (Meal 3). Higher omega-3 than tuna, zero mercury buildup over 60 days, high calcium.' },
      { name: 'Raw shrimp (peeled, deveined)', qty: '1 lb', note: 'Optional swap. Very low saturated fat, high selenium which supports liver function (ALT).' },
    ]},
    { section: 'Breakfast + Snack Protein', items: [
      { name: 'Liquid egg whites (carton)', qty: '2 cartons (32 oz each)', note: '7 breakfasts × 1 cup each. Pure protein, zero cholesterol (the yolk has it, not the white).' },
      { name: 'Fat-free Greek yogurt (plain)', qty: '3 large tubs (32 oz each)', note: '7 breakfasts + 7 bridge snacks. Probiotics support gut health which influences cholesterol metabolism.' },
      { name: 'Edamame (frozen, shelled)', qty: '1 bag (16 oz)', note: 'Alternate bridge snack. Soy protein shown to modestly reduce LDL in meta-analyses.' },
    ]},
    { section: 'Vegetables', items: [
      { name: 'Broccoli crowns', qty: '2 heads (~1.5 lb)', note: '~6 cups florets. Sulforaphane supports liver detox pathways (ALT) and is linked to LDL reduction.' },
      { name: 'Green beans (fresh or frozen)', qty: '2 lb bag', note: '~7 cups. High fiber slows glucose absorption — steadies blood sugar (A1c).' },
      { name: 'Baby spinach', qty: '2 containers (5 oz each)', note: 'High magnesium improves insulin sensitivity (A1c). High nitrates support blood pressure.' },
      { name: 'Asparagus', qty: '2 bunches', note: '~4 cups. Higher folate, anti-inflammatory, supports liver enzyme reduction (ALT).' },
      { name: 'Mixed salad greens', qty: '2 containers (5 oz each)', note: 'Volume + fiber. Fills the plate without spiking blood sugar.' },
      { name: 'Cucumber', qty: '2 medium', note: 'High water content, almost zero glycemic impact. Good base for snacks + salads.' },
      { name: 'Carrot sticks (baby carrots)', qty: '1 bag (1 lb)', note: 'Beta-carotene supports liver health (ALT). Low glycemic for a root vegetable. Meal 3 bridge snack.' },
      { name: 'Cherry tomatoes', qty: '1 pint', note: 'Lycopene is linked to reduced LDL oxidation. Better absorbed when cooked or paired with healthy fat.' },
    ]},
    { section: 'Carbs + Legumes', items: [
      { name: 'Sweet potatoes', qty: '4 medium', note: 'For dinners when needed. Lower glycemic than white potatoes. High fiber steadies A1c.' },
      { name: 'Black beans (canned, no salt added)', qty: '4 cans (15 oz each)', note: '~6 cups drained. Soluble fiber directly binds cholesterol for removal (LDL). Slow-release carbs (A1c).' },
      { name: 'Dry lentils (green or brown)', qty: '1 lb bag', note: 'Highest fiber-per-calorie legume. Shown in studies to lower A1c over 8 weeks.' },
    ]},
    { section: 'Fruit', items: [
      { name: 'Blueberries (fresh or frozen)', qty: '3 pints', note: '7 breakfasts × 1 cup each. Anthocyanins improve insulin sensitivity and reduce LDL oxidation.' },
      { name: 'Apples', qty: '4', note: 'Meal 3 bridge snack days. Pectin (soluble fiber) binds cholesterol. Eat with skin for full benefit.' },
      { name: 'Oranges', qty: '3', note: 'Alternate bridge snack. Hesperidin in the pith improves blood vessel function and supports healthy BP.' },
    ]},
    { section: 'Hydration', items: [
      { name: 'Water (16.9 oz bottles)', qty: `${weeklyBottles} bottles`, note: `${wOz} oz/day × 7 days = ${weeklyOz} oz total. Hydration directly affects blood viscosity and kidney function.` },
      { name: 'Sparkling water (unsweetened)', qty: '1 case (12 pack)', note: 'Zero calories, zero sodium. Satisfies soda cravings without touching blood sugar.' },
      { name: 'Unsweet tea bags', qty: '1 box', note: 'Green tea catechins are linked to modest LDL reduction. Any unsweet variety works.' },
    ]},
    { section: 'Extras', items: [
      { name: 'Psyllium husk powder', qty: '1 container', note: 'Only if doctor-approved. Soluble fiber powerhouse — directly binds cholesterol (LDL) and slows glucose absorption (A1c).' },
      { name: 'Ground cinnamon', qty: '1 jar', note: 'Studies show cinnamon may improve fasting glucose and insulin sensitivity (A1c). Skip if stocked.' },
    ]},
    { section: 'Seasoning (no salt)', items: [
      { name: 'Garlic powder', qty: '1 jar', note: 'Allicin supports modest cholesterol and blood pressure reduction. Skip if stocked.' },
      { name: 'Onion powder', qty: '1 jar', note: 'Quercetin (antioxidant) supports cardiovascular health. Skip if stocked.' },
      { name: 'Black pepper', qty: '1 grinder', note: 'Piperine improves absorption of other nutrients. Skip if stocked.' },
      { name: 'Lemon juice (bottled)', qty: '1 bottle', note: 'Vitamin C supports iron absorption from beans/lentils. For fish + salad.' },
      { name: 'Mrs. Dash (salt-free)', qty: '1 bottle', note: 'Zero sodium — critical for heart + BP focus. All-purpose seasoning.' },
    ]},
  ];
}

// Keep old simple list for backward compat (used by existing GroceryItem refs)
export function groceryList(mealMode: MealMode, startWeight: number, hydrationFactor: number): GroceryItem[] {
  const sections = weeklyGroceryList(mealMode, startWeight, hydrationFactor);
  return sections.map((s) => ({
    emoji: '',
    label: s.section,
    detail: s.items.map((i) => `${i.qty} ${i.name}`).join(', '),
  }));
}

// ---------------------------------------------------------------------------
// Snack cheat section — categorized healthy night snacks + danger rating
// ---------------------------------------------------------------------------

export type DangerLevel = 1 | 2 | 3 | 4 | 5;

export interface CheatSnack {
  name: string;
  portion: string;
  calories: string;
  danger: DangerLevel;  // 1 = safe indulgence, 5 = proceed with extreme caution
  why: string;
}

export interface SnackCategory {
  category: string;
  emoji: string;
  snacks: CheatSnack[];
}

export const CHEAT_CODE = 'slowroll';

export const SNACK_CATEGORIES: SnackCategory[] = [
  {
    category: 'Frozen treats',
    emoji: '\uD83C\uDF66',
    snacks: [
      { name: 'Frozen blueberries', portion: '1 cup', calories: '~85', danger: 1, why: 'Basically a popsicle. Your A1c will not even flinch.' },
      { name: 'Frozen banana slices', portion: '1/2 banana', calories: '~55', danger: 1, why: 'Natural ice cream texture when frozen.' },
      { name: 'Greek yogurt bark', portion: '2 oz piece', calories: '~70', danger: 2, why: 'Spread fat-free Greek yogurt + blueberries on a sheet pan, freeze, snap into pieces.' },
      { name: 'Frozen grapes', portion: '1 cup', calories: '~100', danger: 2, why: 'Little sugar bombs but the cold slows you down.' },
      { name: 'Outshine no-sugar-added fruit bars', portion: '1 bar', calories: '~25-40', danger: 1, why: 'Check the label. Some are basically fruit + water.' },
      { name: 'Halo Top (protein series)', portion: '1/2 cup', calories: '~90', danger: 3, why: 'Tastes like real ice cream. Danger is eating the whole pint.' },
      { name: 'Sugar-free popsicles', portion: '1 pop', calories: '~15', danger: 1, why: 'Basically flavored ice. Zero guilt.' },
    ],
  },
  {
    category: 'Crunchy + salty',
    emoji: '\uD83E\uDD5C',
    snacks: [
      { name: 'Cucumber slices + everything bagel seasoning', portion: '1 whole cucumber', calories: '~30', danger: 1, why: 'Crunchy, salty, basically water.' },
      { name: 'Air-popped popcorn (no butter)', portion: '3 cups', calories: '~90', danger: 2, why: 'Fiber bomb. Just don\'t drench it.' },
      { name: 'Rice cakes (plain)', portion: '2 cakes', calories: '~70', danger: 2, why: 'Crispy. Top with cinnamon if you want.' },
      { name: 'Roasted edamame', portion: '1/3 cup', calories: '~100', danger: 2, why: 'Crunchy protein. Buy the dry-roasted packs.' },
      { name: 'Seaweed snacks', portion: '1 pack', calories: '~25', danger: 1, why: 'Salt craving solved for basically no calories.' },
      { name: 'Carrot + celery sticks', portion: 'Unlimited', calories: '~40', danger: 1, why: 'Eat the whole bag. Nobody got fat from carrots.' },
      { name: 'Pickles (dill, whole)', portion: '2 spears', calories: '~10', danger: 1, why: 'Watch sodium if you are salt-sensitive. Otherwise crunch away.' },
      { name: 'Jicama sticks + Tajin', portion: '1 cup', calories: '~45', danger: 1, why: 'Crispy, tangy, almost zero calorie density.' },
    ],
  },
  {
    category: 'Sweet + creamy',
    emoji: '\uD83C\uDF53',
    snacks: [
      { name: 'Fat-free Greek yogurt + cinnamon', portion: '1 cup', calories: '~100', danger: 1, why: 'Protein dessert. Your baseline meal already includes this.' },
      { name: 'Cottage cheese + blueberries', portion: '1/2 cup + 1/4 cup berries', calories: '~110', danger: 2, why: 'High protein. Go fat-free or 1%.' },
      { name: 'Apple slices + PB2 powder', portion: '1 apple + 2 tbsp PB2', calories: '~140', danger: 2, why: 'Powdered PB has 85% less fat than regular. Tastes close enough.' },
      { name: 'Chia pudding', portion: '1/2 cup', calories: '~120', danger: 2, why: 'Make ahead: chia seeds + almond milk + cinnamon overnight.' },
      { name: 'Frozen yogurt bites', portion: '10 bites', calories: '~80', danger: 2, why: 'Drop yogurt in silicone molds, freeze. Mini treats.' },
      { name: 'Sugar-free Jello', portion: '1 cup', calories: '~10', danger: 1, why: 'Tastes like dessert, basically doesn\'t exist calorically.' },
      { name: 'Baked apple with cinnamon', portion: '1 apple', calories: '~95', danger: 1, why: 'Microwave 3 min with cinnamon. Tastes like pie filling.' },
    ],
  },
  {
    category: 'Chocolate zone',
    emoji: '\uD83C\uDF6B',
    snacks: [
      { name: 'Dark chocolate (85%+ cacao)', portion: '1 square (10g)', calories: '~55', danger: 2, why: 'One square. Not one row. Antioxidants are real.' },
      { name: 'Cocoa powder in Greek yogurt', portion: '1 tbsp cocoa + 1 cup yogurt', calories: '~115', danger: 2, why: 'Chocolate mousse vibes. Zero added sugar.' },
      { name: 'Frozen chocolate banana', portion: '1/2 banana dipped', calories: '~90', danger: 3, why: 'Dip in melted dark chocolate, freeze. Portion control is everything.' },
      { name: 'Chocolate rice cake', portion: '1 cake', calories: '~60', danger: 2, why: 'Some brands have a thin chocolate coating. Check sugar.' },
      { name: 'Cacao nibs', portion: '1 tbsp', calories: '~35', danger: 1, why: 'Crunchy, bitter, pure cacao. Sprinkle on yogurt.' },
    ],
  },
  {
    category: 'Savory + warm',
    emoji: '\uD83C\uDF72',
    snacks: [
      { name: 'Bone broth (low sodium)', portion: '1 mug', calories: '~35', danger: 1, why: 'Warm, savory, filling. Basically a hug for your stomach.' },
      { name: 'Egg white omelette', portion: '3 egg whites + vegetables', calories: '~70', danger: 1, why: 'Pure protein. Add spinach and mushroom.' },
      { name: 'Turkey roll-ups', portion: '3 slices + mustard', calories: '~75', danger: 2, why: 'Low-sodium deli turkey. Roll around a pickle spear.' },
      { name: 'Miso soup', portion: '1 cup', calories: '~35', danger: 2, why: 'Watch sodium content. But satisfying and warm.' },
      { name: 'Roasted asparagus spears', portion: '6-8 spears', calories: '~30', danger: 1, why: 'Roast at 425 for 10 min. Crispy tips, tender stalks. Season with garlic powder.' },
      { name: 'Steamed edamame with salt-free seasoning', portion: '1 cup in pods', calories: '~120', danger: 2, why: 'High protein, fun to eat slowly.' },
      { name: 'Roasted chickpeas', portion: '1/4 cup', calories: '~60', danger: 2, why: 'Crunchy. Season however you want (no salt).' },
    ],
  },
  {
    category: 'Drinks + sips',
    emoji: '\uD83C\uDF75',
    snacks: [
      { name: 'Herbal tea (chamomile, peppermint)', portion: '1 mug', calories: '~0', danger: 1, why: 'Zero everything. Calms you down.' },
      { name: 'Sparkling water + lemon', portion: '12 oz', calories: '~0', danger: 1, why: 'The bubbles trick your brain into thinking it\'s soda.' },
      { name: 'Golden milk (turmeric + almond milk)', portion: '1 mug', calories: '~30', danger: 1, why: 'Anti-inflammatory. Warm and slightly sweet.' },
      { name: 'Decaf coffee (black)', portion: '1 cup', calories: '~5', danger: 1, why: 'If you need the ritual without the caffeine.' },
      { name: 'Tart cherry juice (unsweetened)', portion: '4 oz', calories: '~50', danger: 2, why: 'Small glass only. Helps sleep. Watch the sugar in larger amounts.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Plan for a given day
// ---------------------------------------------------------------------------

export function planForDay(day: number, mealMode: MealMode): DayPlan {
  const phase = phaseForDay(day);
  const movement = MOVEMENT_BY_PHASE[phase];
  const meals = mealMode === 2 ? meals2() : meals4();
  const movementTime = mealMode === 2 ? '7:30 AM' : '7:00 AM';
  return { phase, movement, meals, movementTime };
}

// ---------------------------------------------------------------------------
// Timeline items for the Console
// ---------------------------------------------------------------------------

function addMinutes(time: string, mins: number): string {
  if (time === 'All day') return time;
  const [hm, period] = time.split(' ');
  const [hStr, mStr] = hm.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  let hour = (h % 12) + (period === 'PM' ? 12 : 0);
  const date = new Date(2000, 0, 1, hour, m);
  date.setMinutes(date.getMinutes() + mins);
  let outH = date.getHours();
  const outPeriod = outH >= 12 ? 'PM' : 'AM';
  outH = outH % 12 || 12;
  return `${outH}:${String(date.getMinutes()).padStart(2, '0')} ${outPeriod}`;
}

function parseMinutes(str: string): number {
  const m = str.match(/(\d+)/);
  return m ? Number(m[1]) : 6;
}

export function timelineForDay(
  day: number,
  mealMode: MealMode,
  startWeight: number,
  hydrationFactor: number,
): TimelineItem[] {
  const plan = planForDay(day, mealMode);
  const warmupMins = parseMinutes(plan.movement.warmup);
  const treadmillMins = parseMinutes(plan.movement.treadmill);

  const items: TimelineItem[] = [
    { key: 'warmup', time: plan.movementTime, title: 'Warm-up', copy: plan.movement.warmup },
    { key: 'treadmill', time: addMinutes(plan.movementTime, warmupMins), title: 'Treadmill', copy: plan.movement.treadmill },
    { key: 'strength', time: addMinutes(plan.movementTime, warmupMins + treadmillMins), title: 'Micro-strength', copy: plan.movement.strength },
    {
      key: 'water', time: 'All day', title: 'Water quota',
      copy: `Finish ${waterOz(startWeight, hydrationFactor)} oz total. That is about ${bottleCount(startWeight, hydrationFactor)} bottles of 16.9 oz water.`,
    },
  ];

  plan.meals.forEach((meal) => {
    const itemSummary = meal.items.map((it) => `${it.portion} ${it.name.toLowerCase()}`).join(' · ');
    items.push({ key: meal.key, time: meal.time, title: meal.label, copy: `${meal.title} · ${itemSummary}` });
  });

  if (isWeighDay(day)) {
    items.push({ key: 'weigh', time: 'Morning', title: 'Weigh-in', copy: 'Step on the scale once, log it in settings if you want, and keep moving. No drama.' });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Motion library (exercise video references)
// ---------------------------------------------------------------------------

export const MOTION_LIBRARY: Record<MotionKey, MotionRef> = {
  march: { title: 'Easy march in place', source: 'https://www.youtube.com/watch?v=QilgMPG7OaA', guide: '', blurb: 'This covers the gentle march used in your warm-up and the short march finisher in micro-strength.' },
  shoulder: { title: 'Standing shoulder rolls', source: 'https://www.youtube.com/watch?v=L_neR-zpsBY', guide: '', blurb: 'Use this for the one-minute shoulder-roll slot in your warm-up. Slow circles. No rush.' },
  ankle: { title: 'Standing ankle circles', source: 'https://www.youtube.com/watch?v=-5fyZUhzpUk', guide: '', blurb: 'This is the ankle-circle slot from your warm-up. Small, controlled circles both directions.' },
  sit: { title: 'Sit-to-stand / chair stand', source: 'https://www.youtube.com/watch?v=ITv-_BkcrD0', guide: 'https://www.nhs.uk/live-well/exercise/strength-exercises/', blurb: 'This covers sit-to-stand and chair stands. Same pattern, different phrasing.' },
  chest: { title: 'Wall chest opener', source: 'https://www.youtube.com/watch?v=Xs8oTTFBZ-o', guide: 'https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/', blurb: 'Use this for the wall chest opener / chest opener line in the warm-up sequence.' },
  hall: { title: 'Indoor hallway walk', source: 'https://www.youtube.com/watch?v=SPTWBCwAZEs', guide: '', blurb: 'This stands in for your short hallway walk: easy indoor steps, upright posture, boring on purpose.' },
  treadmill: { title: 'Treadmill walking form', source: 'https://www.youtube.com/watch?v=xCzORpynOm8', guide: '', blurb: 'This is the real-motion reference for your treadmill block across all four phases.' },
  wallPush: { title: 'Wall push-up', source: 'https://www.youtube.com/watch?v=wIPJvBQs7RA', guide: 'https://www.nhs.uk/live-well/exercise/strength-exercises/', blurb: 'This is the phase 1-2 push pattern in your plan.' },
  inclinePush: { title: 'Incline push-up', source: 'https://www.youtube.com/watch?v=cfns5VDVVvk', guide: '', blurb: 'This replaces wall push-ups in phases 3-4 once your floor is more stable.' },
  calf: { title: 'Standing calf raises', source: 'https://www.youtube.com/watch?v=k8ipHzKeAkQ', guide: 'https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/', blurb: 'This is the calf-raise slot from your strength block.' },
  split: { title: 'Supported split squat to chair', source: 'https://www.youtube.com/watch?v=nXgZ0smNacE', guide: '', blurb: 'This is the phase 4 leg pattern upgrade from sit-to-stand.' },
};

export function todayMotionKeys(day: number): MotionKey[] {
  const phase = phaseForDay(day);
  const keys: MotionKey[] = [
    'march', 'shoulder', 'ankle', 'sit', 'chest', 'hall', 'treadmill',
    phase >= 3 ? 'inclinePush' : 'wallPush',
    phase >= 4 ? 'split' : 'sit',
    'calf',
  ];
  // dedupe while preserving order
  return [...new Set(keys)];
}

export function youtubeThumb(source: string): string {
  const m = source.match(/[?&]v=([^&]+)/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : '';
}

export function routineCardsForDay(day: number): RoutineCardData[] {
  const phase = phaseForDay(day);
  const plan = planForDay(day, 4); // movement doesn't depend on meal mode
  const pushKey: MotionKey = phase >= 3 ? 'inclinePush' : 'wallPush';
  const legKey: MotionKey = phase >= 4 ? 'split' : 'sit';

  return [
    { title: 'Warm-up sequence', defaultKey: 'march', copy: plan.movement.warmup, keys: ['march', 'shoulder', 'ankle', 'sit', 'chest', 'hall'] },
    { title: 'Treadmill walk', defaultKey: 'treadmill', copy: plan.movement.treadmill, keys: ['treadmill'] },
    { title: 'Push pattern', defaultKey: pushKey, copy: phase >= 3 ? 'Incline push-up pattern for this phase.' : 'Wall push-up pattern for this phase.', keys: [pushKey] },
    { title: 'Leg + calf pattern', defaultKey: legKey, copy: plan.movement.strength, keys: [...new Set([legKey, 'calf', 'march'] as MotionKey[])] },
  ];
}

/** Map a dashboard directive type to the motion key that best represents it. */
export function directiveToMotionKey(
  directive: 'warmup' | 'treadmill' | 'strength',
  day: number,
): MotionKey {
  if (directive === 'warmup') return 'march';
  if (directive === 'treadmill') return 'treadmill';
  // strength
  const phase = phaseForDay(day);
  return phase >= 3 ? 'inclinePush' : 'wallPush';
}

export function movementCoverageNote(day: number): string {
  const phase = phaseForDay(day);
  return `Covered from your file: easy march, shoulder rolls, ankle circles, sit-to-stand / chair stands, wall chest opener, hallway walk, treadmill walk, ${phase >= 3 ? 'incline push-up' : 'wall push-up'}, calf raises${phase >= 4 ? ', and split squat to chair' : ''}.`;
}

// ---------------------------------------------------------------------------
// Default state factory
// ---------------------------------------------------------------------------

export function createDefaultState(): AppState {
  return {
    height: `6'3"`,
    startWeight: 225,
    currentWeight: 225,
    /** May 1, 1985 — stored backend-only, UI only ever shows the derived age. */
    birthdate: '1985-05-01',
    selectedDay: 1,
    mealMode: 4,
    goal: 'stability',
    hydrationFactor: 0.50,
    days: Array.from({ length: 60 }, (_, i) => ({
      day: i + 1,
      closed: false,
      done: {
        warmup: false,
        treadmill: false,
        strength: false,
        water: false,
        meal1: false,
        meal2: false,
        meal3: false,
        meal4: false,
        weigh: false,
      },
    })),
  };
}
