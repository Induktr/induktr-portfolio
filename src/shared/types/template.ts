export interface Template {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  stack: string[];
  features: string[];
  gradient: string;
}

export type Order = {
  orderId: number,
  accessCode: string,
}
