import React, {
  useEffect, useState, FormEvent, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/Errors';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './utility/todos';
import { TodoState } from './types/TodoState';
import { Error } from './types/Error';

export const USER_ID = 10590;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoId, setLoadedTodoId] = useState<number[]>([]);
  const [footerState, setFooterState] = useState<TodoState>(TodoState.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState<Error>(Error.hasNoError);
  const isError = errorType !== Error.hasNoError;

  const getAllTodos = async () => {
    try {
      const newTodoList = await getTodos(USER_ID);

      setTodos(newTodoList);
    } catch {
      setErrorType(Error.hasAddError);
    }
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setErrorType(Error.hasNoError);
      }, 3000);
    }
  }, [isError, errorType]);

  useEffect(() => {
    getAllTodos();
  }, []);

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorType(Error.hasEmptyInput);

      return;
    }

    const newTemporaryTodo = {
      id: 0,
      title: newTodoTitle,
      completed: false,
    };

    setNewTodoTitle('');
    setIsLoading(true);
    setTemporaryTodo({ ...newTemporaryTodo, userId: USER_ID });

    try {
      const newTodo = await createTodo(USER_ID, newTodoTitle);

      setTodos((previousTodo) => [...previousTodo, newTodo]);
    } catch {
      setErrorType(Error.hasAddError);
    } finally {
      setIsLoading(false);
      setTemporaryTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadedTodoId(state => [...state, todoId]);
      await deleteTodo(todoId);
      setTodos((previousTodo) => previousTodo
        .filter(todo => todo.id !== todoId));
    } catch {
      setErrorType(Error.hasDeleteError);
    } finally {
      setLoadedTodoId([]);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (footerState) {
      case TodoState.Active:
        return todos.filter(todo => !todo.completed);

      case TodoState.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, footerState]);

  const toggleCompleted = async (todoId: number, completed: boolean) => {
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
      setErrorType(Error.hasUpdateError);
    } finally {
      setLoadedTodoId(state => state.filter(todoItem => todoItem !== todoId));
    }
  };

  const toggleCompletedAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if ((isAllCompleted && todo.completed)
       || (!isAllCompleted && !todo.completed)) {
        toggleCompleted(todo.id, !todo.completed);
      }
    });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadedTodoId(completedTodos.map(todo => todo.id));

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(todoItem => !todoItem.completed));
        })
        .catch(() => {
          setErrorType(Error.hasDeleteError);
        });
    });
  };

  const changeTitle = async (todoId: number, newTitle: string) => {
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
      setErrorType(Error.hasUpdateError);
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
          todos={todos}
          isLoading={isLoading}
          addTodo={addTodo}
          toggleCompletedAll={toggleCompletedAll}
          newTitle={newTodoTitle}
          setNewTitle={setNewTodoTitle}
        />

        <TodoList
          todos={filteredTodos}
          loadedTodoId={loadedTodoId}
          temporaryTodo={temporaryTodo}
          toggleCompleted={toggleCompleted}
          changeTitle={changeTitle}
          removeTodo={removeTodo}
        />

        {todos.length > 0 && (
          <Footer
            state={footerState}
            setState={setFooterState}
            todos={todos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {isError && (
        <ErrorMessage
          errorType={errorType}
        />
      )}

    </div>
  );
};
