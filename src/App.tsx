import React, {
  useEffect, useState, FormEvent, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoStatus } from './types/TodoStatus';
import { ErrorType } from './types/ErrorType';

export const USER_ID = 9929;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedTodoId, setLoadedTodoId] = useState<number[]>([]);

  const getTodoList = async () => {
    try {
      const newTodoList = await getTodos(USER_ID);

      setTodos(newTodoList);
    } catch {
      setErrorType(ErrorType.AddError);
    }
  };

  useEffect(() => {
    if (errorType !== null) {
      setTimeout(() => {
        setErrorType(ErrorType.NoError);
      }, 3000);
    }
  }, [errorType]);

  useEffect(() => {
    getTodoList();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);

      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, status]);

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorType(ErrorType.EmptyInput);

      return;
    }

    const newTempTodo = {
      id: 0,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo({ ...newTempTodo, userId: USER_ID });
    setIsLoading(true);
    setNewTodoTitle('');

    try {
      const newTodo = await createTodo(USER_ID, newTodoTitle);

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      setErrorType(ErrorType.AddError);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadedTodoId(state => [...state, todoId]);
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorType(ErrorType.DeleteError);
    } finally {
      setLoadedTodoId([]);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoadedTodoId(completedTodoIds);

    Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)))
      .then(() => {
        setTodos(todos.filter(todoItem => !todoItem.completed));
      })
      .catch(() => {
        setErrorType(ErrorType.DeleteError);
      });
  };

  const toggleCompletedTodo = async (todoId: number, completed: boolean) => {
    setLoadedTodoId(state => [...state, todoId]);
    try {
      await updateTodo(todoId, { completed });

      setTodos(state => state.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed };
        }

        return todo;
      }));
    } catch {
      setErrorType(ErrorType.UpdateError);
    } finally {
      setLoadedTodoId(state => state.filter(todoItem => todoItem !== todoId));
    }
  };

  const toggleAllcompletedTodos = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if ((areAllCompleted && todo.completed)
        || (!areAllCompleted && !todo.completed)) {
        toggleCompletedTodo(todo.id, !todo.completed);
      }
    });
  };

  const renameTitle = async (todoId: number, newTitle: string) => {
    setLoadedTodoId(state => [...state, todoId]);
    try {
      await updateTodo(todoId, { title: newTitle });

      setTodos(state => state.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: newTitle };
        }

        return todo;
      }));
    } catch {
      setErrorType(ErrorType.UpdateError);
    } finally {
      setLoadedTodoId(state => state.filter(todoItem => todoItem !== todoId));
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
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          addTodo={addTodo}
          isLoading={isLoading}
          toggleAllCompletedTodos={toggleAllcompletedTodos}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          loadedTodoIds={loadedTodoId}
          tempTodo={tempTodo}
          toggleCompletedTodo={toggleCompletedTodo}
          renameTitle={renameTitle}
        />

        {todos.length > 0 && (
          <Footer
            status={status}
            setStatus={setStatus}
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {errorType !== null && (
        <Notification
          errorType={errorType}
        />
      )}
    </div>
  );
};
