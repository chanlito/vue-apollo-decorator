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

type OverrideThis<F, T> = F extends (...args: infer A) => infer B
  ? (this: T, ...args: A) => B
  : F;

type OverrideAllThis<O, T> = {
  [key in keyof O]: OverrideThis<O[key], T>
};

interface VueApolloQueryDefinitionPatched<C = any, R = any, V = any>
  extends OverrideAllThis<Omit<VueApolloQueryDefinition<R, V>, 'subscribeToMore'>, C> {
  subscribeToMore?:
    | SubscribeToMoreOptionsPatched<C, R, V>
    | Array<SubscribeToMoreOptionsPatched<C, R, V>>;
}

type SubscribeToMoreOptionsPatched<C, R, V> =
  OverrideAllThis<VueApolloSubscribeToMoreOptions<R, V>, C>;
