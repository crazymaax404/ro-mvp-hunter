import type { MvpDeathRecord } from "@/interfaces";

import { supabase } from "@/lib/supabase";

type MapPosition = { x: number; y: number };

export type FetchDeathsResult = {
  records: Record<string, MvpDeathRecord>;
  idToMvpId: Record<string, string>;
};

export const fetchAllDeaths = async (): Promise<FetchDeathsResult> => {
  const { data, error } = await supabase
    .from("mvp_deaths")
    .select("id, mvp_id, death_time, map_position");

  if (error) throw error;

  const records: Record<string, MvpDeathRecord> = {};
  const idToMvpId: Record<string, string> = {};

  for (const row of data ?? []) {
    records[row.mvp_id] = {
      deathTime: row.death_time,
      mapPosition:
        row.map_position && typeof row.map_position === "object"
          ? (row.map_position as MapPosition)
          : undefined,
    };
    idToMvpId[row.id] = row.mvp_id;
  }

  return { records, idToMvpId };
};

export const upsertDeath = async (
  mvpId: string,
  deathTime: Date,
  mapPosition?: MapPosition | null,
): Promise<void> => {
  const { error } = await supabase.from("mvp_deaths").upsert(
    {
      mvp_id: mvpId,
      death_time: deathTime.toISOString(),
      map_position: mapPosition ?? null,
    },
    { onConflict: "mvp_id" },
  );

  if (error) throw error;
};

export const deleteDeath = async (mvpId: string): Promise<void> => {
  const { error } = await supabase
    .from("mvp_deaths")
    .delete()
    .eq("mvp_id", mvpId);

  if (error) throw error;
};

export const deleteAllDeaths = async (): Promise<void> => {
  const { error } = await supabase
    .from("mvp_deaths")
    .delete()
    .neq("mvp_id", "");

  if (error) throw error;
};
