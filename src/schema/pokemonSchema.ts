import { builder } from ".";
import {
  Pokemon,
  PokemonBase,
  PokemonName,
  PokemonType,
} from "../models/Pokemon";
import {
  addPokemon,
  deletePokemon,
  editPokemon,
  getAllPokemon,
  getPokemon,
} from "../helpers";

const PokemonNameRef = builder.objectRef<PokemonName>("PokemonName");
const PokemonBaseRef = builder.objectRef<PokemonBase>("PokemonBase");
const PokemonTypeRef = builder.enumType("PokemonType", {
  values: [
    "Normal",
    "Fighting",
    "Flying",
    "Poison",
    "Ground",
    "Rock",
    "Bug",
    "Ghost",
    "Steel",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Psychic",
    "Ice",
    "Dragon",
    "Dark",
    "Fairy",
  ] as const,
});

builder.objectType(PokemonNameRef, {
  name: "PokemonName",
  fields: (t) => ({
    english: t.exposeString("english", {}),
    japanese: t.exposeString("japanese", {}),
    chinese: t.exposeString("chinese", {}),
    french: t.exposeString("french", {}),
  }),
});

builder.objectType(PokemonBaseRef, {
  name: "PokemonBase",
  fields: (t) => ({
    HP: t.exposeInt("HP", {}),
    Attack: t.exposeInt("Attack", {}),
    Defense: t.exposeInt("Defense", {}),
    SpAttack: t.exposeInt("SpAttack", {}),
    SpDefense: t.exposeInt("SpDefense", {}),
    Speed: t.exposeInt("Speed", {}),
  }),
});

builder.objectType(Pokemon, {
  name: "Pokemon",
  description: "A pokemon",
  fields: (t) => ({
    id: t.exposeInt("id", {}),
    name: t.field({
      type: PokemonNameRef,
      resolve: (pokemon) => pokemon.name,
    }),
    types: t.field({
      type: [PokemonTypeRef],
      resolve: (pokemon) => pokemon.type,
    }),
    base: t.field({
      type: PokemonBaseRef,
      resolve: (pokemon) => pokemon.base,
    }),
  }),
});

const inputFilterGetAllPokemons = builder.inputType("FilterGetAllPokemons", {
  fields: (t) => ({
    types: t.stringList({
      description: "Filter by types",
      required: false,
    }),
    name: t.string({
      description: "Filter by name",
      required: false,
    }),
  }),
});

builder.queryFields((t) => ({
  getPokemon: t.field({
    type: Pokemon,
    args: {
      id: t.arg.int({ required: true }),
    },
    description: "Get a pokemon by id",
    resolve: async (_, args): Promise<Pokemon> => {
      const { id } = args;
      const pokemon = await getPokemon(id);
      if (!pokemon) {
        throw new Error(`No pokemon found with id ${id}`);
      }
      return pokemon;
    },
  }),
  getAllPokemons: t.field({
    type: [Pokemon],
    description: "Get all pokemon",
    args: {
      filter: t.arg({
        type: inputFilterGetAllPokemons,
        required: false,
      }),
    },
    resolve: async (_, args): Promise<Pokemon[]> => {
      const { filter } = args;
      let pokemon = await getAllPokemon();
      if (filter?.name) {
        pokemon = pokemon.filter((pokemon) =>
          pokemon.name.english.includes(filter.name!)
        );
      }
      if (filter?.types) {
        pokemon = pokemon.filter((pokemon) =>
          pokemon.type.some((type) => filter.types!.includes(type))
        );
      }
      if (!pokemon.length) {
        throw new Error("No pokemon found");
      }
      return pokemon;
    },
  }),
}));

