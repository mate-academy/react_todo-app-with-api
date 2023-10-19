import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../Context/TodoContext';

export const TodoForm: React.FC = () => {
  const {
    todos,
    completedTodos,
    uncompletedTodos,
    handleAddTodo,
    setErrorMessage,
    handleStatusTodoChange,
  } = useContext(TodoContext);

  const isTodosToShow = !!todos.length;
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const areAllTodoCompleted = todos.length === completedTodos.length;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleAll = () => {
    if (areAllTodoCompleted) {
      completedTodos.forEach(todo => handleStatusTodoChange(todo));
    } else {
      uncompletedTodos.forEach(todo => handleStatusTodoChange(todo));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    handleAddTodo(preparedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {

      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  // useEffect(() => {
  //   if (!isAdding) {
  //     titleField.current?.focus();
  //   }
  // }, [isAdding]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {isTodosToShow && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: areAllTodoCompleted })}
          data-cy="ToggleAllButton"
          aria-label="New Todo"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={handleTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
