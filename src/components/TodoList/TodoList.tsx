import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../types/ConstantTypes';
import { ChangeFunction } from '../../types/ChangeFunction';

type Props = {
  todos: Todo[];
  counterActiveTodos: number;
  query: string;
  isClearCompleted: boolean;
  isAllToggled: boolean;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  DeleteTodo: (todoId: number) => void;
  ChangeTodo: ChangeFunction;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  counterActiveTodos,
  query,
  isClearCompleted,
  isAllToggled,
  DeleteTodo,
  showError,
  hideError,
  ChangeTodo,
}) => {
  const creatingTodo: Todo | null = !query
    ? null
    : {
      id: 0,
      USER_ID,
      title: query,
      completed: false,
    };

  const isLoading = (isTodoCompleted: boolean): boolean => {
    const hasTodoToBeToggled = counterActiveTodos === 0
      ? isTodoCompleted
      : !isTodoCompleted;
    const isTodoToggled = isAllToggled && hasTodoToBeToggled;

    return (isTodoCompleted && isClearCompleted) || isTodoToggled;
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              showError={showError}
              hideError={hideError}
              DeleteTodo={DeleteTodo}
              ChangeTodo={ChangeTodo}
              isLoading={isLoading(todo.completed)}
            />
          </CSSTransition>
        ))}

        {creatingTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={creatingTodo}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
