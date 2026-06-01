export interface ApiResource<T> {
  data: T;
}

export interface PaginatedApiResource<T> {
  data: T[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: Record<string, unknown>;
}

