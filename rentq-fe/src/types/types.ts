export type DefaultState = {
  loading: boolean;
  data: any;
  reviewData? : any;
  detailPost? : any;
  listings? : ListingsProperty[];
  error: string | null;
};

export type User = {
  address?: string;
  avatar_url?: string;
  created_at?: string;
  email?: string;
  full_name: string;
  is_verified?: boolean;
  password?: string;
  phone?: string;
  role?: string;
  user_id?: number;
};

export type RoleRequestType = {
  request_id?: number;
  user_id?: number;
  status?: string;
  created_at?: string;
};

export interface RoleRequest {
  user_id: number;
  status: "pending" | "approved" | "rejected";
}

export type ListingsProperty = {
  listing_id?: number;
  landlordId: number;
  title: string;
  address: string;
  alias:string;
  area: number;
  price: number;
  utilities: string;
  maxPeople: number;
  furniture: "full" | "partial" | "none";
  availableFrom: Date;
  propertyType: "apartment" | "house" | "office" | "storefront";
  description: string;
  listing_images?: { image_url: string, is_main?: boolean }[];
};

export type ListingImageType = {
  listing_id?: number;
  images_url: string[];
  isMain: boolean[];
}

export type ReviewProperty = {
  review_id?: number;
  listing_id: number;
  tenant_id: number;
  rating: number;
  comment:string;
  users? : {}
  created_at?: string;
};


export type ReviewPropertyList = {
  reviewList : ReviewProperty[]
};

