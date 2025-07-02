/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/todoList/todoList';
import * as API from './api/todos';
import { Todo } from './types/Todo';
import { TodosHeader } from './components/header/todosHeader';
import { TodosFooter } from './components/footer/todosFooter'; // eslint-disable-next-line
import { ErrorNotification } from './components/errorNotification/errorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [filter, setFilter] = React.useState<string>('all');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletedTodos, setDeletedTodos] = React.useState<number[]>([]);
  const [updatedTodos, setUpdatedTodos] = React.useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(null); // Reset error state before fetching todos

    API.getTodos()
      .then(todos => {
        setTodosFromServer(todos);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const handleHideError = () => {
    setError(null);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();

    if (trimmedInput === '') {
      setError('Title should not be empty');

      return;
    }

    const newTodo = {
      title: trimmedInput,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    API.addTodo(newTodo as Todo)
      .then(todo => {
        setTodosFromServer(prevTodos => [...prevTodos, todo]);
        setInputValue(''); // Clear input field after adding
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null); // Clear the temporary todo state after adding
        setTimeout(() => {
          inputRef.current?.focus(); // Focus the input field after adding a todo
        }, 0);
      });
  };

  const handleDelete = (todoId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setDeletedTodos(prevDeleted => [...prevDeleted, todoId]);

      API.deleteTodo(todoId)
        .then(() => {
          setTodosFromServer(prevTodos =>
            prevTodos.filter(todo => todo.id !== todoId),
          );
          resolve();
        })
        .catch(() => {
          setError('Unable to delete a todo');
          reject();
        })
        .finally(() => {
          setDeletedTodos(prevDeleted =>
            prevDeleted.filter(id => id !== todoId),
          );
          setTimeout(() => {
            inputRef.current?.focus(); // Focus the input field after adding a todo
          }, 0);
        });
    });
  };

  const handleUpdate = (todoToUpdate: Todo): Promise<Todo> => {
    setUpdatedTodos(prevUpdated => [...prevUpdated, todoToUpdate.id]);

    return API.updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodosFromServer(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );

        return updatedTodo;
      })
      .catch(() => {
        setError('Unable to update a todo');

        return Promise.reject(error);
      })
      .finally(() => {
        setUpdatedTodos(prevUpdated =>
          prevUpdated.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleUpdateTitle = async (
    e: React.FormEvent<HTMLFormElement>,
    todoId: number,
    newTitle: string,
  ): Promise<void> => {
    e.preventDefault();

    const todoToUpdate = todosFromServer.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setError('Unable to update a todo');
      throw new Error();
    }

    const trimmed = newTitle.trim();

    if (trimmed === '') {
      await handleDelete(todoId);

      return;
    }

    if (trimmed === todoToUpdate.title) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, title: newTitle.trim() };

    await handleUpdate(updatedTodo);
  };

  const handleToggle = (todoId: number) => {
    const todoToUpdate = todosFromServer.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setError('Unable to update a todo');

      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    handleUpdate(updatedTodo);
  };

  const handleToggleAll = (toggleToComplete: boolean) => {
    todosFromServer.forEach(todo => {
      if (todo.completed != toggleToComplete) {
        handleToggle(todo.id);
      }
    });
  };

  const handleClearCompleted = () => {
    todosFromServer.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const filterTodosByStatus = () => {
    return todosFromServer.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  };

  const visibleTodos = filterTodosByStatus();
  const completedItems = todosFromServer.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todosFromServer}
          tempTodo={tempTodo}
          inputValue={inputValue}
          inputRef={inputRef}
          setInputValue={setInputValue}
          onSubmit={handleAdd}
          onToggleAll={handleToggleAll}
        />
        {todosFromServer.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deletedTodos={deletedTodos}
              updatedTodos={updatedTodos}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onUpdateTitle={handleUpdateTitle}
            />
            <TodosFooter
              completedItems={completedItems}
              totalItems={todosFromServer.length}
              onFilterChange={handleFilterChange}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        error={error}
        setError={setError}
        onHideError={handleHideError}
      />
    </div>
  );
};
