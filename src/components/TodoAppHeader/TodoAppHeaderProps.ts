import { ChangeEvent, FormEvent } from 'react';
import { Todo } from '../../types/Todo';

export interface TodoAppHeaderProps {
  todos: Todo[];
  handleUpdate: (todoIds: number[], newTitle?: string) => Promise<void>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  todoTitle: string;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isInputDisabled: boolean;
}
