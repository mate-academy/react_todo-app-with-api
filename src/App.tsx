import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { getFilteredTodos } from './utils/functions';
import { TodoFilter } from './components/TodoFilter';
import { Header, USER_ID } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { Status } from './types/Status';
import { ErrorMessages } from './utils/ErrorMessages';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';

const initialTodos: Todo[] = [];

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodos);
  const [filterBy, setFilterBy] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NoError);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingId, setLoadingId] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todoList, filterBy);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadError);
        throw new Error(ErrorMessages.LoadError);
      });
  }, []);

  const completedTodosId = todoList
    .reduce((total: number[], current) => (current.completed
      ? [...total, current.id]
      : total), []);

  const hasCompletedTodosCount = !!completedTodosId.length;

  const activeTodosCount = todoList
    .filter(({ completed }) => completed === false).length;

  const handleDeleteTodo = (todoId: number) => {
    setLoadingId(prevTodoIds => [...prevTodoIds, todoId]);

    return postService.deleteTodo(todoId)
      .then(() => {
        setTodoList(currentList => currentList
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteError);
        throw new Error(ErrorMessages.DeleteError);
      })
      .finally(() => {
        setLoadingId([]);
      });
  };

  const handleClearCompleted = () => {
    Promise.all(completedTodosId)
      .then((responses) => responses.forEach((id) => {
        handleDeleteTodo(id);
      }))
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteError);
        throw new Error(ErrorMessages.DeleteError);
      });
  };

  const updateTodo = (todoToUpdate: Todo) => {
    return postService.updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodoList(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          });
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UpdateError);
        throw new Error(ErrorMessages.UpdateError);
      })
      .finally(() => {
        setLoadingId([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodoList={setTodoList}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          updateTodo={updateTodo}
          todoList={todoList}
          setLoadingId={setLoadingId}
          loadingId={loadingId}
          activeTodosCount={activeTodosCount}
        />

        <TodoList
          updateTodo={updateTodo}
          filteredTodos={filteredTodos}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
          handleDeleteTodo={handleDeleteTodo}
          setErrorMessage={setErrorMessage}
        />

        {tempTodo && (
          <TodoItem todo={tempTodo} />
        )}

        {!!todoList.length && (
          <TodoFilter
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            activeTodosCount={activeTodosCount}
            hasCompletedTodosCount={hasCompletedTodosCount}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};
