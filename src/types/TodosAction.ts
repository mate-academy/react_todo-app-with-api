import { Todo } from './Todo';

export type TodosAction = { type: 'initialize', payload: Todo[] }
| { type: 'create', payload: Todo }
| { type: 'delete', payload: number }
| { type: 'update', payload: Todo }
| { type: 'clear all completed', payload: number[] }
| { type: 'toggle status of specified', payload: number[] };
