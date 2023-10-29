import React from 'react';
import { TodoItem } from '../Todo/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setErrorMessage: (str: string) => void,
  focusMainInput: () => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setErrorMessage,
  focusMainInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            setErrorMessage={setErrorMessage}
            focusMainInput={focusMainInput}
          />
        );
      })}
    </section>
  );
};
