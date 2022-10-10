import classNames from 'classnames';
import
React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleToggleAll: () => Promise<void>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
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
  setErrorMessage,
  setTodos,
  user,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorMessage('Title cannot be empty');

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    }

    setTitle('');
    setIsAdding(false);
  }, [title, user]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="close"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={handleToggleAll}
      />

      <form
        onSubmit={newTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={getValue}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
