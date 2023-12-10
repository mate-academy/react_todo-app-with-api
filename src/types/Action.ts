import { ErrorMessage } from './ErrorMessage';
import { FilterStatus } from './FilterStatus';
import { LoadingStatus } from './LoadingStatus';
import { Todo } from './Todo';

export type Action = { type: 'loadingTodos', payload: Todo[] }
| { type: 'shouldLoading', payload: LoadingStatus }
| { type: 'error', payload: ErrorMessage }
| { type: 'filter', payload: FilterStatus }
| { type: 'updateTodo', payload: Todo }
| { type: 'createTempTodo', payload: Todo | null }
| { type: 'createTodo', payload: Todo }
| { type: 'deleteTodo', payload: number };
