import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { NotificationErrors } from '../types/Errors';

type Props = {
  visibleTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  loadingTodoId: number[] | null;
  updateTodos: (todoId: number, updates: Partial<Todo>) => Promise<Todo>;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number[] | null>>;
  setNotificationError: React.Dispatch<
    React.SetStateAction<NotificationErrors | null>
  >;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  onDelete,
  onToggle,
  loadingTodoId,
  updateTodos,
  setLoadingTodoId,
  setNotificationError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const checkboxId = `todo-${todo.id}`;
        const isTemp = todo.id === 0;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            checkboxId={checkboxId}
            isTemp={isTemp}
            setNotificationError={setNotificationError}
            setLoadingTodoId={setLoadingTodoId}
            updateTodos={updateTodos}
            onToggle={onToggle}
            onDelete={onDelete}
            setTodos={setTodos}
            loadingTodoId={loadingTodoId}
          />
        );
      })}
    </section>
  );
};
