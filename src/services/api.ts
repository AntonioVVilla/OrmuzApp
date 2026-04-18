import {RawAPIResponse} from '../types/api';

const API_BASE = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

export async function fetchStationsByProvince(
  provinceId: string,
  signal?: AbortSignal,
): Promise<RawAPIResponse> {
  const response = await fetch(
    `${API_BASE}/EstacionesTerrestres/FiltroProvincia/${provinceId}`,
    {signal},
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data: RawAPIResponse = await response.json();
  if (data.ResultadoConsulta !== 'OK') {
    throw new Error(`API returned: ${data.ResultadoConsulta}`);
  }
  return data;
}
