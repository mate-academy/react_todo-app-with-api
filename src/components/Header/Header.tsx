/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { FormControlContext, TodosContext } from '../../store/store';
import { Dispatchers } from '../../types/enums/Dispatchers';

const USER_ID = 11806;

export const Header: React.FC = () => {
  const { todos, dispatcher } = useContext(TodosContext);
  const {
    formValue,
    onSetFormValue,
    disabledInput,
    inputRef,
  } = useContext(FormControlContext);
  const [isAllComplited, setIsAllComplited] = useState(false);

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onSetFormValue(event.target.value);
  };

  const handleCreateNewTodo = () => {
    const newTodo = {
      title: formValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    dispatcher({ type: Dispatchers.Add, payload: newTodo });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCreateNewTodo();
  };

  const toggleAllStatuses = (): void => {
    dispatcher({
      type: Dispatchers.ChangeAllStatuses,
      payload: !isAllComplited,
    });
  };

  useEffect(() => {
    setIsAllComplited(todos.every(elem => elem.completed));
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0
        && (
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: isAllComplited },
            )}
            data-cy="ToggleAllButton"
            onClick={toggleAllStatuses}
          />
        )}

      <form
        onSubmit={handleSubmit}
        action="/#"
      >
        <input
          disabled={disabledInput}
          value={formValue}
          ref={inputRef}
          onChange={handleValueChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
