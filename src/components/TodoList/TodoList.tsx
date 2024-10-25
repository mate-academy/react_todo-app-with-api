import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (t: Todo) => void;
  selectedTodo: Todo | undefined;
  onTitleChange: (ev: React.FormEvent) => void;
  redactingInputRef: React.RefObject<HTMLInputElement>;
  redactingQuery: string | undefined;
  setRedactingQuery: (q: string | undefined) => void;
  onTodoSelect: (ev: React.MouseEvent<HTMLSpanElement>) => void;
  onDelete: (todoId: Todo['id']) => void;
  loadingTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  selectedTodo,
  onTitleChange,
  redactingInputRef,
  redactingQuery,
  setRedactingQuery,
  onTodoSelect,
  onDelete,
  loadingTodoId,
}) => {
  return todos.map(todo => (
    <TodoItem
      todo={todo}
      key={todo.id}
      onToggle={onToggle}
      selectedTodo={selectedTodo}
      onTitleChange={onTitleChange}
      redactingInputRef={redactingInputRef}
      redactingQuery={redactingQuery}
      setRedactingQuery={setRedactingQuery}
      onTodoSelect={onTodoSelect}
      onDelete={onDelete}
      loadingTodoId={loadingTodoId}
    />
  ));
};
