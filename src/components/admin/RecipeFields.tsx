interface RecipeFieldsProps {
  recipeTime: string;
  setRecipeTime: (v: string) => void;
  recipeServings: string;
  setRecipeServings: (v: string) => void;
  recipeCalories: string;
  setRecipeCalories: (v: string) => void;
  recipeProteins: string;
  setRecipeProteins: (v: string) => void;
  recipeFats: string;
  setRecipeFats: (v: string) => void;
  recipeCarbs: string;
  setRecipeCarbs: (v: string) => void;
  recipeIngredients: string;
  setRecipeIngredients: (v: string) => void;
  recipeSteps: string;
  setRecipeSteps: (v: string) => void;
}

export default function RecipeFields({
  recipeTime, setRecipeTime,
  recipeServings, setRecipeServings,
  recipeCalories, setRecipeCalories,
  recipeProteins, setRecipeProteins,
  recipeFats, setRecipeFats,
  recipeCarbs, setRecipeCarbs,
  recipeIngredients, setRecipeIngredients,
  recipeSteps, setRecipeSteps,
}: RecipeFieldsProps) {
  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
      <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
        <span>🥗</span> Оформление рецепта (необязательно)
      </label>
      <div className="bg-white/70 border border-green-200 rounded-xl px-3 py-2.5 text-[11px] text-gray-500 leading-relaxed">
        <span className="font-bold text-green-700">Как заполнять:</span> время — «20 минут»; порции — «4 порции»; КБЖУ — числами без единиц; ингредиенты и шаги — каждый пункт с новой строки, без нумерации (цифры добавятся сами).
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={recipeTime}
          onChange={e => setRecipeTime(e.target.value)}
          placeholder="Время, напр. 30 мин"
          className="w-full border border-green-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        <input
          type="text"
          value={recipeServings}
          onChange={e => setRecipeServings(e.target.value)}
          placeholder="Порций, напр. 4"
          className="w-full border border-green-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5">КБЖУ на порцию</p>
        <div className="grid grid-cols-4 gap-2">
          <input type="text" value={recipeCalories} onChange={e => setRecipeCalories(e.target.value)} placeholder="Ккал" className="w-full border border-green-200 bg-white rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-green-400" />
          <input type="text" value={recipeProteins} onChange={e => setRecipeProteins(e.target.value)} placeholder="Белки" className="w-full border border-green-200 bg-white rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-green-400" />
          <input type="text" value={recipeFats} onChange={e => setRecipeFats(e.target.value)} placeholder="Жиры" className="w-full border border-green-200 bg-white rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-green-400" />
          <input type="text" value={recipeCarbs} onChange={e => setRecipeCarbs(e.target.value)} placeholder="Углев." className="w-full border border-green-200 bg-white rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-green-400" />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5">Ингредиенты — каждый с новой строки</p>
        <textarea
          rows={4}
          value={recipeIngredients}
          onChange={e => setRecipeIngredients(e.target.value)}
          placeholder={"Рисовая мука — 100 г\nЯйца — 2 шт\nМолоко без лактозы — 150 мл"}
          className="w-full border border-green-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none"
        />
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1.5">Шаги приготовления — каждый шаг с новой строки</p>
        <textarea
          rows={5}
          value={recipeSteps}
          onChange={e => setRecipeSteps(e.target.value)}
          placeholder={"Взбить яйца с молоком\nДобавить муку и перемешать\nЖарить блины на среднем огне"}
          className="w-full border border-green-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none"
        />
      </div>
      <p className="text-xs text-gray-400">Если заполнить — статья отобразится как страница из кулинарной книги, с карточками КБЖУ и пронумерованными шагами</p>
    </div>
  );
}
