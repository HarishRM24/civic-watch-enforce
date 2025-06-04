
import { supabase } from "@/integrations/supabase/client";

export interface Civilian {
  id: string;
  user_id: string | null;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  job: string | null;
  salary: string | null;
  is_criminal: boolean | null;
  created_at: string;
}

export const getCivilians = async (): Promise<Civilian[]> => {
  try {
    const { data, error } = await supabase
      .from('civilians')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching civilians:', error);
      throw error;
    }

    console.log('Fetched civilians:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Service error fetching civilians:', error);
    return [];
  }
};

export const getCivilianByUserId = async (userId: string): Promise<Civilian | null> => {
  try {
    const { data, error } = await supabase
      .from('civilians')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching civilian by user ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Service error fetching civilian by user ID:', error);
    return null;
  }
};

export const createCivilian = async (civilian: Omit<Civilian, 'id' | 'created_at'>): Promise<Civilian | null> => {
  try {
    const { data, error } = await supabase
      .from('civilians')
      .insert(civilian)
      .select()
      .single();

    if (error) {
      console.error('Error creating civilian:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Service error creating civilian:', error);
    return null;
  }
};

export const updateCivilian = async (id: string, updates: Partial<Civilian>): Promise<Civilian | null> => {
  try {
    const { data, error } = await supabase
      .from('civilians')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating civilian:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Service error updating civilian:', error);
    return null;
  }
};

export const updateCivilianByUserId = async (userId: string, updates: Partial<Civilian>): Promise<Civilian | null> => {
  try {
    const { data, error } = await supabase
      .from('civilians')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating civilian by user ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Service error updating civilian by user ID:', error);
    return null;
  }
};
