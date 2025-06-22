export type DefaultState = {
  loading: boolean;
  error: string | null;
} & Partial<{
  userPost?: any;
  data?: any;
  reviewData?: any;
  detailPost?: any;
  posts?: ActivePostType[];
  listProperties?: any;
  userSavePost?: any;
  listMessages?: MessageType[];
  listReceivers?: any;
  listLocation?: string[];
  searchPost?: SearchPost;
  listPropertyImages?: PropertyImage[];
  listContracts?: ContractType[];
}>;

export type SearchPost = {
  posts: PostsType[];
  total: number;
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

export type PropertyType = {
  property_id?: number;
  landlord_id: number;
  address: string;
  area: number;
  utilities: string;
  max_people: number;
  furniture: "full" | "basic" | "none";
  available_from: string;
  property_type: "apartment" | "house" | "office" | "storefront";
  property_images?: PropertyImage[];
  description: string;
  created_at?: string;
  updated_at?: string;
};

export type PostsType = {
  post_id?: number;
  property_id: number;
  title: string;
  alias: string;
  price: number;
  description: string;
  status: string;
  is_approved: boolean;
  properties?: PropertyType;
  created_at?: string;
  updated_at?: string;
};

export type ActivePostType = {
  post_id: number;
  price: number;
  alias: string;
  properties: {
    max_people: number;
    address: string;
    area: number;
    property_images: PropertyImage[];
  };
};

export type PropertyImageType = {
  property_id?: number;
  images_url: string[];
  is_main: boolean[];
};

export type PropertyImage = {
  image_id?: number;
  property_id?: number;
  image_url: string;
  is_main: boolean;
};

export type MessageType = {
  message_id?: number;
  sender_id: number;
  receiver_id: number;
  receiver_full_name?: string;
  receiver_avatar_url?: string;
  last_message?: MessageType;
  content: string;
  send_at?: string;
};

export type ReviewProperty = {
  review_id?: number;
  property_id: number;
  tenant_id: number;
  rating: number;
  comment: string;
  users?: {};
  created_at?: string;
};

export type ContractType = {
  contract_id?: number;
  property_id: number;
  landlord_id: number;
  start_date: string;
  end_date: string;
  actual_move_in_date?: string;
  deposit: number;
  rent: number;
  status: "active" | "pending" | "terminated";
  contract_file_url?: string;
  terms_and_conditions?: string;
  created_at?: string;
  properties?: PropertyType;
};

export type ContractTenant = {
  contract_id: number;
  tenant_id: number;
};

export type ContractTenantRequest = {
  contract_id: number;
  emailList: string[];
};
