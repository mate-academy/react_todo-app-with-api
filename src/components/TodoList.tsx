import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  toggleTodo: (todo: Todo) => void;
  onRename?: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  loadingIds,
  toggleTodo,
  onRename,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={() => deleteTodo(todo.id)}
        isLoading={loadingIds.includes(todo.id)}
        toggleTodo={() => toggleTodo(todo)}
        onRename={onRename ? newTitle => onRename(todo, newTitle) : undefined}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={tempTodo.id}
        deleteTodo={deleteTodo}
        isLoading={true}
      />
    )}
  </section>
);
