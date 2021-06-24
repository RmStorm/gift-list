export type Gift = {
  id?: number;
  gift_order: number;
  name: string;
  description: string;
  desired_amount: number;
  urls: string[];
  image_url: string;
  modified_at?: Date;
};
