import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { TypeTodo } from '../../types/Todo';
import { USER_ID, createData, updateData } from '../../api/todos';

interface Props {
  todos: TypeTodo[];
  isLoading: boolean;
  inputFocus: boolean;
  allTodosCompleted: boolean;
  setInputFocus: (focus: boolean) => void;
  setErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<TypeTodo | null>>;
}

export const Header: React.FC<Props> = ({
  inputFocus, inputRef, allTodosCompleted,
  todos, setInputFocus, setErrorMessage,
  setTodos, setTempTodo, setIsLoading
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCreateNew = async () => {
    if (!title.trim().length) {
      return;
    }

    const maxId = todos.reduce((max, todo) => Math.max(max, todo.id), 0);

    setTempTodo({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      id: maxId + 1,
    });

    setIsDisabled(true);
    await createData({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      id: maxId + 1,
    })
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setTitle('');
        setInputFocus(true);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const handleKeyPress = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (!title.trim()) {
        setErrorMessage('Title should not be empty');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return;
      }

      handleCreateNew();
    }
  }, [title, setErrorMessage, handleCreateNew]);

  const handlePreventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos?.every(todo => todo.completed);

    setIsLoading(true);
    todos?.forEach(todo => {
      updateData(todo.id, 'completed', !todo.completed)
        .then(() => {
          setTodos(prevTodos => prevTodos.map(prev => (
            {
              ...prev,
              completed: !isAllCompleted
            })));
          setInputFocus(true);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');

          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length &&
        <button
          type="button"
          className={classNames("todoapp__toggle-all",
            { "active": allTodosCompleted }
          )}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      }

      <form onSubmit={handlePreventSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleValue}
          onKeyDown={handleKeyPress}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoFocus={inputFocus}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
