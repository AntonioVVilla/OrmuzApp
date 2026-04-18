export interface FuelPrice {
  fuelType: string;
  price: number;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  schedule: string;
  prices: FuelPrice[];
  distance?: number;
  color?: string;
  priceBucket?: 1 | 2 | 3;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
