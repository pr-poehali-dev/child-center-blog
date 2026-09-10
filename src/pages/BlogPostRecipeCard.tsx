import Icon from "@/components/ui/icon";
import { Post } from "./useBlogPostData";

interface BlogPostRecipeCardProps {
  post: Post;
  ingredientsList: string[];
  stepsList: string[];
}

export default function BlogPostRecipeCard({ post, ingredientsList, stepsList }: BlogPostRecipeCardProps) {
  return (
    <div className="mb-6 rounded-3xl border-2 border-green-100 bg-[#fffdf5] overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2">
        <span className="text-xl">📖</span>
        <span className="text-white font-black text-sm tracking-wide uppercase">Рецепт</span>
      </div>
      <div className="p-5">
        {(post.recipe_time?.trim() || post.recipe_servings?.trim()) && (
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-dashed border-green-200">
            {post.recipe_time?.trim() && (
              <div className="flex items-center gap-2 text-gray-700">
                <Icon name="Clock" size={18} className="text-green-500" />
                <span className="text-sm font-bold">{post.recipe_time}</span>
              </div>
            )}
            {post.recipe_servings?.trim() && (
              <div className="flex items-center gap-2 text-gray-700">
                <Icon name="Users" size={18} className="text-green-500" />
                <span className="text-sm font-bold">{post.recipe_servings}</span>
              </div>
            )}
          </div>
        )}

        {(post.recipe_calories?.trim() || post.recipe_proteins?.trim() || post.recipe_fats?.trim() || post.recipe_carbs?.trim()) && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">КБЖУ на порцию</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Ккал", value: post.recipe_calories },
                { label: "Белки", value: post.recipe_proteins },
                { label: "Жиры", value: post.recipe_fats },
                { label: "Углев.", value: post.recipe_carbs },
              ].map((item, i) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-xl py-2.5 text-center">
                  <div className="font-black text-green-700 text-base">{item.value || "—"}</div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ingredientsList.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ингредиенты</p>
            <ul className="flex flex-col gap-2">
              {ingredientsList.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 w-4 h-4 rounded-full border-2 border-green-400 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stepsList.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Приготовление</p>
            <ol className="flex flex-col gap-3">
              {stepsList.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
