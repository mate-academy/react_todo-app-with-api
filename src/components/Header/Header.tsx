import classNames from 'classnames';
import {
  FormEvent, useCallback, useEffect, useRef,
} from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { Error } from '../../types/ErrorType';
import { createTodos } from '../../api/todos';

type Props = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleToggleAll: () => void;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  user: User | null;
};

export const Header: React.FC<Props> = ({
  setTitle,
  todos,
  title,
  isAdding,
  handleToggleAll,
  setIsAdding,
  setErrorNotification,
  setTodos,
  user,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const onAdd = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const addTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorNotification(Error.Title);

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodos(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorNotification(Error.Add);
    }

    setTitle('');
    setIsAdding(false);
  }, [title, user]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={handleToggleAll}
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onAdd}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
