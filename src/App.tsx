/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as TodoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { FilterNav } from './types/Filter';
import { findTodo } from './servises/serviseTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filter, setFilter] = useState<FilterNav>(FilterNav.All);

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterNav.Completed:
          return todo.completed;

        case FilterNav.Active:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const hideError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await TodoService.getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage('Unable to load todos');

      hideError();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFormSubmit = async (newTodoTitle: string): Promise<void> => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      hideError();

      return;
    }

    const createdTodo = {
      title: trimmedTitle,
      completed: false,
      userId: TodoService.USER_ID,
    };

    const newTempTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: TodoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await TodoService.createTodo(createdTodo);

      setTodos(currentTodos => [...currentTodos, newTodo]);

      setTempTodo(null);

      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
      throw error;
    }
  };

  const deleteTodo = async (todoId: number): Promise<void> => {
    setErrorMessage('');

    try {
      await TodoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    }
  };

  const updateTodoTitle = async (
    todoId: number,
    newTitle: string,
  ): Promise<void> => {
    setErrorMessage('');
    const chosenTodo: Todo | undefined = findTodo(todoId, todos);

    if (!chosenTodo) {
      setErrorMessage('Todo not found');

      return;
    }

    if (chosenTodo.title === newTitle) {
      return;
    }

    if (!newTitle) {
      try {
        await deleteTodo(todoId);

        return;
      } catch (error) {
        setErrorMessage('Unable to delete a todo');

        return;
      }
    }

    try {
      const updatedTodo = await TodoService.updateTodo({
        ...chosenTodo,
        title: newTitle.trim(),
      });

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

        newTodos.splice(index, 1, updatedTodo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    }
  };

  const toggleTodoStatus = async (todoId: number): Promise<void> => {
    setErrorMessage('');

    const chosenTodo: Todo | undefined = findTodo(todoId, todos);

    if (!chosenTodo) {
      setErrorMessage('Todo not found');

      return;
    }

    try {
      const updatedTodo = await TodoService.updateTodoStatus(chosenTodo);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

        newTodos.splice(index, 1, updatedTodo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    }
  };

  const toggleAllTodoStatus = async (
    todosToUpdateIds: number[],
  ): Promise<void> => {
    if (todosToUpdateIds.length === 0) {
      return;
    }

    try {
      await Promise.all(
        todosToUpdateIds.map(todoId => {
          return toggleTodoStatus(todoId);
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to update todos');
      throw error;
    }
  };

  const handleDeleteAllTodo = async (): Promise<void> => {
    setErrorMessage('');
    const filtredResult = filteredTodos.filter(todo => {
      return todo.completed === true;
    });

    try {
      await Promise.all(filtredResult.map((todo: Todo) => deleteTodo(todo.id)));
    } catch (error) {
      setErrorMessage('Unable to delete all todos');
      throw error;
    }
  };

  const handleErrorButton = () => {
    setErrorMessage('');
  };

  const handleFilter = (filterName: FilterNav) => {
    setFilter(filterName);
  };

  if (!TodoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoHeader
        allTodos={todos}
        filtredTodos={filteredTodos}
        onSubmit={handleFormSubmit}
        deleteTodo={deleteTodo}
        handleFilter={handleFilter}
        selectFilter={filter}
        tempTodo={tempTodo}
        handleDeleteAllTodo={handleDeleteAllTodo}
        toggleTodoStatus={toggleTodoStatus}
        toggleAllTodoStatus={toggleAllTodoStatus}
        updateTodoTitle={updateTodoTitle}
      />

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorButton}
        />
        {errorMessage}
      </div>
    </div>
  );
};
