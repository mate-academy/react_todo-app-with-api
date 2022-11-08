import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[];
  hasTodos: boolean;
  onAdd: (title: string) => void;
  onError: (error: ErrorType) => void;
  onChangeStatus: (todo: Todo) => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  hasTodos,
  onAdd,
  onError,
  onChangeStatus,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const preparedQuery = query.trim();

      if (preparedQuery) {
        onAdd(preparedQuery);
        setQuery('');
      } else {
        onError({ status: true, message: 'Title can\'t be empty' });
      }
    }, [query],
  );

  const allTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed), [todos],
  );

  const allTodosActive = useMemo(
    () => todos.every(todo => !todo.completed), [todos],
  );

  const handleTodosToggle = useCallback(() => {
    if (allTodosCompleted || allTodosActive) {
      todos.forEach(todo => onChangeStatus(todo));
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          onChangeStatus(todo);
        }
      });
    }
  }, [todos, allTodosCompleted, allTodosActive]);

  return (
    <>
      {hasTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: allTodosCompleted },
          )}
          onClick={handleTodosToggle}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </>
  );
};
