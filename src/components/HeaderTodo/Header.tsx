import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ContextTodo } from '../ContextTodo';
import { USER_ID } from '../../utils/constant';
import { createTodo, updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types';

export const HeaderTodo = () => {
  const {
    title,
    setTitle,
    todos,
    setTodos,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    setLoadingTodoIds,
  } = useContext(ContextTodo);

  const [isDisabled, setIsDisabledButton] = useState(false);

  const changeValues = () => {
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
        setErrorMessage(ErrorMessage.AddTodoError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabledButton(false);
      });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabledButton(true);
      changeValues();
    } else {
      setErrorMessage(ErrorMessage.EmptyTitle);
    }
  };

  const changeHandler
    = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(
      event.target.value,
    );

  const todosLeft = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, tempTodo]);

  // button in header
  const toggledTodosList = useMemo(() => {
    if (todosLeft) {
      return todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    }

    return todos.map(todo => ({
      ...todo,
      completed: true,
    }));
  }, [todos, todosLeft]);

  const toggleChanges = () => {
    let notCompletedTodos;

    if (!todosLeft) {
      notCompletedTodos = todos.filter(todo => !todo.completed);
    } else {
      notCompletedTodos = todos;
    }

    setLoadingTodoIds(notCompletedTodos.map(todo => todo.id));

    notCompletedTodos.forEach(editedTodo => updateTodo({
      ...editedTodo,
      completed: !editedTodo.completed,
    })
      .then(() => {
        setTodos(toggledTodosList);
      })
      .catch(() => setErrorMessage(ErrorMessage.UpdateTodoError))
      .finally(() => setLoadingTodoIds([])));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={toggleChanges}
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: todosLeft })}
          data-cy="ToggleAllButton"
          aria-label="Toggle"
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          disabled={isDisabled}
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
