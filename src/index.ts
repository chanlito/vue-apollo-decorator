import { SubscribeToMoreOptions } from 'apollo-client';
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

type VueApolloQueryDefinitionPatched<
  C = any,
  R = any,
  V = any
> = VueApolloQueryDefinition<C, R> & Patch<C, V>;

type Patch<C, V> = VariablesPatched<C, V> & {
  subscribeToMore?:
    | SubscribeToMoreOptionsPatched<C, V>
    | Array<SubscribeToMoreOptionsPatched<C, V>>;
};

type VariablesPatched<C, V> = {
  variables?: (this: C) => V | V;
};

type SubscribeToMoreOptionsPatched<C, V> = SubscribeToMoreOptions &
  VariablesPatched<C, V>;
