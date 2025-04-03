import React from 'react';
import { ErrorMessage, Todo } from '../types/Todo';
import cn from 'classnames';
import { AddTodoForm } from './AddTodoForm/AddTodoForm';

interface Props {
  todos: Todo[];
  onCheckAll: () => void;
  onAddTodo: (query: string) => Promise<void>;
  setErrorMessage: (msg: ErrorMessage) => void;
  isFocusAddForm: boolean;
}

export const HeaderTodoApp: React.FC<Props> = ({
  todos,
  onCheckAll,
  onAddTodo,
  setErrorMessage,
  isFocusAddForm,
}) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          hidden={!todos}
          onClick={onCheckAll}
        />
      )}
      <AddTodoForm
        setErrorMessage={setErrorMessage}
        onAddTodo={onAddTodo}
        isFocusAddForm={isFocusAddForm}
      />
    </header>
  );
};
