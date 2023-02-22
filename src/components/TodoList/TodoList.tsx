import React, { useContext, useMemo } from 'react';
import { SelectedTodo } from '../../types/SelectedTodo';
import { EditTodo } from '../../types/EditTodo';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { UserContext } from '../../UserContext';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodoName: string;
  activeTodosAmount: number,
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
  activeTodosAmount,
  isClearCompleted,
  isToggled,
  showError,
  hideError,
  deleteTodo,
  editTodo,
}) => {
  const userId = useContext(UserContext);

  const tempTodo: SelectedTodo = useMemo(
    () => ({
      id: 0,
      userId,
      title: tempTodoName,
      completed: false,
    }),
    [userId, tempTodoName],
  );

  const isLoading = (isTodoCompleted: boolean): boolean => {
    const hasTodoToBeToggled
    = !activeTodosAmount
      ? isTodoCompleted
      : !isTodoCompleted;
    const isTodoToggled = isToggled && hasTodoToBeToggled;

    return (isTodoCompleted && isClearCompleted) || isTodoToggled;
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          showError={showError}
          hideError={hideError}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          isLoading={isLoading(todo.completed)}
        />
      ))}

      {tempTodoName && (
        <TodoInfo
          key={0}
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
});
