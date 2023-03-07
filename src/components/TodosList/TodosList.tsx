import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => Promise<void>,
  toggleStatusTodo: (todo: Todo) => void,
  renameTodo: (todo: Todo, newTitle: string) => void,
  loadableTodos: number[],
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  toggleStatusTodo,
  renameTodo,
  loadableTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={() => deleteTodo(todo.id)}
          toggleStatusTodo={() => toggleStatusTodo(todo)}
          renameTodo={renameTodo}
          loadableTodos={loadableTodos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => deleteTodo(tempTodo.id)}
          toggleStatusTodo={() => toggleStatusTodo(tempTodo)}
          renameTodo={renameTodo}
          loadableTodos={loadableTodos}
        />
      )}
    </section>
  );
};
