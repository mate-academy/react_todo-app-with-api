import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  setTodos,
  setErrorMessage,
  setLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          loadingIds={loadingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setLoadingIds={setLoadingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
