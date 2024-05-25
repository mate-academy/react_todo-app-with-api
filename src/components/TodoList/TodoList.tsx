import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  handleToggleStatus: (todo: Todo) => void;
  handleRename: (todo: Todo) => void;
  loadingTodo: Todo | null;
  setLoadingTodo: (loadingTodo: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
  handleToggleStatus,
  handleRename,
  loadingTodo,
  setLoadingTodo,
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
          loadingTodo={loadingTodo}
          setLoadingTodo={setLoadingTodo}
        />
      ))}
    </section>
  );
};
