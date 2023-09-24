import React, { useContext, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TempTodo, Todo } from '../Todo';
import { StatusType } from '../../types/Status';
import { TodoType } from '../../types/TodoType';
import { StateContext } from '../StateProvider';

const getVisibleTodos = (todos: TodoType[], filter: StatusType) => {
  switch (filter) {
    case StatusType.Active:
      return todos.filter((todo) => !todo.completed);

    case StatusType.Completed:
      return todos.filter((todo) => todo.completed);

    default:
      return todos;
  }
};

export const TodoList: React.FC = () => {
  const {
    todos,
    filter,
    tempTodo,
    loading,
  } = useContext(StateContext);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [todos, filter],
  );

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <Todo
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo
              todo={tempTodo}
              loading={loading}
            />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
