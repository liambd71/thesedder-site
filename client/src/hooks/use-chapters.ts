import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useChapters() {
  return useQuery({
    queryKey: [api.chapters.list.path],
    queryFn: async () => {
      const res = await fetch(api.chapters.list.path);
      if (!res.ok) throw new Error("Failed to fetch chapters");
      return api.chapters.list.responses[200].parse(await res.json());
    },
  });
}

export function useChapter(id: number) {
  return useQuery({
    queryKey: [api.chapters.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.chapters.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch chapter");
      return api.chapters.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}
