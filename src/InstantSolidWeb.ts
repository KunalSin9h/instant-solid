import type { RoomSchemaShape } from "@instantdb/core";
import { InstantSolid } from "./InstantSolid";

export class InstantSolidWeb<
  Schema = {},
  RoomSchema extends RoomSchemaShape = {},
> extends InstantSolid<Schema, RoomSchema> {}

