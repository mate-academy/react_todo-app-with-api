import React from 'react';
import { Todo, Error } from '../types/Index';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  setHasError: (value: Error) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  filteredTodos,
  setHasError,
  loadingIds,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          todos={todos}
          setTodos={setTodos}
          todo={todo}
          key={todo.id}
          setHasError={setHasError}
        />
      ))}
      {tempTodo
        && (
          <TodoItem
            loadingIds={loadingIds}
            setLoadingIds={setLoadingIds}
            todos={todos}
            setTodos={setTodos}
            todo={tempTodo}
            setHasError={setHasError}
          />
        )}
    </section>
  );
};
