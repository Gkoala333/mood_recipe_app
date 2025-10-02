let currentMood = null;
let excludedRecipeIds = [];

// Mood emojis
const moodEmojis = {
  'Happy': '😊',
  'Sad': '😢',
  'Energetic': '⚡',
  'Tired': '😴',
  'Stressed': '😰',
  'Relaxed': '😌',
  'Romantic': '💕',
  'Adventurous': '🌟',
  'Nostalgic': '🕰️',
  'Confident': '💪'
};

// Load moods on page load
async function loadMoods() {
  try {
    const response = await fetch('/api/moods');
    const moods = await response.json();
    
    const container = document.getElementById('moods-container');
    container.innerHTML = '';
    
    moods.forEach(mood => {
      const button = document.createElement('button');
      button.className = 'bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:scale-105 transition transform shadow-lg hover:shadow-xl';
      button.innerHTML = `
        <div class="text-4xl mb-2">${moodEmojis[mood] || '🍽️'}</div>
        <div class="font-semibold">${mood}</div>
      `;
      button.onclick = () => selectMood(mood);
      container.appendChild(button);
    });
  } catch (error) {
    console.error('Error loading moods:', error);
  }
}

// Select a mood
async function selectMood(mood) {
  currentMood = mood;
  excludedRecipeIds = [];
  await loadRecipe();
}

// Load recipe
async function loadRecipe() {
  const moodSelection = document.getElementById('mood-selection');
  const recipeDisplay = document.getElementById('recipe-display');
  const loading = document.getElementById('loading');
  
  moodSelection.classList.add('hidden');
  recipeDisplay.classList.add('hidden');
  loading.classList.remove('hidden');
  
  try {
    const excludeParam = excludedRecipeIds.length > 0 ? `?exclude=${excludedRecipeIds.join(',')}` : '';
    const response = await fetch(`/api/recipes/${currentMood}${excludeParam}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        alert('No more recipes available for this mood. Try another mood!');
        goBack();
        return;
      }
      throw new Error('Failed to load recipe');
    }
    
    const recipe = await response.json();
    excludedRecipeIds.push(recipe.id);
    displayRecipe(recipe);
    
    loading.classList.add('hidden');
    recipeDisplay.classList.remove('hidden');
  } catch (error) {
    console.error('Error loading recipe:', error);
    loading.classList.add('hidden');
    moodSelection.classList.remove('hidden');
    alert('Failed to load recipe. Please try again.');
  }
}

// Display recipe
function displayRecipe(recipe) {
  const content = document.getElementById('recipe-content');
  const ingredientsList = recipe.ingredients.split(',').map(i => i.trim());
  const instructionsList = recipe.instructions.split('\n').filter(i => i.trim());
  
  content.innerHTML = `
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-5xl">${moodEmojis[recipe.mood] || '🍽️'}</span>
        <div>
          <h2 class="text-3xl font-bold text-gray-800">${recipe.name}</h2>
          <p class="text-purple-600 font-medium">Perfect for when you're feeling ${recipe.mood.toLowerCase()}</p>
        </div>
      </div>
      <div class="bg-purple-50 rounded-lg p-3 inline-block">
        <span class="text-purple-700 font-semibold">⏱️ ${recipe.prep_time}</span>
      </div>
    </div>
    
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        🛒 Ingredients
      </h3>
      <ul class="space-y-2">
        ${ingredientsList.map(ingredient => `
          <li class="flex items-start">
            <span class="text-purple-600 mr-2">•</span>
            <span class="text-gray-700">${ingredient}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center">
        👨‍🍳 Instructions
      </h3>
      <ol class="space-y-3">
        ${instructionsList.map((instruction, index) => `
          <li class="flex items-start">
            <span class="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-semibold">${index + 1}</span>
            <span class="text-gray-700 pt-0.5">${instruction}</span>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

// Go back to mood selection
function goBack() {
  document.getElementById('recipe-display').classList.add('hidden');
  document.getElementById('mood-selection').classList.remove('hidden');
  currentMood = null;
  excludedRecipeIds = [];
}

// Event listeners
document.getElementById('back-button').addEventListener('click', goBack);
document.getElementById('new-recipe-button').addEventListener('click', loadRecipe);

// Initialize
loadMoods();