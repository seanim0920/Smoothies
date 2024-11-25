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

export type SmoothieInput = Omit<Smoothie, "id">

export type SmoothiePublish = Smoothie & {isPublished: true}