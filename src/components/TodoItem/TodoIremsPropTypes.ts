import { FocusEvent, FormEvent } from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  toggleStatus: (todoId: number, completed: boolean) => void;
  setloadingTodoId: (todoId: number | null) => void;
  setErrorMessage: (message: string) => void;
  loadingTodoId: number | null;
  changeTitle: (todoId: number, newTitle : string) => void;
};

export type EventChangeTitle = FormEvent<HTMLFormElement>
| FocusEvent<HTMLInputElement> | null;
