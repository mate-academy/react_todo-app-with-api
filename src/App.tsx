import classNames from 'classnames';
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodos,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Page/ErrorNotification';
import { Footer } from './components/Page/Footer';
import { TodoList } from './components/Page/TodoList';
import { TodoContext } from './components/TodoContext';
import { TodosError } from './types/ErrorEnum';
import { FilterType } from './types/FilterTypeEnum';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useContext(TodoContext);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState<string>('');
  const [todosError, setTodosError] = useState<TodosError>(TodosError.None);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  if (todosError.length > 0) {
    setTimeout(() => {
      setTodosError(TodosError.None);
    }, 3000);
  }

  const loadTodos = useCallback((userId: number) => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setTodosError(TodosError.Loading));
  }, [user, todos]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, [user]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = filterType === FilterType.All
    ? todos
    : todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;
        case FilterType.Completed:
          return completed;

        default:
          throw new Error();
      }
    });

  const handleChooseFilter = useCallback(
    (filter: FilterType) => {
      setFilterType(filter);
    },
    [filterType],
  );

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    setIsAdding(true);

    if (!title.trim()) {
      setTodosError(TodosError.Title);
      setTitle('');

      return;
    }

    try {
      if (!user) {
        return;
      }

      const newTodo = await addTodos(user.id, title);

      setTodos([...todos, newTodo]);
    } catch {
      setTodosError(TodosError.Adding);
    }

    setTitle('');
    setIsAdding(false);
  }, [title, user]);

  const handleDelete = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos([...todos.filter(({ id }) => id !== todoId)]);
    } catch {
      setTodosError(TodosError.Deleting);
    }
  }, [todos, todosError, isAdding]);

  const handleChangeInput = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setTitle(value);

  const toggleAllActive = todos.every(({ completed }) => completed);

  const upgradeTodos = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      try {
        const patchedTodo: Todo = await patchTodo(todoId, data);

        setTodos(todos.map(todo => (
          todo.id === todoId
            ? patchedTodo
            : todo
        )));
      } catch {
        setTodosError(TodosError.Updating);
      }
    }, [todos],
  );

  const uncompletedTodos = todos.filter(({ completed }) => !completed);

  const handleClickToggle = () => {
    if (uncompletedTodos.length) {
      uncompletedTodos.map(({ id }) => patchTodo(id,
        { completed: true }).catch(() => setTodosError(TodosError.Updating)));
      setTodos(todos.map(todo => {
        // eslint-disable-next-line no-param-reassign
        todo.completed = true;

        return todo;
      }));
    } else {
      todos.map(({ id }) => patchTodo(id,
        { completed: false }).catch(() => setTodosError(TodosError.Updating)));
      setTodos(todos.map(todo => {
        // eslint-disable-next-line no-param-reassign
        todo.completed = false;

        return todo;
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: toggleAllActive },
              )}
              onClick={handleClickToggle}
            >
              {null}
            </button>
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChangeInput}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          visibleTodos={visibleTodos}
          removeTodo={handleDelete}
          input={title}
          isAdding={isAdding}
          handleStatus={upgradeTodos}
        />

        {todos.length > 0 && (
          <Footer
            handleChooseFilter={handleChooseFilter}
            todos={todos}
            filterType={filterType}
          />
        )}
      </div>
      <ErrorNotification errorContent={todosError} setError={setTodosError} />
    </div>
  );
};
