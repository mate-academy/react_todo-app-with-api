/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../utils/constants';

export const TodoHeader: React.FC = () => {
  const {
    setErrorMessage,
    addTodoHandler,
    todos,
    activeTodos,
    completedTodos,
    isLoading,
    setTempTodo,
    toggleChangeHandler,
  } = useContext(TodoContext);

  const activeTodosCount = activeTodos.length;

  const formInputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const [value, setValue] = useState('');

  const handleToggleAll = () => {
    if (activeTodosCount) {
      activeTodos.forEach(todo => toggleChangeHandler(todo));
    } else {
      completedTodos.forEach(todo => toggleChangeHandler(todo));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trimStart();

    setValue(newValue);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trimEnd()) {
      setErrorMessage(ErrorMessage.EmptyTitleError);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodoHandler(newTodo)
      .then(() => {
        setValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
      });
  };

  useEffect(() => {
    if (formInputRef.current) {
      formInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      formInputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={formInputRef}
          value={value}
          onChange={(event) => handleInputChange(event)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
