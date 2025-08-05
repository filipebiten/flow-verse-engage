import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";

export const useAdminData = () => {
  return useQuery({
    queryKey: ['adminData'],
    staleTime: 1000 * 60,
    queryFn: async () => {
      const [booksResult, coursesResult, missionsResult, profilesResult] = await Promise.all([
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('missions').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      return {
        books: booksResult.data || [],
        courses: coursesResult.data || [],
        missions: missionsResult.data || [],
        users: profilesResult.data || [],
      };
    },
  });
};