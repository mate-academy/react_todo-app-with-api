import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

import '../../App.css';

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
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              setError={setError}
              setVisibleTodos={setVisibleTodos}
              isDeletingAll={isDeletingAll}
              isTogglingAll={isTogglingAll}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
