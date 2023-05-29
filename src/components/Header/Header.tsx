import {
  FC, FormEvent, useCallback, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';
import { TodoData } from '../../types/TodoData';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../utils/UserId';

interface Props {
  todos: Todo[];
  onAdd: (newTodo: Todo) => void;
  onError: (error: null | Errors) => void;
  onChange: (newTodo: Todo | null) => void;
  onLoad: () => void;
  onSelect: () => void;
}

export const Header:FC<Props> = ({
  todos,
  onAdd,
  onError,
  onChange,
  onLoad,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      onError(Errors.Title);

      return;
    }

    const todoData: TodoData = {
      completed: false,
      title: query,
      userId: USER_ID,
    };

    onChange({ ...todoData, id: 0 });
    try {
      setIsDisabled(true);
      const newTodo = await createTodo(todoData);

      onAdd(newTodo);
      setQuery('');
    } catch {
      onError(Errors.Add);
    } finally {
      onLoad();
      onChange(null);
      setIsDisabled(false);
    }
  }, [
    query,
    onError,
    onChange,
    onLoad,
    onAdd,
  ]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="button"
          type="button"
          className="todoapp__toggle-all active"
          onClick={onSelect}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onError(null);
          }}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
