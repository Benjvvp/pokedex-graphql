import fs from "fs/promises";
import { Pokemon } from "../models/Pokemon";
import path from "path";

const getAllPokemon = async (): Promise<Pokemon[]> => {
  const pokemon = await fs.readFile("./src/data/pokedex.json", "utf8");
  return JSON.parse(pokemon);
};

const getPokemon = async (id: number): Promise<Pokemon | undefined> => {
  const pokemon = await fs.readFile(
    path.join(__dirname, "../data/pokedex.json"),
    "utf8"
  );
  const pokemonList = (await JSON.parse(pokemon)) as Pokemon[];
  return pokemonList.find((pokemon: Pokemon) => pokemon.id === id);
};

const editPokemon = async (id: number, pokemon: Pokemon): Promise<Pokemon> => {
  const pokemonList = await getAllPokemon();
  const pokemonIndex = pokemonList.findIndex((pokemon) => pokemon.id === id);
  pokemonList[pokemonIndex] = pokemon;
  await fs.writeFile(
    path.join(__dirname, "../data/pokedex.json"),
    JSON.stringify(pokemonList)
  );
  return pokemon;
};

const addPokemon = async (pokemon: Pokemon): Promise<Pokemon> => {
  const pokemonList = await getAllPokemon();
  const newPokemon = { ...pokemon, id: pokemonList.length + 1 };
  pokemonList.push(newPokemon);
  await fs.writeFile(
    path.join(__dirname, "../data/pokedex.json"),
    JSON.stringify(pokemonList)
  );
  return newPokemon;
};

const deletePokemon = async (id: number): Promise<Pokemon> => {
  const pokemonList = await getAllPokemon();
  const pokemonIndex = pokemonList.findIndex((pokemon) => pokemon.id === id);
  const pokemon = pokemonList[pokemonIndex];
  pokemonList.splice(pokemonIndex, 1);
  await fs.writeFile(
    path.join(__dirname, "../data/pokedex.json"),
    JSON.stringify(pokemonList)
  );
  return pokemon;
};

export { getAllPokemon, getPokemon, editPokemon, addPokemon, deletePokemon };
