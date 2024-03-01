import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { createTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { TodosContext } from '../../contexts/TodoContext';
import { USER_ID } from '../../constants/constants';

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
    setEditedTodos,
  } = useContext(TodosContext);

  const [notActiveButton, setNotActiveButton] = useState(false);

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
        setTodos(current => [...current, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(Errors.onAdd);
        setTempTodo(null);
      })
      .finally(() => {
        setNotActiveButton(false);
      });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setNotActiveButton(true);
      addTodo();
    } else {
      setErrorMessage(Errors.EmptyTittleField);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);

  const numberOfCompletedTodos = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, tempTodo]);

  const toggledTodosList = useMemo(() => {
    if (numberOfCompletedTodos) {
      return todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    }

    return todos.map(todo => ({
      ...todo,
      completed: true,
    }));
  }, [todos, numberOfCompletedTodos]);

  const toggleChanges = () => {
    let notCompletedTodos;

    if (!numberOfCompletedTodos) {
      notCompletedTodos = todos.filter(todo => !todo.completed);
    } else {
      notCompletedTodos = todos;
    }

    setEditedTodos(notCompletedTodos);

    notCompletedTodos.forEach(editedTodo =>
      updateTodo({
        ...editedTodo,
        completed: !editedTodo.completed,
      })
        .then(() => {
          setTodos(toggledTodosList);
        })
        .catch(() => setErrorMessage(Errors.onUpdate))
        .finally(() => setEditedTodos([])),
    );
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={toggleChanges}
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: numberOfCompletedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          disabled={notActiveButton}
          ref={titleField}
          onChange={changeHandler}
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
