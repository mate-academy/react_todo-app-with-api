import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Notification } from './components/Notification';
import { StatusTodos } from './types/StatusTodo';

const USER_ID = 9946;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(StatusTodos.ALL);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoId, setIsTodoId] = useState<number[] | null>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const isTodoCompleted = todos.every(todo => todo.completed);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (status) {
        case StatusTodos.ACTIVE:
          return !todo.completed;

        case StatusTodos.COMPLETED:
          return todo.completed;

        default:
          return StatusTodos.ALL;
      }
    });
  }, [status, todos]);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      if ('Error' in todosData) {
        throw new Error('Error in TodosData');
      } else {
        setTodos(todosData);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Can't create a todo");
      throw new Error('Error in loadData');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsError(false);
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isError, errorMessage]);

  const addNewTodo = async (
    title: string,
  ) => {
    if (!title) {
      setIsError(true);
      setErrorMessage("Title can't be empty");

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todoData = await postTodo(USER_ID, newTodo);

      setTodos((prev: Todo[]) => {
        return [...prev, todoData];
      });

      setQuery('');
    } catch {
      setIsError(true);
      setErrorMessage('Unable to add a todo');
      throw new Error('Error in Header');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsTodoId([todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
      throw new Error('Error in Delete Method');
    } finally {
      setIsTodoId([]);
    }
  };

  const changeTodoTitle = async (
    todoId: number,
    title: string,
  ) => {
    try {
      setIsTodoId([todoId]);
      const newTodo = await patchTodo(todoId, { title });

      setTodos((prev: Todo[]) => {
        return prev.map(todo => {
          if (todo.id !== todoId) {
            return todo;
          }

          return newTodo;
        });
      });
    } catch {
      setIsError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsTodoId([]);
    }
  };

  const changeTodoCompleted = async (
    todoId: number,
    completed: boolean,
  ) => {
    setIsTodoId([todoId]);
    try {
      const newTodo = await patchTodo(todoId, { completed });

      setTodos((prev: Todo[]) => {
        return prev.map(todo => {
          if (todo.id !== todoId) {
            return todo;
          }

          return newTodo;
        });
      });
    } catch {
      setIsError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsTodoId([]);
    }
  };

  const toggleAllCompletedTodos = () => {
    try {
      const completedTodo = todos.map(todo => {
        if (todo.completed === isTodoCompleted) {
          patchTodo(todo.id, { completed: !isTodoCompleted });
        }

        return { ...todo, completed: !isTodoCompleted };
      });

      setTodos(completedTodo);
    } catch {
      setIsError(true);
      setErrorMessage('Unable to update a todo');
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
          titleTodo={query}
          changeTitle={setQuery}
          onAddTodo={addNewTodo}
          onChangeTodoAllCompleted={toggleAllCompletedTodos}
          isCompleted={isTodoCompleted}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            onChangeTodoTitle={changeTodoTitle}
            onChangeTodoCompleted={changeTodoCompleted}
            onDeleteTodo={removeTodo}
            tempTodo={tempTodo}
            isTodoId={isTodoId}
          />
        </section>

        {!!todos.length && (
          <TodoFilter
            visibleTodos={todos}
            status={status}
            onStatusChange={setStatus}
            onChangeTodo={setTodos}
          />
        )}

      </div>

      {isError && (
        <Notification
          errorMessage={errorMessage}
          error={isError}
          deleteError={setIsError}
        />
      )}

    </div>
  );
};
