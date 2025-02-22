import { Category, MainSubCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: Category;
  selectedSubCategory?: MainSubCategory;
  onCategorySelect: (category: Category) => void;
  onSubCategorySelect: (subCategory: MainSubCategory) => void;
}

export function CategoryFilter({
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
}: CategoryFilterProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category.value)}
            className={cn(
              "text-sm",
              selectedCategory === category.value && "bg-primary text-primary-foreground"
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {selectedCategory === 'main' && (
        <div className="flex flex-wrap gap-2">
          {subCategories.map((subCategory) => (
            <Button
              key={subCategory.value}
              variant={selectedSubCategory === subCategory.value ? "default" : "outline"}
              size="sm"
              onClick={() => onSubCategorySelect(subCategory.value)}
              className={cn(
                "text-sm",
                selectedSubCategory === subCategory.value && "bg-secondary text-secondary-foreground"
              )}
            >
              {subCategory.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}