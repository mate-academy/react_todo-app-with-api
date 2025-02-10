/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import { ErrorMessange } from './component/ErrorMessange';
import { Status } from './types/statys';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { TempTodo } from './component/TempTodo';
import { Header } from './component/Header';
import { updateTodos } from './api/todos';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [isProcessingTodos, setIsProcessingTodos] = useState(false);

  const loadTodos = () => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    postTodos(newTempTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTitle(title);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingTodoId(prev => [...prev, id]);
    setIsLoading(true);
    const todoDelete = todos.find(todo => todo.id === id);

    if (!todoDelete) {
      return;
    }

    deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setEditTodoId(null);
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(prev => [...prev, id]);
      });
  };

  const handleUpdate = (updatedTodo: Todo) => {
    setLoadingTodoId(prev => [...prev, updatedTodo.id]);
    setIsLoading(true);

    updateTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        // setError('');
        setEditTodoId(null);
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const toggleAllTodos = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setIsProcessingTodos(true);

    setIsLoading(true);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todosToUpdate.some(t => t.id === todo.id)
          ? { ...todo, completed: !areAllCompleted }
          : todo,
      ),
    );

    todosToUpdate.forEach(todo => {
      const updatedTodo = { ...todo, completed: !areAllCompleted };

      updateTodos(updatedTodo)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setError('Unable to update some todos');
        })
        .finally(() => {
          setIsLoading(false);
          setIsProcessingTodos(false);
        });
    });
  };

  const toggleTodo = (id: number) => {
    const todoUpdate = todos.find(todo => todo.id === id);

    if (!todoUpdate) {
      return;
    }

    const updatedTodo: Todo = {
      ...todoUpdate,
      completed: !todoUpdate.completed,
    };

    setLoadingTodoId(prev => [...prev, id]);
    setIsLoading(true);

    updateTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Status.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const itemLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          title={title}
          handleTitleChange={handleTitleChange}
          isLoading={isLoading}
          inputRef={inputRef}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          toggleTodo={toggleTodo}
          handleDelete={handleDelete}
          loadingTodoId={loadingTodoId}
          handleUpdate={handleUpdate}
          setError={setError}
          inputRef={inputRef}
          editTodoId={editTodoId}
          setEditTodoId={setEditTodoId}
          isProcessingTodos={isProcessingTodos}
        />

        {tempTodo && <TempTodo tempTodo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            itemLeft={itemLeft}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessange message={error} onClose={() => setError('')} />
    </div>
  );
};
