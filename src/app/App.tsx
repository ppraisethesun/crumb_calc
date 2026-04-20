import { useState, useEffect } from "react";
import { Wheat, Settings } from "lucide-react";
import IngredientRow from "./components/IngredientRow";
import TotalBar from "./components/TotalBar";
import RecipeDetail from "./components/RecipeDetail";
import RecipeSelector from "./components/RecipeSelector";
import RecipeManagement from "./components/RecipeManagement";

interface Ingredient {
  id: string;
  name: string;
  weight: number;
  icon?: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

type Screen = "calculator" | "detail" | "management";

const defaultRecipes: Recipe[] = [
  {
    id: "1",
    name: "Sourdough",
    ingredients: [
      { id: "1", name: "Bread Flour", weight: 400, icon: "🌾" },
      { id: "2", name: "Whole Wheat Flour", weight: 100, icon: "🌿" },
      { id: "3", name: "Water", weight: 325, icon: "💧" },
      { id: "4", name: "Starter", weight: 100, icon: "🫧" },
      { id: "5", name: "Salt", weight: 2, icon: "🧂" },
    ],
  },
  {
    id: "2",
    name: "Focaccia",
    ingredients: [
      { id: "1", name: "White Flour", weight: 235, icon: "🌾" },
      { id: "2", name: "Whole Wheat Flour", weight: 20, icon: "🌿" },
      { id: "3", name: "Water", weight: 195, icon: "💧" },
      { id: "4", name: "Starter", weight: 90, icon: "🫧" },
      { id: "5", name: "Salt", weight: 9, icon: "🧂" },
      { id: "6", name: "Olive Oil", weight: 11, icon: "🫒" },
    ],
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("calculator");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeId, setCurrentRecipeId] = useState("1");
  const [loafCount, setLoafCount] = useState(1);
  const [driverIngredientId, setDriverIngredientId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const saved = localStorage.getItem("crumb-calculator-recipes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecipes(parsed);
      } catch (e) {
        setRecipes(defaultRecipes);
      }
    } else {
      setRecipes(defaultRecipes);
    }
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem("crumb-calculator-recipes", JSON.stringify(recipes));
    }
  }, [recipes]);

  const currentRecipe =
    recipes.find((r) => r.id === currentRecipeId) || recipes[0];
  const baseIngredients = currentRecipe?.ingredients || [];
  const ingredients = baseIngredients.map((ing) => ({
    ...ing,
    weight: parseFloat((ing.weight * loafCount).toFixed(1)),
  }));

  const totalWeight = ingredients.reduce((sum, ing) => sum + ing.weight, 0);
  const flourWeight =
    ingredients.find((ing) => ing.name.toLowerCase().includes("flour"))
      ?.weight || 500;

  const handleIngredientWeightChange = (id: string, newWeight: number) => {
    setDriverIngredientId(id);
    const driverIngredient = ingredients.find((ing) => ing.id === id);
    if (!driverIngredient) return;

    // When current weight is 0, we can't calculate ratio, so use 1
    // This keeps other ingredients unchanged while updating only the driver
    const ratio = driverIngredient.weight === 0 ? 1 : newWeight / driverIngredient.weight;

    const updatedBaseIngredients = baseIngredients.map((ing) => {
      const scaledWeight = ing.weight * loafCount;
      const newScaledWeight =
        ing.id === id
          ? newWeight
          : parseFloat((scaledWeight * ratio).toFixed(1));
      return {
        ...ing,
        weight: parseFloat((newScaledWeight / loafCount).toFixed(1)),
      };
    });

    updateCurrentRecipeIngredients(updatedBaseIngredients);
  };

  const updateCurrentRecipeIngredients = (updatedIngredients: Ingredient[]) => {
    setRecipes(
      recipes.map((r) =>
        r.id === currentRecipeId
          ? { ...r, ingredients: updatedIngredients }
          : r,
      ),
    );
  };

  const handleUpdateRecipe = (
    name: string,
    updatedIngredients: Ingredient[],
  ) => {
    setRecipes(
      recipes.map((r) =>
        r.id === currentRecipeId
          ? { ...r, name, ingredients: updatedIngredients }
          : r,
      ),
    );
  };

  const handleNewRecipe = () => {
    const newId = String(Date.now());
    const newRecipe: Recipe = {
      id: newId,
      name: "New Recipe",
      ingredients: [
        { id: "1", name: "Bread Flour", weight: 500 },
        { id: "2", name: "Water", weight: 375 },
        { id: "3", name: "Salt", weight: 10 },
      ],
    };
    setRecipes([...recipes, newRecipe]);
    setCurrentRecipeId(newId);
    setScreen("detail");
  };

  const handleDeleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter((r) => r.id !== id);
    setRecipes(updatedRecipes);
    if (currentRecipeId === id && updatedRecipes.length > 0) {
      setCurrentRecipeId(updatedRecipes[0].id);
    }
  };

  const handleEditRecipe = (id: string) => {
    setCurrentRecipeId(id);
    setScreen("detail");
  };

  const hydration = Math.round(
    ((ingredients.find((ing) => ing.name === "Water")?.weight || 0) /
      flourWeight) *
      100,
  );

  if (screen === "detail") {
    return (
      <RecipeDetail
        recipeName={currentRecipe?.name || ""}
        ingredients={ingredients}
        onBack={() => setScreen("calculator")}
        onUpdateRecipe={handleUpdateRecipe}
      />
    );
  }

  if (screen === "management") {
    return (
      <RecipeManagement
        recipes={recipes}
        onBack={() => setScreen("calculator")}
        onEditRecipe={handleEditRecipe}
        onDeleteRecipe={handleDeleteRecipe}
        onNewRecipe={handleNewRecipe}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <header className="px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wheat className="w-6 h-6 text-accent" strokeWidth={2} />
          <h1 className="font-serif">Crumb Calculator</h1>
        </div>
        <button
          onClick={() => setScreen("management")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5 text-primary" strokeWidth={2} />
        </button>
      </header>

      <div className="px-4 mb-6">
        <RecipeSelector
          recipes={recipes}
          currentRecipeId={currentRecipeId}
          onSelectRecipe={setCurrentRecipeId}
          onNewRecipe={handleNewRecipe}
        />
      </div>

      <div className="px-4 mb-4">
        <div className="bg-secondary/20 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Loaves</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLoafCount(Math.max(1, loafCount - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-card hover:bg-accent/20 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={loafCount}
              onChange={(e) =>
                setLoafCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-12 h-8 text-center bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              onClick={() => setLoafCount(loafCount + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-card hover:bg-accent/20 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl shadow-lg p-4 space-y-1">
          {ingredients.map((ingredient, index) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              isDriver={driverIngredientId === ingredient.id}
              onWeightChange={(newWeight) =>
                handleIngredientWeightChange(ingredient.id, newWeight)
              }
              isLast={index === ingredients.length - 1}
            />
          ))}
        </div>
      </div>

      <TotalBar totalWeight={totalWeight} hydration={hydration} />
    </div>
  );
}
