import React, { useCallback, useContext, useMemo } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { ErrorContext } from '../Error/ErrorContext';

interface Props {
  todos: Todo[];
  status: Status;
  newTodoTitle: string;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo, newTitle: string) => Promise<void>
  onToggle: (todo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    status,
    newTodoTitle,
    onDelete,
    onUpdate,
    onToggle,
  } = props;

  const user = useContext(AuthContext);
  const { isAdding, selectedTodoIds } = useContext(ErrorContext);

  const getVisibleTodos = useCallback((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const visibleTodos = useMemo(
    getVisibleTodos,
    [todos, status],
  );

  const tempTodo = {
    id: 0,
    title: newTodoTitle,
    userId: user?.id || 0,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo) => {
          const isActive = selectedTodoIds.includes(todo.id);

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                isActive={isActive}
                onToggle={onToggle}
              />
            </CSSTransition>
          );
        })}

        {(user && isAdding) && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onToggle={onToggle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
