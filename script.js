//to toggle the menu 
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
            nav.classList.remove('active');
        }
    });
});

  
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

// Your Edamam API credentials
    const APP_ID = '7cfd6ac6'; // Replace with your actual App ID
    const APP_KEY = '2567c52b071ba71cab42268d0d0e58f5'; // Replace with your actual App Key
    
    // Function to fetch recipes based on the search query
    function fetchRecipes(query) {
        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.hits.length === 0) {
                    document.getElementById('searchMessage').innerText = 'No recipes found.';
                } else {
                    displayRecipes(data.hits);
                    document.getElementById('searchMessage').innerText = ''; // Clear previous messages
                }
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                document.getElementById('searchMessage').innerText = 'Error fetching recipes. Please try again.';
            });
    }
    
    // Function to display the fetched recipes
    function displayRecipes(recipes) {
        const resultsDiv = document.getElementById('recipe-list');
        resultsDiv.innerHTML = ''; // Clear previous results
    
        recipes.forEach(recipe => {
            const recipeCard = `
                <div class="recipe-card">
                    <h3>${recipe.recipe.label}</h3>
                    <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" />
                    <p><a href="${recipe.recipe.url}" target="_blank">View Recipe</a></p>
                    <p>Ingredients: ${recipe.recipe.ingredientLines.join(', ')}</p>
                </div>
            `;
            resultsDiv.innerHTML += recipeCard; // Add each recipe to the results div
        });
    }
    
    // Event listener for the search button (for recipes)
    document.getElementById('recipeSearchBtn').addEventListener('click', () => {
        const query = document.getElementById('recipeSearch').value.trim();
        if (query) {
            fetchRecipes(query); // Fetch recipes based on user input
        } else {
            document.getElementById('searchMessage').innerText = 'Please enter a recipe name.';
        }
    })


  