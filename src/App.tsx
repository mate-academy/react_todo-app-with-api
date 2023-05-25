/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodoOnServer,
  deleteTodoFromServer,
  updateTodoOnServer,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Status } from './enums/Status';

const USER_ID = 7010;

function getFilteredTodos(todos: Todo[], status: Status) {
  if (status !== Status.All) {
    return [...todos].filter(todo => (
      status === Status.Completed ? todo.completed : !todo.completed));
  }

  return todos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [hasError, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const addLoadingTodo = useCallback((id: number) => {
    setLoadingIds(state => {
      state.add(id);

      return new Set(state);
    });
  }, []);

  const removeLoadingTodo = useCallback((id: number) => {
    setLoadingIds(state => {
      state.delete(id);

      return new Set(state);
    });
  }, []);

  const isTodoLoading = useCallback(
    (id: number) => loadingIds.has(id),
    [loadingIds],
  );

  const loadTodos = useCallback(
    async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
        setError('');
      } catch {
        setError('Unable to add a todo');
        setTimeout(() => setError(''), 3000);
      }
    }, [getTodos],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  const addTodo = useCallback(
    async (title: string) => {
      setLoading(true);
      if (!title) {
        setError('Title can t be empty');
        setTimeout(() => setError(''), 3000);
      }

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);

      try {
        const response = await addTodoOnServer(newTodo);

        setTodos(currentTodos => [...currentTodos, response]);
        addLoadingTodo(newTodo.id);
      } catch {
        setError('Unable to add todo!');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
        removeLoadingTodo(newTodo.id);
        setTempTodo(null);
      }
    }, [addLoadingTodo, removeLoadingTodo],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setLoading(true);
      addLoadingTodo(todoId);

      try {
        await deleteTodoFromServer(todoId);
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      } catch {
        setError('Unable to delete a todo!');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
        removeLoadingTodo(todoId);
      }
    }, [addLoadingTodo, removeLoadingTodo],
  );

  const deleteComplitedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => {
      deleteTodo(id);
    });

    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
  };

  const updateTodo = useCallback(
    async (id: number, todoData: Partial<Todo>) => {
      addLoadingTodo(id);
      try {
        const updatedTodo = await updateTodoOnServer(id, todoData);

        setTodos(currentTodos => currentTodos.map(
          todo => (todo.id === updatedTodo.id
            ? updatedTodo
            : todo),
        ));
      } catch {
        setError('Unable to update a todo!');
        setTimeout(() => setError(''), 3000);
      } finally {
        removeLoadingTodo(id);
      }
    }, [addLoadingTodo, removeLoadingTodo],
  );

  const updateTodoAll = () => {
    const completedAllTodos = todos.every(todo => todo.completed === true);

    if (completedAllTodos) {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false });
      });
    } else {
      todos.forEach(todo => {
        updateTodo(todo.id, { completed: true });
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          onSubmit={addTodo}
          loaded={isLoading}
          onUpdateTodoAll={updateTodoAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={deleteTodo}
              isTodoLoading={isTodoLoading}
              onUpdateTodo={updateTodo}
              showError={setError}
            />

            <Footer
              todos={visibleTodos}
              selectedStatus={status}
              onChangeStatus={setStatus}
              onDeleteCompletedTodos={deleteComplitedTodos}
            />
          </>
        )}
      </div>

      <Notification
        error={hasError}
        onClose={() => setError('')}
      />
    </div>
  );
};
