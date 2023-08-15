/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-cycle */
import classNames from 'classnames';

import React, { useContext } from 'react';
import { AddTodoForm } from '../AddTodoForm/AddTodoForm';
import { TodosContext } from '../../context/TodosContext';

export const Header: React.FC = () => {
  const { toggleAllTodoStatus, todos } = useContext(TodosContext);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames({
          'todoapp__toggle-all': true,
          active: todos.every((todo) => todo.completed),
        })}
        onClick={toggleAllTodoStatus}
      />

      {/* Add a todo on form submit */}
      <AddTodoForm />
    </header>
  );
};
