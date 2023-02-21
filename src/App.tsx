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
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { warningTimer } from './utils/warningTimer';
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
  ] = useState<ErrorMessages>(ErrorMessages.NOUN);

  const hasTodos = !!todos.length;
  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const showErrorMessage = useCallback((message: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    if (hasError) {
      warningTimer(setHasError, false, 3000);
    }
  }, [hasError]);

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

  const handleAddTodo = useCallback(async (newTodo: Todo) => {
    setHasError(false);

    try {
      setTempTodo(newTodo);
      const addedTodo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
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

      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoToRemove.id));
    } catch (error) {
      showErrorMessage(ErrorMessages.ONDELETE);
    } finally {
      setTodosInProcessed(currentTodos => currentTodos
        .filter(todo => todo.id !== todoToRemove.id));
    }
  }, []);

  const removeCompletedTodo = useCallback(() => {
    const compeletedTodos = todos.filter(todo => todo.completed);

    compeletedTodos.forEach(todo => handleRemoveTodo(todo));
  }, [todos]);

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    setHasError(false);

    try {
      setTodosInProcessed(currentTodos => [...currentTodos, todoToUpdate]);
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => {
        return todo.id === updatedTodo.id
          ? updatedTodo
          : todo;
      }));
    } catch (error) {
      showErrorMessage(ErrorMessages.ONUPDATE);
    } finally {
      setTodosInProcessed(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoToUpdate.id)
      ));
    }
  }, []);

  const toggleUpdateTodos = useCallback((todoStatus: boolean) => {
    const todosToToggle = todos.filter(todo => todo.completed === todoStatus);

    todosToToggle.forEach(todo => handleUpdateTodo({
      ...todo,
      completed: !todo.completed,
    }));
  }, [todos]);

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
          hasActiveTodos={countActiveTodos}
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
            setFilterBy={setFilterBy}
            hasCompletedTodos={hasCompletedTodos}
            onRemoveCompletedTodo={removeCompletedTodo}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        setHasError={setHasError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
