export type Ingredient = {
  name: string;
  quantity: string;
}

export type SmoothieID = string & { _tag?: "SmoothieID" };

export type Smoothie = {
  id: SmoothieID;
  name: string;
  ingredients: Ingredient[];
  isPublished: boolean;
  tags?: string[];
}

export type SmoothieCreate = Omit<Smoothie, "id">

export type SmoothieUpdate = Partial<Smoothie>

export type SmoothiePublish = Smoothie & {isPublished: true}