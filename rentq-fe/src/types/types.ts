export type DefaultState = {
  loading: boolean;
  data: any;
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