const EditPokemonNameInput = builder.inputType("EditPokemonNameInput", {
  fields: (t) => ({
    english: t.string({ required: true }),
    japanese: t.string({ required: false }),
    chinese: t.string({ required: false }),
    french: t.string({ required: false }),
  }),
});
const EditPokemonBaseInput = builder.inputType("EditPokemonBaseInput", {
  fields: (t) => ({
    HP: t.int({ required: false }),
    Attack: t.int({ required: false }),
    Defense: t.int({ required: false }),
    SpAttack: t.int({ required: false }),
    SpDefense: t.int({ required: false }),
    Speed: t.int({ required: false }),
  }),
});
const inputEditPokemon = builder.inputType("EditPokemon", {
  fields: (t) => ({
    name: t.field({
      type: EditPokemonNameInput,
      required: false,
    }),
    types: t.stringList({
      required: false,
    }),
    base: t.field({
      type: EditPokemonBaseInput,
      required: false,
    }),
  }),
});
/* Add pokemon inputs */
const AddPokemonNameInput = builder.inputType("AddPokemonNameInput", {
  fields: (t) => ({
    english: t.string({ required: true }),
    japanese: t.string({ required: true }),
    chinese: t.string({ required: true }),
    french: t.string({ required: true }),
  }),
});
const AddPokemonBaseInput = builder.inputType("AddPokemonBaseInput", {
  fields: (t) => ({
    HP: t.int({ required: true }),
    Attack: t.int({ required: true }),
    Defense: t.int({ required: true }),
    SpAttack: t.int({ required: true }),
    SpDefense: t.int({ required: true }),
    Speed: t.int({ required: true }),
  }),
});
const inputAddPokemon = builder.inputType("AddPokemon", {
  fields: (t) => ({
    name: t.field({
      type: AddPokemonNameInput,
      required: true,
    }),
    types: t.stringList({
      required: true,
    }),
    base: t.field({
      type: AddPokemonBaseInput,
      required: true,
    }),
  }),
});

builder.mutationFields((t) => ({
  editPokemon: t.field({
    type: Pokemon,
    description: "Edit a pokemon",
    args: {
      id: t.arg.int({ required: true }),
      updates: t.arg({ type: inputEditPokemon, required: true }),
    },
    resolve: async (_, { id, updates }): Promise<Pokemon> => {
      let existingPokemon = await getPokemon(id);
      if (!existingPokemon) {
        throw new Error(`No pokemon found with id ${id}`);
      }

      const updatesToApply = {} as {
        name?: PokemonName;
        types?: string[];
        base?: PokemonBase;
      };
      if (updates.name) {
        updatesToApply.name = {
          ...existingPokemon.name,
          ...(updates.name.chinese && { chinese: updates.name.chinese }),
          ...(updates.name.english && { english: updates.name.english }),
          ...(updates.name.french && { french: updates.name.french }),
          ...(updates.name.japanese && { japanese: updates.name.japanese }),
        };
      }
      if (updates.types) {
        updatesToApply.types = updates.types;
      }
      if (updates.base) {
        updatesToApply.base = {
          ...existingPokemon.base,
          ...(updates.base.Attack && { Attack: updates.base.Attack }),
          ...(updates.base.Defense && { Defense: updates.base.Defense }),
          ...(updates.base.HP && { HP: updates.base.HP }),
          ...(updates.base.SpAttack && { SpAttack: updates.base.SpAttack }),
          ...(updates.base.SpDefense && { SpDefense: updates.base.SpDefense }),
          ...(updates.base.Speed && { Speed: updates.base.Speed }),
        };
      }

      const updatedPokemon = await editPokemon(id, {
        ...existingPokemon,
        ...updatesToApply,
      });
      return updatedPokemon;
    },
  }),
  addPokemon: t.field({
    type: Pokemon,
    description: "Add a pokemon",
    args: {
      pokemon: t.arg({ type: inputAddPokemon, required: true }),
    },
    resolve: async (_, { pokemon }): Promise<Pokemon> => {
      const newPokemon = await addPokemon({
        id: Math.floor(Math.random() * 1000) + 1,
        name: {
          chinese: pokemon.name.chinese,
          english: pokemon.name.english,
          french: pokemon.name.french,
          japanese: pokemon.name.japanese,
        },
        type: pokemon.types as PokemonType[],
        base: {
          Attack: pokemon.base.Attack,
          Defense: pokemon.base.Defense,
          HP: pokemon.base.HP,
          SpAttack: pokemon.base.SpAttack,
          SpDefense: pokemon.base.SpDefense,
          Speed: pokemon.base.Speed,
        },
      });
      return newPokemon;
    },
  }),
  deletePokemon: t.field({
    type: Pokemon,
    description: "Delete a pokemon",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, { id }): Promise<Pokemon> => {
      const pokemon = await deletePokemon(id);
      if (!pokemon) {
        throw new Error(`No pokemon found with id ${id}`);
      }
      return pokemon;
    },
  }),
}));

export const schema = builder.toSchema();
