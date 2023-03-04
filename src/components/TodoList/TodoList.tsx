import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  isTemp?: Todo | null,
  onRemoveTodo: (id: number) => void,
  onCompletedChange: (value: Todo) => void,
  loadTodos: () => void,
  setErrorMessage:(value: string) => void,
  setIsError:(value: boolean) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  isTemp,
  onRemoveTodo,
  onCompletedChange,
  loadTodos,
  setErrorMessage,
  setIsError,
}) => {
  return (
    <section className="todoapp__main">
      <ul>
        {todos.map((todo) => (
          <li>
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemoveTodo={onRemoveTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodos}
              setErrorMessage={setErrorMessage}
              setIsError={setIsError}
            />
          </li>

        ))}

        {isTemp && (
          <li>
            <TodoItem
              key={isTemp.id}
              todo={isTemp}
              withLoader
              onRemoveTodo={onRemoveTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodos}
              setErrorMessage={setErrorMessage}
              setIsError={setIsError}
            />

          </li>
        )}

      </ul>
    </section>
  );
};
