/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  FC,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  editTodo,
  getTodos,
  postTodo, removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, CreateTodoFragment, UpdateTodoFragment } from './types/Todo';

enum FilterTodosStatus {
  All,
  Active,
  Completed,
}

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddError, setIsAddError] = useState(false);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [
    filterTodosStatus,
    setFilterTodosStatus,
  ] = useState<FilterTodosStatus>(FilterTodosStatus.All);
  const [isToggleAll, setIsToggleAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);

  const hasError = useMemo(() => (
    isAddError
      || isUpdateError
      || isDeleteError
      || isEmptyTitle
  ), [
    isAddError,
    isUpdateError,
    isDeleteError,
    isEmptyTitle,
  ]);

  const resetErrors = () => {
    setIsAddError(false);
    setIsUpdateError(false);
    setIsDeleteError(false);
    setIsEmptyTitle(false);
  };

  if (hasError) {
    setInterval(resetErrors, 3000);
  }

  useEffect(() => {
    resetErrors();
  }, [todoTitle, todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user !== null) {
      setIsLoading(true);

      getTodos(user.id)
        .then(res => {
          setTodos(prev => [...prev, ...res]);
        })
        .catch(() => {
          setIsAddError(true);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const onTodoChange = useCallback(
    (todoId: number, status: UpdateTodoFragment) => {
      setIsLoading(true);

      editTodo(todoId, status)
        .then(updatedTodo => {
          setTodos(prevTodos => prevTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          }));
        })
        .catch(() => setIsUpdateError(true))
        .finally(() => setIsLoading(false));
    },
    [todos, isLoading],
  );

  const onDeleteTodo = useCallback(
    (todoId: number) => {
      setIsLoading(true);

      removeTodo(todoId)
        .then((res) => {
          if (res === 1) {
            setTodos(prev => prev.filter(current => current.id !== todoId));
          }
        })
        .catch(() => setIsDeleteError(true))
        .finally(() => setIsLoading(false));
    },
    [todos, isLoading],
  );

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    const preparedTodoTitle = todoTitle.trim();

    if (user && preparedTodoTitle !== '') {
      const newTodo: CreateTodoFragment = {
        title: todoTitle,
        userId: user.id,
        completed: false,
      };

      setIsLoading(true);

      postTodo(newTodo)
        .then(res => {
          if (res) {
            setTodos(prevTodos => {
              return [...prevTodos, res];
            });
            window.console.log('postTodoId', res.id);
            setCurrentTodoId(res.id);
          }
        })
        .catch(() => setIsAddError(true))
        .finally(() => setIsLoading(false));

      setTodoTitle('');
    }

    if (preparedTodoTitle === '') {
      setIsEmptyTitle(true);
    }
  }, [todoTitle, isLoading, currentTodoId]);

  const getIncompletedTodosLength = useCallback((): number => {
    const completedTodos = todos
      .filter(currentTodo => currentTodo.completed);

    return todos.length - completedTodos.length;
  }, [todos]);

  const filterTodosByStatus = (todoFilterStatus: FilterTodosStatus): Todo[] => {
    switch (todoFilterStatus) {
      case FilterTodosStatus.Active:
        return todos.filter(todo => !todo.completed);

      case FilterTodosStatus.Completed:
        return todos.filter(todo => todo.completed);

      case FilterTodosStatus.All:
      default:
        return todos;
    }
  };

  const toggleAllTodosStatus = useCallback(async () => {
    setIsToggleAll(prev => !prev);

    try {
      const toggledTodos = await Promise.all(todos.map(todo => (
        editTodo(todo.id, { completed: !isToggleAll })
      )));

      setTodos(toggledTodos);
    } catch {
      setIsUpdateError(true);
    }
  }, [todos, isToggleAll]);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(completedTodo => (
      removeTodo(completedTodo.id)
    )))
      .then(() => setTodos(prevTodos => (
        prevTodos.filter(todo => !todo.completed)
      )))
      .catch(() => setIsDeleteError(true));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length === 0 || (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
              onClick={toggleAllTodosStatus}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {todos.length === 0 || (
          <TodoList
            todos={filterTodosByStatus(filterTodosStatus)}
            onChange={onTodoChange}
            onDelete={onDeleteTodo}
            loading={isLoading}
            currentTodoId={currentTodoId}
            setCurrentTodoId={setCurrentTodoId}
          />
        )}

        {todos.length === 0 || (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${getIncompletedTodosLength()} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames('filter__link', {
                  selected: filterTodosStatus === FilterTodosStatus.All,
                })}
                onClick={() => setFilterTodosStatus(FilterTodosStatus.All)}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterTodosStatus === FilterTodosStatus.Active,
                })}
                onClick={() => setFilterTodosStatus(FilterTodosStatus.Active)}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterTodosStatus === FilterTodosStatus.Completed,
                })}
                onClick={() => (
                  setFilterTodosStatus(FilterTodosStatus.Completed)
                )}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      {hasError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={resetErrors}
          />

          {isEmptyTitle && 'Title can\'t be empty'}
          <br />
          {isAddError && 'Unable to add a todo'}
          <br />
          {isUpdateError && 'Unable to update a todo'}
          <br />
          {isDeleteError && 'Unable to delete a todo'}
        </div>
      )}
    </div>
  );
};
