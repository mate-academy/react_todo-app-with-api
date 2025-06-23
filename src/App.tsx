import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, getUpdateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilters } from './types/TodoFilters';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.WithoutError,
  );
  const [todoFilter, setTodoFilter] = useState<TodoFilters>(TodoFilters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const isVisibleFooter = todos.length !== 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const [todosProcessing, setTodosProcessing] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableLoadTodos))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.WithoutError);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleDeleteTodo = async (todo: Todo) => {
    setTodosProcessing(prev => [...prev, todo.id]);
    try {
      await deleteTodos(todo.id);
      setTodos(currentTodos =>
        currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
      );
      inputRef.current?.focus();
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableDeleteTodo);
      throw error;
    } finally {
      setTodosProcessing(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleUpdateTodo = async (toUpdateTodo: Todo): Promise<Todo> => {
    setTodosProcessing(prev => [...prev, toUpdateTodo.id]);

    try {
      const updateTodo = await getUpdateTodo(toUpdateTodo);

      setTodos(currentTodos => {
        return currentTodos.map(currentTodo =>
          currentTodo.id === updateTodo.id ? updateTodo : currentTodo,
        );
      });

      return updateTodo;
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableUpdateTodo);
      throw error;
    } finally {
      setTodosProcessing(prev => prev.filter(id => id !== toUpdateTodo.id));
    }
  };

  const handleUpdateAllTodo = () => {
    const activeTodo = todos.filter(todo => !todo.completed);

    if (activeTodo.length > 0) {
      activeTodo.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: false });
      });
    }
  };

  const onSetTodos = useCallback((todo: Todo[]) => {
    setTodos(todo);
  }, []);

  const onSetErrorMessage = useCallback((error: ErrorMessage) => {
    setErrorMessage(error);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onSetErrorMessage={setErrorMessage}
          onSetTempTodo={setTempTodo}
          onSetTodos={onSetTodos}
          isVisibleFooter={isVisibleFooter}
          ref={inputRef}
          isLoading={isLoading}
          onSetIsLoading={setIsLoading}
          onUpdateAllTodo={handleUpdateAllTodo}
          todos={todos}
          newTitle={title}
          onSetTitle={setTitle}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              todoFilter={todoFilter}
              todosProcessing={todosProcessing}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
            />

            {isVisibleFooter && (
              <TodoFooter
                todos={todos}
                todoFilter={todoFilter}
                onSetTodoFilter={setTodoFilter}
                onDeleteTodo={handleDeleteTodo}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onSetErrorMessage={onSetErrorMessage}
      />
    </div>
  );
};
