import cn from 'classnames';
import React from 'react';
import { CreateForm } from '../CreateForm/CreateForm';
import { Errors } from '../../utils/Errors';
import { Todo } from '../../types/Todo';

interface Props {
  unfinishedTodoIds: number[];
  todosLength: number;
  setErrorMessage: (error: Errors) => void;
  setTempTodo: (todo: Todo | null) => void;
  onAddTodo: (newTodo: Todo) => void;
  tempTodo: Todo | null;
  onToggleAddTodos: () => void;
}

export const Header: React.FC<Props> = ({
  todosLength,
  unfinishedTodoIds,
  setErrorMessage,
  setTempTodo,
  onAddTodo,
  tempTodo,
  onToggleAddTodos,
}) => {
  const areAllTodoCompleted = unfinishedTodoIds.length === 0;

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAddTodos()}
        />
      )}
      <CreateForm
        setErrorMessage={setErrorMessage}
        setTempTodo={setTempTodo}
        onAddTodo={onAddTodo}
        tempTodo={tempTodo}
        todosLength={todosLength}
      />
    </header>
  );
};
