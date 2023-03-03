import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useError } from './controllers/useError';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { getCompletedTodoIds } from './components/helpers/helpers';
import { todosApi } from './api/todos';
import { ErrorMessage } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [delitingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const [showError, closeErroreMessage, errorMessages] = useError();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      todosApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError(ErrorMessage.loadTodosError));
    }
  }, [user, isLoading, showError]);

  const addTodo = useCallback(async (fieldsToCreate: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    try {
      setTempTodo({
        ...fieldsToCreate,
        id: 0,
      });

      const newTodo = await todosApi.addTodo(fieldsToCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError(ErrorMessage.addTodoError);

      throw Error(ErrorMessage.whileAddingTodo);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, [showError]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await todosApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.deleteTodoError);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const updateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(prevIds => {
      if (prevIds.includes(todoId)) {
        return [...prevIds, todoId];
      }

      return prevIds;
    });

    setIsLoading(true);

    try {
      const updatedTodo = await todosApi.updateTodo(todoId, updateData);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      showError(ErrorMessage.updateTodoError);
    } finally {
      setUpdatingTodoIds(prevTodos => (
        prevTodos.filter(prevTodoId => prevTodoId !== todoId)));
      setIsLoading(false);
    }
  }, [showError]);

  const deleteCompleted = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => deleteTodo(id));
  }, [deleteTodo, todos]);

  const visibleFiltredTodos = useMemo(() => {
    switch (completedFilter) {
      case FilterType.Active:
        return todos.filter(todo => (
          !todo.completed
        ));

      case FilterType.Completed:
        return todos.filter(todo => (
          todo.completed
        ));

      case FilterType.All:
      default:
        return todos;
    }
  }, [completedFilter, todos]);

  const activeTodosCount = useMemo(() => (
    visibleFiltredTodos.filter(todo => (
      !todo.completed)).length), [visibleFiltredTodos]);

  const completedTodosAmount = useMemo(() => {
    return visibleFiltredTodos.filter(todo => todo.completed).length;
  }, [visibleFiltredTodos]);

  const shouldRenderActiveToggle = todos.length === completedTodosAmount;

  const handleToggleTodosStatus = useCallback(() => {
    const neededTodosStatus = !shouldRenderActiveToggle;

    todos.forEach(async (todo) => {
      if (todo.completed !== neededTodosStatus) {
        await updateTodo(todo.id, { completed: neededTodosStatus });
      }
    });
  }, [shouldRenderActiveToggle, todos, updateTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          showError={showError}
          isAddingTodo={isLoading}
          addTodo={addTodo}
          shouldRenderActiveToggle={shouldRenderActiveToggle}
          handleToggleTodosStatus={handleToggleTodosStatus}
        />

        {(todos.length > 0 || !!tempTodo)
          && (
            <>
              <TodoList
                todos={visibleFiltredTodos}
                tempTodo={tempTodo}
                deleteTodo={deleteTodo}
                delitingTodoIds={delitingTodoIds}
                updateTodo={updateTodo}
                updatingTodoIds={updatingTodoIds}
                isUpdatingTodo={isLoading}
              />
              <Footer
                activeTodosCount={activeTodosCount}
                completedFilter={completedFilter}
                setCompletedFilter={setCompletedFilter}
                deleteCompleted={deleteCompleted}
              />
            </>
          )}
      </div>

      {
        errorMessages.length > 0 && (
          <ErrorNotification
            messages={errorMessages}
            close={closeErroreMessage}
          />
        )
      }
    </div>
  );
};
