import { useCallback, useEffect, useState } from "react";
import { listCompanyNotes } from "@/db/repositories/companyNoteRepo";
import { subscribe } from "@/db/events";
import type { CompanyNote } from "@/types";

export function useCompanyNotes() {
  const [notes, setNotes] = useState<CompanyNote[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await listCompanyNotes();
    setNotes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("companyNotes", refresh);
  }, [refresh]);

  return { notes, loading, refresh };
}
