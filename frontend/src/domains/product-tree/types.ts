export interface ProductTree {
  parentId: string;
  childId: string;
  childQuantity: number;
  childUnitCost: number;
  parent: { id: string; name: string; active: boolean };
  child: { id: string; name: string; active: boolean };
}

export interface DeleteNodeDTO {
  parentId: string;
  childId: string;
}

export interface ProductTreeDTO {
  parentId: string;
  childId: string;
  childQuantity: number;
  childUnitCost: number;
}
