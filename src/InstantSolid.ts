import {
    init as initCore,

    // types
    Config,
    Query,
    Exactly,
    AuthState,
    InstantClient,
    TransactionChunk,
    Auth,
    LifecycleSubscriptionState,
    PresenceOpts,
    PresenceResponse,
    RoomSchemaShape,
    Storage,
} from "@instantdb/core";
import { useQuery } from "./useQuery";
import { useTimeout } from "./useTimeout";

export type PresenceHandle<
    PresenceShape,
    Keys extends keyof PresenceShape
> = PresenceResponse<PresenceShape, Keys> & {
    publishPresence: (data: Partial<PresenceShape>) => void;
}

export type TypingIndicatorOpts = {
    timeout?: number | null;
    stopOnEntry?: boolean;
    // Perf opt - `active` will always be an empty array
    writeOnly?: boolean;
}

export type TypingIndicatorHandle<PresenceShape> = {
    active: PresenceShape[];
    setActive(active: boolean): void;
    inputProps: {
        onKeyDown: (e: KeyboardEvent) => void;
        onBlur: () => void;
    };
};

export const defaultActivityStopTimeout = 1_000;

export class InstantSolidRoom<
    Schema,
    RoomSchema extends RoomSchemaShape,
    RoomType extends keyof RoomSchema
> {
    _core: InstantClient<Schema, RoomSchema>;
    type: RoomType;
    id: string;

    constructor(
        _core: InstantClient<Schema, RoomSchema>,
        type: RoomType,
        id: string,
    ) {
        this._core = _core;
        this.type = type;
        this.id = id;
    }

}