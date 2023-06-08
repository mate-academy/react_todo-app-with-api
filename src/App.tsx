import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodos, deleteTodos, updateTodoStatus, updateTodoTitle, USER_ID,
} from './api/todos';
import { Header } from './components/TodoHeader';
import { Footer } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Todo, TodoToSend } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { Notification }
  from './components/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage]
    = useState<Error>(Error.NONE);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const isTodoCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const areAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (todoStatus) {
        case Status.ACTIVE:
          return !todo.completed;
        case Status.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    })
    );
  }, [todoStatus, todos]);

  const fetchData = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(Error.LOAD);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTodoAdd = async (todoTitle: string) => {
    try {
      const newTodo: TodoToSend = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempoTodo({
        id: 0,
        ...newTodo,
      });
      const addedTodo = await addTodos(newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setTempoTodo(null);
    }
  };

  const handleTodoRemove = async (id: number) => {
    try {
      setLoadingTodoIds(prev => [...prev, id]);

      await deleteTodos(id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    } finally {
      setTempoTodo(null);
      setLoadingTodoIds([0]);
    }
  };

  const handleTodoTitleUpdate = async (updatingTodo: Todo, title?: string) => {
    try {
      setLoadingTodoIds(prev => [...prev, updatingTodo.id]);

      const updatedTodo = {
        ...updatingTodo,
        ...(title ? { title } : { completed: !updatingTodo.completed }),
      };

      await updateTodoTitle(updatedTodo);

      setTodos(prevTodos => (
        prevTodos.map(todo => (
          todo.id === updatingTodo.id
            ? updatedTodo
            : todo
        ))
      ));
    } catch {
      setErrorMessage(Error.UPDATE);
    } finally {
      setLoadingTodoIds(
        current => current.filter(todoId => todoId !== updatingTodo.id),
      );
    }
  };

  const handleTodoStatusUpdate = async (updatingTodo: Todo) => {
    const newStatus = !updatingTodo.completed;

    try {
      setLoadingTodoIds(current => [...current, updatingTodo.id]);

      const updatedTodo: Todo = await updateTodoStatus(
        updatingTodo.id,
        newStatus,
      );

      setTodos(currentTodos => (
        currentTodos.map(todo => (
          todo.id === updatingTodo.id
            ? updatedTodo
            : todo
        ))
      ));
    } catch {
      setErrorMessage(Error.UPDATE);
    } finally {
      setLoadingTodoIds(
        current => current.filter(todoId => todoId !== updatingTodo.id),
      );
    }
  };

  const handleToggleAll = () => {
    let toggledTodos = todos;

    if (activeTodosCount) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(todo => {
      handleTodoStatusUpdate(todo);
    });
  };

  const handleClearCompleted = () => {
    const promises = todos
      .filter(todo => todo.completed)
      .map(todo => handleTodoRemove(todo.id));

    return Promise.all(promises);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          handleTodoAdd={handleTodoAdd}
          todos={todos}
          handleToggleAll={handleToggleAll}
          areAllTodosCompleted={areAllTodosCompleted}
        />

        <TodoList
          todos={visibleTodos}
          handleTodoRemove={handleTodoRemove}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
          tempoTodo={tempoTodo}
          loadingTodoIds={loadingTodoIds}
          handleTodoStatusUpdate={handleTodoStatusUpdate}
        />

        {!!todos.length && (
          <>
            <Footer
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
              clearCompleted={handleClearCompleted}
              isTodoCompleted={isTodoCompleted}
              activeTodosCount={activeTodosCount}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          closeError={() => setErrorMessage(Error.NONE)}
        />
      )}
    </div>
  );
};
