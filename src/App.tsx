/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import React, { useEffect, useState, useMemo } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErorMesage } from './components/ErrorComponent';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterEnum';

const USER_ID = 10387;

export enum Error {
  LOAD = 'load',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const visibleTodos = todos.filter((todo) => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const displayError = (error: Error) => {
    setErrorMessage(error);
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setErrorMessage(null);
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        displayError(Error.LOAD);
      }
    };

    loadTodos();
  }, []);

  const completedTodosId = useMemo(() => {
    return todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);
  }, [todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage('Title cannot be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    try {
      setIsLoading(true);
      setTempTodo(newTodo);
      addTodo(newTodo)
        .then((response) => {
          setTodos([...todos, response]);
          setInputValue('');
        });
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleTodoComplited = async (id: number) => {
    try {
      setErrorMessage('');

      const toggledTodo = todos.find((todo) => todo.id === id);

      setSelectedTodoId(toggledTodo?.id || null);

      if (toggledTodo) {
        await updateTodo(toggledTodo.id, {
          ...toggledTodo,
          completed: !toggledTodo.completed,
        });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }));
      }
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setSelectedTodoId(null);
    }
  };

  const handleDeleteComplited = async () => {
    try {
      setErrorMessage('');

      setIsLoading(true);

      await Promise.all(
        completedTodosId.map((id: number) => deleteTodo(id)),
      );
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTodoEdit = async (id: number, title: string) => {
    try {
      setErrorMessage('');
      setIsLoading(true);

      const editedTodo = todos.find((todo) => todo.id === id);

      setSelectedTodoId(editedTodo?.id || null);

      if (editedTodo) {
        await updateTodo(editedTodo.id, {
          ...editedTodo,
          title,
        });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        }));
      }
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setSelectedTodoId(null);
    }
  };

  const handleTodoToggleAll = async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);

      const allCompleted = todos.every((todo) => todo.completed);

      await Promise.all(
        todos.map((todo) => updateTodo(todo.id, {
          ...todo,
          completed: !allCompleted,
        })),
      );

      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      })));
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleTodoToggleAll}
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              value={inputValue}
              placeholder="What needs to be done?"
              onChange={(event) => setInputValue(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleTodoComplited={handleTodoComplited}
              isLoading={isLoading}
              deletingId={deletingId}
              setDeletingId={setDeletingId}
              tempTodo={tempTodo}
              handleTodoEdit={handleTodoEdit}
            />
            <Footer
              visibleTodos={visibleTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              handleDeleteComplited={handleDeleteComplited}
            />
          </>
        )}
      </div>

      {!selectedTodoId && errorMessage}

      {errorMessage
        && (
          <ErorMesage
            setErrorMessage={setErrorMessage}
          />
        )}
    </div>
  );
};
