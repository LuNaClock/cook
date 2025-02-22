import { useState, useEffect } from 'react';
import { Recipe, Category, MainSubCategory, Unit, Ingredient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipeFormProps {
  onSubmit: (recipe: Partial<Recipe>) => void;
  initialData?: Recipe;
}

const categories: { value: Category; label: string }[] = [
  { value: 'main', label: '主食' },
  { value: 'side', label: '副菜' },
  { value: 'soup', label: '汁物' },
  { value: 'other', label: 'その他' },
];

const subCategories: { value: MainSubCategory; label: string }[] = [
  { value: 'noodles', label: '麺類' },
  { value: 'rice', label: 'ご飯物' },
  { value: 'donburi', label: '丼もの' },
  { value: 'meat', label: '肉料理' },
  { value: 'fish', label: '魚料理' },
  { value: 'other', label: 'その他' },
];

const units: { value: Unit; label: string }[] = [
  { value: 'small', label: '小さじ' },
  { value: 'large', label: '大さじ' },
  { value: 'gram', label: 'グラム' },
  { value: 'liter', label: 'ℓ' },
  { value: 'pinch', label: 'つまみ' },
  { value: 'piece', label: '個' },
  { value: 'appropriate', label: '適量' },
  { value: 'none', label: '単位なし' },
];

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  
  // YouTubeの標準的なURL形式に対応
  const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (standardMatch) return standardMatch[1];
  
  // その他の形式のURLに対応
  const fallbackMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return (fallbackMatch && fallbackMatch[2].length === 11) ? fallbackMatch[2] : null;
}

async function getYouTubeThumbnail(url: string): Promise<string | null> {
  const videoId = getYoutubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}

export function RecipeForm({ onSubmit, initialData }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || [{ name: '', amount: '', unit: 'appropriate' }]
  );
  const [steps, setSteps] = useState<string[]>(initialData?.steps || ['']);
  const [title, setTitle] = useState(initialData?.title || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'main');
  const [subCategory, setSubCategory] = useState<MainSubCategory>(
    initialData?.subCategory || 'noodles'
  );

  useEffect(() => {
    const updateThumbnail = async () => {
      if (youtubeUrl) {
        const thumbnail = await getYouTubeThumbnail(youtubeUrl);
        if (thumbnail) {
          setImage(thumbnail);
        }
      }
    };
    updateThumbnail();
  }, [youtubeUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      steps: steps.filter(Boolean),
      notes,
      youtubeUrl,
      category,
      subCategory: category === 'main' ? subCategory : undefined,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>新しいレシピを追加</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'レシピを編集' : '新しいレシピを追加'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">料理名</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="料理名を入力"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">画像URL</label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="画像URLを入力"
              type="url"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">カテゴリ</label>
              <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category === 'main' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">サブカテゴリ</label>
                <Select
                  value={subCategory}
                  onValueChange={(value: MainSubCategory) => setSubCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="サブカテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCat) => (
                      <SelectItem key={subCat.value} value={subCat.value}>
                        {subCat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">材料</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-2">
                <Input
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = { ...ingredient, name: e.target.value };
                    setIngredients(newIngredients);
                  }}
                  placeholder={`材料 ${index + 1}`}
                />
                <Input
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = { ...ingredient, amount: e.target.value };
                    setIngredients(newIngredients);
                  }}
                  placeholder="量"
                />
                <Select
                  value={ingredient.unit}
                  onValueChange={(value: Unit) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = { ...ingredient, unit: value };
                    setIngredients(newIngredients);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="単位" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newIngredients = ingredients.filter((_, i) => i !== index);
                    setIngredients(newIngredients.length ? newIngredients : [{ name: '', amount: '', unit: 'appropriate' }]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIngredients([...ingredients, { name: '', amount: '', unit: 'appropriate' }])}
            >
              <Plus className="h-4 w-4 mr-2" />
              材料を追加
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">手順</label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index] = e.target.value;
                    setSteps(newSteps);
                  }}
                  placeholder={`手順 ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newSteps = steps.filter((_, i) => i !== index);
                    setSteps(newSteps.length ? newSteps : ['']);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSteps([...steps, ''])}
            >
              <Plus className="h-4 w-4 mr-2" />
              手順を追加
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">備考</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="備考を入力"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube URL</label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube URLを入力"
              type="url"
            />
          </div>

          <Button type="submit" className="w-full">
            {initialData ? '更新' : '追加'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}