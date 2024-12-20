import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {  //+++
  onAdd: (title: string) => void;
  isAdding: boolean;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onToggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdd, isAdding, newTodoTitle, setNewTodoTitle, inputRef, todos, onToggleAll }) => { //+++


  const handleSubmit = (event: React.FormEvent) => { //+++
    event.preventDefault();
    onAdd(newTodoTitle.trim());
  };

  React.useEffect(() => {
    if (inputRef.current && !isAdding) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className={classNames('todoapp__new-todo', {
            'todoapp__new-todo--disabled' : isAdding,
          })}
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
      {todos.length > 0 && (
      <button
      type="button"
      data-cy="ToggleAllButton"
      className={classNames('todoapp__toggle-all', {
      active: todos.every(todo => todo.completed),
      })}
      onClick={onToggleAll}
      >
    </button>
    )}
      </header>
  );
};
