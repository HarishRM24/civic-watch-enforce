
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
  try {
    const { data, error } = await supabase
      .from('police_stations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching police stations:', error);
      throw error;
    }

    console.log('Fetched police stations:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Service error fetching police stations:', error);
    return [];
  }
};

export const getPoliceStationById = async (id: string): Promise<PoliceStation | null> => {
  try {
    const { data, error } = await supabase
      .from('police_stations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching police station with ID ${id}:`, error);
      throw error;
    }

    console.log('Fetched police station:', data?.name || 'Not found');
    return data;
  } catch (error) {
    console.error('Service error fetching police station:', error);
    return null;
  }
};

export const searchPoliceStations = async (query: string): Promise<PoliceStation[]> => {
  try {
    const { data, error } = await supabase
      .from('police_stations')
      .select('*')
      .or(`name.ilike.%${query}%, city.ilike.%${query}%, state.ilike.%${query}%`)
      .order('name');

    if (error) {
      console.error('Error searching police stations:', error);
      throw error;
    }

    console.log('Search results:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Service error searching police stations:', error);
    return [];
  }
};
