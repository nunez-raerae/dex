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
  showdown: {
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

type pokeStats = {
  base_stat: number;
  stat: {
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
  stats: pokeStats[];
  species: NamedAPIResource["species"];
  id: number;
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
    .then(async (data) => await data)
    .catch((error) => console.error("Error fetching data:", error));
}

export function useGetDetails(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => ({
      queryKey: ["detail", url],
      queryFn: async () => await getDetail(url),
      enabled: !!url,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
    combine: (result) => {
      return result
        .map((r) => r.data)
        .filter((data): data is pokeFilter => !!data) as pokeFilter[];
    },
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
export async function getPokePageV2(
  name?: string,
  offset: number = 1,
): Promise<pokeFilter[]> {
  const url = new URL(`https://pokeapi.co/api/v2/pokemon/${name || ""}`);
  url.searchParams.set("limit", String(LIMIT));
  url.searchParams.set("offset", String(offset));

  const res = await fetch(url.toString());

  if (name) {
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data: pokeFilter = await res.json();

    const svgUrl = data.sprites?.other?.dream_world?.front_default;
    let dreamWorldSvgXml: string | null = null;
    if (svgUrl) {
      try {
        dreamWorldSvgXml = await getSvgText(svgUrl);
      } catch {
        dreamWorldSvgXml = null;
      }
    }
    return [{ ...data, dreamWorldSvgXml }];
  }

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
export function useInfinitePokeList(name?: string) {
  return useInfiniteQuery<pokeFilter[], Error, InfiniteData<pokeFilter[]>>({
    queryKey: ["pokeListaa", name],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      await getPokePageV2(name, pageParam as number),
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

export function useGetPokePage(name?: string) {
  return useQuery<pokeFilter[], Error>({
    queryKey: ["pokePage", name],
    queryFn: async () => await getPokePageV2(name),
    enabled: !!name,
    staleTime: 50 * 60 * 1000, // Cache for 50 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

type NamedAPIResource = {
  species: {
    name: string;
    url: string;
  };
};
export type ChainLink = {
  evolves_to: ChainLink[];
  species: NamedAPIResource["species"];
};

type EvolutionChain = {
  chain: ChainLink;
  // species: NamedAPIResource["species"];
};

async function getPokeEvolutionChain(url: string): Promise<EvolutionChain> {
  const data = fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data:", error));

  return data;
}

export function useGetPokeEvolutionChain(url: string) {
  return useQuery<EvolutionChain, Error>({
    queryKey: ["evolutionChain", url],
    queryFn: async () => await getPokeEvolutionChain(url),
    enabled: !!url,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

async function getPokeSpecies(id: number) {
  const species = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });

  const evoChainLink = await fetch(species.evolution_chain.url)
    .then(async (response) => await response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching evolution chain:", error);
      return null;
    });
  // console.log(evoChainLink);

  return species;
}

export function useGetPokeSpecies(id: number) {
  return useQuery({
    queryKey: ["pokeSpecies", id],
    queryFn: async () => await getPokeSpecies(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
