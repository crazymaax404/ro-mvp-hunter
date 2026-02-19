import type { MvpDeathRecord } from "@/interfaces";

import { supabase } from "@/lib/supabase";

type MapPosition = { x: number; y: number };

export async function fetchAllDeaths(): Promise<
  Record<string, MvpDeathRecord>
> {
  const { data, error } = await supabase
    .from("mvp_deaths")
    .select("mvp_id, death_time, map_position");

  if (error) throw error;

  const record: Record<string, MvpDeathRecord> = {};

  for (const row of data ?? []) {
    record[row.mvp_id] = {
      deathTime: row.death_time,
      mapPosition:
        row.map_position && typeof row.map_position === "object"
          ? (row.map_position as MapPosition)
          : undefined,
    };
  }

  return record;
}

export async function upsertDeath(
  mvpId: string,
  deathTime: Date,
  mapPosition?: MapPosition | null,
): Promise<void> {
  const { error } = await supabase.from("mvp_deaths").upsert(
    {
      mvp_id: mvpId,
      death_time: deathTime.toISOString(),
      map_position: mapPosition ?? null,
    },
    { onConflict: "mvp_id" },
  );

  if (error) throw error;
}

export async function deleteDeath(mvpId: string): Promise<void> {
  const { error } = await supabase
    .from("mvp_deaths")
    .delete()
    .eq("mvp_id", mvpId);

  if (error) throw error;
}

export async function deleteAllDeaths(): Promise<void> {
  const { error } = await supabase
    .from("mvp_deaths")
    .delete()
    .neq("mvp_id", "");

  if (error) throw error;
}
