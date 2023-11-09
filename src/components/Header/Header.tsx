import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID, addTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (value: string) => void;
  setTempTodo: (value: Todo | null) => void;
  onToggleAll: (id: number) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const [isInputActive, setIsInputActive] = useState(true);

  const isButtonActive = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputActive, todos]);

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();

    setErrorMessage('');
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
    } else {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setIsInputActive(false);
      const temp = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(temp);

      addTodo(newTodo)
        .then(todo => {
          setTodos([...todos, todo]);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsInputActive(true);
        });
    }
  }

  function handleToggleAll() {
    if (isButtonActive) {
      todos.forEach(todo => onToggleAll(todo.id));
    } else {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => onToggleAll(todo.id));
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isButtonActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          disabled={!isInputActive}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
