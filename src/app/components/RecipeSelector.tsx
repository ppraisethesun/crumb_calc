import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

interface Recipe {
  id: string;
  name: string;
}

interface RecipeSelectorProps {
  recipes: Recipe[];
  currentRecipeId: string;
  onSelectRecipe: (id: string) => void;
  onNewRecipe: () => void;
}

export default function RecipeSelector({ recipes, currentRecipeId, onSelectRecipe, onNewRecipe }: RecipeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentRecipe = recipes.find(r => r.id === currentRecipeId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-10 bg-card rounded-lg shadow-sm hover:bg-muted transition-colors"
      >
        <span className="font-serif text-primary/80">{currentRecipe?.name || 'Select Recipe'}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 right-0 bg-card rounded-xl shadow-2xl border border-border z-20 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    onSelectRecipe(recipe.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                    recipe.id === currentRecipeId ? 'bg-accent/10 text-accent' : 'text-primary'
                  }`}
                >
                  {recipe.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                onNewRecipe();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-2 border-t border-border hover:bg-muted transition-colors text-accent"
            >
              <Plus className="w-4 h-4" />
              New Recipe
            </button>
          </div>
        </>
      )}
    </div>
  );
}
