/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { TodoFilter } from './components/TodoFilter';
import { Filters } from './components/Filters';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isSubmittingEnter, setIsSubmittingEnter] = useState(false);

  useEffect(() => {
    const allCompleted = todos.every(t => t.completed);

    setIsActive(allCompleted);
  }, [todos]);

  useEffect(() => {
    if (!todosService.USER_ID) {
      return;
    }

    setErrorMessage(null);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(null), 3000);
      });
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
    } catch {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => setErrorMessage(null), 3000);
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
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(null), 3000);
        })
        .finally(() => setProcessedId([]));
    }
  };

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  function deleteTodo(id: number) {
    setProcessedId(ids => [...ids, id]);

    return todosService
      .deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => {
        setProcessedId([]);
        setIsSubmittingEnter(!isSubmittingEnter);
      });
  }

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
          handleCompletedStatus={handleCompletedStatus}
          isActive={isActive}
          isSubmittingEnter={isSubmittingEnter}
          setIsSubmittingEnter={setIsSubmittingEnter}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={deleteTodo}
          processedIds={processedId}
          handleUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
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
