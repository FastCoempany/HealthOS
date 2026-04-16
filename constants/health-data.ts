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
  items: string[];
  drink: string;
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
  age: string;
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

function meals2(): Meal[] {
  return [
    {
      key: 'meal1', label: 'Meal 1', time: '12:00 PM', title: 'Protein plate + produce',
      items: [
        '8 oz grilled chicken breast, turkey breast, white fish, or tuna in water',
        '2 cups broccoli, green beans, spinach, zucchini, cauliflower, or mixed vegetables',
        '1 cup lentils or black beans OR 1 medium sweet potato',
        '1 piece fruit: apple, orange, or 1 cup berries',
      ],
      drink: 'Drink lane: 16.9-24 oz water or sparkling water. Hydration helps appetite control, bowel regularity, and exercise tolerance.',
    },
    {
      key: 'meal2', label: 'Meal 2', time: '6:30 PM', title: 'Protein plate + salad',
      items: [
        '8 oz lean protein: chicken, turkey, shrimp, cod, tuna, or 99% lean ground turkey',
        'Huge salad bowl or 2 cups cooked vegetables',
        '1 cup beans OR 1 medium sweet potato if you skipped it earlier',
        'Optional: 1 cup fat-free Greek yogurt with cinnamon if hunger is loud',
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
        '1 cup egg whites or 6 oz fat-free Greek yogurt',
        '1 cup berries',
        'Optional: 1 serving psyllium in water only if your doctor is okay with it',
      ],
      drink: 'Drink lane: 16.9 oz water. The early bottle makes the total day much easier.',
    },
    {
      key: 'meal2', label: 'Meal 2', time: '12:30 PM', title: 'Lean protein lunch',
      items: [
        '6-7 oz chicken, turkey, tuna in water, or white fish',
        '2 cups vegetables',
        '1/2-1 cup beans or lentils',
      ],
      drink: 'Drink lane: 16.9-20 oz water or sparkling water. Keeps the meal filling without adding calories.',
    },
    {
      key: 'meal3', label: 'Meal 3', time: '4:00 PM', title: 'Bridge snack',
      items: [
        '1 can low-sodium tuna OR 1 cup fat-free Greek yogurt OR 1 cup edamame',
        '1 piece fruit or cucumber/carrot sticks',
      ],
      drink: 'Drink lane: 12-16 oz water or unsweet tea. Helps you not maul dinner.',
    },
    {
      key: 'meal4', label: 'Meal 4', time: '7:30 PM', title: 'Lean dinner',
      items: [
        '6-8 oz lean protein',
        '2 cups vegetables or salad',
        '1 small sweet potato or 1/2 cup beans if still hungry',
      ],
      drink: 'Drink lane: 16.9-20 oz water. Finish the quota here, not with snacks.',
    },
  ];
}

// ---------------------------------------------------------------------------
// Grocery lists
// ---------------------------------------------------------------------------

export function groceryList(mealMode: MealMode, startWeight: number, hydrationFactor: number): GroceryItem[] {
  const weeklyBottles = (Math.ceil((waterOz(startWeight, hydrationFactor) * 7) / 16.9 * 10) / 10).toFixed(1);

  if (mealMode === 2) {
    return [
      { emoji: '\uD83C\uDF57', label: 'Lean protein', detail: '7-9 lb total chicken, turkey, white fish, tuna, or shrimp for the week' },
      { emoji: '\uD83E\uDD6C', label: 'Vegetables', detail: '21-28 cups broccoli, green beans, spinach, zucchini, cauliflower, salad mix' },
      { emoji: '\uD83E\uDED8', label: 'Smart carbs', detail: '4-6 sweet potatoes and 5-7 cups beans or lentils cooked' },
      { emoji: '\uD83C\uDF4E', label: 'Fruit', detail: '7-10 apples, oranges, or berry portions' },
      { emoji: '\uD83D\uDCA7', label: 'Water', detail: `About ${weeklyBottles} bottles of 16.9 oz water for the week` },
      { emoji: '\uD83E\uDD63', label: 'Breakfast add-ons', detail: 'Optional fat-free Greek yogurt or egg whites if hunger gets loud' },
    ];
  }
  return [
    { emoji: '\uD83E\uDD5A', label: 'Breakfast + snack protein', detail: 'Egg whites or fat-free Greek yogurt for 7 breakfasts plus 7 bridge snacks' },
    { emoji: '\uD83C\uDF57', label: 'Lunch + dinner protein', detail: '6-8 lb total chicken, turkey, fish, tuna, or shrimp for the week' },
    { emoji: '\uD83E\uDD6C', label: 'Vegetables', detail: '18-24 cups total vegetables plus salad bowls' },
    { emoji: '\uD83E\uDED8', label: 'Beans / lentils', detail: '4-6 cups cooked total' },
    { emoji: '\uD83C\uDF60', label: 'Sweet potatoes + fruit', detail: '4-5 sweet potatoes and 7-10 fruit servings' },
    { emoji: '\uD83D\uDCA7', label: 'Water', detail: `About ${weeklyBottles} bottles of 16.9 oz water for the week` },
  ];
}

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
    items.push({ key: meal.key, time: meal.time, title: meal.label, copy: [meal.title, ...meal.items].join(' · ') });
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
    age: '',
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
