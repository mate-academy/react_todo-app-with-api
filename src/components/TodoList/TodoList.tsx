import React from 'react';
import { Todo, TodoArgs } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  removeTodo: (todoId: number) => void
  editTodo: (todoId: number, payload: TodoArgs) => void
  loadingTodo: number[],
  setError: (error: string) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingTodo,
  editTodo,
  setError,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
          editTodo={editTodo}
          setError={setError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          loadingTodo={loadingTodo}
          editTodo={editTodo}
          setError={setError}
        />
      )}

    </section>
  );
};
