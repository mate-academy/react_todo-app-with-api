/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  removeTodo,
  addTodoToServer,
  changeTodo,
} from './api/todos';
import { TodosList } from './components/TodosList/TodosList';
import { Todo } from './types/Todo';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import {
  preparedTodos,
  getcompletedTodosIds,
  filterTodosByCompletion,
} from './utils/todoUtils';
import { StatusValue } from './types/StatusValue';

const USER_ID = 10725;

export const App: FC = () => {
  const formRef = useRef<HTMLInputElement | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [queryTodo, setQueryTodo] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [statusTodo, setstatusTodo] = useState<StatusValue>(StatusValue.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [visibleError, setVisibleError] = useState('');

  const fetchTodosFromServer = async () => {
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos as Todo[]);
    } catch (error) {
      setVisibleError('Unable to load a todos');
    }
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }

    fetchTodosFromServer();
  }, [tempTodo, loadingTodoIds, visibleError]);

  const completedTodosIds = useMemo(() => (
    getcompletedTodosIds(todos)
  ), [todos]);

  const visibleTodos = useMemo(() => (
    preparedTodos(todos, statusTodo)
  ), [todos, statusTodo]);

  const removeTodos = useCallback(async (todoIds: number[]) => {
    try {
      setLoadingTodoIds(prevIds => [...prevIds, ...todoIds]);

      await Promise.all(
        todoIds.map(async id => {
          await removeTodo(id);
        }),
      );

      const updatedTodos = todos.filter(todo => !todoIds.includes(todo.id));

      setTodos(updatedTodos);
    } catch (error) {
      setVisibleError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  }, [todos]);

  const handleToggleTodoStatus = useCallback(async (
    todoIds: number[],
  ) => {
    try {
      setLoadingTodoIds((prevIds) => [...prevIds, ...todoIds]);

      await Promise.all(
        todoIds.map(async id => {
          const todoToUpdate = todos.find(todo => todo.id === id);

          if (todoToUpdate) {
            const updatedTodo = await changeTodo(id, {
              ...todoToUpdate,
              completed: !todoToUpdate.completed,
            });

            setTodos(prevTodos => prevTodos.map(todo => (
              todo.id === updatedTodo.id
                ? updatedTodo
                : todo
            )));
          }
        }),
      );
    } catch (error) {
      setVisibleError('Unable to update a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  }, [todos]);

  const changeTitle = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    setLoadingTodoIds((prevIds) => [...prevIds, todoId]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      const updatedTodo = await changeTodo(todoId, {
        ...todoToUpdate,
        title: newTitle,
      });

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo
      )));
    } catch (error) {
      setVisibleError('Unable to update a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  }, [todos]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setIsInputDisabled(true);

      const newTodo = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      const tempId = 0;

      setTempTodo({
        ...newTodo,
        id: tempId,
      });

      setLoadingTodoIds([tempId]);

      const addedTodo = await addTodoToServer('/todos', newTodo);

      setTodos((currentTodos) => [...currentTodos, addedTodo]);
    } catch (error) {
      setVisibleError('Unable to add a todo');
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
      setLoadingTodoIds([]);
      setQueryTodo('');
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!queryTodo.trim()) {
      setQueryTodo('');
      setVisibleError('Title can\'t be empty');

      return;
    }

    addTodo(queryTodo);
  };

  const handleOnQuery = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryTodo(event.target.value);
  };

  const handleClearCompleted = () => {
    removeTodos(completedTodosIds);
    setLoadingTodoIds(completedTodosIds);
    setstatusTodo(StatusValue.ALL);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            onClick={() => (
              handleToggleTodoStatus(
                filterTodosByCompletion(todos)
                  .map(todo => todo.id),
              ))}
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={queryTodo}
              onChange={handleOnQuery}
              disabled={isInputDisabled}
              ref={formRef}
            />
          </form>
        </header>

        <TodosList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodos={removeTodos}
          loadingTodoIds={loadingTodoIds}
          handleToggleTodoStatus={handleToggleTodoStatus}
          changeTitle={changeTitle}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length - completedTodosIds.length} items left`}
            </span>

            <nav className="filter">
              {Object.values(StatusValue).map(value => (
                <a
                  key={value}
                  href={`#/${value === StatusValue.ALL ? '' : value}`}
                  className={cn('filter__link', {
                    selected: statusTodo === value,
                  })}
                  onClick={() => setstatusTodo(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodosIds.length}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorInfo
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
