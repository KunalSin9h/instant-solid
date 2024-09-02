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

import { createSignal, createEffect, createMemo, onCleanup } from "solid-js";

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

    /**
    * Listen for broadcasted events given a room and topic.
    *
    * @see https://instantdb.com/docs/presence-and-topics
    * @example
    *  function App({ roomId }) {
    *    db.room(roomType, roomId).useTopicEffect("chat", (message, peer) => {
    *      console.log("New message", message, 'from', peer.name);
    *    });
    *   
    *    // ...
    *  }
    */
   createTopicEffect = <TopicType extends keyof RoomSchema[RoomType]["topics"]>(
        topic: TopicType,
        onEvent: (
            event: RoomSchema[RoomType]["topics"][TopicType],
            peer: RoomSchema[RoomType]["presence"]
        ) => void
    ): void => {
        const [roomId] = createSignal(this.id);
        const [roomTopic] = createSignal(topic);

        createEffect(() => {
            const unsubscribe = this._core._reactor.subscribeTopic(
                roomId(),
                roomTopic(),
                (event, peer) => {
                    onEvent(event, peer);
                }
            );

            onCleanup(() => {
                unsubscribe();
            });
        });
    }
    

    /**
     * Broadcast an event to a room.
     *
     * @see https://instantdb.com/docs/presence-and-topics
     * @example
     * function App({ roomId }) {
     *   const publishTopic = db.room(roomType, roomId).createPublishTopic("clicks");
     *
     *   return (
     *     <button onClick={() => publishTopic({ ts: Date.now() })}>Click me</button>
     *   );
     * }
     *
     */
    createPublishTopic = <Topic extends keyof RoomSchema[RoomType]["topics"]>(
        topic: Topic
    ): ((data: RoomSchema[RoomType]["topics"][Topic]) => void) => {
        const [roomId] = createSignal(this.id);
        const [roomTopic] = createSignal(topic);

        createEffect(() => {
            this._core._reactor.joinRoom(roomId());
        });

        const publishTopic = createMemo((data) => {
            this._core._reactor.publishTopic({
                roomType: this.type,
                roomId: roomId(),
                topic: roomTopic(),
                data,
            });
        });

        return publishTopic;
    }
}