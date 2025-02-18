import { Todo } from './Todo';

export interface TodoHelpers {
  todos: Todo[];
  setErrorMessage: (msg: string) => void;
  setIsSubmitting: (status: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
  setLoadingTodoId: (id: number | number[] | null) => void;
  setTodos: (cb: (todos: Todo[]) => Todo[]) => void;
  closeError: () => void;
  timerId: { current: number };
  inputRef: React.RefObject<HTMLInputElement>;
}
