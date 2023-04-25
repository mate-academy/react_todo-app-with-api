/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './types/ErrorMessage';
import {
  getTodos, USER_ID, createTodo, removeTodo, patchTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const getVisibleTodos = (todos: Todo[], filterBy: TodoStatus) => {
  switch (filterBy) {
    case TodoStatus.ACTIVE:
      return todos.filter(item => !item.completed);
    case TodoStatus.COMPLETED:
      return todos.filter(item => item.completed);
    case TodoStatus.ALL:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [hasError, setHasError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadTodoId, setLoadTodoId] = useState([0]);

  const completedTodosCount = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setHasError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    try {
      setIsDisabled(true);
      setTempTodo({ id: 0, ...newTodo });

      const todo = await createTodo(newTodo as Todo);

      setTodos(prevState => [...prevState, todo]);
    } catch {
      setHasError(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setIsDisabled(false);
    }
  }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    updatedDate: Partial<Todo>,
  ) => {
    if (loadTodoId.includes(todoId)) {
      return;
    }

    setLoadTodoId(prevState => [...prevState, todoId]);
    setIsDisabled(true);

    try {
      const updatedTodo = await patchTodo(todoId, updatedDate);

      setTodos(prevState => prevState.map(todo => (
        todo.id === todoId
          ? updatedTodo
          : todo)));
    } catch {
      setHasError(ErrorMessage.UPDATE);
    } finally {
      setIsDisabled(false);
      setLoadTodoId([0]);
    }
  }, [loadTodoId]);

  const deleteTodo = useCallback(async (taskId: number) => {
    setLoadTodoId(prevState => [...prevState, taskId]);

    try {
      await removeTodo(taskId);

      setTodos(prevTodos => (
        prevTodos.filter(({ id }) => id !== taskId)
      ));
    } catch {
      setHasError(ErrorMessage.DELETE);
    } finally {
      setLoadTodoId([0]);
    }
  }, []);

  const handleClearCompleted = () => {
    const filteredTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    const promises = completedTodos.map(todo => {
      setLoadTodoId(prevState => [...prevState, todo.id]);

      return removeTodo(todo.id);
    });

    Promise.all(promises).then(() => {
      setTodos(filteredTodos);
      setLoadTodoId([]);
    });
  };

  const activeTodos = getVisibleTodos(todos, TodoStatus.ACTIVE);
  const completedTodos = getVisibleTodos(todos, TodoStatus.COMPLETED);

  const changeStatusForAll = useCallback(async () => {
    if (!loadTodoId.length) {
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

  const onCloseError = () => setHasError(ErrorMessage.NONE);

  const visibleTodos = getVisibleTodos(todos, todoStatus);

  const fetchTodos = async () => {
    try {
      const getData = await getTodos(USER_ID);

      setTodos(getData);
    } catch {
      setHasError(ErrorMessage.LOAD);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          isDisabled={isDisabled}
          activeTodosCount={activeTodosCount}
          onToggleAll={changeStatusForAll}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          tempTodo={tempTodo}
          loadTodoId={loadTodoId}
        />

        {todos.length > 0 && (
          <>
            <Footer
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
              onClearCompleted={handleClearCompleted}
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodosCount}
            />
          </>
        )}
      </div>

      {hasError && (
        <ErrorNotification
          errorMessage={hasError}
          onCloseError={onCloseError}
        />
      )}
    </div>
  );
};
