export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock?: number;
  reorderLevel: number;
}
