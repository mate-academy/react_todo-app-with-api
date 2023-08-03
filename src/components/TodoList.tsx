import React from 'react';
import { Todo, Error } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  setTodos: (value: (prevTodos: Todo[]) => Todo[]) => void,
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  setHasError: (value: Error) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
  deleteTodo: (todoId: number) => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  setTodos,
  tempTodo,
  filteredTodos,
  setHasError,
  loadingIds,
  setLoadingIds,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          deleteTodo={deleteTodo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          setTodos={setTodos}
          todo={todo}
          key={todo.id}
          setHasError={setHasError}
        />
      ))}
      {tempTodo
        && (
          <TodoItem
            deleteTodo={deleteTodo}
            loadingIds={loadingIds}
            setLoadingIds={setLoadingIds}
            setTodos={setTodos}
            todo={tempTodo}
            setHasError={setHasError}
          />
        )}
    </section>
  );
};
