import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  todosToRender: Todo[],
  tempTodo: Todo | null,
  isTempLoading: boolean,
  setTodos: (todos: Todo[]) => void,
  showError: (title: string) => void,
  toBeCleared: Todo[],
  isToggleAll: boolean,
  setIsToggleAll: (val: boolean) => void,
  isSameStatus: boolean,
  toggleAll: () => void,
};

export const Main: React.FC<Props> = ({
  todos,
  todosToRender,
  tempTodo,
  isTempLoading,
  showError,
  setTodos,
  toBeCleared,
  isToggleAll,
  setIsToggleAll,
  isSameStatus,
  toggleAll,
}) => {
  return (
    <section className="todoapp__main">
      {todosToRender.map(todo => (

        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          todosToRender={todosToRender}
          showError={showError}
          setTodos={setTodos}
          toBeCleared={toBeCleared}
          isToggleAll={isToggleAll}
          setIsToggleAll={setIsToggleAll}
          isSameStatus={isSameStatus}
          toggleAll={toggleAll}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTempLoading={isTempLoading}
        />
      )}
    </section>
  );
};
