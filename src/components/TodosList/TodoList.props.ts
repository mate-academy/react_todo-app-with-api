import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  onDelete: (todoId: number) => void;
  selectedTodos: number[];
  setSelectedTodos: (todoId: number[]) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => void;
  selectedTodo: number;
  setSelectedTodo: (value: number) => void;
};
