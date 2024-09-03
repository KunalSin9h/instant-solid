import { createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import {
  coerceQuery,
  Query,
  Exactly,
  InstantClient,
  LifecycleSubscriptionState,
  weakHash,
} from "@instantdb/core";

const defaultState = {
  isLoading: true,
  data: undefined,
  pageInfo: undefined,
  error: undefined,
};

export function createQuery<Q extends Query, Schema>(
  _core: InstantClient<Schema>,
  _query: Exactly<Query, Q> | null,
): {
  state: LifecycleSubscriptionState<Q, Schema>;
  query: any;
} {
  const query = _query ? coerceQuery(_query) : null;
  const queryHash = weakHash(query);

  const [result, setResult] =
    createStore<LifecycleSubscriptionState<Q, Schema>>(defaultState);

  createEffect(() => {
    if (!query) {
      setResult(defaultState);
      return;
    }

    const unsubscribe = _core.subscribeQuery<Q>(query, (result) => {
      setResult({
        isLoading: !Boolean(result),
        data: undefined,
        pageInfo: undefined,
        error: undefined,
        ...result,
      });
    });

    onCleanup(() => unsubscribe());
  }, [queryHash]);

  return {
    state: result,
    query,
  };
}
