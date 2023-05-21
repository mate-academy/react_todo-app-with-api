import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, addTodos, deleteTodos, updateTodoStatus, updateTodoTitle, USER_ID,
} from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, TodoToSend } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodo, setLoadingTodo] = useState([0]);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);

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
        case TodoStatus.ACTIVE:
          return !todo.completed;
        case TodoStatus.COMPLETED:
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
      setErrorMessage(ErrorMessage.LOAD);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNewTodo = async (todoTitle: string) => {
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
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempoTodo(null);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingTodo(prev => [...prev, id]);
      await deleteTodos(id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setTempoTodo(null);
      setLoadingTodo([0]);
    }
  };

  const updateTitleOfTodo = async (updatingTodo: Todo, title?: string) => {
    setLoadingTodo(prev => [...prev, updatingTodo.id]);

    const updatedTodo = title
      ? ({ ...updatingTodo, title })
      : ({ ...updatingTodo, completed: !updatingTodo.completed });

    try {
      await updateTodoTitle(updatedTodo);
      await fetchData();
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setLoadingTodo(
        current => current.filter(todoId => todoId !== updatingTodo.id),
      );
    }
  };

  const updateStatusOfTodo = async (updatingTodo: Todo) => {
    const newStatus = !updatingTodo.completed;

    try {
      setLoadingTodo(current => [...current, updatingTodo.id]);

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
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setLoadingTodo(
        current => current.filter(todoId => todoId !== updatingTodo.id),
      );
    }
  };

  const toggleAll = () => {
    let toggledTodos = todos;

    if (activeTodosCount) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(todo => {
      updateStatusOfTodo(todo);
    });
  };

  const clearCompletedTodos = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
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
          addNewTodo={addNewTodo}
          todos={todos}
          toggleAll={toggleAll}
          areAllTodosCompleted={areAllTodosCompleted}
        />

        <TodoList
          todos={visibleTodos}
          removeTodo={removeTodo}
          updateTitleOfTodo={updateTitleOfTodo}
          tempoTodo={tempoTodo}
          loadingTodo={loadingTodo}
          updateStatusOfTodo={updateStatusOfTodo}
        />

        {!!todos.length && (
          <>
            <Footer
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
              clearCompletedTodos={clearCompletedTodos}
              isTodoCompleted={isTodoCompleted}
              activeTodosCount={activeTodosCount}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          closeError={() => setErrorMessage(ErrorMessage.NONE)}
        />
      )}
    </div>
  );
};
