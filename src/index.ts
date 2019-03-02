import { DocumentNode } from 'graphql';
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

export function SmartQuery(query: DocumentNode): VueDecorator;
export function SmartQuery<I, R = any, V = any>(
  options: QueryComponentProperty<I, R, V>
): VueDecorator;
export function SmartQuery<I, R = any, V = any>(
  options: DocumentNode | QueryComponentProperty<I, R, V>
) {
  return createDecorator((componentOptions: any, key) => {
    componentOptions.apollo = componentOptions.apollo || {};
    componentOptions.apollo[key] = options;
  });
}
