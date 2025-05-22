
import { supabase } from "@/integrations/supabase/client";

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export const getPoliceStations = async (): Promise<PoliceStation[]> => {
  const { data, error } = await supabase
    .from('police_stations')
    .select('*');

  if (error) {
    console.error('Error fetching police stations:', error);
    throw error;
  }

  return data || [];
};

export const getPoliceStationById = async (id: string): Promise<PoliceStation | null> => {
  const { data, error } = await supabase
    .from('police_stations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching police station with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const searchPoliceStations = async (query: string): Promise<PoliceStation[]> => {
  const { data, error } = await supabase
    .from('police_stations')
    .select('*')
    .or(`name.ilike.%${query}%, city.ilike.%${query}%, state.ilike.%${query}%`);

  if (error) {
    console.error('Error searching police stations:', error);
    throw error;
  }

  return data || [];
};
