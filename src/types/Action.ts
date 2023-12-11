import { ErrorMessage } from './ErrorMessage';
import { FilterStatus } from './FilterStatus';
import { LoadingStatus } from './LoadingStatus';
import { Todo } from './Todo';

export type Action =
{
  type: 'loadingTodos',
  payload: Todo[]
}
| {
  type: 'setRef',
  payload: HTMLInputElement
}
| {
  type: 'shouldLoading',
  payload: LoadingStatus
}
| {
  type: 'error',
  payload: { error: ErrorMessage, loadingType?: LoadingStatus }
}
| {
  type: 'filter',
  payload: FilterStatus
}
| {
  type: 'updateTodo',
  payload: { todo: Todo, loadingType?: LoadingStatus }
}
| {
  type: 'createTempTodo',
  payload: { todo: Todo | null, loadingType?: LoadingStatus }
}
| {
  type: 'createTodo',
  payload: { todo: Todo, loadingType?: LoadingStatus }
}
| {
  type: 'deleteTodo',
  payload: { id: number, loadingType?: LoadingStatus }
};
