import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
}

interface RecipeManagementProps {
  recipes: Recipe[];
  onBack: () => void;
  onEditRecipe: (id: string) => void;
  onDeleteRecipe: (id: string) => void;
  onNewRecipe: () => void;
}

export default function RecipeManagement({ recipes, onBack, onEditRecipe, onDeleteRecipe, onNewRecipe }: RecipeManagementProps) {
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
          <h2>Manage Recipes</h2>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        <button
          onClick={onNewRecipe}
          className="w-full h-14 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Recipe
        </button>

        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-card rounded-xl shadow-md p-4 flex items-center justify-between gap-4"
            >
              <h3 className="font-serif flex-1 truncate">{recipe.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditRecipe(recipe.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent/20 text-accent transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (recipes.length <= 1) {
                      alert('You must keep at least one recipe');
                      return;
                    }
                    if (confirm(`Delete "${recipe.name}"?`)) {
                      onDeleteRecipe(recipe.id);
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
