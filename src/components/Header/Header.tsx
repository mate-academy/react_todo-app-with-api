import React, { useEffect, useRef, useState } from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMassege: (error: string) => void,
  hideError: () => void,
  userId: number,
  addTodo: (todo: Todo) => void,
  spinnerStatus: (value: boolean) => void,
  changeDate: (date: Date) => void,
  changeCurrentId: (id: number) => void,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
  isCompletedAllTodos: boolean,
  setSpinnerForTodos: (value: boolean) => void,
};

export const Header: React.FC<Props> = ({
  setErrorMassege,
  hideError,
  userId,
  addTodo,
  spinnerStatus,
  changeDate,
  changeCurrentId,
  setTodos,
  todos,
  isCompletedAllTodos,
  setSpinnerForTodos,
}) => {
  const [titleTodo, setTitleTodo] = useState('');
  const [isblockedInput, setIsblockedInput] = useState(false);
  const [returnFocus, setReturnFocus] = useState(false);

  const inputAddFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (returnFocus) {
      inputAddFocus.current?.focus();
    }
  }, [returnFocus]);

  const handleChangeTitleTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleTodo(event.target.value);
  };

  const handleSubmitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsblockedInput(true);

    if (!titleTodo.trim()) {
      setErrorMassege('Title can\'t be empty');
      hideError();
      setIsblockedInput(false);

      return;
    }

    const tempTodo = {
      id: 0,
      userId,
      title: titleTodo,
      completed: false,
    };

    setReturnFocus(false);
    changeCurrentId(0);
    spinnerStatus(true);
    addTodo(tempTodo);

    createTodo(tempTodo)
      .then(() => {
        setTitleTodo('');
        spinnerStatus(false);
        changeDate(new Date());
      })
      .catch(() => {
        setErrorMassege('Unable to add a todo');
        hideError();
        setTodos(todos);
      })
      .finally(() => {
        setIsblockedInput(false);
        setReturnFocus(true);
      });
  };

  const handleClickCompletedAllTodos = () => {
    if (isCompletedAllTodos) {
      setErrorMassege('');
      spinnerStatus(true);
      setSpinnerForTodos(true);
      const promises = todos.map(todo => {
        return updateTodo({ ...todo, completed: true });
      });

      Promise.all(promises)
        .then(() => changeDate(new Date()))
        .catch(() => {
          setErrorMassege('Unable to update a todos');
          hideError();
        })
        .finally(() => {
          setSpinnerForTodos(false);
          spinnerStatus(false);
        });
    }

    if (!isCompletedAllTodos) {
      setErrorMassege('');
      spinnerStatus(true);
      setSpinnerForTodos(true);
      const promises = todos.map(todo => {
        return updateTodo({ ...todo, completed: false });
      });

      Promise.all(promises)
        .then(() => changeDate(new Date()))
        .catch(() => {
          setErrorMassege('Unable to update a todos');
          hideError();
        })
        .finally(() => {
          setSpinnerForTodos(false);
          spinnerStatus(false);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button
          aria-label="change the completed of todos"
          type="button"
          className={`todoapp__toggle-all ${!isCompletedAllTodos && 'active'}`}
          onClick={handleClickCompletedAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitTodo}>
        <input
          ref={inputAddFocus}
          value={titleTodo}
          onChange={handleChangeTitleTodo}
          disabled={isblockedInput}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
