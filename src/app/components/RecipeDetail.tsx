import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface Ingredient {
  id: string;
  name: string;
  weight: number;
}

interface RecipeDetailProps {
  recipeName: string;
  ingredients: Ingredient[];
  onBack: () => void;
  onUpdateRecipe: (name: string, ingredients: Ingredient[]) => void;
}

export default function RecipeDetail({
  recipeName,
  ingredients,
  onBack,
  onUpdateRecipe,
}: RecipeDetailProps) {
  const [name, setName] = useState(recipeName);
  const [editableIngredients, setEditableIngredients] = useState(ingredients);

  const handleIngredientChange = (
    id: string,
    field: "name" | "weight",
    value: string | number,
  ) => {
    setEditableIngredients(
      editableIngredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  const handleDeleteIngredient = (id: string) => {
    setEditableIngredients(editableIngredients.filter((ing) => ing.id !== id));
  };

  const handleAddIngredient = () => {
    const newId = String(Date.now());
    setEditableIngredients([
      ...editableIngredients,
      { id: newId, name: "New Ingredient", weight: 0 },
    ]);
  };

  const handleSave = () => {
    onUpdateRecipe(name, editableIngredients);
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 py-4 bg-card shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h2>Edit Recipe</h2>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        <div>
          <label className="block mb-2 text-sm text-muted-foreground">
            Recipe Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-4 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif"
            placeholder="My Sourdough Recipe"
          />
        </div>

        <p className="text-sm text-muted-foreground bg-secondary/20 rounded-xl p-4">
          Recipe quantities are for <strong>1 loaf</strong>. Use the loaves
          selector on the main page to scale.
        </p>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Ingredients</h3>
            <button
              onClick={handleAddIngredient}
              className="flex items-center gap-2 px-4 h-10 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-4 space-y-3">
            {editableIngredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className={`p-3 rounded-xl border border-border ${index !== editableIngredients.length - 1 ? "border-b" : ""}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(
                          ingredient.id,
                          "name",
                          e.target.value,
                        )
                      }
                      className="flex-1 h-11 px-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="Ingredient name"
                    />
                    <button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-muted-foreground whitespace-nowrap">
                      Weight
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={ingredient.weight}
                        onChange={(e) =>
                          handleIngredientChange(
                            ingredient.id,
                            "weight",
                            Number(e.target.value),
                          )
                        }
                        className="w-full h-11 px-3 pr-8 bg-input-background border border-border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                        g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
