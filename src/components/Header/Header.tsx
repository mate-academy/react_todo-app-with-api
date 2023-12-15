import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { AppContext } from '../../AppContext';
import { ContextKey } from '../../types/Context';

interface Props {
  createNewTodo: (title: string) => Promise<void>;
  errorFound: (error: ErrorType) => void
  updateTodo: (todo: Todo) => Promise<void>;
}

export const Header = ({
  createNewTodo,
  errorFound,
  updateTodo,
}: Props) => {
  const {
    todosFromServer,
    toggleAllActive,
    changeState,
  } = useContext(AppContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [todoTitleDisabled, setTodoTitleDisabled] = useState(false);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [todosFromServer, todoTitleDisabled]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      errorFound(ErrorType.TitleEmpty);

      return;
    }

    setTodoTitleDisabled(true);
    createNewTodo(title)
      .then(() => setTodoTitle(''))
      .catch(() => {})
      .finally(() => {
        setTodoTitleDisabled(false);
      });
  };

  const toggleTodo = (
    condition: boolean,
    state: boolean,
    todo: Todo,
    isLast: boolean,
  ) => {
    if (condition) {
      updateTodo({
        ...todo,
        completed: state,
      })
        .finally(() => {
          if (isLast) {
            changeState(ContextKey.GlobalLoading, false);
          }
        });
    }
  };

  const handleToggleAll = async () => {
    changeState(ContextKey.GlobalLoading, true);

    if (toggleAllActive) {
      todosFromServer.forEach((todo, index, arr) => {
        toggleTodo(
          todo.completed,
          false,
          todo,
          arr.length - 1 === index,
        );
      });
    } else {
      todosFromServer.forEach((todo, index, arr) => {
        toggleTodo(
          !todo.completed,
          true,
          todo,
          arr.length - 1 === index,
        );
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todosFromServer.length > 0 && (
        <button
          aria-label="Toggle All"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: toggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={todoTitleDisabled}
          ref={todoTitleRef}
        />
      </form>
    </header>
  );
};
