import {
  useCallback,
  useEffect,
  useState,
  FC,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/FilterEnum';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { BottomPanel } from './components/BottomPanel';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './types/ErrorEnum';

const USER_ID = 10268;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOfTodo, setFilterOfTodo] = useState(Filter.ALL);
  const [hasError, setHasError] = useState(false);
  const [deletedTodoID, setDeletedTodoID] = useState<number | null>(null);
  const [
    completedTodoIds,
    setCompletedTodoIds,
  ] = useState<number[] | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[] | null>(null);
  const [typeOfError, setTypeOfError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const loadTodoFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setHasError(true);
      setTypeOfError(Error.SERVER);
    }
  }, []);

  const createTodoOnServer = useCallback(async (data: Todo) => {
    try {
      const todo = await addTodos(data);

      setTodos(prevTodo => [...prevTodo, todo]);
    } catch {
      setHasError(true);
      setTypeOfError(Error.ADD);
    }

    setTempTodo(null);
  }, []);

  const deleteTodoFromServer = useCallback(async (id: number) => {
    try {
      const deletedTodo = await deleteTodos(id);

      if (deletedTodo) {
        setDeletedTodoID(null);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    } catch {
      setHasError(true);
      setTypeOfError(Error.DELETE);
    }
  }, []);

  const updateTodoOnServer = useCallback(async (
    id: number,
    property: string | boolean,
  ) => {
    try {
      const updatedTodo = await updateTodos(id, property);

      if (updatedTodo) {
        setUpdatingTodoIds(null);
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === id) {
            return typeof property === 'string'
              ? {
                ...todo,
                title: property,
              }
              : {
                ...todo,
                completed: property,
              };
          }

          return todo;
        }));
      }
    } catch {
      setHasError(true);
      setTypeOfError(Error.UPDATE);
    }
  }, []);

  const addTodo = useCallback((query: string) => {
    if (!query.trim()) {
      setHasError(true);
      setTypeOfError(Error.EMPTY);

      return;
    }

    const data = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo(data);
    createTodoOnServer(data);
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setDeletedTodoID(id);
    deleteTodoFromServer(id);
  }, []);

  const updateTodo = useCallback((id: number, property: string | boolean) => {
    updateTodoOnServer(id, property);
  }, []);

  const deleteAllCompleted = useCallback(() => {
    const completedIds = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    setCompletedTodoIds(completedIds);

    completedIds.forEach(id => deleteTodoFromServer(id));
  }, [todos]);

  const updateStatusOfAllTodo = useCallback(() => {
    let todosForUpdating = todos;
    const hasAllEqual = todos.every(({ completed }) => (
      completed === todos[0].completed));

    if (!hasAllEqual) {
      todosForUpdating = todos.filter(({ completed }) => !completed);
    }

    const todosIdsOnUpdating = todosForUpdating.map(({ id }) => id);

    setUpdatingTodoIds(todosIdsOnUpdating);

    todosForUpdating.forEach(({ id, completed }) => (
      updateTodoOnServer(id, !completed)));
  }, [todos]);

  const isCompletedTodos = useMemo(() => {
    return todos.some(({ completed }) => completed);
  }, [todos]);

  const closeErrorMessage = useCallback(() => {
    setHasError(false);
  }, []);

  const handleSelect = useCallback((status: Filter) => {
    setFilterOfTodo(status);
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterOfTodo) {
      case Filter.ACTIVE:
        return todos.filter(({ completed }) => !completed);
      case Filter.COMPLETED:
        return todos.filter(({ completed }) => completed);
      default:
        return todos;
    }
  }, [todos, filterOfTodo]);

  useEffect(() => {
    loadTodoFromServer();
  }, []);

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout>;

    if (hasError) {
      timeoutID = setTimeout(() => {
        setHasError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutID);
    };
  }, [hasError]);

  const countOfActiveTodos = useMemo(() => visibleTodos
    .filter(({ completed }) => !completed)
    .length, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          tempTodo={tempTodo}
          countOfActiveTodos={countOfActiveTodos}
          addTodo={addTodo}
          updateStatusOfAllTodo={updateStatusOfAllTodo}
        />

        {!!visibleTodos.length && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletedTodosID={deletedTodoID}
            completedTodoIds={completedTodoIds}
            updatingTodoIds={updatingTodoIds}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        ) }

        {!!todos.length && (
          <BottomPanel
            itemsCount={countOfActiveTodos}
            selectedFilter={filterOfTodo}
            onChange={handleSelect}
            deleteAllCompleted={deleteAllCompleted}
            showClearAllButton={isCompletedTodos}
          />
        ) }
      </div>

      {hasError && (
        <ErrorMessage
          hasError={hasError}
          error={typeOfError}
          onClose={closeErrorMessage}
        />
      )}
    </div>
  );
};
