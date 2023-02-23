import React, { useContext, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { OptionalTodo } from '../../types/OptionalTodo';
import { EditTodo } from '../../types/EditTodo';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { UserContext } from '../../UserContext';
import { TodoInfo } from '../Todo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodoName: string;
  activeTodosQuantity: number,
  isClearCompleted: boolean;
  isToggled: boolean,
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  deleteTodo: (todoId: number) => void;
  editTodo: EditTodo;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodoName,
  activeTodosQuantity,
  isClearCompleted,
  isToggled,
  showError,
  hideError,
  deleteTodo,
  editTodo,
}) => {
  const userId = useContext(UserContext);

  const tempTodo: OptionalTodo = useMemo(() => ({
    id: 0,
    userId,
    title: tempTodoName,
    completed: false,
  }),
  [userId, tempTodoName]);

  const isLoading = (isTodoCompleted: boolean): boolean => {
    const hasTodoToBeToggled
    = !activeTodosQuantity
      ? isTodoCompleted
      : !isTodoCompleted;
    const isTodoToggled = isToggled && hasTodoToBeToggled;

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
            <TodoInfo
              todo={todo}
              showError={showError}
              hideError={hideError}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              isLoading={isLoading(todo.completed)}
            />
          </CSSTransition>
        ))}

        {tempTodoName && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
