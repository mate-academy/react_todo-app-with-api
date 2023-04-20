import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { TaskStatus } from './types/Sort';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './components/Filter';
import { getFilteredTodos } from './utils/helpers';
import { DEFAULT_TASK_ID, USER_ID } from './utils/constants';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [sortType, setSortType] = useState<TaskStatus>(TaskStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadTodoById, setLoadTodoById] = useState([DEFAULT_TASK_ID]);

  const fetchTodos = async () => {
    try {
      const getData = await getTodos(USER_ID);

      setTodos(getData);
    } catch {
      setError(ErrorType.LOAD);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, sortType)
  ), [todos, sortType]);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setError(ErrorType.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    try {
      setIsDisabled(true);
      setTempTodo({ id: DEFAULT_TASK_ID, ...newTodo });

      const todo = await postTodo(newTodo as Todo);

      setTodos(state => [...state, todo]);
    } catch {
      setError(ErrorType.ADD);
    } finally {
      setTempTodo(null);
      setIsDisabled(false);
    }
  }, [todos]);

  const updateTodo = useCallback(async (
    taskId: number,
    updatedData: Partial<Todo>,
  ) => {
    if (loadTodoById.includes(taskId)) {
      return;
    }

    setLoadTodoById(prevTodos => [...prevTodos, taskId]);
    setIsDisabled(true);

    try {
      const updatedTodo = await patchTodo(taskId, updatedData);

      setTodos(prevState => prevState.map(todo => (
        todo.id === taskId
          ? updatedTodo
          : todo)));
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setLoadTodoById([DEFAULT_TASK_ID]);
      setIsDisabled(false);
    }
  }, [loadTodoById]);

  const removeTodo = useCallback(async (taskId: number) => {
    setLoadTodoById(prevState => [...prevState, taskId]);

    try {
      await deleteTodo(taskId);

      setTodos(prevTodos => (
        prevTodos.filter(({ id }) => id !== taskId)
      ));
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setLoadTodoById([DEFAULT_TASK_ID]);
    }
  }, []);

  const handleRemoveError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const activeTodos = getFilteredTodos(todos, TaskStatus.ACTIVE);
  const completedTodos = getFilteredTodos(todos, TaskStatus.COMPLETED);

  const changeStatusForAll = useCallback(async () => {
    if (loadTodoById.length === DEFAULT_TASK_ID) {
      return;
    }

    await Promise.all(activeTodos.map(({ id }) => (
      updateTodo(id, { completed: true }))));

    if (!activeTodos.length) {
      await Promise.all(
        completedTodos.map(({ id }) => (
          updateTodo(id, { completed: false }))),
      );
    }
  }, [completedTodos, activeTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodo
          todos={todos}
          onAddTodo={addTodo}
          onDisable={isDisabled}
          activeTodosCount={activeTodosCount}
          onChangeAllStatus={changeStatusForAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onRemove={removeTodo}
          updateTodo={updateTodo}
          loadTodoById={loadTodoById}
        />

        {todos.length !== 0 && (
          <Filter
            todos={todos}
            sortType={sortType}
            onChangeSortType={setSortType}
            activeTodosCount={activeTodosCount}
            onRemove={removeTodo}
          />
        )}
      </div>

      {error
        && (
          <ErrorNotification
            setError={setError}
            error={error}
            onRemoveError={handleRemoveError}
          />
        )}
    </div>
  );
};
