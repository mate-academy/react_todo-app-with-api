import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import * as todoService from './api/todos';
import { USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTypes';
import Footer from './components/Footer';
import TodoList from './components/TodoList';
import Header from './components/Header';

const getFilteredTodos = (todos: Todo[], filter: FilterType) => {
  switch (filter) {
    case FilterType.active:
      return todos.filter(todo => !todo.completed);

    case FilterType.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.all);
  const [errorMessage, setErrorMessage] = useState<string | null>('');

  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [todoIds, setTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoDeleted, setIsTodoDeleted] = useState(false);
  const [isTodoUpdated, setIsTodoUpdated] = useState(false);

  const visibleTodos = getFilteredTodos(todos, filterType);

  const unCompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    setIsLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isTodoDeleted) {
      setIsTodoDeleted(false);
    }
  }, [isTodoDeleted]);

  const deleteTodo = (todoId: number) => {
    setTodoIds(prevIds => [...prevIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        setIsTodoDeleted(true);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodoIds(prevIds => prevIds.filter(tId => todoId !== tId));
      });
  };

  const addTodo = (todo: Todo) => {
    return todoService
      .createTodo(todo)
      .then(newTodoData => {
        setTodos(prevTodos => [...prevTodos, newTodoData]);
        setNewTodo('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodoTitle = newTodo.trim();

    if (newTodoTitle === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodoItem = {
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodoItem);

    setIsSubmiting(true);

    addTodo(newTodoItem).finally(() => {
      setIsSubmiting(false);
      setTempTodo(null);
    });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    todoService
      .updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });

        setIsTodoUpdated(true);
      })

      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setTodoIds(prevIds => prevIds.filter(tId => updatedTodo.id !== tId));
        setIsTodoUpdated(false);
      });
  };

  const toggleTodoStatus = (toggleTodo: Todo) => {
    const changedTodo = { ...toggleTodo, completed: !toggleTodo.completed };

    updateTodo(changedTodo);
  };

  const toggleAllTodos = () => {
    let toggledTodos = todos.filter(todo => !todo.completed);

    if (toggledTodos.length === 0) {
      toggledTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));
    } else {
      toggledTodos = toggledTodos.map(todo => ({
        ...todo,
        completed: true,
      }));
    }

    toggledTodos.map(todo => updateTodo(todo));
  };

  const deleteAllCompleted = () => {
    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.map(todo => {
      setTodoIds(prevIds => [...prevIds, todo.id]);
      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() =>
          setTodoIds(prevIds => prevIds.filter(todoId => todoId !== todo.id)),
        );
    });
  };

  if (errorMessage) {
    setTimeout(() => setErrorMessage(null), 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          isTodoDeleted={isTodoDeleted}
          toggleAllTodos={toggleAllTodos}
          unCompletedTodos={unCompletedTodos}
          todos={todos}
        />
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          todoIds={todoIds}
          tempTodo={tempTodo}
          toggleTodoStatus={toggleTodoStatus}
          setTodoIds={setTodoIds}
          setErrorMessage={setErrorMessage}
          isTodoUpdated={isTodoUpdated}
        />
        {todos.length > 0 && (
          <Footer
            unCompletedCount={unCompletedTodos.length}
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodosCount={completedTodos.length}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>
      {/* Error notification */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
