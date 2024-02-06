import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../contexts/TodosContext';
import { USER_ID } from '../../variables';
import { createTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header = () => {
  const {
    title,
    setTitle,
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    tempTodo,
    setChangedTodos,
  } = useContext(TodosContext);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  const addTodo = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(todoFromServer => {
        setTodos(curr => [...curr, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(Errors.UnableToAdd);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabledButton(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabledButton(true);
      addTodo();
    } else {
      setErrorMessage(Errors.TitleEmpty);
    }
  };

  const handlerChange
    = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(
      event.target.value,
    );

  const counterOfCompletedTodos = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, tempTodo]);

  const toggledTodosList = useMemo(() => {
    if (counterOfCompletedTodos) {
      return todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    }

    return todos.map(todo => ({
      ...todo,
      completed: true,
    }));
  }, [todos, counterOfCompletedTodos]);

  const toggleChanges = () => {
    let notCompletedTodos;

    if (!counterOfCompletedTodos) {
      notCompletedTodos = todos.filter(todo => !todo.completed);
    } else {
      notCompletedTodos = todos;
    }

    setChangedTodos(notCompletedTodos);

    notCompletedTodos.forEach(changedTodo => updateTodo({
      ...changedTodo,
      completed: !changedTodo.completed,
    })
      .then(() => {
        setTodos(toggledTodosList);
      })
      .catch(() => setErrorMessage(Errors.UnableToUpdate))
      .finally(() => setChangedTodos([])));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={toggleChanges}
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: counterOfCompletedTodos })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isDisabledButton}
          ref={titleField}
          onChange={handlerChange}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
