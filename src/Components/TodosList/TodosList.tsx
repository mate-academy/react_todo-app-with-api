import React from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { useTodosContext, useApiErrorContext }
  from '../../hooks/getContextHooks';
import { TodoItem } from '../TodoItem';

import getFilteredTodos from '../../helpers/getFilteredTodos';

export const TodosList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodosContext();
  const { apiError } = useApiErrorContext();

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames={classNames('temp-item', {
              'has-error': apiError,
            })}
          >
            <TodoItem todo={tempTodo} key={tempTodo.id} />
          </CSSTransition>

        )}
      </TransitionGroup>
    </section>
  );
};
