
export interface BoqItem {
  ref: string;
  description: string;
  quantity: string;
  unit: string;
  rate: string;
  rateRef: string;
  total: string;
}

export interface BoqSection {
  section: string;
  items: BoqItem[];
}
