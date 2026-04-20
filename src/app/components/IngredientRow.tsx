import { useState, useEffect } from 'react';

interface Ingredient {
  id: string;
  name: string;
  weight: number;
  icon?: string;
}

interface IngredientRowProps {
  ingredient: Ingredient;
  isDriver: boolean;
  onWeightChange: (weight: number) => void;
  isLast: boolean;
  disabled?: boolean;
}

export default function IngredientRow({ ingredient, isDriver, onWeightChange, isLast, disabled }: IngredientRowProps) {
  const [isChanged, setIsChanged] = useState(false);
  const [inputValue, setInputValue] = useState(String(ingredient.weight));

  useEffect(() => {
    setInputValue(String(ingredient.weight));
    setIsChanged(true);
    const timer = setTimeout(() => setIsChanged(false), 300);
    return () => clearTimeout(timer);
  }, [ingredient.weight]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onWeightChange(numValue);
    }
  };

  return (
    <div
      className={`py-4 px-3 rounded-xl transition-all duration-300 ${
        isDriver ? 'bg-accent/20' : ''
      } ${isChanged ? 'animate-pulse-subtle' : ''} ${!isLast ? 'border-b border-border/50' : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {ingredient.icon && <span className="text-lg">{ingredient.icon}</span>}
            <h3 className="truncate">{ingredient.name}</h3>
            {isDriver && (
              <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                Based on this
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleInputChange}
              disabled={disabled}
              className={`w-24 h-11 px-3 pr-8 bg-input-background border border-border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
