import {
  KeyboardEvent, SetStateAction, useEffect, useState,
} from 'react';
import { Todo } from '../types/Todo';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HeaderProps {
  todos:Todo[],
  toggleAllCompleted:()=>void,
  setTempTodos:React.Dispatch<React.SetStateAction<Todo[]>>
  setError: (value: SetStateAction<string>) => void,
  isInputLocked: boolean,
  setIsInputLocked: (arg0:boolean) => void,
}

export const Header: React.FC<HeaderProps> = ({
    setTempTodos,
    setError,
    isInputLocked,
    setIsInputLocked,
    toggleAllCompleted,
    todos,
}) => {
  const [query, setQuery] = useState('');
  const [isToggleAllActive, setIsToggleAllActive]
    = useState(!todos.every(todo => todo.completed));

  useEffect(() => {
    setIsToggleAllActive(!todos.every(todo => todo.completed));
  }, [todos]);

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      if (query) {
        setTempTodos(prev => {
          return [
            ...prev,
            {
              id: Date.now(),
              userId: 0,
              title: query,
              completed: false,
            },
          ];
        });
        setIsInputLocked(true);
      } else {
        setError('Title can\'t be empty');
      }

      setQuery('');
    }
  };

  const handleToggleAllCompleted = () => {
    toggleAllCompleted();
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={`todoapp__toggle-all ${isToggleAllActive ? 'active' : ''}`}
        onClick={handleToggleAllCompleted}
      />
      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onKeyDown={handleEnter}
          onChange={event => setQuery(event.target.value)}
          disabled={isInputLocked}
        />
      </form>
    </header>
  );
};
