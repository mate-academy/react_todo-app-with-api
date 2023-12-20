/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GlobalContex } from '../TodoContext';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';

export const Header: React.FC = () => {
  const {
    USER_ID,
    postNewTodo,
    updateTodoItem,
    todos,
    setTodos,
    setError,
    setTempTodo,
    isLoading,
    setIsLoading,
    setIsAllUpdating,
    isTitleOnFocus,
    setIsTitleOnFocus,
  } = useContext(GlobalContex);

  const [title, setTitle] = useState('');
  const [isToggleAll, setIsToggleAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTitleOnFocus) {
      inputRef.current?.focus();
    }
  }, [isTitleOnFocus]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;

    setTitle(titleValue);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsTitleOnFocus(false);

    if (title.trim()) {
      setIsLoading(true);

      const tempTodo: Omit<Todo, 'userId'> = {
        id: 0,
        title: title.trim(),
        completed: false,
      };

      setTempTodo(tempTodo);

      const newTodo: Omit<Todo, 'id'> = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      postNewTodo(newTodo)
        .then(todo => {
          setTitle('');
          setTodos([...todos, {
            id: todo.id,
            title: todo.title,
            userId: todo.userId,
            completed: todo.completed,
          }]);
        })
        .catch(() => setError(TodoErrors.Add))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
          setIsTitleOnFocus(true);
        });
    } else {
      setError(TodoErrors.Title);
    }
  };

  const handleToggleAllClick = async () => {
    setTodos(todos.map(todo => {
      setIsAllUpdating(true);

      updateTodoItem(todo.id, { completed: isToggleAll })
        .catch((err) => {
          setError(TodoErrors.Update);
          throw err;
        })
        .finally(() => setIsAllUpdating(false));

      return { ...todo, completed: isToggleAll };
    }));
  };

  useEffect(() => {
    if (todos.every(todo => todo.completed)) {
      setIsToggleAll(false);
    } else {
      setIsToggleAll(true);
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAll,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          value={title}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
