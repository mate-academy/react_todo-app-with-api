import { useEffect, useRef } from 'react';
import { USER_ID } from '../api/todos';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todoTitle: string;
  setTodoTitle: (text: string) => void;
  addTodo: ({ userId, title, completed }: Omit<Todo, 'id'>) => void;
  allComleted: boolean;
  setErrorMessage: (text: string) => void;
  loading: boolean;
  todos: Todo[];
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todoTitle,
  setTodoTitle,
  addTodo,
  allComleted,
  setErrorMessage,
  loading,
  todos,
  toggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [loading, todos]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTodoTitle(event.target.value);
  };

  const handleTitleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!todoTitle.trim()) {
        setErrorMessage('Title should not be empty');
        setTimeout(() => setErrorMessage(''), 3000);
      }

      if (todoTitle.trim()) {
        addTodo({
          userId: USER_ID,
          title: todoTitle.trim(),
          completed: false,
        });
      }
    }

    if (event.key === 'Escape') {
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allComleted })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          onKeyDown={handleTitleEnter}
          ref={titleField}
          disabled={loading}
        />
      </form>
    </header>
  );
};
