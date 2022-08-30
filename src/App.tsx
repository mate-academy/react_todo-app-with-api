/* eslint-disable jsx-a11y/control-has-associated-label */
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
};

export const App: FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddError, setIsAddError] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [
    filterTodosStatus,
    setFilterTodosStatus,
  ] = useState<FilterTodosStatus>(FilterTodosStatus.All);

  const hasError = useMemo(() => (
    isAddError || isUpdateError || isDeleteError
  ), [isAddError, isUpdateError, isDeleteError]);

  const resetErrors = () => {
    setIsAddError(false);
    setIsUpdateError(false);
    setIsDeleteError(false);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user !== null) {
      getTodos(user.id)
        .then(res => {
          setTodos(prev => [...prev, ...res]);
        })
        .catch(() => {
          setIsAddError(true);
        });
    }
  }, []);

  const updateStatus = (todoId: number, status: UpdateTodoFragment) => {
    editTodo(todoId, status)
      .then(updatedTodo => {
        setTodos(prev => prev.map(currentTodo => (
          currentTodo.id === updatedTodo.id
            ? { ...currentTodo, completed: !currentTodo.completed }
            : currentTodo
        )));
      })
      .catch(() => setIsUpdateError(true));
  };

  const removeTodoItem = (todoId: number) => {
    removeTodo(todoId)
      .then((res) => {
        if (res === 1) {
          setTodos(prev => prev.filter(current => current.id !== todoId));
        }
      })
      .catch(() => setIsDeleteError(true));
  };

  const onStatusChange = useCallback(
    updateStatus,
    [todos],
  );

  const onDeleteTodo = useCallback(
    removeTodoItem,
    [todos],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTodoTitle('');

    if (user && todoTitle !== '') {
      const newTodo: CreateTodoFragment = {
        title: todoTitle,
        userId: user.id,
        completed: false,
      };

      postTodo(newTodo)
        .then(res => {
          if (res) {
            setTodos(prev => [...prev, res]);
          }
        })
        .catch(() => setIsAddError(true));
    }
  };

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

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

        <TodoList
          todos={filterTodosByStatus(filterTodosStatus)}
          onChange={onStatusChange}
          onDelete={onDeleteTodo}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${getIncompletedTodosLength()} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
              onClick={() => setFilterTodosStatus(FilterTodosStatus.All)}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
              onClick={() => setFilterTodosStatus(FilterTodosStatus.Active)}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
              onClick={() => setFilterTodosStatus(FilterTodosStatus.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer>
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
