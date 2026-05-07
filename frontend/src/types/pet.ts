export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  ageMonths: number;
  price: number;
  availabilityStatus: string;
  photoUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PetListResponse {
  content: Pet[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

export interface FilterCriteria {
  species?: string;
  breed?: string;
  minAge?: number;
  maxAge?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}
