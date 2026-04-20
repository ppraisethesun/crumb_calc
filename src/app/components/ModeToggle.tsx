interface ModeToggleProps {
  mode: 'total' | 'ingredient';
  onModeChange: (mode: 'total' | 'ingredient') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="inline-flex bg-card rounded-xl p-1 shadow-md w-full">
      <button
        onClick={() => onModeChange('total')}
        className={`flex-1 h-11 px-4 rounded-lg transition-all duration-200 ${
          mode === 'total'
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        Scale by Total
      </button>
      <button
        onClick={() => onModeChange('ingredient')}
        className={`flex-1 h-11 px-4 rounded-lg transition-all duration-200 ${
          mode === 'ingredient'
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        Scale by Ingredient
      </button>
    </div>
  );
}
