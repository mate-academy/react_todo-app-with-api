import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { createTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  toggleAll: (switcher: boolean) => void;
  deleteItem: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setTempTodo,
  setTodos,
  setErrorMessage,
  toggleAll,
  deleteItem,
}) => {
  const [title, setTitle] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);

  const activeToggleButton = useMemo(() => {
    return todos.every(({ completed }) => completed);
  }, [todos]);

  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textField.current?.focus();
  }, [disabledInput, deleteItem]);

  useEffect(() => {
    setDisabledInput(deleteItem);
  }, [deleteItem]);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedTitle = title.trim();

    setDisabledInput(true);

    if (!formattedTitle) {
      setTitle(formattedTitle);
      setErrorMessage('Title should not be empty');
      textField.current?.focus();

      setTimeout(() => {
        setErrorMessage('');
        setDisabledInput(false);
      }, 3000);

      return;
    }

    setTempTodo({
      title: formattedTitle,
      id: 0,
      completed: false,
      userId: USER_ID,
    });

    createTodo({
      title: formattedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(data => {
        setTodos(currentTodos => {
          return [...currentTodos, data];
        });
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTitle(formattedTitle);
        textField.current?.focus();
      })
      .finally(() => {
        setDisabledInput(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!todos.length || (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeToggleButton,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll(activeToggleButton)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={textField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
