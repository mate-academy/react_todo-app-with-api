import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedId: number;
  loading: boolean;
  onDelete: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  loadingClearCompleted: boolean;
  completedTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedId,
  loading,
  onDelete,
  updateTodo,
  completedTodos,
  loadingClearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          selectedId={selectedId}
          onDelete={onDelete}
          loading={loading}
          completedTodos={completedTodos}
          updateTodo={updateTodo}
          loadingClearCompleted={loadingClearCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedId={selectedId}
          loading={loading}
        />
      )}
    </section>
  );
};
