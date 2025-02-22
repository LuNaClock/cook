import { useState } from 'react';
import { Recipe, Category, MainSubCategory } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { RecipeForm } from '@/components/RecipeForm';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// サンプルデータ
const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: '醤油ラーメン',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80',
    ingredients: [
      { name: '麺', amount: '1', unit: 'appropriate' },
      { name: '醤油スープ', amount: '400', unit: 'liter' },
      { name: 'チャーシュー', amount: '2', unit: 'appropriate' },
      { name: 'メンマ', amount: '30', unit: 'gram' },
      { name: 'ネギ', amount: '1', unit: 'appropriate' }
    ],
    steps: ['スープを沸かす', '麺を茹でる', '具材を盛り付ける'],
    notes: '好みで辛子を加えても美味しい',
    category: 'main',
    subCategory: 'noodles',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '親子丼',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80',
    ingredients: [
      { name: '米', amount: '1', unit: 'appropriate' },
      { name: '鶏肉', amount: '200', unit: 'gram' },
      { name: '玉ねぎ', amount: '1', unit: 'appropriate' },
      { name: '卵', amount: '2', unit: 'appropriate' },
      { name: 'だし汁', amount: '200', unit: 'liter' }
    ],
    steps: ['だし汁で具材を煮る', '卵を流し入れる', 'ご飯の上に盛り付ける'],
    notes: '半熟卵がおすすめ',
    category: 'main',
    subCategory: 'donburi',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'ほうれん草のお浸し',
    image: 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?auto=format&fit=crop&q=80',
    ingredients: [
      { name: 'ほうれん草', amount: '1', unit: 'appropriate' },
      { name: 'かつお節', amount: '1', unit: 'appropriate' },
      { name: '醤油', amount: '1', unit: 'large' }
    ],
    steps: ['ほうれん草を茹でる', '水気を絞る', '調味料で味付けする'],
    category: 'side',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: '味噌汁',
    image: 'https://images.unsplash.com/photo-1547928576-b822bc410bdf?auto=format&fit=crop&q=80',
    ingredients: [
      { name: 'だし汁', amount: '400', unit: 'liter' },
      { name: '味噌', amount: '2', unit: 'large' },
      { name: 'わかめ', amount: '1', unit: 'pinch' },
      { name: '豆腐', amount: '1/4', unit: 'appropriate' }
    ],
    steps: ['だし汁を沸かす', '具材を入れる', '味噌を溶く'],
    category: 'soup',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [selectedCategory, setSelectedCategory] = useState<Category>('main');
  const [selectedSubCategory, setSelectedSubCategory] = useState<MainSubCategory>('noodles');

  const filteredRecipes = recipes.filter((recipe) => {
    if (recipe.category !== selectedCategory) return false;
    if (selectedCategory === 'main' && recipe.subCategory !== selectedSubCategory) return false;
    return true;
  });

  const handleAddRecipe = (newRecipe: Partial<Recipe>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Math.random().toString(36).substr(2, 9),
      category: newRecipe.category || selectedCategory,
      subCategory: newRecipe.category === 'main' ? (newRecipe.subCategory || selectedSubCategory) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: newRecipe.ingredients || [],
      steps: newRecipe.steps || [],
      title: newRecipe.title || '',
      image: newRecipe.image || '',
    };

    setRecipes([...recipes, recipe]);
    toast.success('レシピを追加しました');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">レシピ管理</h1>
        
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategorySelect={setSelectedCategory}
            onSubCategorySelect={setSelectedSubCategory}
          />
        </div>

        <div className="mb-8">
          <RecipeForm onSubmit={handleAddRecipe} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;