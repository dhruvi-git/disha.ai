import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useActivityLog = () => {
  const logActivity = useCallback(async (tool: string, action: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        tool,
        action,
      });
    } catch {
      // silently fail – analytics should never block UX
    }
  }, []);

  return { logActivity };
};
