/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { AddTodoForm } from '../AddTodoForm/AddTodoForm';
import { TodosContext } from '../../context/TodosContext';

export const Header: React.FC = () => {
  const { toggleAll } = useContext(TodosContext);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={() => toggleAll()}
      />

      {/* Add a todo on form submit */}
      <AddTodoForm />
    </header>
  );
};
