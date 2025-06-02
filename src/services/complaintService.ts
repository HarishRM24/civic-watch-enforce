
import { supabase } from "@/integrations/supabase/client";

export interface Complaint {
  id: string;
  complainant_id: string | null;
  officer_id: string | null;
  subject: string;
  description: string;
  status: string | null;
  created_at: string;
}

export const createComplaint = async (complaint: Omit<Complaint, 'id' | 'created_at'>): Promise<Complaint | null> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single();

    if (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Service error creating complaint:', error);
    return null;
  }
};

export const getComplaintsByUser = async (userId: string): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        civilians!inner(user_id)
      `)
      .eq('civilians.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Service error fetching complaints:', error);
    return [];
  }
};
