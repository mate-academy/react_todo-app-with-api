import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  onAdd: (todo: Todo) => void;
  title: string;
  onChange: (value: string) => void;
  onError: (error: string) => void;
  checkResponceAdd: boolean;
  onToggleAll: (todos: Todo[]) => void;
};

export const NewTodoField: React.FC<Props> = ({
  todos,
  onAdd,
  title,
  onChange,
  onError,
  checkResponceAdd,
  onToggleAll,
}) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocus.current?.focus();
  }, [checkResponceAdd]);

  const handleAddTodo = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');

      return;
    }

    if (trimmedTitle) {
      onAdd({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
        id: 0,
      });
    }
  };

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleAddTodo(event);
    }
  }

  function toggledList(list: Todo[]) {
    if (
      list.every(item => item.completed === true) ||
      list.every(item => item.completed === false)
    ) {
      return list.map(item => {
        return { ...item, completed: !item.completed };
      });
    } else {
      return list
        .filter(item => item.completed === false)
        .map(item => {
          return { ...item, completed: true };
        });
    }
  }

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll(toggledList(todos))}
        />
      )}
      <form>
        <input
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleKeyDown}
          disabled={checkResponceAdd}
          onChange={event => onChange(event.target.value)}
          ref={inputFocus}
        />
      </form>
    </>
  );
};
