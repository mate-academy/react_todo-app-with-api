/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessages } from './types/ErrorMessages';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcessed, setTodosInProcessed] = useState<Todo[]>([]);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessages>(ErrorMessages.NONE);

  const hasTodos = !!todos.length;
  const countActiveTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const showErrorMessage = useCallback((message: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(message);
  }, []);

  const getAllTodos = async () => {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      showErrorMessage(ErrorMessages.ONLOAD);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = useCallback(async (newTodo: TodoData) => {
    setHasError(false);

    try {
      setTempTodo({
        id: 0,
        ...newTodo,
      });
      await addTodo(newTodo);

      await getAllTodos();
    } catch (error) {
      showErrorMessage(ErrorMessages.ONADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoToRemove: Todo) => {
    setHasError(false);

    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoToRemove]);
      await deleteTodo(todoToRemove.id);

      await getAllTodos();
    } catch (error) {
      showErrorMessage(ErrorMessages.ONDELETE);
    } finally {
      setTodosInProcessed(currentTodos => currentTodos
        .filter(todo => todo.id !== todoToRemove.id));
    }
  }, []);

  const removeCompletedTodo = useCallback(() => {
    todos.forEach(todo => (
      todo.completed && handleRemoveTodo(todo)
    ));
  }, [todos]);

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    setHasError(false);

    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoToUpdate]);
      await updateTodo(todoToUpdate);

      await getAllTodos();
    } catch (error) {
      showErrorMessage(ErrorMessages.ONUPDATE);
    } finally {
      setTodosInProcessed(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoToUpdate.id)
      ));
    }
  }, []);

  const toggleUpdateTodos = useCallback((todoStatus: boolean) => {
    todos.forEach(todo => (
      todo.completed === todoStatus && handleUpdateTodo({
        ...todo,
        completed: !todo.completed,
      })
    ));
  }, [todos]);

  const handleHasError = useCallback((isError: boolean) => {
    setHasError(isError);
  }, []);

  const handleFilterBy = useCallback((filterType: FilterBy) => {
    setFilterBy(filterType);
  }, []);

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, filterBy)
  ), [todos, filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          someActiveTodos={countActiveTodos}
          inProcessed={!!tempTodo}
          onSubmitAddTodo={handleAddTodo}
          onToggleUpdateTodos={toggleUpdateTodos}
          showErrorMessage={showErrorMessage}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          todosLoadingState={todosInProcessed}
          onClickRemoveTodo={handleRemoveTodo}
          onUpdateTodo={handleUpdateTodo}
        />

        {!!todos.length && (
          <Footer
            quantity={countActiveTodos}
            filterBy={filterBy}
            setFilterBy={handleFilterBy}
            hasCompletedTodos={hasCompletedTodos}
            onRemoveCompletedTodo={removeCompletedTodo}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        setHasError={handleHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
