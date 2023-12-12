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

export type PokemonType =
  | "Normal"
  | "Fighting"
  | "Flying"
  | "Poison"
  | "Ground"
  | "Rock"
  | "Bug"
  | "Ghost"
  | "Steel"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Psychic"
  | "Ice"
  | "Dragon"
  | "Dark"
  | "Fairy";
