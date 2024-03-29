/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SetTodosContext, TodosContext } from '../Contexts/TodosContext';
import { USER_ID, addTodo, editTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { SetErrorContext } from '../Contexts/ErrorContext';
import { ErrorMessage } from '../types/Error';
import { InputRef, SetInputRef } from '../Contexts/InputRefContext';

type Props = {
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);
  const setErrorMessage = useContext(SetErrorContext);
  const inputFocused = useContext(InputRef);
  const setInputFocused = useContext(SetInputRef);

  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputFocused) {
      inputRef.current.focus();
      setInputFocused(false);
    }
  }, [inputFocused, setInputFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.title);
      setTitle('');

      return;
    }

    if (inputRef?.current) {
      inputRef.current.disabled = true;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((todo: Todo) => {
        setTodos(prevTodos => prevTodos.concat(todo));
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.add))
      .finally(() => {
        if (inputRef?.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggledAllCompleted = useMemo(() => {
    return !todos.some(todo => !todo.completed);
  }, [todos]);

  const handleToggleAll = useCallback(() => {
    const updatedTodos = todos.map(todo => {
      if (todo.completed !== toggledAllCompleted) {
        return todo;
      }

      const updatedTodo: Todo = {
        ...todo,
        completed: !toggledAllCompleted,
      };

      editTodos(updatedTodo);

      return updatedTodo;
    });

    setTodos(updatedTodos);
  }, [todos, toggledAllCompleted, setTodos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: toggledAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
