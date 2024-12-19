import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  FC,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { todosService } from '../../api';
import { USER_ID } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  tempTodo: Todo | null;
  setTempTodo: Dispatch<React.SetStateAction<Todo | null>>;

  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;

  setErrorMessage: (Error: Errors) => void;

  onUpdateTodo: (todoToUpdate: Todo) => void;

  loadingTodoId: number[];
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: FC<Props> = ({
  tempTodo,
  setTempTodo,
  setErrorMessage,
  todos,
  setTodos,
  onUpdateTodo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  const field = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    const titleTrim = title.trim();

    if (!titleTrim) {
      setErrorMessage(Errors.TITLE);

      return;
    }

    const newTodo = {
      userId,
      title: titleTrim,
      completed,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodoId(currentIds => [...currentIds, 0]);

    return todosService
      .createTodo(newTodo)
      .then(defTodo => {
        setTodos(currentTodos => [...currentTodos, defTodo]);

        setNewTitle('');
      })
      .catch(() => setErrorMessage(Errors.ADD_TODO))
      .finally(() => {
        field.current?.focus();

        setTempTodo(null);

        setLoadingTodoId(currentIds =>
          currentIds.filter(currId => currId !== 0),
        );
      });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo({
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });
  };

  const allCompletedTodos = todos.every(todo => todo.completed);

  function handleToggleAll(defTodos: Todo[]) {
    const activeTodos = defTodos.filter(todo => !todo.completed);

    if (allCompletedTodos) {
      defTodos.forEach(defTodo =>
        onUpdateTodo({ ...defTodo, completed: false }),
      );
    } else {
      activeTodos.forEach(defTodo =>
        onUpdateTodo({ ...defTodo, completed: true }),
      );
    }
  }

  useEffect(() => {
    field.current?.focus();
  }, [todos.length, tempTodo]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompletedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll(todos)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitle}
          disabled={loadingTodoId.includes(0)}
        />
      </form>
    </header>
  );
};
