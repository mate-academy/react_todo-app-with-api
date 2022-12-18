import React, {
  ChangeEvent, useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import classNames from 'classnames';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorMessage } from '../../types/ErrorMessage';
import { addTodo } from '../../api/todos';

interface Props {
  title: string,
  onTitleChange: (value: string) => void,
  isTodosAvailable: boolean,
  onErrorsChange: (value: ErrorMessage) => void,
  isAdding: boolean,
  onIsAddingChange: (value: boolean) => void,
  loadTodos: () => void;
  setAllTodosCompleted: () => void,
  isToggleAllActive: boolean,
}

export const AddField: React.FC<Props> = (
  {
    title,
    onTitleChange,
    isTodosAvailable,
    onErrorsChange,
    isAdding,
    onIsAddingChange,
    loadTodos,
    setAllTodosCompleted,
    isToggleAllActive,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const user = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onErrorsChange(ErrorMessage.EmptyToDo);

      return;
    }

    onIsAddingChange(true);

    if (title.trim() && user) {
      try {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadTodos();

        onIsAddingChange(false);
        onTitleChange('');
      } catch {
        onErrorsChange(ErrorMessage.Add);
      }
    }
  };

  const handleTittleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      return onTitleChange(event.target.value);
    },
    [],
  );

  return (
    <header className="todoapp__header">
      {isTodosAvailable && (
        <button
          data-cy="ToggleAllButton"
          aria-label="Toggle all"
          type="button"
          // className="todoapp__toggle-all"
          className={classNames('todoapp__toggle-all',
            {
              active: isToggleAllActive,
            })}
          onClick={() => setAllTodosCompleted()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTittleChange}
        />
      </form>
    </header>
  );
};
