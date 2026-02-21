import { JSX } from "react";
import Bug from "../assets/svg/bug.svg";
import Dark from "../assets/svg/dark.svg";
import Dragon from "../assets/svg/dragon.svg";
import Electric from "../assets/svg/electric.svg";
import Fairy from "../assets/svg/fairy.svg";
import Fighting from "../assets/svg/fighting.svg";
import Fire from "../assets/svg/fire.svg";
import Flying from "../assets/svg/flying.svg";
import Ghost from "../assets/svg/ghost.svg";
import Grass from "../assets/svg/grass.svg";
import Ground from "../assets/svg/ground.svg";
import Ice from "../assets/svg/ice.svg";
import Normal from "../assets/svg/normal.svg";
import Poison from "../assets/svg/poison.svg";
import Psychic from "../assets/svg/psychic.svg";
import Rock from "../assets/svg/rock.svg";
import Steel from "../assets/svg/steel.svg";
// import Stellar from "../assets/svg/stellar.svg";
// import Unknown from "../assets/svg/unknown.svg";
import Pokeball from "../assets/svg/pokeball.svg";
import Water from "../assets/svg/water.svg";

export const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fighting: "#C22E28",
  flying: "#A98FF3",
  poison: "#A33EA1",
  ground: "#E2BF65",
  rock: "#B6A136",
  bug: "#A6B91A",
  ghost: "#735797",
  steel: "#B7B7CE",
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  psychic: "#F95587",
  ice: "#96D9D6",
  dragon: "#6F35FC",
  dark: "#705746",
  fairy: "#D685AD",
  stellar: "#FFD700",
  unknown: "#68A090",
};

export const typeIcons: Record<string, JSX.Element> = {
  normal: <Normal fill="#A8A77A" width={10} height={10} />,
  fighting: <Fighting fill="#C22E28" width={10} height={10} />,
  flying: <Flying fill="#A98FF3" width={10} height={10} />,
  poison: <Poison fill="#A33EA1" width={10} height={10} />,
  ground: <Ground fill="#E2BF65" width={10} height={10} />,
  rock: <Rock fill="#B6A136" width={10} height={10} />,
  bug: <Bug fill="#A6B91A" width={10} height={10} />,
  ghost: <Ghost fill="#735797" width={10} height={10} />,
  steel: <Steel fill="#B7B7CE" width={10} height={10} />,
  fire: <Fire fill="#EE8130" width={10} height={10} />,
  water: <Water fill="#6390F0" width={10} height={10} />,
  grass: <Grass fill="#7AC74C" width={10} height={10} />,
  electric: <Electric fill="#F7D02C" width={10} height={10} />,
  psychic: <Psychic fill="#F95587" width={10} height={10} />,
  ice: <Ice fill="#96D9D6" width={10} height={10} />,
  dragon: <Dragon fill="#6F35FC" width={10} height={10} />,
  dark: <Dark fill="#705746" width={10} height={10} />,
  fairy: <Fairy fill="#D685AD" width={10} height={10} />,
  //   stellar: <Stellar fill="#FFD700" width={10} height={10} />,
  //   unknown: <Unknown fill="#68A090" width={10} height={10} />,
};

export function PokeballIcon(props: { width?: number; height?: number }) {
  return <Pokeball width={props.width || 80} height={props.height || 80} />;
}

const typeIconComponents = {
  normal: Normal,
  fighting: Fighting,
  flying: Flying,
  poison: Poison,
  ground: Ground,
  rock: Rock,
  bug: Bug,
  ghost: Ghost,
  steel: Steel,
  fire: Fire,
  water: Water,
  grass: Grass,
  electric: Electric,
  psychic: Psychic,
  ice: Ice,
  dragon: Dragon,
  dark: Dark,
  fairy: Fairy,
} as const;

export function TypeIcon(props: {
  type: string;
  width?: number;
  height?: number;
}): JSX.Element | null {
  const { type, width = 10, height = 10 } = props;
  const Comp =
    typeIconComponents[type as keyof typeof typeIconComponents] ?? null;

  if (!Comp) return null;

  return (
    <Comp fill={typeColors[type] ?? "#000"} width={width} height={height} />
  );
}
