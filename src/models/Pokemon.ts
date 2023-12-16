export class Pokemon {
  id: number;
  name: PokemonName;
  type: PokemonType[];
  base: PokemonBase;

  constructor(
    id: number,
    name: PokemonName,
    type: PokemonType[],
    base: PokemonBase
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.base = base;
  }
}

export interface PokemonName {
  english: string;
  japanese: string;
  chinese: string;
  french: string;
}

export interface PokemonBase {
  HP: number;
  Attack: number;
  Defense: number;
  SpAttack: number;
  SpDefense: number;
  Speed: number;
}

export enum PokemonType {
  Normal = "Normal",
  Fighting = "Fighting",
  Flying = "Flying",
  Poison = "Poison",
  Ground = "Ground",
  Rock = "Rock",
  Bug = "Bug",
  Ghost = "Ghost",
  Steel = "Steel",
  Fire = "Fire",
  Water = "Water",
  Grass = "Grass",
  Electric = "Electric",
  Psychic = "Psychic",
  Ice = "Ice",
  Dragon = "Dragon",
  Dark = "Dark",
  Fairy = "Fairy",
}
