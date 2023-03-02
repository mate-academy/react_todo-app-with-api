import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => Promise<void>,
  toggleStatusTodo: (todo: Todo) => void,
  renameTodo: (todo: Todo, newTitle: string) => void,
  loading: { todoId: number, isLoading: boolean },
  // setLoading: (loading: { todoId: number, isLoading: boolean }) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  toggleStatusTodo,
  renameTodo,
  loading,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={() => deleteTodo(todo.id)}
          toggleStatusTodo={() => toggleStatusTodo(todo)}
          renameTodo={renameTodo}
          loading={loading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => deleteTodo(tempTodo.id)}
          toggleStatusTodo={() => toggleStatusTodo(tempTodo)}
          renameTodo={renameTodo}
          loading={loading}
        />
      )}
    </section>
  );
};
