import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { filterTodos } from './utils/helpers';

import { AddingForm } from './components/AddingForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NotificationError } from './components/NotificationError';

const USER_ID = 6922;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [error, setError] = useState('');

  const clearNotification = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch (err) {
      setError('Can`t load todos');
      clearNotification();
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, todoStatus);
  }, [todos, todoStatus]);

  const numberOfRemainingTodos = useMemo(() => {
    return todos
      .filter(({ completed }) => !completed)
      .length;
  }, [todos]);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    setIsInputDisabled(true);
    const newTodo = {
      ...todoData,
    };
    const temporaryTodo = {
      id: 0,
      ...todoData,
    };

    try {
      setTempTodo(temporaryTodo);
      setLoadingTodosId(currId => [...currId, temporaryTodo.id]);
      const addedTodo = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (err) {
      setError('Unable to add todo');
      clearNotification();
    } finally {
      setTempTodo(null);
    }

    setIsInputDisabled(false);
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    setLoadingTodosId((currId) => [...currId, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos((currTodos) => currTodos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError('Unable to delete todo');
      clearNotification();
    } finally {
      setLoadingTodosId([]);
    }
  }, []);

  const updateTodo = useCallback(async (
    todoId: number,
    updatedTodo: Partial<Todo>,
  ) => {
    setLoadingTodosId((currId) => [...currId, todoId]);

    try {
      await patchTodo(todoId, updatedTodo);
      setTodos((currTodos) => currTodos.map(todo => (todo.id === todoId
        ? {
          ...todo,
          ...updatedTodo,
        }
        : todo)));
    } catch (err) {
      setError('Unable to update todo');
      clearNotification();
    } finally {
      setLoadingTodosId([]);
    }
  }, []);

  const allCompleted = useMemo(() => {
    if (todos.length) {
      return todos.every(({ completed }) => completed);
    }

    return false;
  }, [todos]);

  const handleToggleAll = useCallback(() => {
    if (allCompleted) {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false });
      });
    } else {
      const notCompleted = todos.filter(({ completed }) => !completed);

      notCompleted.forEach(todo => {
        updateTodo(todo.id, { completed: true });
      });
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddingForm
          userId={USER_ID}
          isInputDisabled={isInputDisabled}
          allCompleted={allCompleted}
          onSubmit={addTodo}
          onToggleAll={handleToggleAll}
          setError={setError}
          clearNotification={clearNotification}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodosId={loadingTodosId}
          onTodoDelete={removeTodo}
          onTodoUpdate={updateTodo}
        />

        {todos.length > 0 && (
          <TodoFilter
            todos={visibleTodos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            numberOfRemainingTodos={numberOfRemainingTodos}
            onTodoDelete={removeTodo}
          />
        )}
      </div>

      <NotificationError
        error={error}
        setError={setError}
      />
    </div>
  );
};
