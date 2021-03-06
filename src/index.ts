import { DocumentNode } from 'graphql';
import Vue from 'vue';
import {
  VueApolloQueryDefinition,
  VueApolloSubscribeToMoreOptions,
} from 'vue-apollo/types/options';
import { createDecorator, VueDecorator } from 'vue-class-component';

export function SmartQuery<C = any, R = any, V = any>(
  options: C extends Vue
    ? VueApolloQueryDefinitionPatched<C, R, V>
    : DocumentNode,
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
  [key in keyof O]: OverrideThis<O[key], T>;
};

type VueApolloQueryDefinitionWithoutVariablesAndSubscribeToMore<
  R = any,
  V = any
> = Omit<VueApolloQueryDefinition<R, V>, 'subscribeToMore' | 'variables'>;

type SubscribeToMoreOptionsPatched<C, R, V> = OverrideAllThis<
  Omit<VueApolloSubscribeToMoreOptions<R, V>, 'updateQuery' | 'variables'>,
  C
> & {
  variables?: (this: C) => any;
  updateQuery?: UpdateQueryFn<C, R, any, any>; // TODO: How should we pass subscript data & variables types?
};

type UpdateQueryFn<
  C = any,
  R = any,
  TSubscriptionVariables = any,
  TSubscriptionData = any
> = (
  this: C,
  previousQueryResult: R,
  options: {
    subscriptionData: {
      data: TSubscriptionData;
    };
    variables?: TSubscriptionVariables;
  },
) => R;

interface VueApolloQueryDefinitionPatched<C = any, R = any, V = any>
  extends OverrideAllThis<
    VueApolloQueryDefinitionWithoutVariablesAndSubscribeToMore<R, V>,
    C
  > {
  variables?: (this: C) => V | V;
  subscribeToMore?:
    | SubscribeToMoreOptionsPatched<C, R, V>
    | Array<SubscribeToMoreOptionsPatched<C, R, V>>;
}
