'use client';

interface CategoryNavProps {
  categories: string[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <a
            key={category}
            href={`#category-${category}`}
            onClick={(e) => handleClick(e, category)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {category}
          </a>
        ))}
      </div>
    </div>
  );
}