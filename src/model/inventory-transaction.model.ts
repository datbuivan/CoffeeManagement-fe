export interface InventoryTransaction {
  id: string;
  ingredientId: string;
  transactionType: string;
  quantity: number;
  unitPrice?: number;
  userId: string;
  relatedDocumentId?: string;
}
