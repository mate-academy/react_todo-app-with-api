import classNames from 'classnames';
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';
import { ErrorMessage } from '../../types/errorMessage';
import { Todo } from '../../types/Todo';

export const Header: React.FC = () => {
  const {
    todos, setTodos, errorNotificationHandler, USER_ID, setTempTodo,
    setTodosIdsUpdating, setErrorMessage, statusChangeHandler,
  } = useContext(TodosContext);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)), [todos]);

  const inputField = useRef<HTMLInputElement>(null);

  const addingTodo = (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage(ErrorMessage.NO);
    setIsDisabled(true);

    const tempTodoData = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tempTodoData);
    setTodosIdsUpdating([tempTodoData.id]);

    addTodo(USER_ID, newTodo)
      .then((response) => {
        setTodos([...todos,
          {
            ...response as Todo,
            title: title.trim(),
          }]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => errorNotificationHandler(ErrorMessage.ADD))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        setTodosIdsUpdating([]);
      });
  };

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todos]);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errorNotificationHandler(ErrorMessage.TITLE);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    addingTodo(newTodo);
  };

  const toggleAllHandler = async (
    event: React.FormEvent<HTMLButtonElement>,
  ) => {
    const button = event.target as HTMLButtonElement;

    if (button.classList.contains('active')) {
      todos.forEach(async currTodo => {
        statusChangeHandler(
          await currTodo.id, true,
        );
      });
    } else {
      todos.filter(currTodo => currTodo.completed === false)
        .forEach(async currTodo => {
          statusChangeHandler(
            await currTodo.id, false,
          );
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.length === completedTodos.length },
          )}
          data-cy="ToggleAllButton"
          aria-label="delete"
          onClick={toggleAllHandler}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputField}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
