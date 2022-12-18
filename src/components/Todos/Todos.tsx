import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { AuthContext } from '../Auth/AuthContext';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  title: string,
  todos: Todo[]
  onTodoDelete: (value: number) => void,
  isLoading: boolean,
  loadTodos: () => void,
  onErrorsChange: (value: ErrorMessage) => void,
}

export const Todos: React.FC<Props> = (
  {
    title,
    todos,
    onTodoDelete,
    isLoading,
    loadTodos,
    onErrorsChange,
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          loadTodos={loadTodos}
          onErrorsChange={onErrorsChange}
        />
      ))}

      {isLoading && (
        <Loader
          todo={{
            id: 0,
            userId: user?.id || 0,
            title,
            completed: false,
          }}
        />
      )}
    </section>
  );
};
