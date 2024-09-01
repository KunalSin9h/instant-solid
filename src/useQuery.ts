import { createEffect, createSignal, onCleanup } from "solid-js";
import {
  coerceQuery,
  Query,
  Exactly,
  InstantClient,
  LifecycleSubscriptionState,
} from "@instantdb/core";

const defaultState = {
  isLoading: true,
  data: undefined,
  pageInfo: undefined,
  error: undefined,
};

export function useQuery<Q extends Query, Schema>(
  _core: InstantClient<Schema>,
  _query: Exactly<Query, Q> | null,
): {
  state: LifecycleSubscriptionState<Q, Schema>;
  query: any
} {
  // We use a solid's store to store the result to prevent unnecessary re-renders.
  const [resultCacheRef, setResultCacheRef] = createSignal<LifecycleSubscriptionState<Q, Schema>>(defaultState);

  const query = _query ? coerceQuery(_query) : null;

  createEffect(() => {
    if (!query) {
      setResultCacheRef(defaultState);
      return () => {};
    }

    const unsubscribe = _core.subscribeQuery<Q>(query, (result) => {
      setResultCacheRef({
        isLoading: !Boolean(result),
        data: undefined,
        pageInfo: undefined,
        error: undefined,
        ...result,
      });
    });

    onCleanup(() => unsubscribe());
  });

  return {
    state: resultCacheRef(),
    query,
  };
}

