import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  addedTodo: Todo | null,
  setTodos(todos: Todo[]): void,
  setError(error: string | null): void,
  isDeletingAll: boolean,
  isToggleAll: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  addedTodo,
  setTodos,
  setError,
  isDeletingAll,
  isToggleAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todos={todos}
          todo={todo}
          key={todo.id}
          isAdded={false}
          setTodos={setTodos}
          setError={setError}
          isDeletingAll={isDeletingAll}
          isToggleAll={isToggleAll}
        />
      ))}
      {addedTodo && (
        <TodoItem
          todos={todos}
          todo={addedTodo}
          key={addedTodo.id}
          isAdded
          setTodos={setTodos}
          setError={setError}
          isDeletingAll={isDeletingAll}
          isToggleAll={isToggleAll}
        />
      )}
    </section>
  );
};
