/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  addNewTodo: (title: string) => void;
  isAdding: boolean;
  showError: (message: string) => void;
  onToggleAll: () => Promise<void>;
  todos: Todo[];
};

export const NewTodo: React.FC<Props> = ({
  addNewTodo,
  isAdding,
  showError,
  onToggleAll,
  todos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const resetForm = useCallback(() => {
    setNewTodoTitle('');
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!newTodoTitle.trim()) {
        showError('Title can\'t be empty');
        resetForm();
      } else {
        await addNewTodo(newTodoTitle);
        resetForm();
      }
    } catch (err) {
      showError('Unable to add todo');
    }
  };

  const isAllCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        onClick={onToggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
