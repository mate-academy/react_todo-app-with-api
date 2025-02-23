import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  handleToggleStatus: (todo: Todo) => void;
  handleRename: (todo: Todo) => void;
  loadingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
  handleToggleStatus,
  handleRename,
  loadingTodos,
}) => {
  const state = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {state.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          handleToggleStatus={handleToggleStatus}
          handleRename={handleRename}
          loadingTodos={loadingTodos}
        />
      ))}
    </section>
  );
};
