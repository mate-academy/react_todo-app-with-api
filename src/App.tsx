import React, { useEffect, useMemo, useState } from 'react';
import {
  getTodos,
  deleteTodos,
  createTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Todos } from './components/Todos';
import { ErrorType } from './types/ErorrType';
import { ErrorMessage } from './components/ErrorMes';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const USER_ID = 11072;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [filter, setFilter] = useState(Filter.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const showError = (notification: ErrorType) => {
    setErrorMessage(notification);
    setTimeout(() => {
      setErrorMessage(ErrorType.None);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todoFromServer) => {
        setTodos(todoFromServer);
      })
      .catch(() => showError(ErrorType.Loading));
  }, []);

  const visibleTodos = useMemo(() => todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [filter, todos]);

  function deleteTodo(todoId: number) {
    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));

    return deleteTodos(todoId)
      .then(() => { })
      .catch((Error) => {
        showError(ErrorType.Delete);
        throw Error;
      });
  }

  function todoStatus(todoId: number) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
    const todoToUpdateOnServer = updatedTodos.find((tod) => tod.id === todoId);

    if (todoToUpdateOnServer) {
      return updateTodo(todoToUpdateOnServer)
        .then(() => { })
        .catch((Error) => {
          showError(ErrorType.Update);
          throw Error;
        });
    }

    return Promise.resolve();
  }

  function todoStatusAll() {
    const updatedIsAllCompleted = !isAllCompleted;
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: updatedIsAllCompleted,
    }));

    setTodos(updatedTodos);
    setIsAllCompleted(updatedIsAllCompleted);

    updatedTodos.map(todo => updateTodo(todo)
      .then(() => { })
      .catch((Error) => {
        showError(ErrorType.Update);
        throw Error;
      }));
  }

  function clearCompleted() {
    return todos.forEach((todo => {
      if (todo.completed === true) {
        deleteTodo(todo.id);
      }
    }));
  }

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTempTodo(createdTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      showError(ErrorType.Add);
    } finally {
      setTempTodo(null);
    }
  };

  function changeTodoTitle(todoId: number, newTitleTodo: string) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          title: newTitleTodo,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);

    const todoToUpdateOnServer = updatedTodos.find((tod) => tod.id === todoId);

    if (todoToUpdateOnServer) {
      return updateTodo(todoToUpdateOnServer)
        .then(() => { })
        .catch((Error) => {
          showError(ErrorType.Update);
          throw Error;
        });
    }

    return Promise.resolve();
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={() => setErrorMessage}
          tempTodo={tempTodo}
          todoStatusAll={() => todoStatusAll()}
        />
        <Todos
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={(todoId: number) => deleteTodo(todoId)}
          todoStatus={(todoId: number) => todoStatus(todoId)}
          changeTodoTitle={(
            todoId: number,
            newTitleTodo: string,
          ) => changeTodoTitle(todoId, newTitleTodo)}
        />
        {todos.length > 1
          && (
            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              onClear={() => clearCompleted()}
            />
          )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
