import {z} from 'zod';

/**
 * Loose schema for a raw station coming from the Spanish Ministry of
 * Industry API. Only the fields we actually read are required; every
 * other key is allowed to be any string (the real payload has dozens
 * of them and varies over time).
 */
export const RawStationSchema = z
  .object({
    IDEESS: z.string(),
    Latitud: z.string(),
    'Longitud (WGS84)': z.string(),
  })
  .catchall(z.string());

export const RawAPIResponseSchema = z.object({
  Fecha: z.string().optional(),
  ListaEESSPrecio: z.array(RawStationSchema),
  Nota: z.string().optional(),
  ResultadoConsulta: z.string(),
});

export type RawStationParsed = z.infer<typeof RawStationSchema>;
export type RawAPIResponseParsed = z.infer<typeof RawAPIResponseSchema>;
