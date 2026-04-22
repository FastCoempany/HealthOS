/**
 * Slow Roll Health OS — Meal Prep Data
 *
 * Everything you need for a Sunday prep session:
 * - Ingredient cards (shelf life, cook methods, storage)
 * - Prep day timeline
 * - Container map
 * - Midweek check
 * - Quick reference
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IngredientCard {
  name: string;
  category: 'Protein' | 'Vegetable' | 'Carb' | 'Fruit' | 'Dairy' | 'Pantry';
  rawLife: string;           // How long raw/unopened in fridge or pantry
  cookedLife: string;        // How long cooked in fridge
  freezerLife: string;       // How long in freezer
  cookOrRaw: 'cook' | 'raw' | 'either';
  cookMethod: string;        // Exact method + temp + time + seasoning
  storage: string;           // How to store after prep
  portionsPerPrep: string;   // How many meals one batch covers
  goneBadSigns: string;      // How to tell it's spoiled
}

export interface PrepStep {
  time: string;              // e.g. "0:00", "0:15"
  title: string;
  detail: string;
  icon: string;              // single char emoji
}

export interface ContainerMap {
  day: string;
  meal: string;
  contents: string[];
  label: string;
}

export interface QuickRef {
  title: string;
  items: { label: string; value: string }[];
}

// ---------------------------------------------------------------------------
// Ingredient cards — every item in the grocery list
// ---------------------------------------------------------------------------

export const INGREDIENT_CARDS: IngredientCard[] = [
  // --- Protein ---
  {
    name: 'Boneless skinless chicken breast',
    category: 'Protein',
    rawLife: '1-2 days in fridge, 9 months frozen',
    cookedLife: '3-4 days in fridge',
    freezerLife: '2-3 months cooked, 9 months raw',
    cookOrRaw: 'cook',
    cookMethod: 'Bake at 400°F for 20-25 min (internal temp 165°F). Season with garlic powder, onion powder, black pepper, and Mrs. Dash. Brush lightly with lemon juice halfway through.',
    storage: 'Let cool 10 min, then slice into meal-size portions. Store in glass containers with tight lids. Do NOT stack portions — lay flat so they reheat evenly.',
    portionsPerPrep: '3 lb raw ≈ 5 meals (8 oz cooked each)',
    goneBadSigns: 'Gray color, slimy texture, sour smell. When in doubt, throw it out.',
  },
  {
    name: 'Ground turkey (99% lean)',
    category: 'Protein',
    rawLife: '1-2 days in fridge, 3-4 months frozen',
    cookedLife: '3-4 days in fridge',
    freezerLife: '2-3 months cooked',
    cookOrRaw: 'cook',
    cookMethod: 'Brown in a dry non-stick pan over medium-high heat, breaking apart with a spatula, 8-10 min until no pink remains (internal temp 165°F). Season with garlic powder, onion powder, black pepper, Mrs. Dash.',
    storage: 'Cool 10 min, store in glass containers. Great for meal-prepping lunch bowls.',
    portionsPerPrep: '2 lb raw ≈ 4 meals',
    goneBadSigns: 'Gray-brown color, sour or ammonia smell, slimy texture.',
  },
  {
    name: 'Wild salmon fillets',
    category: 'Protein',
    rawLife: '1-2 days in fridge, 2-3 months frozen',
    cookedLife: '3 days in fridge MAX — fish goes bad faster than other proteins',
    freezerLife: '2-3 months raw, do not refreeze cooked',
    cookOrRaw: 'cook',
    cookMethod: 'Bake at 400°F for 12-15 min (internal temp 145°F, flakes easily with a fork). Season with lemon juice, garlic powder, black pepper, Mrs. Dash. DO NOT overcook — dries out fast.',
    storage: 'Cool fully, then refrigerate flat in a glass container. Best eaten within 3 days. Do NOT prep all your salmon on Sunday for the whole week — cook half Sunday, half Wednesday.',
    portionsPerPrep: '1-1.5 lb raw ≈ 2-3 meals',
    goneBadSigns: 'Strong fishy smell (fresh salmon smells mild/oceanic), gray color, dry or mushy texture.',
  },
  {
    name: 'Canned sardines in water',
    category: 'Protein',
    rawLife: '3-5 years unopened',
    cookedLife: '2 days in fridge after opening',
    freezerLife: 'Not recommended after opening',
    cookOrRaw: 'raw',
    cookMethod: 'Eat straight from the can. Drain water, plate with lemon juice and black pepper. No cooking needed.',
    storage: 'Keep unopened cans in pantry. Once opened, transfer to a glass container with a lid and refrigerate.',
    portionsPerPrep: '1 can = 1 snack/bridge meal',
    goneBadSigns: 'Bulging can (toss immediately), off smell after opening, discolored fish.',
  },
  {
    name: 'Liquid egg whites',
    category: 'Protein',
    rawLife: '3-5 days after opening (check carton date)',
    cookedLife: '3-4 days in fridge',
    freezerLife: '6 months in carton unopened',
    cookOrRaw: 'cook',
    cookMethod: 'Scramble in a non-stick pan over medium heat, 2-3 min until set. NO oil, NO butter. Season with black pepper and a shake of garlic powder.',
    storage: 'Best cooked fresh each morning. If meal-prepping, store cooked whites in a sealed container and reheat 30 seconds in the microwave.',
    portionsPerPrep: '1 cup raw = 1 breakfast',
    goneBadSigns: 'Cloudy appearance after settling, sour smell.',
  },

  // --- Vegetables ---
  {
    name: 'Broccoli crowns',
    category: 'Vegetable',
    rawLife: '5-7 days in fridge',
    cookedLife: '3-5 days in fridge',
    freezerLife: '10-12 months (blanched first)',
    cookOrRaw: 'either',
    cookMethod: 'Cut into florets. Steam 4-5 min (still bright green, slight crunch). OR roast at 425°F for 18-20 min with garlic powder and black pepper. Do NOT overcook — becomes mushy and loses sulforaphane.',
    storage: 'Store raw in the crisper drawer with a paper towel to absorb moisture. Store cooked in a glass container, lid slightly vented when warm.',
    portionsPerPrep: '2 lb raw ≈ 6-8 cups cooked',
    goneBadSigns: 'Yellowing florets, mushy stems, sulfur smell.',
  },
  {
    name: 'Green beans',
    category: 'Vegetable',
    rawLife: '5-7 days in fridge (fresh), 12 months frozen',
    cookedLife: '3-5 days in fridge',
    freezerLife: '10-12 months',
    cookOrRaw: 'either',
    cookMethod: 'Steam 5-6 min OR sauté in a dry pan 4-5 min with lemon juice, garlic powder, black pepper. Keep them crisp-tender.',
    storage: 'Raw: plastic bag or container in fridge. Cooked: glass container.',
    portionsPerPrep: '2 lb raw ≈ 7 cups cooked',
    goneBadSigns: 'Soft/limp, brown spots, slimy texture.',
  },
  {
    name: 'Baby spinach',
    category: 'Vegetable',
    rawLife: '5-7 days in fridge',
    cookedLife: '3-5 days in fridge',
    freezerLife: '10-12 months (blanched)',
    cookOrRaw: 'either',
    cookMethod: 'Sauté in a dry non-stick pan 1-2 min with lemon juice until just wilted. OR eat raw in salads.',
    storage: 'Raw: keep in original container with paper towel. Cooked: glass container, drain excess liquid first.',
    portionsPerPrep: '5 oz raw ≈ ~1 cup cooked',
    goneBadSigns: 'Wet/slimy leaves, yellowing, strong off smell.',
  },
  {
    name: 'Asparagus',
    category: 'Vegetable',
    rawLife: '3-5 days in fridge',
    cookedLife: '3-5 days in fridge',
    freezerLife: '8-12 months (blanched)',
    cookOrRaw: 'cook',
    cookMethod: 'Snap off woody ends. Roast at 425°F for 10-12 min with garlic powder, black pepper, lemon juice. Crispy tips, tender stalks.',
    storage: 'Raw: stand upright in a jar with 1 inch of water in the fridge (like flowers). Cooked: glass container.',
    portionsPerPrep: '3 bunches ≈ 6 cups cooked',
    goneBadSigns: 'Mushy tips, wrinkled stalks, sour smell.',
  },
  {
    name: 'Purple cabbage',
    category: 'Vegetable',
    rawLife: '3-4 weeks in fridge (intact head)',
    cookedLife: '5-7 days in fridge',
    freezerLife: '10-12 months (blanched)',
    cookOrRaw: 'raw',
    cookMethod: 'Eat raw. Shred thinly with a knife or mandoline. Dress with lemon juice, black pepper, a pinch of Mrs. Dash. No cooking needed — cooking destroys most of the anthocyanins.',
    storage: 'Whole head: fridge crisper drawer. Shredded: airtight container, 5-7 days.',
    portionsPerPrep: '1 head ≈ 6-8 cups shredded',
    goneBadSigns: 'Black/brown spots, slimy outer leaves (peel off outer leaves if just surface).',
  },
  {
    name: 'Mixed salad greens',
    category: 'Vegetable',
    rawLife: '5-7 days in fridge',
    cookedLife: 'N/A — eat raw',
    freezerLife: 'Not recommended',
    cookOrRaw: 'raw',
    cookMethod: 'Eat raw. Dress with lemon juice and black pepper.',
    storage: 'Keep in original container with a paper towel to absorb moisture.',
    portionsPerPrep: '5 oz ≈ 4-5 salad servings',
    goneBadSigns: 'Wet/slimy leaves, brown edges.',
  },
  {
    name: 'Cucumber',
    category: 'Vegetable',
    rawLife: '7-10 days in fridge',
    cookedLife: 'N/A — eat raw',
    freezerLife: 'Not recommended',
    cookOrRaw: 'raw',
    cookMethod: 'Slice thin for salads or sticks for snacks. Sprinkle with everything bagel seasoning or eat plain.',
    storage: 'Fridge crisper drawer, unwashed until ready to use.',
    portionsPerPrep: '2 medium ≈ 5-7 days of snacks',
    goneBadSigns: 'Soft spots, slimy surface, wrinkled skin.',
  },
  {
    name: 'Carrot sticks (baby carrots)',
    category: 'Vegetable',
    rawLife: '3-4 weeks in fridge',
    cookedLife: '5-7 days in fridge',
    freezerLife: '10-12 months',
    cookOrRaw: 'either',
    cookMethod: 'Eat raw for snacks. Or roast at 425°F for 20-25 min with garlic powder and black pepper.',
    storage: 'Fridge in original bag or container with a paper towel.',
    portionsPerPrep: '1 lb bag ≈ 7 snack portions',
    goneBadSigns: 'Slimy film (rinse well — often salvageable), soft/rubbery texture.',
  },
  {
    name: 'Cherry tomatoes',
    category: 'Vegetable',
    rawLife: '5-7 days at room temp (longer if unripe), 1-2 weeks in fridge',
    cookedLife: '3-5 days in fridge',
    freezerLife: '8-10 months (roasted)',
    cookOrRaw: 'raw',
    cookMethod: 'Eat raw in salads. Or roast at 400°F for 15 min until bursting for deeper flavor.',
    storage: 'Room temp until ripe, then fridge. Pull out 30 min before eating for best flavor.',
    portionsPerPrep: '1 pint ≈ 5-7 salad toppings',
    goneBadSigns: 'Wrinkled skin (still edible but mushy), mold, leaking juice.',
  },

  // --- Carbs + Legumes ---
  {
    name: 'Sweet potatoes',
    category: 'Carb',
    rawLife: '1-2 months in a cool dry pantry',
    cookedLife: '5-7 days in fridge',
    freezerLife: '10-12 months cooked',
    cookOrRaw: 'cook',
    cookMethod: 'Pierce with a fork. Bake whole at 400°F for 45-50 min until tender. OR microwave on high 8-10 min. Eat plain or with a dash of cinnamon.',
    storage: 'Raw: pantry, NOT fridge (cold damages texture). Cooked: glass container, fridge.',
    portionsPerPrep: '5 potatoes ≈ 5 meals',
    goneBadSigns: 'Soft spots, moldy skin, shriveled, black spots throughout flesh when cut.',
  },
  {
    name: 'Black beans (canned, no salt added)',
    category: 'Carb',
    rawLife: '2-5 years unopened',
    cookedLife: '3-5 days in fridge after opening',
    freezerLife: '1-2 months cooked',
    cookOrRaw: 'either',
    cookMethod: 'Drain and rinse thoroughly (removes ~40% of sodium even from "no salt" cans). Heat in a small saucepan 3-4 min with garlic powder, black pepper, Mrs. Dash.',
    storage: 'Unopened cans: pantry. Opened: transfer to glass container, fridge.',
    portionsPerPrep: '1 can ≈ 1.5 cups drained',
    goneBadSigns: 'Bulging can (toss), bubbles when opened, sour smell, unusual color.',
  },
  {
    name: 'Dry lentils (green or brown)',
    category: 'Carb',
    rawLife: '2-3 years in pantry',
    cookedLife: '5-7 days in fridge',
    freezerLife: '6 months cooked',
    cookOrRaw: 'cook',
    cookMethod: 'Rinse 1 cup dry lentils. Simmer in 2.5 cups water for 20-25 min until tender but not mushy. Season with garlic powder, onion powder, black pepper. Drain any excess water.',
    storage: 'Dry: airtight pantry container. Cooked: glass container, fridge.',
    portionsPerPrep: '1 cup dry = ~3 cups cooked ≈ 4 meals',
    goneBadSigns: 'Insects/larvae in dry lentils (toss), sour smell after cooking.',
  },

  // --- Fruit ---
  {
    name: 'Apples',
    category: 'Fruit',
    rawLife: '1-2 weeks at room temp, 4-6 weeks in fridge',
    cookedLife: '3-5 days if baked',
    freezerLife: '8-12 months sliced',
    cookOrRaw: 'raw',
    cookMethod: 'Eat whole with skin. Wash right before eating. Pectin (soluble fiber) binds cholesterol.',
    storage: 'Fridge crisper drawer extends life significantly. Keep away from other produce (apples release ethylene gas that ripens other fruit).',
    portionsPerPrep: '1 apple = 1 snack/meal portion',
    goneBadSigns: 'Soft/mushy, brown spots throughout, wrinkled skin.',
  },
  {
    name: 'Oranges',
    category: 'Fruit',
    rawLife: '1 week at room temp, 3-4 weeks in fridge',
    cookedLife: 'N/A',
    freezerLife: 'Not recommended whole',
    cookOrRaw: 'raw',
    cookMethod: 'Peel and eat. Keep the pith (white stringy stuff) — that\'s where the hesperidin is.',
    storage: 'Fridge crisper drawer for longer life.',
    portionsPerPrep: '1 orange = 1 portion',
    goneBadSigns: 'Soft spots, mold on skin, fermented smell.',
  },
  {
    name: 'Blueberries',
    category: 'Fruit',
    rawLife: '1-2 weeks in fridge (unwashed)',
    cookedLife: 'N/A',
    freezerLife: '10-12 months',
    cookOrRaw: 'raw',
    cookMethod: 'Eat raw. Rinse right before eating. Never rinse before storing — moisture causes mold.',
    storage: 'Fridge in original container, DO NOT wash until use. For frozen: spread on a sheet pan, freeze, then transfer to a bag.',
    portionsPerPrep: '1 pint ≈ 3-4 servings',
    goneBadSigns: 'Mushy/leaking, mold spots, wrinkled skin.',
  },

  // --- Dairy + Extras ---
  {
    name: 'Fat-free Greek yogurt (plain)',
    category: 'Dairy',
    rawLife: 'Check date — usually 1-2 weeks unopened, 5-7 days after opening',
    cookedLife: 'N/A',
    freezerLife: 'Can freeze but texture changes — best used in smoothies after thawing',
    cookOrRaw: 'raw',
    cookMethod: 'Eat cold. Top with cinnamon, blueberries, or cacao nibs. No sweeteners needed — plain is better for your A1c.',
    storage: 'Fridge, tight lid. Liquid (whey) on top is normal — stir back in.',
    portionsPerPrep: '1 large tub ≈ 4-5 portions',
    goneBadSigns: 'Mold on surface, sour or off smell beyond normal tang, pink or yellow discoloration.',
  },
  {
    name: 'Psyllium husk powder',
    category: 'Pantry',
    rawLife: '2-3 years in pantry',
    cookedLife: 'N/A',
    freezerLife: 'Not needed',
    cookOrRaw: 'raw',
    cookMethod: 'Stir 1 tablespoon into a full 16 oz glass of water. Drink IMMEDIATELY before it thickens — it turns into gel fast.',
    storage: 'Airtight container in pantry.',
    portionsPerPrep: '1 container ≈ 30-60 servings',
    goneBadSigns: 'Clumps, musty smell (rare if kept dry).',
  },
];

// ---------------------------------------------------------------------------
// Prep Day Timeline — Sunday prep session, ordered by oven/stove timing
// ---------------------------------------------------------------------------

export const PREP_TIMELINE: PrepStep[] = [
  { time: '0:00', icon: 'O', title: 'Preheat + workspace setup',
    detail: 'Preheat oven to 400°F. Clear a big section of counter. Pull out: 2 sheet pans (line with parchment), 1 glass baking dish for salmon, a large pot for lentils, a non-stick skillet, tongs, a sharp knife, and 6-8 glass meal prep containers with lids.' },
  { time: '0:05', icon: '~', title: 'Wash + prep all vegetables',
    detail: 'Wash broccoli, asparagus, green beans, and blueberries. Cut broccoli into florets. Snap woody ends off asparagus. Trim green beans. Dry everything well — wet veg steams instead of roasts. Shred purple cabbage (or leave for later in the week).' },
  { time: '0:15', icon: '#', title: 'Sweet potatoes into oven',
    detail: 'Pierce 4-5 sweet potatoes all over with a fork. Place directly on the oven rack or on a sheet pan. They cook for 45-50 min, so they go in first. Set a 45-min timer.' },
  { time: '0:20', icon: '*', title: 'Season chicken breasts',
    detail: 'Pat 3 lb chicken dry with paper towels. Season both sides generously with garlic powder, onion powder, black pepper, and Mrs. Dash. Brush lightly with lemon juice. Place on a parchment-lined sheet pan, not touching each other.' },
  { time: '0:25', icon: '#', title: 'Chicken into oven',
    detail: 'Chicken goes on the middle rack (sweet potatoes can go to the top rack or bottom — just not blocking airflow). Cook 20-25 min until internal temp hits 165°F. Set a 22-min timer.' },
  { time: '0:30', icon: '~', title: 'Start lentils on stovetop',
    detail: 'Rinse 1 cup dry lentils. Combine with 2.5 cups water in a pot. Bring to a boil, then reduce to a simmer. Cover and cook 20-25 min until tender. Season at the end with garlic powder, onion powder, and black pepper.' },
  { time: '0:35', icon: '+', title: 'Toss asparagus + broccoli',
    detail: 'On a separate sheet pan, toss asparagus spears with garlic powder, black pepper, and a squeeze of lemon juice. On another, toss broccoli florets with the same. They roast after the chicken comes out.' },
  { time: '0:47', icon: '#', title: 'Pull chicken, check temp',
    detail: 'Check chicken with a meat thermometer — 165°F internal. If not done, give it 3-5 more min. Remove and let rest on a cutting board, loosely tented with foil. Do NOT slice yet — it needs to rest 10 min or juices run out.' },
  { time: '0:50', icon: '+', title: 'Asparagus + broccoli into oven',
    detail: 'Both sheet pans into the oven at 425°F. Roast 10-12 min for asparagus, 18-20 min for broccoli. Asparagus comes out first. Everything should be slightly charred but not burnt.' },
  { time: '0:55', icon: '~', title: 'Prep green beans',
    detail: 'Heat a dry non-stick pan on medium. Add green beans, a splash of lemon juice, garlic powder, and black pepper. Sauté 4-5 min until crisp-tender. Remove from heat.' },
  { time: '1:02', icon: '#', title: 'Pull asparagus',
    detail: 'Asparagus should be tender with crispy tips. Pull the pan out. Leave broccoli in for 5-8 more min.' },
  { time: '1:05', icon: '#', title: 'Pull sweet potatoes',
    detail: 'Test with a fork — should slide in easily. Pull and let cool on the counter. DO NOT unwrap or cut yet — let cool at least 15 min.' },
  { time: '1:10', icon: '#', title: 'Pull broccoli',
    detail: 'Broccoli should be tender with slightly charred tips. Remove.' },
  { time: '1:15', icon: '*', title: 'Slice and portion chicken',
    detail: 'Chicken has rested. Slice against the grain into meal-size portions (roughly 6-8 oz each). Count 5 portions.' },
  { time: '1:20', icon: '+', title: 'Check lentils',
    detail: 'Lentils should be tender but not mushy. Drain any excess water. Season and transfer to a glass container.' },
  { time: '1:25', icon: '*', title: 'Wipe skillet, wait on salmon',
    detail: 'DO NOT cook the salmon today. Salmon goes in on Wednesday — it only lasts 3 days cooked. Put your salmon fillets in the freezer if you won\'t cook them Wednesday.' },
  { time: '1:30', icon: 'O', title: 'Portion into containers — build all you can now',
    detail: 'Grab 10 containers, tape, and a Sharpie. Build these right now:\n\nMON LUNCH: 6-7 oz chicken + 1 cup broccoli + 1 cup green beans + 3/4 cup lentils\nMON DINNER: 6-8 oz chicken + 1 cup asparagus + 1 sweet potato (cabbage shred later)\nTUE LUNCH: 6-7 oz chicken + 1 cup broccoli + 1 cup green beans + 3/4 cup lentils\nTUE DINNER: 6-8 oz chicken + 1 cup asparagus + 1 sweet potato\nWED LUNCH: last chicken (~6 oz) + remaining broccoli + green beans + 3/4 cup lentils\n\nSet aside in a separate container:\n- Remaining lentils for Thu-Fri lunches\n- Remaining sweet potatoes for Wed-Thu dinners\n\nDO NOT container these (prep fresh later):\n- Salmon (cook Wed + Thu + Fri nights)\n- Asparagus for Wed-Sun (roast fresh in small batches)\n- Purple cabbage (shred fresh each dinner)\n- Breakfast egg whites (cook each morning)\n\nStack containers in fridge: Mon in front, Wed in back. Snack cans + fruit go in a separate shelf zone.' },
  { time: '1:45', icon: '~', title: 'Final cleanup',
    detail: 'Wash pans while they\'re still warm (easier). Wipe the counters. Stack containers in the fridge. Refill water bottles for tomorrow. Prep day done.' },
];

// ---------------------------------------------------------------------------
// Container Map — exact pairings for the week
// ---------------------------------------------------------------------------

export const CONTAINER_MAP_4MEAL: ContainerMap[] = [
  // --- MONDAY ---
  { day: 'Mon', meal: 'Breakfast (Meal 1)', label: 'MON BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Mon', meal: 'Lunch (Meal 2)', label: 'MON LUNCH', contents: ['Container: 6-7 oz sliced chicken breast', 'Container: 1 cup steamed broccoli', 'Container: 1 cup green beans', 'Container: 3/4 cup cooked lentils'] },
  { day: 'Mon', meal: 'Snack (Meal 3)', label: 'MON SNACK', contents: ['Bag/container: 1 can sardines (keep sealed until eating)', '1 apple (whole, in a separate bag)'] },
  { day: 'Mon', meal: 'Dinner (Meal 4)', label: 'MON DINNER', contents: ['Container: 6-8 oz sliced chicken breast', 'Container: 1 cup roasted asparagus', 'Shred fresh: 1 cup purple cabbage slaw with lemon + pepper', '1 baked sweet potato (from Sunday batch)'] },

  // --- TUESDAY ---
  { day: 'Tue', meal: 'Breakfast (Meal 1)', label: 'TUE BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Tue', meal: 'Lunch (Meal 2)', label: 'TUE LUNCH', contents: ['Container: 6-7 oz sliced chicken breast', 'Container: 1 cup steamed broccoli', 'Container: 1 cup green beans', 'Container: 3/4 cup cooked lentils'] },
  { day: 'Tue', meal: 'Snack (Meal 3)', label: 'TUE SNACK', contents: ['1 can sardines (sealed)', '1 apple'] },
  { day: 'Tue', meal: 'Dinner (Meal 4)', label: 'TUE DINNER', contents: ['Container: 6-8 oz sliced chicken breast', 'Container: 1 cup roasted asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (from Sunday batch)'] },

  // --- WEDNESDAY (midweek fresh cook) ---
  { day: 'Wed', meal: 'Breakfast (Meal 1)', label: 'WED BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Wed', meal: 'Lunch (Meal 2)', label: 'WED LUNCH', contents: ['Container: last of Sunday chicken (~6 oz)', 'Container: remaining broccoli', 'Container: remaining green beans', 'Container: 3/4 cup lentils'] },
  { day: 'Wed', meal: 'Snack (Meal 3)', label: 'WED SNACK', contents: ['1 can sardines (sealed)', '1 orange'] },
  { day: 'Wed', meal: 'Dinner (Meal 4) — COOK FRESH', label: 'WED DINNER (FRESH)', contents: ['Cook fresh tonight: 6-8 oz wild salmon fillet (400°F, 12-15 min, lemon + garlic + Mrs. Dash)', 'Roast fresh: 1 cup asparagus (425°F, 10 min)', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (from Sunday batch)'] },

  // --- THURSDAY ---
  { day: 'Thu', meal: 'Breakfast (Meal 1)', label: 'THU BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Thu', meal: 'Lunch (Meal 2)', label: 'THU LUNCH', contents: ['Container: leftover salmon from Wed (~6 oz)', 'Container: leftover asparagus from Wed roast', 'Shred fresh: 1 cup purple cabbage', 'Container: 3/4 cup lentils (from Sunday batch, still good through Fri)'] },
  { day: 'Thu', meal: 'Snack (Meal 3)', label: 'THU SNACK', contents: ['1 can sardines (sealed)', '1 orange'] },
  { day: 'Thu', meal: 'Dinner (Meal 4) — COOK FRESH', label: 'THU DINNER (FRESH)', contents: ['Cook fresh: 6-8 oz wild salmon fillet', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (bake 2 more if Sunday batch is gone)'] },

  // --- FRIDAY ---
  { day: 'Fri', meal: 'Breakfast (Meal 1)', label: 'FRI BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Fri', meal: 'Lunch (Meal 2)', label: 'FRI LUNCH', contents: ['Container: leftover salmon from Thu (~6 oz)', 'Container: leftover asparagus from Thu', 'Shred fresh: 1 cup purple cabbage', 'Container: last of lentils (5 days post-cook — smell check first)'] },
  { day: 'Fri', meal: 'Snack (Meal 3)', label: 'FRI SNACK', contents: ['1 can sardines (sealed)', '1 apple'] },
  { day: 'Fri', meal: 'Dinner (Meal 4) — COOK FRESH', label: 'FRI DINNER (FRESH)', contents: ['Cook fresh: 6-8 oz wild salmon (last of the week\'s supply)', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato'] },

  // --- SATURDAY ---
  { day: 'Sat', meal: 'Breakfast (Meal 1)', label: 'SAT BREAKFAST', contents: ['Cook fresh: 1 cup egg whites (or 6 oz Greek yogurt if switching up)', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Sat', meal: 'Lunch (Meal 2)', label: 'SAT LUNCH', contents: ['Cook fresh: 6-7 oz ground turkey (brown in skillet, 8-10 min)', '1 cup steamed broccoli (fresh batch, steam 4-5 min)', '1 cup green beans (sauté 4-5 min)', '3/4 cup black beans (drain + rinse 1 can, heat 3-4 min)'] },
  { day: 'Sat', meal: 'Snack (Meal 3)', label: 'SAT SNACK', contents: ['1 can sardines (sealed)', '1 apple or orange'] },
  { day: 'Sat', meal: 'Dinner (Meal 4)', label: 'SAT DINNER', contents: ['Cook fresh: 6-8 oz ground turkey', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato'] },

  // --- SUNDAY ---
  { day: 'Sun', meal: 'Breakfast (Meal 1)', label: 'SUN BREAKFAST', contents: ['Cook fresh: 1 cup egg whites scrambled', '1 cup blueberries', 'Psyllium in water (if approved)'] },
  { day: 'Sun', meal: 'Lunch (Meal 2)', label: 'SUN LUNCH', contents: ['Leftover ground turkey from Sat (~6 oz)', 'Leftover broccoli + green beans from Sat', '3/4 cup black beans (from Sat can)', 'Or cook fresh if Sat leftovers are gone'] },
  { day: 'Sun', meal: 'Snack (Meal 3)', label: 'SUN SNACK', contents: ['Last can sardines', '1 orange'] },
  { day: 'Sun', meal: 'Dinner (Meal 4)', label: 'SUN DINNER', contents: ['Cook fresh: shrimp (2-3 min/side until pink) or remaining ground turkey', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato'] },
];

export const CONTAINER_MAP_2MEAL: ContainerMap[] = [
  // --- MONDAY ---
  { day: 'Mon', meal: 'Meal 1 (12:00 PM)', label: 'MON MEAL 1', contents: ['Container: 8 oz sliced chicken breast', 'Container: 1 cup steamed broccoli + 1 cup sautéed spinach', 'Container: 1 cup black beans (drained, rinsed, heated)', '1 apple (whole, in a separate bag)'] },
  { day: 'Mon', meal: 'Meal 2 (6:30 PM)', label: 'MON MEAL 2', contents: ['Container: 8 oz sliced chicken breast', 'Container: 1 cup roasted asparagus', 'Shred fresh: 1 cup purple cabbage slaw with lemon + pepper', '1 baked sweet potato (from Sunday batch)'] },

  // --- TUESDAY ---
  { day: 'Tue', meal: 'Meal 1 (12:00 PM)', label: 'TUE MEAL 1', contents: ['Container: 8 oz sliced chicken breast', 'Container: 1 cup steamed broccoli + 1 cup green beans', 'Container: 1 cup black beans', '1 apple'] },
  { day: 'Tue', meal: 'Meal 2 (6:30 PM)', label: 'TUE MEAL 2', contents: ['Container: 8 oz sliced chicken breast', 'Container: 1 cup roasted asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (from Sunday batch)', 'Greek yogurt + cinnamon if still hungry'] },

  // --- WEDNESDAY (midweek fresh cook) ---
  { day: 'Wed', meal: 'Meal 1 (12:00 PM)', label: 'WED MEAL 1', contents: ['Container: last of Sunday chicken (~8 oz)', 'Container: remaining broccoli + spinach', 'Container: 1 cup black beans', '1 orange'] },
  { day: 'Wed', meal: 'Meal 2 (6:30 PM) — COOK FRESH', label: 'WED MEAL 2 (FRESH)', contents: ['Cook fresh: 8 oz wild salmon fillet (400°F, 12-15 min, lemon + garlic + Mrs. Dash)', 'Roast fresh: 1 cup asparagus (425°F, 10 min)', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (from Sunday batch)'] },

  // --- THURSDAY ---
  { day: 'Thu', meal: 'Meal 1 (12:00 PM)', label: 'THU MEAL 1', contents: ['Container: leftover salmon from Wed (~8 oz)', 'Container: leftover asparagus from Wed', 'Container: 1 cup lentils (cook fresh small batch: 1/2 cup dry, simmer 20 min)', '1 apple'] },
  { day: 'Thu', meal: 'Meal 2 (6:30 PM) — COOK FRESH', label: 'THU MEAL 2 (FRESH)', contents: ['Cook fresh: 8 oz wild salmon fillet', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato (bake 2 more if Sunday batch gone)'] },

  // --- FRIDAY ---
  { day: 'Fri', meal: 'Meal 1 (12:00 PM)', label: 'FRI MEAL 1', contents: ['Container: leftover salmon from Thu (~8 oz)', 'Container: 1 cup steamed broccoli (fresh batch, steam 4-5 min)', 'Container: 1 cup green beans (sauté 4-5 min)', 'Container: remaining lentils from Thu', '1 orange'] },
  { day: 'Fri', meal: 'Meal 2 (6:30 PM) — COOK FRESH', label: 'FRI MEAL 2 (FRESH)', contents: ['Cook fresh: 8 oz wild salmon (last fillet)', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato', 'Greek yogurt + cinnamon if still hungry'] },

  // --- SATURDAY ---
  { day: 'Sat', meal: 'Meal 1 (12:00 PM)', label: 'SAT MEAL 1', contents: ['Cook fresh: 8 oz ground turkey (brown 8-10 min)', '1 cup steamed broccoli (fresh)', '1 cup green beans (fresh)', '1 cup black beans (drain + rinse 1 can, heat 3-4 min)', '1 apple'] },
  { day: 'Sat', meal: 'Meal 2 (6:30 PM)', label: 'SAT MEAL 2', contents: ['Cook fresh: 8 oz ground turkey', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato'] },

  // --- SUNDAY ---
  { day: 'Sun', meal: 'Meal 1 (12:00 PM)', label: 'SUN MEAL 1', contents: ['Leftover ground turkey from Sat (~8 oz) or cook fresh shrimp (2-3 min/side)', '1 cup steamed broccoli + 1 cup spinach', '1 cup black beans from Sat can', '1 orange or 1 cup blueberries'] },
  { day: 'Sun', meal: 'Meal 2 (6:30 PM)', label: 'SUN MEAL 2', contents: ['Cook fresh: shrimp or remaining ground turkey', 'Roast fresh: 1 cup asparagus', 'Shred fresh: 1 cup purple cabbage slaw', '1 baked sweet potato', 'Greek yogurt + cinnamon if still hungry'] },
];

// ---------------------------------------------------------------------------
// Midweek check — Wednesday checklist
// ---------------------------------------------------------------------------

export const MIDWEEK_CHECK = [
  { title: 'Cook salmon fresh tonight', detail: 'Do NOT use salmon prepped Sunday — it\'s past the 3-day window. Bake fresh: 400°F, 12-15 min, with lemon + garlic + Mrs. Dash.' },
  { title: 'Check chicken smell and color', detail: 'If it smells off or looks gray, toss it. Otherwise good through Thursday (4 days post-prep).' },
  { title: 'Smell the lentils', detail: 'Should smell neutral/earthy. Sour = toss. Good through Friday (5 days post-cook).' },
  { title: 'Shred more purple cabbage if needed', detail: 'Raw cabbage stores 3-4 weeks whole but shredded only 5-7 days. Shred what you need for the next 3-4 days.' },
  { title: 'Roast asparagus fresh for tonight + tomorrow', detail: 'Sunday asparagus is done. 10-12 min at 425°F gives you 2 days worth.' },
  { title: 'Re-check sweet potato stock', detail: 'Sunday-baked sweet potatoes good through Sunday next week. Bake 2 more if running low.' },
  { title: 'Refill water bottle supply', detail: 'Restock your grab-and-go water if you went through more than half the week\'s supply.' },
  { title: 'Pull blueberries or apples for the weekend', detail: 'If using frozen blueberries, move a day\'s portion to the fridge overnight to thaw.' },
];

// ---------------------------------------------------------------------------
// Quick Reference — cook temps, seasoning cheat sheet, reheating
// ---------------------------------------------------------------------------

export const QUICK_REFS: QuickRef[] = [
  {
    title: 'Protein internal temps',
    items: [
      { label: 'Chicken breast', value: '165°F' },
      { label: 'Ground turkey', value: '165°F' },
      { label: 'Wild salmon', value: '145°F (flakes with fork)' },
      { label: 'Shrimp', value: 'Pink, 2-3 min/side (no thermometer needed)' },
    ],
  },
  {
    title: 'Seasoning cheat sheet',
    items: [
      { label: 'Chicken / turkey', value: 'Garlic + onion + black pepper + Mrs. Dash' },
      { label: 'Salmon', value: 'Lemon + garlic + black pepper + Mrs. Dash' },
      { label: 'Sardines', value: 'Lemon + black pepper (nothing else needed)' },
      { label: 'Egg whites', value: 'Black pepper + garlic powder' },
      { label: 'Broccoli / asparagus', value: 'Garlic powder + black pepper + lemon (roasted)' },
      { label: 'Green beans', value: 'Garlic + black pepper + lemon (sautéed dry)' },
      { label: 'Purple cabbage slaw', value: 'Lemon + black pepper (raw, no cooking)' },
      { label: 'Lentils', value: 'Garlic + onion + black pepper' },
      { label: 'Sweet potato', value: 'Nothing, or a dash of cinnamon' },
    ],
  },
  {
    title: 'Reheating',
    items: [
      { label: 'Chicken (microwave)', value: '60 sec + 30 sec if needed. Cover with a damp paper towel.' },
      { label: 'Chicken (oven, crispier)', value: '350°F, 8-10 min, covered loosely with foil' },
      { label: 'Roasted veg', value: 'Microwave 45-60 sec, or pan-heat 2-3 min for crispiness' },
      { label: 'Lentils / beans', value: 'Microwave 60-90 sec, splash of water if dry' },
      { label: 'Sweet potato', value: 'Microwave 90 sec to 2 min whole, or slice + pan-heat' },
      { label: 'NEVER reheat salmon in microwave', value: 'Oven at 275°F for 10 min OR eat cold. Microwave ruins it.' },
    ],
  },
  {
    title: 'Spoilage red flags (toss immediately)',
    items: [
      { label: 'Any meat', value: 'Gray color, slimy texture, sour smell' },
      { label: 'Salmon', value: 'Strong fishy smell, dry/mushy texture' },
      { label: 'Cooked beans/lentils', value: 'Sour smell, white film on surface' },
      { label: 'Leafy greens', value: 'Slimy, wet, yellow/black spots' },
      { label: 'Any can', value: 'Bulging, hissing when opened, dents along the seam' },
    ],
  },
];
