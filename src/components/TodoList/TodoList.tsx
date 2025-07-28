import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Prop = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void | Promise<void>;
  onDeleted: (id: number) => void;
  deletingTodoId: number | null;
  deletingAllTodo: number[] | null;
  loadingTodoId: number | null;
  loadingAllTodo: number[] | null;
  onEditSubmit: (
    id: number,
    oldTitle: string,
    newTitle: string,
  ) => void | Promise<void>;
};

export const TodoList: React.FC<Prop> = ({
  todos,
  toggleTodo,
  onDeleted,
  deletingTodoId,
  deletingAllTodo,
  loadingTodoId,
  loadingAllTodo,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo)}
          onDeleted={onDeleted}
          isLoading={
            loadingTodoId === todo.id ||
            deletingTodoId === todo.id ||
            (loadingAllTodo ? loadingAllTodo.includes(todo.id) : false) ||
            (deletingAllTodo ? deletingAllTodo.includes(todo.id) : false)
          }
          onEditSubmit={onEditSubmit}
        />
      ))}
    </section>
  );
};
