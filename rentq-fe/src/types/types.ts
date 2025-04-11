export type DefaultState = {
  loading: boolean;
  data: any;
  reviewData? : any;
  detailPost? : any;
  posts? : ActivePostType[];
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

export type PostsType = {
  post_id?: number;
  title: string;
  description: string;
  price: number;
  property_id: number;
  status: boolean;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ActivePostType = {
  price: number;
  alias: string;
  properties: {
    address: string;
    area: number;
    reviews: any[]; 
    property_images: any[]; 
  };
};


// export type ListingImageType = {
//   listing_id?: number;
//   images_url: string[];
//   isMain: boolean[];
// }

// export type ReviewProperty = {
//   review_id?: number;
//   listing_id: number;
//   tenant_id: number;
//   rating: number;
//   comment:string;
//   users? : {}
//   created_at?: string;
// };
