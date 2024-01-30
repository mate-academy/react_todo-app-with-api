/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Notification } from './Components/Notiifcation';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 13;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMessege, setErrorMessege] = useState(ErrorMessage.NONE);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addLoadingTodoId = (todoId: number) => {
    setLoadingTodosId(currentTodos => [...currentTodos, todoId]);
  };

  const removeLoadingTodoId = (todoId: number) => {
    setLoadingTodosId(currentTodos => currentTodos.filter(id => id !== todoId));
  };

  useEffect(() => {
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        setErrorMessege(ErrorMessage.CANNOT_LOAD_TODOS);
      });
  }, []);

  const addTodo = (title: string) => {
    setErrorMessege(ErrorMessage.NONE);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });
    addLoadingTodoId(0);

    client.post<Todo>('/todos', {
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        removeLoadingTodoId(0);
      })
      .catch((error) => {
        setErrorMessege(ErrorMessage.UNABLE_TO_ADD_A_TODO);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessege(ErrorMessage.NONE);
    addLoadingTodoId(updatedTodo.id);

    return client.patch<Todo>(`/todos/${updatedTodo.id}`, updatedTodo)
      .then(todo1 => {
        setTodos((currentTodos) => {
          const newTodo = [...currentTodos];
          const index = newTodo.findIndex(todo => todo.id === updatedTodo.id);

          newTodo.splice(index, 1, todo1);

          return newTodo;
        });
      })
      .catch((e) => {
        setErrorMessege(ErrorMessage.UNABLE_TO_UPDATE_A_TODO);
        throw e;
      })
      .finally(() => {
        removeLoadingTodoId(updatedTodo.id);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessege(ErrorMessage.NONE);
    addLoadingTodoId(todoId);

    client.delete(`/todos/${todoId}`)
      .then(() => {
        setTodos((currentTodo) => currentTodo
          .filter(todo => todo.id !== todoId));
        removeLoadingTodoId(todoId);
      })
      .catch(() => {
        setErrorMessege(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
      });
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      case FilterType.ALL:
      default:
        return true;
    }
  });

  const completedTodos = todos.filter((todo) => todo.completed);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const closeErrorMsg = () => {
    setErrorMessege(ErrorMessage.NONE);
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
          addTodo={addTodo}
          setErrorMessege={setErrorMessege}
          isLoading={!!tempTodo}
          updateTodo={updateTodo}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          loadingTodosId={loadingTodosId}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            completedTodos={completedTodos}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <Notification
        errorMessege={errorMessege}
        close={closeErrorMsg}
      />
    </div>
  );
};
