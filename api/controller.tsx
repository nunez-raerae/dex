import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
} from "@tanstack/react-query";

type PokeResult = {
  name: string;
  url: string;
};
type data = {
  count: number;
  next: number | null;
  previous: number | null;
  results: PokeResult[] | null;
};

type other = {
  dream_world: {
    front_default: string;
  };
};

type sprites = {
  front_default: string;
  other: other;
};
type types = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type pokeFilter = {
  abilities: [
    {
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
      slot: number;
    },
  ];
  base_experience: number;
  forms: [
    {
      name: string;
      url: string;
    },
  ];
  name: string;
  sprites: sprites;
  types: types[];
  order: number;
  dreamWorldSvgXml?: string | null;
};

async function getPokeFilter(name: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export function useGetPokeFilter(name: string) {
  return useQuery<pokeFilter | null>({
    queryKey: ["pokeFilter", name],
    queryFn: async () => getPokeFilter(name),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: !!name,
  });
}

async function getDetail(url: string) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data:", error));
}

export function useGetDetails(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => ({
      queryKey: ["detail", url],
      queryFn: async () => getDetail(url),
      enabled: !!url,
      staleTime: 5 * 60 * 1000,
    })),
  });
}

async function getPokeList(): Promise<data> {
  return fetch(`https://pokeapi.co/api/v2/pokemon/?limit=100&offset=0}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data:", error));
}

async function getPokeDetails(): Promise<pokeFilter[]> {
  const list = await getPokeList();

  const detailRequests =
    list.results?.map((item) => fetch(item.url).then((res) => res.json())) ||
    [];
  const details = await Promise.all(detailRequests);

  return details;
}

export function useGetPokeList() {
  return useQuery<pokeFilter[] | undefined>({
    queryKey: ["pokeList"],
    queryFn: async () => await getPokeDetails(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

const LIMIT = 20;
export async function getPokePageV2(offset: number = 1): Promise<pokeFilter[]> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${LIMIT}&offset=${offset}`,
  );

  const data: data = await res.json();

  const requests =
    data.results?.map(async (item) => {
      const pokemon: pokeFilter = await fetch(item.url).then((r) => r.json());

      const svgUrl = pokemon.sprites?.other?.dream_world?.front_default;

      let dreamWorldSvgXml: string | null = null;
      if (svgUrl) {
        try {
          dreamWorldSvgXml = await getSvgText(svgUrl);
        } catch {
          dreamWorldSvgXml = null;
        }
      }

      return { ...pokemon, dreamWorldSvgXml };
    }) ?? [];

  return await Promise.all(requests);
}
export function useInfinitePokeList() {
  return useInfiniteQuery<pokeFilter[], Error, InfiniteData<pokeFilter[]>>({
    queryKey: ["pokeListaa"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => await getPokePageV2(pageParam as number),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < LIMIT) return undefined;
      return (lastPageParam as number) + LIMIT;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 60 * 1000, // ✅ fresh for 30 min
    gcTime: 24 * 60 * 60 * 1000, // ✅ keep in cache 24h (v5)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

async function getSvgText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch svg: ${res.status}`);
  return await res.text();
}

// export function useSvgText(url?: string) {
//   return useQuery<string, Error>({
//     queryKey: ["svgText", url],
//     queryFn: () => getSvgText(url!),
//     enabled: !!url,
//     staleTime: 30 * 24 * 60 * 60 * 1000, // Cache for 30 days
//     gcTime: 30 * 24 * 60 * 60 * 1000, // Keep in cache for 30 days
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
// }
