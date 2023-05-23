import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../types/ConstantTypes';
import { ChangeFunction } from '../../types/ChangeFunction';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  counterActiveTodos: number;
  query: string;
  isClearCompleted: boolean;
  isAllToggled: boolean;
  onShowError: (errorType: ErrorMessage) => void;
  onHideError: () => void;
  handleDelete: (todoId: number) => void;
  onChangeTodo: ChangeFunction;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  counterActiveTodos,
  query,
  isClearCompleted,
  isAllToggled,
  handleDelete,
  onShowError,
  onHideError,
  onChangeTodo,
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
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          showError={onShowError}
          hideError={onHideError}
          handleDelete={handleDelete}
          ChangeTodo={onChangeTodo}
          isLoading={isLoading(todo.completed)}
        />
      ))}

      {creatingTodo && (
        <TempTodo
          todo={creatingTodo}
        />
      )}
    </section>
  );
});
