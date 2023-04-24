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
  let filteredTodos = todos;

  switch (filterBy) {
    case TodoStatus.ACTIVE:
      filteredTodos = todos.filter(item => !item.completed);
      break;
    case TodoStatus.COMPLETED:
      filteredTodos = todos.filter(item => item.completed);
      break;
    case TodoStatus.ALL:
    default:
      break;
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [hasError, setHasError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [LoadTodoId, setLoadTodoId] = useState([0]);

  const completedTodosCount = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);
  const activeTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setHasError(ErrorMessage.LOAD);
      });
  }, []);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setHasError(ErrorMessage.ADD);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsDisabled(true);

      createTodo(USER_ID, newTodo)
        .then((res) => {
          setTodos((prevTodo) => {
            return [...prevTodo, res];
          });
        })
        .catch(() => {
          setHasError(ErrorMessage.ADD);
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const updateTodo = useCallback(async (
    todoId: number,
    updatedDate: Partial<Todo>,
  ) => {
    if (LoadTodoId.includes(todoId)) {
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
  }, [LoadTodoId]);

  const deleteTodo = (id: number) => {
    setLoadTodoId(prevState => [...prevState, id]);

    removeTodo(id)
      .then(() => {
        const result = todos.filter(todo => todo.id !== id);

        setTodos(result);
      })
      .catch(() => {
        setHasError(ErrorMessage.DELETE);
      })
      .finally(() => {
        setLoadTodoId([]);
      });
  };

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
    if (LoadTodoId.length === 0) {
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

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(todos, todoStatus);

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
          LoadTodoId={LoadTodoId}
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
