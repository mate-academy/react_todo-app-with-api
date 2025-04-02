import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { NewTodoForm } from '../NewTodoForm';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  setNewError: (newErrorMessage: Errors) => void;
  changeAllIsComplated: () => void;
  isFocusAddForm: boolean;
};

// eslint-disable-next-line react/display-name
export const Header: React.FC<Props> = React.memo(
  ({ todos, addTodo, setNewError, changeAllIsComplated, isFocusAddForm }) => {
    return (
      <header className="todoapp__header">
        {todos.length !== 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={() => changeAllIsComplated()}
          />
        )}

        <NewTodoForm
          addTodo={addTodo}
          setNewError={setNewError}
          isFocusAddForm={isFocusAddForm}
        />
      </header>
    );
  },
);
