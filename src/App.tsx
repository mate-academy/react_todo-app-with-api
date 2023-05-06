import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from './components/Loader';
import { TodoFilter } from './components/TodoFilter';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { StatusToFilterBy, Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { USER_ID, temporeryTodo } from './utils/constant';
import { ErrorMessage } from './utils/errorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>(temporeryTodo);
  const [filterBy, setFilterBy] = useState(StatusToFilterBy.All);
  const [isAdding, setIsAdding] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodosId, setLoadingTodosId] = useState<Set<number>>(new Set());
  const inCompleteTodos = todos.filter(todo => todo.completed === false);

  const handleErrorMessage = () => {
    setTimeout(() => {
      setError(ErrorMessage.Clear);
    }, 3000);
  };

  const handleTodosId = (todoId: number) => {
    setLoadingTodosId((state) => {
      state.add(todoId);

      return new Set(state);
    });
  };

  const removeTodosId = (todoId: number) => {
    setLoadingTodosId((state) => {
      state.delete(todoId);

      return new Set(state);
    });
  };

  const getTodosFromServer = async () => {
    setIsLoading(true);
    setError(ErrorMessage.Clear);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorMessage.Server);
      handleErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (title: string): Promise<void> => {
    setIsAdding(true);
    if (!title.trim().length) {
      setError(ErrorMessage.Title);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo(newTodo);
    setError(ErrorMessage.Clear);
    try {
      const todo = await postTodo(USER_ID, newTodo);

      handleTodosId(todo.id);
      setTodos((prevTodos) => [...prevTodos, todo]);
      removeTodosId(todo.id);
    } catch {
      setError(ErrorMessage.AddTodo);
      handleErrorMessage();
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      handleTodosId(id);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setError(ErrorMessage.DeleteTodo);
      handleErrorMessage();
    } finally {
      removeTodosId(id);
    }
  };

  const deleteCompleteTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
    setTodos(todos.filter((todo) => !todo.completed));
  }, [todos]);

  const handleUpdateTodo = async (todoId: number, todoData: Partial<Todo>) => {
    setIsInputDisabled(true);
    handleTodosId(todoId);
    try {
      const updatedTodo = await updateTodo(todoId, todoData);

      setTodos((todo) => todo.map((prevTodo) => {
        if (prevTodo.id === updatedTodo.id) {
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }

        return prevTodo;
      }));
    } catch {
      setError(ErrorMessage.UpdateTodo);
      handleErrorMessage();
    } finally {
      removeTodosId(todoId);
      setIsInputDisabled(false);
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(({ completed }) => completed === true);

    if (areAllCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleTodos = todos.filter((todo) => {
    let isStatusCorrect = true;

    switch (filterBy) {
      case StatusToFilterBy.Active:
        isStatusCorrect = !todo.completed;
        break;

      case StatusToFilterBy.Completed:
        isStatusCorrect = todo.completed;
        break;

      default:
        break;
    }

    return isStatusCorrect;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoInput
          itemsCompleted={inCompleteTodos}
          addTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          todos={todos}
          isInputDisabled={isInputDisabled}
        />

        <section className="todoapp__main">
          {isLoading ? (
            <Loader />
          ) : (
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              tempTodo={tempTodo}
              deleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
              loadingTodosId={loadingTodosId}
            />
          )}
        </section>

        {todos.length > 0 && (
          <TodoFilter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            itemsLeft={inCompleteTodos.length}
            todos={todos}
            deleteComplete={deleteCompleteTodos}
          />
        )}

      </div>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            aria-label="Close Error button"
            onClick={() => setError(ErrorMessage.Clear)}
          />
          {error}
        </div>
      )}
    </div>
  );
};
