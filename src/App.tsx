/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filters } from './components/Filters/Filters';
import { TodoError } from './components/TodoError/TodoError';
import { ErrorMessages } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isSubmittingEnter, setIsSubmittingEnter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allCompleted = todos.every(todo => todo.completed);

    setIsActive(allCompleted);
  }, [todos]);

  useEffect(() => {
    if (!todosService.USER_ID) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UNABLE_TO_LOAD);
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateTodo = async (updateTodo: Todo): Promise<void> => {
    setProcessedId(ids => [...ids, updateTodo.id]);
    try {
      const todo = await todosService.patchTodo(updateTodo.id, updateTodo);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(t => t.id === updateTodo.id);

        newTodos.splice(index, 1, todo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.UNABLE_TO_UPDATE);
      setTimeout(() => setErrorMessage(null), 3000);
      throw error;
    } finally {
      setProcessedId([]);
    }
  };

  const handleCompletedStatus = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    setProcessedId(ids => [...ids, id]);
    if (todoToUpdate) {
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };

      todosService
        .patchTodo(updatedTodo.id, updatedTodo)
        .then(todo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(t => t.id === id);

            newTodos.splice(index, 1, todo);

            return newTodos;
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.UNABLE_TO_UPDATE);
          setTimeout(() => setErrorMessage(null), 3000);
        })
        .finally(() => setProcessedId([]));
    }
  };

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const deleteTodo = (id: number): Promise<void> => {
    setProcessedId(ids => [...ids, id]);

    return todosService
      .deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UNABLE_TO_DELETE);
        setTimeout(() => setErrorMessage(null), 3000);
        throw new Error(ErrorMessages.UNABLE_TO_DELETE);
      })
      .finally(() => {
        setProcessedId([]);
        setIsSubmittingEnter(!isSubmittingEnter);
      });
  };

  const handleToggleAll = () => {
    const hasIncomplete = todos.some(todo => !todo.completed);
    const todosToUpdate = hasIncomplete
      ? todos.filter(todo => !todo.completed)
      : todos;

    Promise.all(
      todosToUpdate.map(todo =>
        todosService.patchTodo(todo.id, { completed: hasIncomplete }),
      ),
    )
      .then(updatedTodos => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            const updatedTodo = updatedTodos.find(t => t.id === todo.id);

            return updatedTodo || todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UNABLE_TO_UPDATE);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  };

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [currentFilter, todos]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={addTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          handleToggleAll={handleToggleAll}
          isActive={isActive}
          isSubmittingEnter={isSubmittingEnter}
          setIsSubmittingEnter={setIsSubmittingEnter}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedIds={processedId}
          handleUpdateTodo={handleUpdateTodo}
        />

        {!!todos.length && (
          <TodoFilter
            filter={currentFilter}
            setFilter={setCurrentFilter}
            onDelete={deleteTodo}
            todos={todos}
          />
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
