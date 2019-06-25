import { DocumentNode } from 'graphql';
import Vue from 'vue';
import {
  ApolloVueThisType,
  ExtendableVueApolloQueryOptions
} from 'vue-apollo/types/options';
import { createDecorator, VueDecorator } from 'vue-class-component';

interface VueApolloQueryOptions<V, R, T>
  extends ExtendableVueApolloQueryOptions<V, R> {
  query: ((this: ApolloVueThisType<V>) => DocumentNode) | DocumentNode;
  variables?: ((this: ApolloVueThisType<V>) => T) | T;
  client?: String;
}

type QueryComponentProperty<V, R, T> =
  | ((this: ApolloVueThisType<V>) => VueApolloQueryOptions<V, R, T>)
  | VueApolloQueryOptions<V, R, T>;

export function SmartQuery<
  VueComponent extends Vue | DocumentNode,
  QueryResult = any,
  QueryVariables = any
>(
  options: VueComponent extends Vue
    ? QueryComponentProperty<VueComponent, QueryResult, QueryVariables>
    : DocumentNode
): VueDecorator {
  return createDecorator((componentOptions: any, k: string) => {
    componentOptions.apollo = componentOptions.apollo || {};
    componentOptions.apollo[k] = options;
  });
}
