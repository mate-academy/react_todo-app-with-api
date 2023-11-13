/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as TodoService from './api/todos';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoAppContent } from './TodoAppContent';
import { ErrorNotification } from './ErrorNotification';

const USER_ID = 11836;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.None);
  const [todoInput, setTodoInput] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then((todosFromServer: React.SetStateAction<Todo[]>) => {
        setTodos(todosFromServer);
        setFilteredTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
        throw error;
      });
  }, []);

  useEffect(() => {
    if (!isSubmitting && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodo(todoId);
    setIsSubmitting(true);

    TodoService.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setFilteredTodos(currentFilteredTodos => currentFilteredTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoadingTodo(null);
      });
  };

  const clearCompletedTodos = () => {
    setIsSubmitting(true);

    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => setIsSubmitting(false));
  };

  const toggleTodoStatus = (todoId: number) => {
    setLoadingTodo(todoId);
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    const updatedTodo = { ...todo, completed: !todo.completed };

    TodoService.updateTodo(todoId, updatedTodo)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .map(t => (t.id === todoId ? updatedTodo : t)));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => setLoadingTodo(null));
  };

  const toggleAllTodos = () => {
    setIsUpdatingAll(true);
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos
      .map(todo => ({ ...todo, completed: !allCompleted }));

    Promise.all(updatedTodos.map(todo => TodoService.updateTodo(todo.id, todo)))
      .then(() => setTodos(updatedTodos))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToUpdate);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => {
        setIsUpdatingAll(false);
      });
  };

  const createTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsSubmitting(true);

    TodoService.createTodos(newTodo)
      .then((createdTodo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTodoInput('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
        if (focusRef.current) {
          focusRef.current.focus();
        }
      });
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = todoInput.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);

      return;
    }

    const newTempTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTempTodo,
    });

    createTodo(newTempTodo);
  };

  useEffect(() => {
    switch (filterBy) {
      case FilterBy.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterBy.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case FilterBy.All:
      default:
        setFilteredTodos(todos);
        break;
    }
  }, [filterBy, todos]);

  const handleFilterClick
  = (filterType: FilterBy) => (event: React.MouseEvent) => {
    event.preventDefault();
    setFilterBy(filterType);
  };

  const handleErrorNotificationClick = () => {
    setErrorMessage(ErrorMessage.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoAppContent
        toggleTodoStatus={toggleTodoStatus}
        isUpdatingAll={isUpdatingAll}
        toggleAllTodos={toggleAllTodos}
        filteredTodos={filteredTodos}
        tempTodo={tempTodo}
        todos={todos}
        filterBy={filterBy}
        todoInput={todoInput}
        loadingTodo={loadingTodo}
        isSubmitting={isSubmitting}
        handleAddTodo={handleAddTodo}
        setTodoInput={setTodoInput}
        deleteTodo={deleteTodo}
        handleFilterClick={handleFilterClick}
        clearCompletedTodos={clearCompletedTodos}
        focusRef={focusRef}
      />
      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorNotificationClick={handleErrorNotificationClick}
      />
    </div>
  );
};
