import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

interface Props {
  onAddTodo: (title: string, setTitle: (title: string) => void) => void;
  isAllCompleted: boolean;
  todosLength: number;
  tempTodo: Todo | null;
  updateTodo: (patchTodo: Todo, title: string) => void;
  isInputDisabled: boolean;
  todos: Todo[];
  onUpdateTodo: (patchTodo: Todo, title: string) => void;
  setLoading: (loading: string | number | null) => void;
  headerError: boolean;
  setLoadAll: (loadAll: number[]) => void;
}

const Header: React.FC<Props> = ({
  onAddTodo,
  isAllCompleted,
  todosLength,
  isInputDisabled,
  todos,
  onUpdateTodo,
  setLoading,
  headerError,
  setLoadAll,
}) => {
  const [title, setTitle] = useState('');
  const [isShouldFocus, setIsShouldFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, headerError]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(title, setTitle);
    if (!title.trim()) {
      setIsShouldFocus(true);
    }
  };

  if (isShouldFocus && inputRef.current) {
    inputRef.current.focus();
    setIsShouldFocus(false);
  }

  const handleCheckboxChange = () => {
    const allTodos = todos.map(todo => todo.id);

    setLoadAll(allTodos);

    if (isAllCompleted) {
      todos.forEach(todo => {
        const updatedTodo = {
          ...todo,
          completed: false,
          status: Status.Active,
        };

        onUpdateTodo(updatedTodo, updatedTodo.title);
      });
    } else {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => {
          setLoading(todo.id);
          const updatedTodo = {
            ...todo,
            completed: true,
            status: Status.Completed,
          };

          onUpdateTodo(updatedTodo, updatedTodo.title);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCheckboxChange}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
