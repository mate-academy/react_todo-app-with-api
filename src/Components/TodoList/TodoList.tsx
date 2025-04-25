import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[];
  onDeleteTodo: (value: number) => Promise<void>;
  onUpdateTodoStatus: (todoToUpdate: Todo) => Promise<void>;
  updateTodoTitle: (todoToUpdate: Todo) => Promise<void>;
  setErrorMessage: (value: ErrorType) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  loadingByIds: number[];
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  isLoading,
  loadingByIds,
  deletingTodoId,
  onUpdateTodoStatus,
  updateTodoTitle,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodoStatus={onUpdateTodoStatus}
          isLoading={isLoading}
          loadingByIds={loadingByIds.includes(todo.id)}
          isBeingDeleted={deletingTodoId === todo.id}
          updateTodoTitle={updateTodoTitle}
          setErrorMessage={setErrorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={true}
          isBeingDeleted={false}
        />
      )}
    </section>
  );
};
