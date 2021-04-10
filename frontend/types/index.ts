export type Gift = {
  id?: number;
  name: string;
  description: string;
  desired_amount: number;
  urls: string[];
  image_url: string;
  modified_at?: Date;
};
