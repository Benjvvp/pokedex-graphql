import SchemaBuilder from "@pothos/core";

export const builder = new SchemaBuilder({});

builder.queryType();
builder.mutationType();

import "./pokemonSchema";

export const schema = builder.toSchema();
