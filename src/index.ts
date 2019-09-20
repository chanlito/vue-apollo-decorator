import { ApolloQueryResult } from 'apollo-client';
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
    VueApolloQueryDefinition<R, V>,
    'variables' | 'subscribeToMore' | 'result'
  > {
  variables?: (this: C) => V | V;
  subscribeToMore?:
    | SubscribeToMoreOptionsPatched<C, R>
    | Array<SubscribeToMoreOptionsPatched<C, R>>;
  result?: (this: C, result: ApolloQueryResult<R>, key: string) => void;
}

interface SubscribeToMoreOptionsPatched<C, R> {
  document: DocumentNode;
  variables?: (this: C) => any | { [key: string]: any };
  updateQuery?: (
    this: C,
    previousQueryResult: R,
    options: { subscriptionData: { data: any }; variables?: any }
  ) => R;
  onError?: (error: Error) => void;
}
