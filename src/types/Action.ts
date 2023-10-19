import { Todo } from './Todo';

export type Action = { type: 'get', payload: Todo[] }
| { type: 'add', payload: Todo }
| { type: 'remove', payload: number }
| { type: 'toggle', payload: Todo }
| { type: 'edit', payload: Todo };
