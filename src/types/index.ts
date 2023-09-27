import { Database } from './supabase';

export type Row<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type NestedRow<
  T extends keyof Database['public']['Tables'],
  J extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Row'] & {
  [K in J]: Database['public']['Tables'][J]['Row'];
};
