import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { todoApi } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import {
  filterTodosByCompleted,
  getActiveTodoIds,
  getCompletedTodoIds,
} from './helpers/helpers';
import { TodoErrors } from './types/Errors';
import { Todo } from './types/Todo';
import { useError } from './controllers/useError';
import { FilterStatus } from './types/Filterstatus';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [showError, closeError, errorMessages] = useError();

  const isActiveToggleAll = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const uncompletedTodosAmount = useMemo(() => {
    return getActiveTodoIds(todos).length;
  }, [todos]);

  useEffect(() => {
    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError(TodoErrors.UnableToLoad));
    }
  }, [user]);

  const addTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAdding(true);
      setTempTodo({ ...fieldsForCreate, id: 0 });
      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError(TodoErrors.UnableToAdd);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  }, [showError]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setDeletingTodoIds(prev => [...prev, todoId]);

      await todoApi.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(TodoErrors.UnableToDelete);
    } finally {
      setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showError]);

  const deleteCompleted = useCallback(async () => {
    const completedTodoIds = getCompletedTodoIds(todos);

    completedTodoIds.forEach(id => deleteTodo(id));
  }, [deleteTodo, todos]);

  const visibleTodos = useMemo(() => (
    filterTodosByCompleted(todos, filterStatus)
  ), [filterStatus, todos]);

  const updateTodo = useCallback(async (updatedTodo: Todo) => {
    try {
      setUpdatingTodoIds(prev => [...prev, updatedTodo.id]);
      await todoApi.updateTodo(updatedTodo.id, updatedTodo);
      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo
      )));
    } catch {
      showError(TodoErrors.UnableToaupdate);
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  }, []);

  const toggleAll = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const activeTodoIds = todos.filter(todo => !todo.completed);

    if (todos.length !== activeTodoIds.length
      && todos.length !== completedTodos.length) {
      activeTodoIds.forEach(todo => updateTodo({
        ...todo,
        completed: true,
      }));
    } else {
      todos.forEach(todo => updateTodo({
        ...todo,
        completed: !todo.completed,
      }));
    }
  }, [todos]);

  const updateTodoTitle = useCallback(async (updatedTodo: Todo) => {
    updateTodo(updatedTodo);
  }, [todos]);

  const shouldRenderContent = todos.length !== 0 || !!tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          isAdding={isAdding}
          addTodo={addTodo}
          toggleAll={toggleAll}
          isActiveToggleAll={isActiveToggleAll}
        />

        {shouldRenderContent && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
              updateTodo={updateTodo}
              updatingTodoIds={updatingTodoIds}
              showError={showError}
              updateTodoTitle={updateTodoTitle}
            />
            <Footer
              completedTodoIds={getCompletedTodoIds(todos)}
              uncompletedTodosAmount={uncompletedTodosAmount}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              deleteCompleted={deleteCompleted}
            />
          </>
        )}
      </div>
      {errorMessages.length > 0 && (
        <ErrorNotification
          errorMessages={errorMessages}
          closeError={closeError}
        />
      )}
    </div>
  );
};
