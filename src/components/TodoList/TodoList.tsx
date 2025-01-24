import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  loadingByIds: number[];
  onDelete: (value: number) => Promise<void>;
  updateTodo: (todoToUpdate: Todo) => Promise<void>;
  updateTodoTitle: (todoToUpdate: Todo) => Promise<void>;
  setErrorMessage: (value: ErrorType) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isLoading,
  loadingByIds,
  onDelete,
  updateTodo,
  updateTodoTitle,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          loadingByIds={loadingByIds.includes(todo.id)}
          onDelete={onDelete}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          setErrorMessage={setErrorMessage}
        />
      ))}
      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isLoading={true} />
      )}
    </section>
  );
};
