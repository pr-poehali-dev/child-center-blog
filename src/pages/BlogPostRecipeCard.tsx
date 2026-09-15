import Icon from "@/components/ui/icon";
import honeyStar from "@/assets/honey-star.png";
import { Post } from "./useBlogPostData";

interface BlogPostRecipeCardProps {
  post: Post;
  ingredientsList: string[];
  stepsList: string[];
}

export default function BlogPostRecipeCard({ post, ingredientsList, stepsList }: BlogPostRecipeCardProps) {
  return (
    <div className="mb-6 rounded-3xl overflow-hidden" style={{ background: "#FBF6EE", boxShadow: "0 2px 5px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.07)" }}>
      <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#E8985F" }}>
        <img src={honeyStar} alt="" className="w-5 h-5" />
        <span className="font-golos text-white font-bold text-sm tracking-wide uppercase">Рецепт</span>
      </div>
      <div className="p-5">
        {(post.recipe_time?.trim() || post.recipe_servings?.trim()) && (
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-dashed" style={{ borderColor: "#EADFC8" }}>
            {post.recipe_time?.trim() && (
              <div className="flex items-center gap-2" style={{ color: "#17364A" }}>
                <Icon name="Clock" size={18} style={{ color: "#D9A441" }} />
                <span className="font-golos text-sm font-bold">{post.recipe_time}</span>
              </div>
            )}
            {post.recipe_servings?.trim() && (
              <div className="flex items-center gap-2" style={{ color: "#17364A" }}>
                <Icon name="Users" size={18} style={{ color: "#D9A441" }} />
                <span className="font-golos text-sm font-bold">{post.recipe_servings}</span>
              </div>
            )}
          </div>
        )}

        {(post.recipe_calories?.trim() || post.recipe_proteins?.trim() || post.recipe_fats?.trim() || post.recipe_carbs?.trim()) && (
          <div className="mb-5">
            <p className="font-golos text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">КБЖУ на порцию</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Ккал", value: post.recipe_calories },
                { label: "Белки", value: post.recipe_proteins },
                { label: "Жиры", value: post.recipe_fats },
                { label: "Углев.", value: post.recipe_carbs },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl py-2.5 text-center" style={{ border: "1px solid #EADFC8" }}>
                  <div className="font-playfair font-bold text-base" style={{ color: "#17364A" }}>{item.value || "—"}</div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ingredientsList.length > 0 && (
          <div className="mb-5">
            <p className="font-golos text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ингредиенты</p>
            <ul className="flex flex-col gap-2">
              {ingredientsList.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 font-golos text-sm text-gray-700">
                  <span className="mt-0.5 w-4 h-4 rounded-full shrink-0" style={{ border: "2px solid #D9A441" }} />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stepsList.length > 0 && (
          <div>
            <p className="font-golos text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Приготовление</p>
            <ol className="flex flex-col gap-3">
              {stepsList.map((step, i) => (
                <li key={i} className="flex items-start gap-3 font-golos text-sm text-gray-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#D9A441" }}>{i + 1}</span>
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
