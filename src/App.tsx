import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 10681;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(TodoStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Something went wrong');
      });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodos(prevTodosId => [...prevTodosId, todoId]);
      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodos([0]);
    }
  }, []);

  const handleTodoStatusUpdate = useCallback(async (todoToUpdate: Todo) => {
    try {
      setLoadingTodos(prevTodosId => [...prevTodosId, todoToUpdate.id]);

      const newTodoStatus = !todoToUpdate.completed;
      const updatedTodo = await updateTodoStatus(
        todoToUpdate.id,
        newTodoStatus,
      ) as Todo;

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id !== todoToUpdate.id
            ? todo
            : updatedTodo
        ))
      ));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(currentTodosId => currentTodosId
        .filter(todoId => todoId !== todoToUpdate.id));
    }
  }, []);

  const handleTodoTitleUpdate = useCallback(async (
    todoToUpdate: Todo,
    title: string,
  ) => {
    try {
      setLoadingTodos(prevTodosId => [...prevTodosId, todoToUpdate.id]);

      const hasTitle = title
        ? { title }
        : { completed: !todoToUpdate.completed };

      const updatedTodo = {
        ...todoToUpdate,
        ...hasTitle,
      } as Todo;

      await updateTodoTitle(updatedTodo);

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id !== todoToUpdate.id
            ? todo
            : updatedTodo
        ))
      ));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(currentTodosId => currentTodosId
        .filter(todoId => todoId !== todoToUpdate.id));
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    let toggledTodos = todos;

    if (activeTodos.length) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(todo => handleTodoStatusUpdate(todo));
  }, [todos]);

  const handleClearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      await handleRemoveTodo(todo.id);
    });
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case TodoStatus.COMPLETED:
        return completedTodos;

      case TodoStatus.ACTIVE:
        return activeTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          setError={setError}
          handleAddTodo={handleAddTodo}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          handleRemoveTodo={handleRemoveTodo}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
        />

        {todos.length > 0 && (
          <TodoFooter
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            filter={filter}
            onChangeFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
