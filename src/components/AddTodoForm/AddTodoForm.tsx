import React, { useContext, useState } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { ERRORS } from '../../types/TodosErrors';

export const AddTodoForm: React.FC = () => {
  const [titleField, setTitleField] = useState('');

  const { onAddTodo, updateError } = useContext(TodosContext);

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normilizedField = titleField.trim();

    if (!normilizedField) {
      updateError(ERRORS.EMPTY);

      return;
    }

    onAddTodo(normilizedField);
    setTitleField('');
  };

  return (
    <form onSubmit={onHandleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={titleField}
        onChange={(e) => setTitleField(e.target.value)}
      />
    </form>
  );
};
