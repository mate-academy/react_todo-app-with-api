import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Error } from '../../types/Error';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  TodoUpdate: (todo: Todo) => void;
  setErrorText: (error: Error) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  TodoUpdate,
  setErrorText,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          TodoUpdate={TodoUpdate}
          setErrorText={setErrorText}
          deleteTodo={deleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          TodoUpdate={TodoUpdate}
          setErrorText={setErrorText}
          deleteTodo={deleteTodo}
        />
      )}
    </section>
  );
};
