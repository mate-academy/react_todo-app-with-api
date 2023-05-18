import React from 'react';
// eslint-disable-next-line
import { v4 } from 'uuid';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempoTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  todoIdsInUpdating: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempoTodo,
  setTodos,
  setError,
  todoIdsInUpdating,
}) => {
  return (

    <section className="todoapp__main">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            setTodos={setTodos}
            setError={setError}
            key={v4()}
            todoIdsInUpdating={todoIdsInUpdating}
          />
        );
      })}

      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          setTodos={setTodos}
          setError={setError}
          todoIdsInUpdating={todoIdsInUpdating}
        />
      )}
    </section>
  );
};
