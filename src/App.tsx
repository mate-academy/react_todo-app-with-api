/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useState, useMemo,
} from 'react';
import {
  postTodos, getTodos, deleteTodo, updateTodo,
} from './api/todos';

// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const USER_ID = 5997;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);

  // Get Todo
  useEffect(() => {
    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(Error.LoadingError);
      });
  }, []);

  // Add Todo
  const addTodo = async () => {
    setIsLoading(true);
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTodos(curr => [...curr, newTodo]);
    setUpdatingTodos(curr => [...curr, newTodo.id]);

    return postTodos(newTodo)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.AddTodo);
      })
      .finally(() => {
        setNewTodoTitle('');
        setUpdatingTodos(curr => curr.filter(id => id !== newTodo.id));
        setIsLoading(false);
      });
  };

  // Delete Todo
  const handleDeleteTodo = async (id:number) => {
    setUpdatingTodos(current => [...current, id]);
    deleteTodo(id)
      .then(() => setTodos(currentTodos => {
        return currentTodos.filter(todo => todo.id !== id);
      }))
      .catch(() => setErrorMessage(Error.DeleteTodo))
      .finally(() => {
        setUpdatingTodos(current => current
          .filter(updatingId => updatingId !== id));
      });
  };

  // Delete completed Todos
  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));

    setTodos(current => current.filter(todo => !todo.completed));
  };

  const toggleCompletedTodo = (toggledTodo: Todo) => {
    updateTodo({
      ...toggledTodo,
      completed: !toggledTodo.completed,
    })
      .then((updatedTodo) => {
        setTodos(current => current.map(todo => (
          todo.id === updatedTodo.id ? updatedTodo : todo
        )));
      });
  };

  const handleUpdateTodo = (todoToUpdate: Todo) => {
    setUpdatingTodos(curr => [...curr, todoToUpdate.id]);

    updateTodo(todoToUpdate)
      .then(() => {
        setTodos(
          current => current.map(todo => {
            if (todo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage(Error.UpdateTodo);
      })
      .finally(() => {
        setUpdatingTodos(curr => curr.filter(id => id !== todoToUpdate.id));
      });
  };

  const hasUncompletedTodo = todos.some(todo => !todo.completed);
  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  const toggleCompleteAllTodos = () => {
    if (hasUncompletedTodo) {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleUpdateTodo({
            ...todo,
            completed: true,
          });
        }
      });
    }

    if (hasAllTodosCompleted) {
      todos.forEach(todo => {
        handleUpdateTodo({
          ...todo,
          completed: false,
        });
      });
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          setError={setErrorMessage}
          isLoading={isLoading}
          addTodo={addTodo}
          hasUncompletedTodo={hasAllTodosCompleted}
          toggleCompleteAllTodos={toggleCompleteAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          toggleTodo={toggleCompletedTodo}
          updatingTodos={updatingTodos}
          updateTodo={handleUpdateTodo}
        />

        <Footer
          filteredItemsCount={filteredTodos.length}
          setFilter={setFilterStatus}
          filterStatus={filterStatus}
          clearCompletedTodos={clearCompletedTodos}
          todos={todos}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
