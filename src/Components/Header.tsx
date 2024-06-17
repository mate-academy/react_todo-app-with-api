import React, { useEffect, useState } from 'react';
import { USER_ID, changeTodo, postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  setErrorMessage: (value: string) => void;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  completedTodos: Todo[];
  setTempTodo: (value: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setMakingChanges: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  completedTodos,
  todos,
  setTodos,
  setTempTodo,
  inputRef,
  setMakingChanges,
}) => {
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, inputRef]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedInput = input.trim();

    if (normalizedInput.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    });

    postTodo({
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    })
      .then(data => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, data]);
        setInput('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const onToggle = (id: number) => {
    setMakingChanges(true);
    changeTodo(id, { completed: todos.length !== completedTodos.length })
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(prevTodo => ({
            ...prevTodo,
            completed: todos.length !== completedTodos.length,
          })),
        );
      })
      .finally(() => {
        setMakingChanges(false);
      });
  };

  const handleToggle = () => {
    if (completedTodos.length === todos.length || completedTodos.length === 0) {
      todos.forEach(todo => onToggle(todo.id));
    } else {
      const notCompletedTodos = todos.filter(todo => !todo.completed);

      notCompletedTodos.forEach(todo => onToggle(todo.id));
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          })}
          onClick={handleToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
