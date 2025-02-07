import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<boolean>;
  updateTodo: (updateTodo: Todo) => Promise<boolean>;
  tempTodo?: Todo | null;
  isAdding?: boolean;
  deletingTodos?: Set<number>;
  updatingTodos?: Set<number>;
  // setError: (ErrorMessage: ErrorMessage) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    deleteTodo,
    updateTodo,
    tempTodo = null,
    isAdding = false,
    deletingTodos = new Set(),
    updatingTodos = new Set(),
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            isLoading={deletingTodos.has(todo.id) || updatingTodos.has(todo.id)}
          />
        ))}
        {tempTodo && <TodoItem todo={tempTodo} isLoading={isAdding} />}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
