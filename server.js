const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('Frontend'));

// Initialize SQLite database
const db = new sqlite3.Database('./recipes.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');
    initializeDatabase();
  }
});

// Create tables and seed data
function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mood TEXT NOT NULL,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time TEXT,
    image_url TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err);
    } else {
      seedRecipes();
    }
  });
}

// Seed database with recipes
function seedRecipes() {
  db.get("SELECT COUNT(*) as count FROM recipes", (err, row) => {
    if (row.count === 0) {
      const moods = ['Happy', 'Sad', 'Energetic', 'Tired', 'Stressed', 'Relaxed', 'Romantic', 'Adventurous', 'Nostalgic', 'Confident'];
      
      const recipeTemplates = {
        'Happy': [
          { name: 'Rainbow Fruit Salad', ingredients: 'Strawberries, Blueberries, Mango, Kiwi, Pineapple, Honey', instructions: '1. Chop all fruits into bite-sized pieces\n2. Mix in a large bowl\n3. Drizzle with honey\n4. Serve chilled', prep_time: '15 mins' },
          { name: 'Sunshine Pancakes', ingredients: 'Flour, Eggs, Milk, Butter, Lemon zest, Maple syrup', instructions: '1. Mix flour, eggs, and milk\n2. Add lemon zest\n3. Cook on griddle until golden\n4. Serve with maple syrup', prep_time: '20 mins' },
          { name: 'Cheerful Veggie Stir-fry', ingredients: 'Bell peppers, Broccoli, Carrots, Soy sauce, Garlic, Ginger', instructions: '1. Heat oil in wok\n2. Stir-fry vegetables\n3. Add soy sauce and seasonings\n4. Serve over rice', prep_time: '25 mins' },
          { name: 'Joyful Smoothie Bowl', ingredients: 'Banana, Berries, Yogurt, Granola, Honey, Chia seeds', instructions: '1. Blend banana, berries, and yogurt\n2. Pour into bowl\n3. Top with granola and chia seeds\n4. Drizzle with honey', prep_time: '10 mins' },
          { name: 'Bright Lemon Pasta', ingredients: 'Pasta, Lemon, Parmesan, Basil, Olive oil, Garlic', instructions: '1. Cook pasta al dente\n2. Toss with lemon juice and zest\n3. Add olive oil and garlic\n4. Top with parmesan and basil', prep_time: '20 mins' },
          { name: 'Happy Hummus Wrap', ingredients: 'Tortilla, Hummus, Cucumber, Tomatoes, Lettuce, Feta', instructions: '1. Spread hummus on tortilla\n2. Add fresh vegetables\n3. Sprinkle with feta\n4. Roll and enjoy', prep_time: '10 mins' },
          { name: 'Sunny Side Up Toast', ingredients: 'Bread, Eggs, Avocado, Cherry tomatoes, Salt, Pepper', instructions: '1. Toast bread until golden\n2. Fry eggs sunny side up\n3. Top toast with mashed avocado\n4. Add egg and tomatoes', prep_time: '15 mins' },
          { name: 'Colorful Quinoa Bowl', ingredients: 'Quinoa, Chickpeas, Red onion, Cucumber, Feta, Lemon dressing', instructions: '1. Cook quinoa according to package\n2. Mix with roasted chickpeas\n3. Add fresh vegetables\n4. Drizzle with lemon dressing', prep_time: '30 mins' },
          { name: 'Blissful Berry Parfait', ingredients: 'Greek yogurt, Mixed berries, Granola, Honey, Mint', instructions: '1. Layer yogurt in glass\n2. Add berries and granola\n3. Repeat layers\n4. Top with honey and mint', prep_time: '8 mins' },
          { name: 'Golden Grilled Cheese', ingredients: 'Bread, Cheddar cheese, Butter, Tomato, Basil', instructions: '1. Butter bread slices\n2. Add cheese, tomato, and basil\n3. Grill until golden and melty\n4. Serve hot', prep_time: '10 mins' }
        ],
        'Sad': [
          { name: 'Comfort Mac and Cheese', ingredients: 'Macaroni, Cheddar cheese, Milk, Butter, Breadcrumbs', instructions: '1. Cook macaroni\n2. Make cheese sauce with butter, milk, and cheese\n3. Combine and top with breadcrumbs\n4. Bake until golden', prep_time: '35 mins' },
          { name: 'Warm Chicken Soup', ingredients: 'Chicken, Carrots, Celery, Onion, Noodles, Herbs', instructions: '1. Simmer chicken with vegetables\n2. Shred chicken and return to pot\n3. Add noodles and herbs\n4. Serve hot', prep_time: '45 mins' },
          { name: 'Chocolate Brownie', ingredients: 'Chocolate, Butter, Sugar, Eggs, Flour, Vanilla', instructions: '1. Melt chocolate and butter\n2. Mix with sugar and eggs\n3. Fold in flour\n4. Bake until fudgy', prep_time: '40 mins' },
          { name: 'Creamy Mashed Potatoes', ingredients: 'Potatoes, Butter, Cream, Garlic, Chives, Salt', instructions: '1. Boil potatoes until tender\n2. Mash with butter and cream\n3. Add roasted garlic\n4. Garnish with chives', prep_time: '30 mins' },
          { name: 'Hot Chocolate Supreme', ingredients: 'Milk, Cocoa powder, Sugar, Vanilla, Marshmallows, Cream', instructions: '1. Heat milk in saucepan\n2. Whisk in cocoa and sugar\n3. Add vanilla\n4. Top with marshmallows and cream', prep_time: '10 mins' },
          { name: 'Tomato Basil Soup', ingredients: 'Tomatoes, Basil, Cream, Garlic, Onion, Vegetable broth', instructions: '1. Sauté onion and garlic\n2. Add tomatoes and broth\n3. Blend until smooth\n4. Stir in cream and basil', prep_time: '35 mins' },
          { name: 'Grilled Cheese Deluxe', ingredients: 'Sourdough bread, Multiple cheeses, Butter, Tomato soup', instructions: '1. Layer different cheeses on bread\n2. Butter outsides generously\n3. Grill until perfectly melted\n4. Serve with tomato soup', prep_time: '15 mins' },
          { name: 'Chicken Pot Pie', ingredients: 'Chicken, Mixed vegetables, Cream sauce, Puff pastry, Butter', instructions: '1. Cook chicken and vegetables\n2. Make creamy sauce\n3. Pour into dish and top with pastry\n4. Bake until golden', prep_time: '60 mins' },
          { name: 'Banana Bread', ingredients: 'Ripe bananas, Flour, Sugar, Eggs, Butter, Walnuts', instructions: '1. Mash bananas\n2. Mix with wet ingredients\n3. Fold in flour and walnuts\n4. Bake until golden', prep_time: '70 mins' },
          { name: 'Warm Apple Crisp', ingredients: 'Apples, Oats, Brown sugar, Butter, Cinnamon, Vanilla ice cream', instructions: '1. Slice apples and arrange in dish\n2. Mix oats, sugar, and butter for topping\n3. Bake until bubbly\n4. Serve with ice cream', prep_time: '50 mins' }
        ],
        'Energetic': [
          { name: 'Power Protein Bowl', ingredients: 'Quinoa, Grilled chicken, Edamame, Avocado, Seeds, Tahini', instructions: '1. Cook quinoa\n2. Top with protein and vegetables\n3. Add healthy fats\n4. Drizzle with tahini', prep_time: '25 mins' },
          { name: 'Energy Balls', ingredients: 'Dates, Almonds, Cocoa powder, Coconut, Chia seeds, Honey', instructions: '1. Blend dates and almonds\n2. Add cocoa and coconut\n3. Roll into balls\n4. Refrigerate until firm', prep_time: '15 mins' },
          { name: 'Açai Energy Bowl', ingredients: 'Açai puree, Banana, Granola, Berries, Peanut butter, Coconut', instructions: '1. Blend açai with banana\n2. Pour into bowl\n3. Top with granola and fruits\n4. Add peanut butter drizzle', prep_time: '10 mins' },
          { name: 'Veggie Egg Scramble', ingredients: 'Eggs, Spinach, Mushrooms, Peppers, Feta, Whole grain toast', instructions: '1. Scramble eggs\n2. Add sautéed vegetables\n3. Top with feta\n4. Serve with toast', prep_time: '15 mins' },
          { name: 'Turkey Avocado Wrap', ingredients: 'Whole wheat wrap, Turkey, Avocado, Lettuce, Tomato, Mustard', instructions: '1. Layer turkey on wrap\n2. Add fresh vegetables\n3. Spread avocado\n4. Roll tightly', prep_time: '10 mins' },
          { name: 'Green Power Smoothie', ingredients: 'Spinach, Banana, Mango, Protein powder, Almond milk, Flax seeds', instructions: '1. Add all ingredients to blender\n2. Blend until smooth\n3. Add ice if desired\n4. Serve immediately', prep_time: '5 mins' },
          { name: 'Salmon Poke Bowl', ingredients: 'Salmon, Brown rice, Cucumber, Seaweed, Sesame, Soy ginger sauce', instructions: '1. Cook rice\n2. Cube fresh salmon\n3. Arrange with vegetables\n4. Drizzle with sauce', prep_time: '20 mins' },
          { name: 'Mediterranean Plate', ingredients: 'Hummus, Falafel, Pita, Cucumber, Tomatoes, Olives', instructions: '1. Arrange hummus on plate\n2. Add warm falafel\n3. Include fresh vegetables\n4. Serve with pita', prep_time: '25 mins' },
          { name: 'Shrimp Stir-fry', ingredients: 'Shrimp, Snap peas, Carrots, Ginger, Garlic, Rice noodles', instructions: '1. Cook noodles\n2. Stir-fry shrimp quickly\n3. Add vegetables and seasonings\n4. Toss with noodles', prep_time: '20 mins' },
          { name: 'Chia Pudding Powerhouse', ingredients: 'Chia seeds, Almond milk, Protein powder, Berries, Almonds, Honey', instructions: '1. Mix chia with milk overnight\n2. Stir in protein powder\n3. Top with fruits and nuts\n4. Serve chilled', prep_time: '10 mins + overnight' }
        ],
        'Tired': [
          { name: 'Easy Ramen Bowl', ingredients: 'Instant ramen, Egg, Green onions, Nori, Sesame oil, Chili flakes', instructions: '1. Cook ramen according to package\n2. Add soft-boiled egg\n3. Top with green onions and nori\n4. Drizzle with sesame oil', prep_time: '12 mins' },
          { name: 'Simple Quesadilla', ingredients: 'Tortilla, Cheese, Black beans, Salsa, Sour cream', instructions: '1. Place cheese on tortilla\n2. Add beans\n3. Fold and cook until crispy\n4. Serve with salsa', prep_time: '10 mins' },
          { name: 'Lazy Pasta Carbonara', ingredients: 'Spaghetti, Bacon, Eggs, Parmesan, Black pepper, Garlic', instructions: '1. Cook pasta\n2. Fry bacon\n3. Mix with egg and cheese\n4. Toss with hot pasta', prep_time: '20 mins' },
          { name: 'One-Pot Rice Bowl', ingredients: 'Rice, Chicken broth, Frozen vegetables, Soy sauce, Sesame seeds', instructions: '1. Cook rice in broth\n2. Add frozen vegetables\n3. Season with soy sauce\n4. Top with sesame seeds', prep_time: '25 mins' },
          { name: 'Avocado Toast', ingredients: 'Bread, Avocado, Egg, Salt, Pepper, Chili flakes', instructions: '1. Toast bread\n2. Mash avocado on top\n3. Add fried egg\n4. Season and serve', prep_time: '8 mins' },
          { name: 'Microwave Mug Cake', ingredients: 'Flour, Sugar, Cocoa, Milk, Oil, Vanilla', instructions: '1. Mix all in mug\n2. Microwave 90 seconds\n3. Let cool slightly\n4. Enjoy warm', prep_time: '5 mins' },
          { name: 'BLT Sandwich', ingredients: 'Bread, Bacon, Lettuce, Tomato, Mayo, Avocado', instructions: '1. Cook bacon until crispy\n2. Toast bread\n3. Layer all ingredients\n4. Cut and serve', prep_time: '15 mins' },
          { name: 'Frozen Pizza Upgrade', ingredients: 'Frozen pizza, Fresh basil, Extra cheese, Red pepper flakes, Olive oil', instructions: '1. Bake pizza as directed\n2. Add extra cheese halfway through\n3. Top with fresh basil\n4. Drizzle with olive oil', prep_time: '18 mins' },
          { name: 'Instant Oatmeal Bowl', ingredients: 'Instant oats, Banana, Peanut butter, Honey, Cinnamon, Milk', instructions: '1. Make oatmeal with milk\n2. Slice banana on top\n3. Add peanut butter and honey\n4. Sprinkle with cinnamon', prep_time: '5 mins' },
          { name: 'Canned Soup Upgrade', ingredients: 'Canned tomato soup, Cream, Garlic bread, Basil, Parmesan', instructions: '1. Heat soup\n2. Stir in cream\n3. Serve with garlic bread\n4. Garnish with basil', prep_time: '10 mins' }
        ],
        'Stressed': [
          { name: 'Lavender Chamomile Tea', ingredients: 'Chamomile tea, Lavender, Honey, Lemon, Mint', instructions: '1. Steep tea and lavender\n2. Add honey and lemon\n3. Garnish with mint\n4. Sip slowly', prep_time: '8 mins' },
          { name: 'Calming Buddha Bowl', ingredients: 'Brown rice, Roasted vegetables, Chickpeas, Tahini, Spinach, Seeds', instructions: '1. Roast vegetables slowly\n2. Cook rice mindfully\n3. Arrange in bowl\n4. Drizzle with tahini', prep_time: '40 mins' },
          { name: 'Dark Chocolate Treats', ingredients: 'Dark chocolate, Almonds, Sea salt, Coconut oil, Dried berries', instructions: '1. Melt chocolate gently\n2. Stir in almonds and berries\n3. Spread on parchment\n4. Sprinkle with salt and chill', prep_time: '20 mins' },
          { name: 'Herbal Risotto', ingredients: 'Arborio rice, Vegetable broth, White wine, Parmesan, Fresh herbs', instructions: '1. Toast rice\n2. Add broth gradually while stirring\n3. Stir in cheese and herbs\n4. Serve creamy', prep_time: '35 mins' },
          { name: 'Green Tea Smoothie', ingredients: 'Matcha powder, Banana, Spinach, Almond milk, Honey, Ice', instructions: '1. Blend all ingredients\n2. Taste and adjust sweetness\n3. Add ice for chill\n4. Drink slowly', prep_time: '5 mins' },
          { name: 'Soothing Miso Soup', ingredients: 'Miso paste, Tofu, Seaweed, Green onions, Mushrooms, Water', instructions: '1. Heat water gently\n2. Dissolve miso paste\n3. Add tofu and vegetables\n4. Serve warm', prep_time: '15 mins' },
          { name: 'Herbed Salmon', ingredients: 'Salmon fillet, Dill, Lemon, Olive oil, Asparagus, Garlic', instructions: '1. Season salmon with herbs\n2. Roast with asparagus\n3. Drizzle with lemon\n4. Serve on warm plate', prep_time: '25 mins' },
          { name: 'Turmeric Latte', ingredients: 'Milk, Turmeric, Ginger, Cinnamon, Honey, Black pepper', instructions: '1. Heat milk gently\n2. Whisk in spices\n3. Add honey to taste\n4. Foam and serve', prep_time: '8 mins' },
          { name: 'Calming Porridge', ingredients: 'Oats, Almond milk, Cinnamon, Banana, Walnuts, Maple syrup', instructions: '1. Cook oats slowly\n2. Stir frequently\n3. Top with banana and nuts\n4. Drizzle with syrup', prep_time: '15 mins' },
          { name: 'Herbal Pasta', ingredients: 'Pasta, Olive oil, Fresh basil, Garlic, Parmesan, Pine nuts', instructions: '1. Cook pasta al dente\n2. Toss with olive oil and garlic\n3. Add fresh herbs\n4. Top with parmesan', prep_time: '20 mins' }
        ],
        'Relaxed': [
          { name: 'Lazy Sunday Brunch', ingredients: 'Croissants, Smoked salmon, Cream cheese, Capers, Orange juice', instructions: '1. Slice croissants\n2. Spread cream cheese\n3. Layer salmon and capers\n4. Serve with juice', prep_time: '10 mins' },
          { name: 'Chilled Gazpacho', ingredients: 'Tomatoes, Cucumber, Peppers, Garlic, Olive oil, Bread', instructions: '1. Blend all vegetables\n2. Chill for few hours\n3. Blend with bread\n4. Serve cold', prep_time: '15 mins + chill' },
          { name: 'Caprese Salad', ingredients: 'Tomatoes, Mozzarella, Basil, Olive oil, Balsamic, Salt', instructions: '1. Slice tomatoes and mozzarella\n2. Arrange alternating\n3. Add basil leaves\n4. Drizzle with oil and vinegar', prep_time: '10 mins' },
          { name: 'Bruschetta', ingredients: 'Baguette, Tomatoes, Garlic, Basil, Olive oil, Salt', instructions: '1. Toast bread slices\n2. Rub with garlic\n3. Top with tomato mixture\n4. Drizzle with oil', prep_time: '15 mins' },
          { name: 'Greek Salad', ingredients: 'Cucumber, Tomatoes, Feta, Olives, Red onion, Oregano', instructions: '1. Chop all vegetables\n2. Toss gently\n3. Add feta and olives\n4. Dress with oil and oregano', prep_time: '12 mins' },
          { name: 'Charcuterie Board', ingredients: 'Various cheeses, Cured meats, Crackers, Grapes, Nuts, Honey', instructions: '1. Arrange cheeses on board\n2. Add meats artfully\n3. Fill gaps with fruits and nuts\n4. Add crackers and honey', prep_time: '15 mins' },
          { name: 'Iced Fruit Tea', ingredients: 'Fruit tea, Fresh fruits, Ice, Mint, Honey, Sparkling water', instructions: '1. Brew tea and cool\n2. Add fresh fruits\n3. Pour over ice\n4. Top with sparkling water', prep_time: '10 mins' },
          { name: 'Cold Noodle Salad', ingredients: 'Soba noodles, Cucumber, Carrots, Sesame dressing, Edamame, Sesame seeds', instructions: '1. Cook and cool noodles\n2. Julienne vegetables\n3. Toss with dressing\n4. Garnish with seeds', prep_time: '20 mins' },
          { name: 'Antipasto Plate', ingredients: 'Prosciutto, Mozzarella, Roasted peppers, Artichokes, Olives, Bread', instructions: '1. Arrange meats and cheese\n2. Add marinated vegetables\n3. Include olives\n4. Serve with bread', prep_time: '10 mins' },
          { name: 'Watermelon Feta Salad', ingredients: 'Watermelon, Feta, Mint, Lime, Olive oil, Black pepper', instructions: '1. Cube watermelon\n2. Crumble feta on top\n3. Add mint leaves\n4. Dress with lime and oil', prep_time: '8 mins' }
        ],
        'Romantic': [
          { name: 'Candlelit Pasta', ingredients: 'Linguine, Cherry tomatoes, Garlic, Basil, White wine, Parmesan', instructions: '1. Cook pasta al dente\n2. Sauté garlic and tomatoes\n3. Deglaze with wine\n4. Toss with pasta and basil', prep_time: '25 mins' },
          { name: 'Chocolate Fondue', ingredients: 'Dark chocolate, Cream, Strawberries, Marshmallows, Pound cake, Brandy', instructions: '1. Melt chocolate with cream\n2. Add splash of brandy\n3. Prepare dipping items\n4. Keep warm and dip', prep_time: '15 mins' },
          { name: 'Lobster Tail Dinner', ingredients: 'Lobster tails, Butter, Garlic, Lemon, Parsley, White wine', instructions: '1. Butterfly lobster tails\n2. Brush with garlic butter\n3. Broil until tender\n4. Serve with wine', prep_time: '30 mins' },
          { name: 'Filet Mignon', ingredients: 'Beef tenderloin, Red wine, Butter, Garlic, Rosemary, Asparagus', instructions: '1. Sear steaks perfectly\n2. Make red wine reduction\n3. Roast asparagus\n4. Plate elegantly', prep_time: '35 mins' },
          { name: 'Oysters with Champagne', ingredients: 'Fresh oysters, Champagne mignonette, Lemon, Shallots, Black pepper', instructions: '1. Shuck oysters carefully\n2. Make mignonette sauce\n3. Arrange on ice\n4. Serve with champagne', prep_time: '20 mins' },
          { name: 'Strawberry Champagne', ingredients: 'Strawberries, Champagne, Sugar, Mint, Lemon', instructions: '1. Macerate strawberries in sugar\n2. Muddle with mint\n3. Add to champagne flute\n4. Top with champagne', prep_time: '10 mins' },
          { name: 'Scallops with Risotto', ingredients: 'Scallops, Arborio rice, White wine, Butter, Parmesan, Saffron', instructions: '1. Make creamy risotto\n2. Sear scallops to perfection\n3. Plate risotto\n4. Top with scallops', prep_time: '40 mins' },
          { name: 'Tiramisu for Two', ingredients: 'Ladyfingers, Mascarpone, Espresso, Cocoa, Amaretto, Eggs', instructions: '1. Make mascarpone cream\n2. Dip ladyfingers in espresso\n3. Layer in glasses\n4. Dust with cocoa', prep_time: '30 mins + chill' },
          { name: 'Red Wine Braised Lamb', ingredients: 'Lamb chops, Red wine, Rosemary, Garlic, Carrots, Potatoes', instructions: '1. Sear lamb chops\n2. Braise in wine and herbs\n3. Add vegetables\n4. Serve tender and rich', prep_time: '90 mins' },
          { name: 'Crème Brûlée', ingredients: 'Heavy cream, Egg yolks, Sugar, Vanilla bean, Berries', instructions: '1. Make custard base\n2. Bake in water bath\n3. Chill completely\n4. Torch sugar on top', prep_time: '60 mins + chill' }
        ],
        'Adventurous': [
          { name: 'Spicy Thai Curry', ingredients: 'Thai curry paste, Coconut milk, Chicken, Thai basil, Lime, Chili', instructions: '1. Fry curry paste\n2. Add coconut milk\n3. Simmer with protein\n4. Finish with basil and lime', prep_time: '35 mins' },
          { name: 'Korean BBQ Tacos', ingredients: 'Beef bulgogi, Corn tortillas, Kimchi, Gochujang mayo, Cilantro, Sesame', instructions: '1. Marinate and grill beef\n2. Warm tortillas\n3. Fill with bulgogi and kimchi\n4. Drizzle with spicy mayo', prep_time: '45 mins' },
          { name: 'Moroccan Tagine', ingredients: 'Lamb, Apricots, Almonds, Couscous, Ras el hanout, Chickpeas', instructions: '1. Brown lamb with spices\n2. Add dried fruits\n3. Slow cook until tender\n4. Serve over couscous', prep_time: '120 mins' },
          { name: 'Sushi Rolls', ingredients: 'Sushi rice, Nori, Salmon, Avocado, Cucumber, Wasabi', instructions: '1. Prepare sushi rice\n2. Lay out nori\n3. Roll with fillings\n4. Slice and serve', prep_time: '40 mins' },
          { name: 'Indian Curry', ingredients: 'Chicken tikka masala spices, Tomatoes, Cream, Garam masala, Naan, Basmati rice', instructions: '1. Marinate chicken in spices\n2. Make tomato curry sauce\n3. Simmer chicken in sauce\n4. Serve with naan', prep_time: '60 mins' },
          { name: 'Brazilian Feijoada', ingredients: 'Black beans, Pork, Sausage, Orange, Rice, Collard greens', instructions: '1. Soak beans overnight\n2. Cook with meats slowly\n3. Season well\n4. Serve with rice and orange', prep_time: '180 mins' },
          { name: 'Vietnamese Pho', ingredients: 'Rice noodles, Beef, Star anise, Ginger, Basil, Sriracha', instructions: '1. Make aromatic broth\n2. Cook noodles\n3. Slice beef thinly\n4. Assemble with herbs', prep_time: '90 mins' },
          { name: 'Ethiopian Doro Wat', ingredients: 'Chicken, Berbere spice, Eggs, Onions, Injera bread, Butter', instructions: '1. Cook onions until caramelized\n2. Add berbere and chicken\n3. Simmer with eggs\n4. Serve on injera', prep_time: '100 mins' },
          { name: 'Peruvian Ceviche', ingredients: 'Fresh fish, Lime juice, Red onion, Cilantro, Chili peppers, Sweet potato', instructions: '1. Dice fresh fish\n2. Marinate in lime juice\n3. Add onions and chilies\n4. Serve with sweet potato', prep_time: '30 mins' },
          { name: 'Japanese Ramen', ingredients: 'Ramen noodles, Pork belly, Miso, Soft egg, Nori, Bamboo shoots', instructions: '1. Make rich broth\n2. Cook pork belly\n3. Prepare toppings\n4. Assemble bowl', prep_time: '120 mins' }
        ],
        'Nostalgic': [
          { name: 'Classic PB&J', ingredients: 'White bread, Peanut butter, Grape jelly, Milk', instructions: '1. Spread peanut butter on bread\n2. Add jelly to other slice\n3. Press together\n4. Cut diagonally', prep_time: '5 mins' },
          { name: 'Mom\'s Meatloaf', ingredients: 'Ground beef, Breadcrumbs, Eggs, Ketchup, Onion, Mashed potatoes', instructions: '1. Mix meat with binders\n2. Shape into loaf\n3. Top with ketchup glaze\n4. Bake until done', prep_time: '75 mins' },
          { name: 'Grandma\'s Cookies', ingredients: 'Butter, Brown sugar, Chocolate chips, Flour, Vanilla, Eggs', instructions: '1. Cream butter and sugar\n2. Add eggs and vanilla\n3. Mix in flour and chips\n4. Bake until golden', prep_time: '25 mins' },
          { name: 'Chicken Nuggets', ingredients: 'Chicken breast, Breadcrumbs, Eggs, Flour, Ketchup, Honey mustard', instructions: '1. Cut chicken into pieces\n2. Bread and coat\n3. Fry or bake until crispy\n4. Serve with dipping sauces', prep_time: '30 mins' },
          { name: 'Sloppy Joes', ingredients: 'Ground beef, Tomato sauce, Brown sugar, Mustard, Hamburger buns, Pickles', instructions: '1. Brown ground beef\n2. Add sauce and seasonings\n3. Simmer until thick\n4. Serve on toasted buns', prep_time: '25 mins' },
          { name: 'Tuna Casserole', ingredients: 'Egg noodles, Canned tuna, Cream of mushroom soup, Peas, Cheese, Chips', instructions: '1. Cook noodles\n2. Mix with tuna and soup\n3. Top with cheese and chips\n4. Bake until bubbly', prep_time: '45 mins' },
          { name: 'Rice Krispie Treats', ingredients: 'Rice Krispies cereal, Marshmallows, Butter, Vanilla, Salt', instructions: '1. Melt butter and marshmallows\n2. Mix in cereal\n3. Press into pan\n4. Cut into squares', prep_time: '15 mins' },
          { name: 'Grilled Cheese & Tomato Soup', ingredients: 'White bread, American cheese, Butter, Tomato soup, Milk', instructions: '1. Butter bread and add cheese\n2. Grill until golden\n3. Heat soup with milk\n4. Serve together for dipping', prep_time: '15 mins' },
          { name: 'Breakfast Cereal Bowl', ingredients: 'Your favorite childhood cereal, Cold milk, Banana, Toast with butter', instructions: '1. Pour cereal into bowl\n2. Add cold milk\n3. Slice banana on top\n4. Enjoy with buttered toast', prep_time: '5 mins' },
          { name: 'Fish Sticks & Fries', ingredients: 'Frozen fish sticks, Frozen fries, Tartar sauce, Ketchup, Lemon', instructions: '1. Bake fish sticks per package\n2. Cook fries until crispy\n3. Arrange on plate\n4. Serve with sauces', prep_time: '30 mins' }
        ],
        'Confident': [
          { name: 'Beef Wellington', ingredients: 'Beef tenderloin, Puff pastry, Mushroom duxelles, Prosciutto, Egg wash, Truffle', instructions: '1. Sear beef perfectly\n2. Wrap in mushrooms and prosciutto\n3. Encase in puff pastry\n4. Bake to perfection', prep_time: '120 mins' },
          { name: 'Homemade Croissants', ingredients: 'Flour, Butter, Yeast, Milk, Sugar, Salt', instructions: '1. Make laminated dough\n2. Fold butter multiple times\n3. Roll and shape\n4. Proof and bake golden', prep_time: '480 mins' },
          { name: 'Soufflé', ingredients: 'Eggs, Milk, Flour, Butter, Cheese, Cream of tartar', instructions: '1. Make béchamel base\n2. Fold in whipped egg whites\n3. Bake carefully\n4. Serve immediately', prep_time: '45 mins' },
          { name: 'Duck Confit', ingredients: 'Duck legs, Duck fat, Garlic, Thyme, Bay leaves, Salt', instructions: '1. Cure duck overnight\n2. Submerge in duck fat\n3. Cook low and slow\n4. Crisp skin before serving', prep_time: '24 hours' },
          { name: 'Fresh Pasta from Scratch', ingredients: 'Flour, Eggs, Olive oil, Salt, Semolina', instructions: '1. Make pasta dough\n2. Knead until smooth\n3. Roll and cut desired shape\n4. Cook in boiling water', prep_time: '90 mins' },
          { name: 'Paella', ingredients: 'Saffron rice, Seafood, Chicken, Peppers, Peas, Paprika', instructions: '1. Build flavor base\n2. Add rice and stock\n3. Layer proteins\n4. Create socarrat crust', prep_time: '75 mins' },
          { name: 'Coq au Vin', ingredients: 'Chicken, Red wine, Bacon, Pearl onions, Mushrooms, Herbs', instructions: '1. Brown chicken and bacon\n2. Braise in wine\n3. Add vegetables\n4. Reduce to perfection', prep_time: '120 mins' },
          { name: 'Baked Alaska', ingredients: 'Cake, Ice cream, Meringue, Sugar, Vanilla, Torch', instructions: '1. Layer cake and ice cream\n2. Freeze solid\n3. Cover with meringue\n4. Torch to brown', prep_time: '60 mins + freeze' },
          { name: 'Osso Buco', ingredients: 'Veal shanks, White wine, Tomatoes, Gremolata, Risotto, Stock', instructions: '1. Braise veal in wine\n2. Cook until tender\n3. Make gremolata\n4. Serve over risotto', prep_time: '150 mins' },
          { name: 'Mille-Feuille', ingredients: 'Puff pastry, Pastry cream, Fondant, Vanilla, Sugar, Berries', instructions: '1. Bake perfect puff pastry layers\n2. Make silky pastry cream\n3. Layer carefully\n4. Top with fondant', prep_time: '180 mins' }
        ]
      };

      const stmt = db.prepare("INSERT INTO recipes (mood, name, ingredients, instructions, prep_time, image_url) VALUES (?, ?, ?, ?, ?, ?)");
      
      moods.forEach(mood => {
        recipeTemplates[mood].forEach(recipe => {
          stmt.run(mood, recipe.name, recipe.ingredients, recipe.instructions, recipe.prep_time, null);
        });
      });
      
      stmt.finalize();
      console.log('Database seeded with recipes');
    }
  });
}

// API Routes
app.get('/api/moods', (req, res) => {
  db.all("SELECT DISTINCT mood FROM recipes", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => row.mood));
    }
  });
});

app.get('/api/recipes/:mood', (req, res) => {
  const { mood } = req.params;
  const { exclude } = req.query;
  
  let query = "SELECT * FROM recipes WHERE mood = ?";
  let params = [mood];
  
  if (exclude) {
    const excludeIds = exclude.split(',').map(id => parseInt(id));
    query += " AND id NOT IN (" + excludeIds.map(() => "?").join(",") + ")";
    params.push(...excludeIds);
  }
  
  query += " ORDER BY RANDOM() LIMIT 1";
  
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'No more recipes found for this mood' });
    } else {
      res.json(row);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});