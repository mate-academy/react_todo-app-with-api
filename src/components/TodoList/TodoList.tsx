import React, { useContext, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../Todo';
import { Todo } from '../../types/Todo';
import { UserIdContext } from '../../utils/context';
import { ErrorMessage } from '../../types/ErrorMessage';
import { ChangeFunction } from '../../types/ChangeFunction';

type Props = {
  todos: Todo[];
  counterActiveTodos: number;
  creatingTodoTitle: string;
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
  creatingTodoTitle,
  isClearCompleted,
  DeleteTodo,
  ChangeTodo,
  showError,
  hideError,
  isAllToggled,
}) => {
  const userId = useContext(UserIdContext);

  const creatingTodo = useMemo(
    () => ({
      id: 0,
      userId,
      title: creatingTodoTitle,
      completed: false,
    }),
    [userId, creatingTodoTitle],
  );

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
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
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
