import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  toggleTodo: (todoId: number, completed: boolean) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  renameTodo: (todoId: number, newTitle: string) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deleteTodo,
  loadingTodoIds,
  renameTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isLoading={loadingTodoIds.includes(todo.id) || todo.id === 0}
          renameTodo={renameTodo}
        />
      ))}
    </section>
  );
};
