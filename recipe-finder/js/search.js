const ingredientInput = document.getElementById("ingredientInput");
const ingredientContainer = document.getElementById("ingredientContainer");
const form = document.getElementById("searchForm");
const clearBtn = document.getElementById("clearBtn");


let ingredients = [];

/* Add ingredient chip */
function addIngredient(value) {
    if (value === "" || ingredients.includes(value)) return;

    ingredients.push(value);

    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `${value} <span>&times;</span>`;

    // Remove chip
    chip.querySelector("span").addEventListener("click", () => {
        ingredientContainer.removeChild(chip);
        ingredients = ingredients.filter(i => i !== value);
    });

    ingredientContainer.insertBefore(chip, ingredientInput);
}

/* Create chip ONLY on comma */
ingredientInput.addEventListener("keydown", function (e) {
    if (e.key === ",") {
        e.preventDefault();

        const value = ingredientInput.value
            .replace(",", "")
            .trim()
            .toLowerCase();

        if (value !== "") {
            addIngredient(value);
            ingredientInput.value = "";
        }
    }
});


/* Form submit */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(
        '.filter-group input[type="checkbox"]'
    );

    let meals = [];
    let times = [];

    checkboxes.forEach(cb => {
        if (cb.checked) {
            if (
                cb.value === "Breakfast" ||
                cb.value === "Lunch" ||
                cb.value === "Dinner" ||
                cb.value === "Snack" ||
                cb.value === "Dessert"
            ) {
                meals.push(cb.value);
            } else {
                times.push(cb.value);
            }
        }
    });

    const query = new URLSearchParams();

    if (ingredients.length > 0) {
        query.append("ingredients", ingredients.join(","));
    }
    if (meals.length > 0) {
        query.append("meals", meals.join(","));
    }
    if (times.length > 0) {
        query.append("time", times.join(","));
    }

    window.location.href = `results.html?${query.toString()}`;
});

clearBtn.addEventListener("click", () => {
  ingredients = [];
  ingredientContainer.innerHTML = "";
  ingredientContainer.appendChild(ingredientInput);
  ingredientInput.value = "";
});
