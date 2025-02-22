import { Recipe, Unit } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Utensils } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

const unitToLabel = (unit: Unit): string => {
  switch (unit) {
    case 'small': return '小さじ';
    case 'large': return '大さじ';
    case 'gram': return 'グラム';
    case 'liter': return 'ℓ';
    case 'pinch': return 'つまみ';
    case 'piece': return '個';
    case 'appropriate': return '適量';
    case 'none': return '';
    default: return '';
  }
};

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  
  // YouTubeの標準的なURL形式に対応
  const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (standardMatch) return standardMatch[1];
  
  // その他の形式のURLに対応
  const fallbackMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return (fallbackMatch && fallbackMatch[2].length === 11) ? fallbackMatch[2] : null;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const videoId = recipe.youtubeUrl ? getYoutubeId(recipe.youtubeUrl) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <div className="aspect-video relative overflow-hidden">
            {recipe.thumbnailUrl ? (
              <img 
                src={recipe.thumbnailUrl} 
                alt={recipe.title}
                className="object-cover w-full h-full"
              />
            ) : recipe.image ? (
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Utensils className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
          </CardHeader>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            {recipe.thumbnailUrl ? (
              <img 
                src={recipe.thumbnailUrl} 
                alt={recipe.title}
                className="object-cover w-full h-full"
              />
            ) : recipe.image ? (
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Utensils className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">材料</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name}
                  {ingredient.amount && (
                    <span className="ml-2">
                      {ingredient.amount} {unitToLabel(ingredient.unit)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">手順</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          {recipe.notes && (
            <div>
              <h3 className="font-semibold mb-2">備考</h3>
              <p className="text-muted-foreground">{recipe.notes}</p>
            </div>
          )}
          
          {videoId && (
            <div>
              <h3 className="font-semibold mb-2">参考動画</h3>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}