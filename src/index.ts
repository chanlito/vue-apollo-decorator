import { DocumentNode } from 'graphql';
import Vue from 'vue';
import { VueApolloQueryDefinition } from 'vue-apollo/types/options';
import { createDecorator, VueDecorator } from 'vue-class-component';

export function SmartQuery<C = any, R = any, V = any>(
  options: C extends Vue
    ? VueApolloQueryDefinitionWithVariables<C, R, V>
    : DocumentNode
): VueDecorator {
  return createDecorator((componentOptions: any, k: string) => {
    componentOptions.apollo = componentOptions.apollo || {};
    componentOptions.apollo[k] = options;
  });
}

type VueApolloQueryDefinitionWithVariables<
  C = any,
  R = any,
  V = any
> = VueApolloQueryDefinition<C, R> & {
  variables?: (this: C) => V | V;
};
