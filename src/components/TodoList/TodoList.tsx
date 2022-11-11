import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  setError: (error: string) => void,
  setVisibleTodos: (value: ((prevState: Todo[]) => Todo[])) => void,
  todos: Todo[],
  isDeletingAll: boolean,
  isTogglingAll: boolean,
};

export const TodoList: React.FC<Props> = ({
  setError,
  setVisibleTodos,
  todos,
  isDeletingAll,
  isTogglingAll,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoInfo
            todo={todo}
            setError={setError}
            setVisibleTodos={setVisibleTodos}
            isDeletingAll={isDeletingAll}
            isTogglingAll={isTogglingAll}
          />
        </li>
      ))}
    </ul>
  );
};
