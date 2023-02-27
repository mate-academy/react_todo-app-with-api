import React, { useContext, useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { UserIdContext } from '../../utils/context';
import { ErrorTypes } from '../../types/PossibleError';
import { PossibleTodo } from '../../types/PossibleTodo';
import { ChangeTodo } from '../../types/ChangeTodo';

type Props = {
  todos: Todo[];
  tempTodoName: string;
  activeTodosQuantity: number;
  deleteTodo: (todoId: number) => void;
  showError: (possibleError: ErrorTypes) => void;
  hideError: () => void;
  isClearCompleted: boolean;
  isToggled: boolean;
  changeTodo: ChangeTodo;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodoName,
  activeTodosQuantity,
  isToggled,
  deleteTodo,
  showError,
  hideError,
  isClearCompleted,
  changeTodo,
}) => {
  const userId = useContext(UserIdContext);

  const tempTodo: PossibleTodo = useMemo(
    () => ({
      id: 0,
      userId,
      title: tempTodoName,
      completed: false,
    }),
    [userId, tempTodoName],
  );

  const isLoading = (isTodoCompleted: boolean): boolean => {
    const hasTodoBeToggled = !activeTodosQuantity
      ? isTodoCompleted
      : !isTodoCompleted;
    const isTodoToggled = isToggled && hasTodoBeToggled;

    return (isTodoCompleted && isClearCompleted) || isTodoToggled;
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          showError={showError}
          hideError={hideError}
          deleteTodo={deleteTodo}
          changeTodo={changeTodo}
          isLoading={isLoading(todo.completed)}
        />
      ))}

      {tempTodoName && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
});
