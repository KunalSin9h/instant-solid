import {
    id,
    tx,
    lookup,
} from "@instantdb/core";

import type {
    QueryResponse,
    InstantObject,
    User,
    AuthState,
    Query,
    Config,
    i,
} from "@instantdb/core";

import { InstantSolid } from "./InstantSolid";
import { InstantSolidWeb } from "./InstantSolidWeb";
import { init } from "./init";

export {
    id,
    tx,
    lookup,
    init,
    InstantSolidWeb,
    // Cursor

    // Initial
    InstantSolid,

    // types
    Config,
    Query,
    QueryResponse,
    InstantObject,
    User,
    AuthState,
    i,
}

