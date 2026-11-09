export interface MenuItemData {
  id: string;
  name: string | null;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

export interface MenuCategoryData {
  id: string;
  name: string | null;
  image: string | null;
  emoji: string | null;
  items: MenuItemData[];
}
