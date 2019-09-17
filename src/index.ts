import { DocumentNode } from 'graphql';
import Vue from 'vue';
import { VueApolloQueryDefinition } from 'vue-apollo/types/options';
import { createDecorator, VueDecorator } from 'vue-class-component';

export function SmartQuery<C = any, R = any, V = any>(
  options: C extends Vue
    ? VueApolloQueryDefinitionPatched<C, R, V>
    : DocumentNode
): VueDecorator {
  return createDecorator((componentOptions: any, k: string) => {
    componentOptions.apollo = componentOptions.apollo || {};
    componentOptions.apollo[k] = options;
  });
}

interface VueApolloQueryDefinitionPatched<C = any, R = any, V = any>
  extends Omit<
    VueApolloQueryDefinition<C, R>,
    'variables' | 'subscribeToMore'
  > {
  variables?: (this: C) => V | V;
  subscribeToMore?:
    | SubscribeToMoreOptionsPatched<C, R, V>
    | Array<SubscribeToMoreOptionsPatched<C, R, V>>;
}

interface SubscribeToMoreOptionsPatched<C, R, V> {
  document: DocumentNode;
  variables?: (this: C) => V | V;
  updateQuery?: (
    this: C,
    previousQueryResult: R,
    options: { subscriptionData: { data: R }; variables?: V }
  ) => R;
  onError?: (error: Error) => void;
}
