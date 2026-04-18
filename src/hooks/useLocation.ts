import {useEffect, useState, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Coordinate} from '../types/station';
import {DEFAULT_LOCATION} from '../utils/constants';

interface LocationState {
  location: Coordinate;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

async function requestAndroidPermission(): Promise<boolean> {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Ubicación',
        message:
          'Ormuz necesita acceso a tu ubicación para mostrar gasolineras cercanas.',
        buttonPositive: 'Permitir',
        buttonNegative: 'Cancelar',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

async function requestIosPermission(): Promise<boolean> {
  try {
    const result = await Geolocation.requestAuthorization('whenInUse');
    return result === 'granted';
  } catch {
    return false;
  }
}

export function useLocation(): LocationState & {refresh: () => void} {
  const [state, setState] = useState<LocationState>({
    location: DEFAULT_LOCATION,
    loading: true,
    error: null,
    permissionGranted: false,
  });

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return requestAndroidPermission();
    }
    if (Platform.OS === 'ios') {
      return requestIosPermission();
    }
    return false;
  }, []);

  const getPosition = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        setState(prev => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          permissionGranted: true,
        }));
      },
      error => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: `Error de ubicación: ${error.message}`,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  const refresh = useCallback(async () => {
    setState(prev => ({...prev, loading: true}));
    const granted = await requestPermission();
    if (granted) {
      getPosition();
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Permiso de ubicación denegado. Mostrando Madrid por defecto.',
        permissionGranted: false,
      }));
    }
  }, [requestPermission, getPosition]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {...state, refresh};
}
