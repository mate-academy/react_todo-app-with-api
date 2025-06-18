import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
  showError: (message: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
  showError,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loadingTodoIds={loadingTodoIds.includes(todo.id)}
          showError={showError}
          setTodos={setTodos}
        />
      ))}
      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isActive={!!tempTodo} />
      )}
    </section>
  );
};
