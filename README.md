# Vue Apollo Decorator

## Install

```bash
npm i vue-apollo-decorator
```

## Usage

There is currently 1 decorator.

- [`@SmartQuery`](#SmartQuery)

### <a id="SmartQuery"></a> `@SmartQuery(options: DocumentNode | QueryComponentProperty)` decorator

```ts
import gql from 'graphql-tag';
import { SmartQuery } from 'vue-apollo-decorator';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class YourComponent extends Vue {
  @SmartQuery(gql`{ todo { id, title, ... } }`) todo: Todo;
  // OR
  @SmartQuery<YourComponent, Todo.Query, Todo.Variables>({
    query: gql`
      query Todo($id: String!) { 
        todo(id: $id) { id, title, ... } 
      }`,
    variables() {
      return { id: '...' };
    }
  })
  todo: Todo;
}
```

is equivalent to

```ts
export default {
  apollo: {
    todo: {
      query: gql`
        query Todo($id: String!) { 
            todo(id: $id) { id, title, ... } 
        }`,
      variables() {
        return { id: '...' };
      }
    }
  }
};
```

## License

MIT License
