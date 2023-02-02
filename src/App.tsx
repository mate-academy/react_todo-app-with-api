/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { deleteTodoById, getTodos, updateTodoById } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { CompletedFilter } from './types/CompletedFilter';
import { Header } from './components/Header';
import { Todolist } from './components/Todolist';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { filteredTodos } from './helper/Helper';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState(CompletedFilter.All);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState([0]);
  const [updatingTodosIds, setUpdatingTodosIds] = useState([0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, []);

  const closeErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos, completedFilter);
  }, [todos, completedFilter]);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setUpdatingTodosIds(
      (prev) => [...prev, updatedTodo.id],
    );

    updateTodoById(updatedTodo.id, {
      title: updatedTodo.title,
      completed: updatedTodo.completed,
    }).then(() => {
      setTodos(currentTodos => currentTodos.map(todo => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todo;
      }));

      setUpdatingTodosIds((currentUpdatingTodos) => (
        currentUpdatingTodos
          .filter(updatingId => updatingId !== updatedTodo.id)
      ));
    }).catch(() => showError('Unable to update a todo'));
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAll = () => {
    if (!isAllTodosCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodo({
            ...todo,
            completed: true,
          });
        }
      });
    } else {
      todos.forEach(todo => {
        if (todo.completed) {
          updateTodo({
            ...todo,
            completed: false,
          });
        }
      });
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodosIds(
      (currentDeletetingTodos) => [...currentDeletetingTodos, todoId],
    );

    deleteTodoById(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== todoId));
      })
      .catch(() => {
        showError('Unable to delete a todo');
        setDeletingTodosIds(
          (currentDeletetingTodos) => (
            currentDeletetingTodos.filter(deletingId => deletingId !== todoId)
          ),
        );
      })
      .finally(() => {
        setDeletingTodosIds(
          (currentDeletetingTodos) => (
            currentDeletetingTodos.filter(deletingId => deletingId !== todoId)
          ),
        );
      });
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id || 0);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllTodosCompleted={isAllTodosCompleted}
          setTemporaryTodo={setTemporaryTodo}
          showError={showError}
          setTodos={setTodos}
          toggleAll={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <Todolist
              todos={visibleTodos}
              temporaryTodo={temporaryTodo}
              deletingTodosIds={deletingTodosIds}
              updatingTodosIds={updatingTodosIds}
              handleDeleteTodo={handleDeleteTodo}
              updateTodo={updateTodo}
            />
            <Footer
              completedFilter={completedFilter}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
              setCompletedFilter={setCompletedFilter}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          close={closeErrorMessage}
        />
      )}
    </div>
  );
};
