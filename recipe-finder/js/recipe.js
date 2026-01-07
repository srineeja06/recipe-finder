const title = document.getElementById("recipeTitle");
const image = document.getElementById("recipeImage");
const mealType = document.getElementById("recipeMeal");
const time = document.getElementById("recipeTime");
const ingredientList = document.getElementById("ingredientList");
const stepsList = document.getElementById("recipeSteps");
const relatedContainer = document.getElementById("relatedRecipes");

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

if (!recipeId) {
    alert("Recipe not found");
} else {
    fetchRecipe();
}

async function fetchRecipe() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );
    const data = await res.json();
    const recipe = data.meals[0];

    displayRecipe(recipe);
    fetchRelated(recipe.strCategory);
}

function displayRecipe(recipe) {
    title.textContent = recipe.strMeal;
    image.src = recipe.strMealThumb;
    mealType.textContent = recipe.strCategory || "N/A";
    ingredientList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        const qty = recipe[`strMeasure${i}`];

        if (ing && ing.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = `${qty} ${ing}`;
            ingredientList.appendChild(li);
        }
    }

    stepsList.innerHTML = "";
    recipe.strInstructions.split(".").forEach(step => {
        if (step.trim()) {
            const li = document.createElement("li");
            li.textContent = step.trim();
            stepsList.appendChild(li);
        }
    });
}

async function fetchRelated(category) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await res.json();

    relatedContainer.innerHTML = "";

    data.meals.slice(0, 4).forEach(meal => {
        const card = document.createElement("div");
        card.className = "related-card";

        card.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h4>${meal.strMeal}</h4>
        `;

        card.onclick = () => {
            window.location.href = `recipe.html?id=${meal.idMeal}`;
        };

        relatedContainer.appendChild(card);
    });
}
