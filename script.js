// Load saved recipes from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadSavedRecipes();
});

// Function to save recipe to localStorage
function saveRecipe(recipe) {
    // Get existing recipes from localStorage or initialize as empty array
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Add new recipe to the list
    recipes.push(recipe);

    // Save updated list back to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Reload the recipes on the page
    loadSavedRecipes();
}

// Function to load saved recipes from localStorage
function loadSavedRecipes() {
    // Get saved recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Find the container where we want to show the saved recipes
    const savedRecipesContainer = document.querySelector('.saved-recipes');

    // Clear any previous content
    savedRecipesContainer.innerHTML = '';

    // Check if there are saved recipes
    if (recipes.length === 0) {
        savedRecipesContainer.innerHTML = '<p>No recipes saved yet.</p>';
        return;
    }

    // Display each saved recipe
    recipes.forEach((recipe, index) => {
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');

        recipeItem.innerHTML = `
            <h4>${recipe.name}</h4>
            <p class="recipe-description">${recipe.description}</p>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        // Append the new recipe to the container
        savedRecipesContainer.appendChild(recipeItem);

        // Add event listener to toggle visibility of the recipe description
        recipeItem.addEventListener('click', function () {
            recipeItem.classList.toggle('active');
        });

        // Add event listener to the delete button
        const deleteButton = recipeItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent toggling description on button click
            deleteRecipe(index);
        });
    });
}

// Function to delete a recipe from localStorage
function deleteRecipe(index) {
    // Get the recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Remove the recipe by its index
    recipes.splice(index, 1);

    // Save the updated list back to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Reload the recipes on the page
    loadSavedRecipes();
}

// Form submission handler
const recipeForm = document.getElementById('recipe-form');
recipeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const recipeName = document.getElementById('recipe-name').value;
    const recipeDescription = document.getElementById('recipe-description').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    // Create a recipe object
    const newRecipe = {
        name: recipeName,
        description: recipeDescription,
        ingredients: ingredients,
        instructions: instructions
    };

    // Save the recipe to localStorage
    saveRecipe(newRecipe);

    // Reset the form
    recipeForm.reset();
});

//recipe page 
const recipeSearchButton = document.getElementById("recipeSearchBtn");
const nutritionSearchButton = document.getElementById("calorieSearchBtn");

// Spoonacular API key (replace with your actual API key)
const API_KEY = 'YOUR_API_KEY';

// Recipe Search
fetch('https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=7cfd6ac6&app_key=2567c52b071ba71cab42268d0d0e58f5', {
    method: 'GET',
    headers: {
      'Edamam-Account-User': 'sarah1khalil'
    }
  })
    .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error fetching recipe:', error));
    .then(data => {
        if (data.hits) {
            displayRecipeResults(data.hits); // Assuming 'hits' contains the recipes
        } else {
            console.error('No recipes found');
        }
    })
    .catch(error => console.error('Error fetching recipe:', error));

// Nutrition Search
nutritionSearchButton.addEventListener('click', () => {
  const query = document.getElementById("calorieSearch").value;
  fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
    method: "GET",
    headers: {
      "X-Api-Key": "lQr2EdvDcnH+O3JATJysg==tW07VueuFsAIREtY"
    }
  })
  
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayNutritionResults(data); // Display nutrition info
    })
    .catch(error => console.error('Error fetching nutrition info:', error));
});

// Function to display recipe results
function displayRecipeResults(recipes) {
  const resultsDiv = document.getElementById('recipe-list');
  resultsDiv.innerHTML = ''; // Clear previous results
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p>Ready in ${recipe.readyInMinutes} minutes</p>
      <a href="https://spoonacular.com/recipes/${recipe.id}" target="_blank">View Recipe</a>
    `;
    resultsDiv.appendChild(recipeCard);
  });
}

// Function to display nutrition results
function displayNutritionResults(ingredients) {
  const resultsDiv = document.getElementById('nutrition-info');
  resultsDiv.innerHTML = ''; // Clear previous results
  ingredients.forEach(item => {
    const nutritionCard = document.createElement('div');
    nutritionCard.classList.add('nutrition-card');
    nutritionCard.innerHTML = `
      <h3>${item.name}</h3>
      <p>Calories: ${item.nutrition.calories} kcal</p>
      <p>Protein: ${item.nutrition.protein} g</p>
      <p>Carbs: ${item.nutrition.carbs} g</p>
      <p>Fat: ${item.nutrition.fat} g</p>
    `;
    resultsDiv.appendChild(nutritionCard);
  });
}


  