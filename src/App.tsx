import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { USER_ID } from './constants/api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputAddRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterStatus.All) {
          return true;
        }

        return filterStatus === FilterStatus.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterStatus],
  );

  const todosCompletedNum = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const areAllTodosCompleated = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const todosActiveNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const handleAddTodo = useCallback(
    async (todoTitle: string) => {
      setTempTodo({
        id: 0,
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      });
      try {
        const newTodo = await addTodo({ title: todoTitle, completed: false });

        setTodos(prev => [...prev, newTodo]);
      } catch (err) {
        setErrorMessage(ErrorType.AddTodo);
        inputAddRef?.current?.focus();
        throw err;
      } finally {
        setTempTodo(null);
      }
    },
    [setTempTodo, setTodos, setErrorMessage],
  );

  const handleRemoveTodo = useCallback(
    async (todoId: number) => {
      setLoadingTodoIds(prev => [...prev, todoId]);
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch (err) {
        setErrorMessage(ErrorType.DeleteTodo);
        inputAddRef?.current?.focus();
        throw err;
      } finally {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      }
    },
    [setLoadingTodoIds, setTodos, setErrorMessage],
  );

  const handleUpdateTodo = useCallback(
    async (todoToUpdate: Todo) => {
      setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
      try {
        const updatedTodo = await updateTodo(todoToUpdate);

        setTodos(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      } catch (err) {
        setErrorMessage(ErrorType.UpdateTodo);
        throw err;
      } finally {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
      }
    },
    [setLoadingTodoIds, setTodos, setErrorMessage],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleRemoveTodo(todo.id)));
  }, [todos, handleRemoveTodo]);

  const handleToggleAll = useCallback(async () => {
    if (todosActiveNum > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      await Promise.all(
        activeTodos.map(todo => handleUpdateTodo({ ...todo, completed: true })),
      );
    } else {
      await Promise.all(
        todos.map(todo => handleUpdateTodo({ ...todo, completed: false })),
      );
    }
  }, [todos, todosActiveNum, handleUpdateTodo]);

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setErrorMessage(ErrorType.LoadTodos);
      }
    };

    getAllTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          inputRef={inputAddRef}
          handleToggleAll={handleToggleAll}
          areAllTodosCompleated={areAllTodosCompleated}
          todosLength={todos.length}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              handleRemoveTodo={handleRemoveTodo}
              handleUpdateTodo={handleUpdateTodo}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
            />

            <TodoFooter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              todosLeft={todosActiveNum}
              todosCompleted={todosCompletedNum}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
