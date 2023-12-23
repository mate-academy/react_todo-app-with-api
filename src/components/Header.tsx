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
    setErrorId,
    setTempTodo,
    isLoading,
    setIsLoading,
    setIsAllUpdating,
    isTitleOnFocus,
    setIsTitleOnFocus,
    isToggleAll,
    setIsToggleAll,
  } = useContext(GlobalContex);

  const [title, setTitle] = useState('');
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

  const handleFormSubmit = async (event: React.FormEvent) => {
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
        .then(responsePost => {
          setTitle('');
          setTodos((previousTodos: Todo[]) => [...previousTodos, {
            id: responsePost.id,
            title: responsePost.title,
            userId: responsePost.userId,
            completed: responsePost.completed,
          }]);
        })
        .catch(() => {
          setErrorId(Date.now());
          setError(() => TodoErrors.Add);
        })
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
          setIsTitleOnFocus(true);
        });
    } else {
      setErrorId(Date.now());
      setError(TodoErrors.Title);
    }
  };

  const handleToggleAllClick = async () => {
    todos
      .filter(todo => todo.completed === isToggleAll)
      .forEach(todo => {
        setIsAllUpdating(true);
        updateTodoItem(todo.id, { completed: !isToggleAll })
          .then(() => {
            setTodos((previousTodos: Todo[]) => {
              return previousTodos.map(todoItem => {
                if (todoItem.id === todo.id) {
                  return {
                    ...todoItem,
                    completed: !todoItem.completed,
                  };
                }

                return todoItem;
              });
            });
          })
          .catch(() => {
            setErrorId(Date.now());
            setError(() => TodoErrors.Update);
          })
          .finally(() => {
            setIsAllUpdating(false);
          });
      });
  };

  useEffect(() => {
    setIsToggleAll(todos.every(todo => todo.completed));
  }, [todos, setIsToggleAll]);

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
