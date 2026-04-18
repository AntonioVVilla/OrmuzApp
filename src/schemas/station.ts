import {z} from 'zod';

export const FuelPriceSchema = z.object({
  fuelType: z.string(),
  price: z.number().finite().nonnegative(),
});

export const StationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  schedule: z.string(),
  prices: z.array(FuelPriceSchema),
  distance: z.number().optional(),
  color: z.string().optional(),
  priceBucket: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export const StationArraySchema = z.array(StationSchema);
