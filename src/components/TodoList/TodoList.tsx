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
};

export const TodoList: React.FC<Props> = ({
  todos,
  isTemp,
  onRemoveTodo,
  onCompletedChange,
  loadTodos,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main">
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              onRemoveTodo={onRemoveTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodos}
              setErrorMessage={setErrorMessage}
            />
          </li>

        ))}

        {isTemp && (
          <li key={isTemp.id}>
            <TodoItem
              todo={isTemp}
              withLoader
              onRemoveTodo={onRemoveTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodos}
              setErrorMessage={setErrorMessage}
            />

          </li>
        )}

      </ul>
    </section>
  );
};
