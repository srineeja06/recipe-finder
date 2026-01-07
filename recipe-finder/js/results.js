const resultsContainer = document.getElementById("resultsContainer");
const loader = document.getElementById("loader");

// Get ingredients from URL
const params = new URLSearchParams(window.location.search);
const ingredientsParam = params.get("ingredients");
const mealParam = params.get("meals"); // Lunch, Dinner, Dessert


if (!ingredientsParam) {
    resultsContainer.innerHTML = "<p>No ingredients provided.</p>";
} else {
    const ingredients = ingredientsParam.split(",").map(i => i.trim());
    loader.classList.remove("hidden");
    resultsContainer.innerHTML = "";

    fetchRecipes(ingredients);
}

// Fetch recipes by ingredients
async function fetchRecipes(ingredients) {
    let allMeals = [];

    loader.classList.remove("hidden");
    resultsContainer.innerHTML = "";

    for (let ing of ingredients) {
        try {
            const res = await fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
            );
            const data = await res.json();

            if (data.meals) {
                allMeals.push(...data.meals);
            }
        } catch (error) {
            console.error("Error fetching ingredient:", ing, error);
        }
    }

    // Remove duplicate meals
    const uniqueMeals = [];
    const seen = new Set();

    allMeals.forEach(meal => {
        if (!seen.has(meal.idMeal)) {
            seen.add(meal.idMeal);
            uniqueMeals.push(meal);
        }
    });
    loader.classList.add("hidden");


    displayRecipes(uniqueMeals);
}

function getMealSuggestion(category) {
    if (!category) return "Any time";

    if (category === "Dessert") return "Dessert";

    if (
        category === "Chicken" ||
        category === "Beef" ||
        category === "Seafood" ||
        category === "Pasta"
    ) {
        return "Lunch / Dinner";
    }

    return "Any time";
}

// Display recipes as cards
async function displayRecipes(meals) {
    loader.classList.add("hidden");

    resultsContainer.innerHTML = "";

    if (meals.length === 0) {
        resultsContainer.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    for (let meal of meals) {
        let category = "Meal";
        let area = "Various";

        try {
            const detailRes = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detailData = await detailRes.json();

            if (detailData.meals) {
                category = detailData.meals[0].strCategory || "Meal";
                area = detailData.meals[0].strArea || "Various";
            }
        } catch (error) {
            console.error("Detail fetch error:", error);
        }

        const suggestion = getMealSuggestion(category);

        const card = document.createElement("div");
        card.className = "recipe-card";

        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="card-content">
                <h3>${meal.strMeal}</h3>

                <div class="card-meta">
                    <span>🍽 ${category}</span>
                    <span>🌍 ${area}</span>
                </div>

                <div class="tag">${suggestion}</div>

                <button class="view-btn">View Recipe</button>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `recipe.html?id=${meal.idMeal}`;
        });

        resultsContainer.appendChild(card);
    }
}
