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
import { Cursors } from "./Cursors";

export {
    id,
    tx,
    lookup,
    init,
    InstantSolidWeb,
    Cursors,

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

