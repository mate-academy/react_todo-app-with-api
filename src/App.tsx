/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useRef, useEffect } from 'react';
import * as todosServise from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo, TodoTitleOrCompleted } from './types/Todo';
import { SelectedBy } from './types/SelectedBy';
import Header from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedBy, setSelectedBy] = useState<SelectedBy>(SelectedBy.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabletField, setIsDisabletField] = useState(false);
  const [title, setTitle] = useState('');
  const mainInputRef = useRef<HTMLInputElement>(null);

  const [loadingTodos, setLoadingTodos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    mainInputRef.current?.focus();
    todosServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  if (!todosServise.USER_ID) {
    return <UserWarning />;
  }

  const createTodo = () => {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsDisabletField(true);

    setTempTodo({
      id: 0,
      title,
      userId: todosServise.USER_ID,
      completed: false,
    });

    return todosServise
      .createTodos({
        title: title.trim(),
        userId: todosServise.USER_ID,
        completed: false,
      })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabletField(false);
        setTimeout(() => {
          mainInputRef.current?.focus();
        }, 300);
      });
  };

  const  editTodo = (data: TodoTitleOrCompleted, todoId: number) => {
    setIsLoading(true);

    todosServise
      .editTodo(data, todoId)
      .then(result => {
        setTodos(prev =>
          prev.map(prevTodo => (prevTodo.id === result.id ? result : prevTodo)),
        );
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const editCheckbox = (data: TodoTitleOrCompleted, todoId: number) => {
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    setTempTodo(todos[todoIndex]);
    editTodo(data, todoId);
  }

  const complitedTodosIds = todos.reduce((result: number[], curTodo: Todo) => {
    if (curTodo.completed) {
      result.push(curTodo.id);
    }

    return result;
  }, []);

  const clearComplitedTodos = () => {
    const loadingState: Record<number, boolean> = {};

    complitedTodosIds.forEach(id => {
      loadingState[id] = true;
    });
    setLoadingTodos(loadingState);

    const deletedTodos = complitedTodosIds.map(id =>
      todosServise
        .deleteTodo(id)
        .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setLoadingTodos(prev => {
            const newState = { ...prev };

            delete newState[id]; // Видаляємо з об'єкта, коли завантаження завершено

            return newState;
          });
          mainInputRef.current?.focus();
        }),
    );

    Promise.all(deletedTodos);
  };

  const deleteTodo = (deletedTodo: Todo) => {
    setTempTodo(deletedTodo);
    setIsLoading(true);

    todosServise
      .deleteTodo(deletedTodo.id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== deletedTodo.id));
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        mainInputRef.current?.focus();
      });
  };

  const toggleAll = () => {
    const loadingState: Record<number, boolean> = {};

    const activeTodos = todos.filter(todo => !todo.completed);
    const todosToToggle = todos.some(todo => !todo.completed)
      ? activeTodos
      : todos;

    todosToToggle.forEach(todo => {
      loadingState[todo.id] = true;
    });
    setLoadingTodos(loadingState);

    const allToggled = todosToToggle.map(todo => {
      return todosServise
        .editTodo({ completed: !todo.completed }, todo.id)
        .then(updatedTodo => {
          setTodos(prev =>
            prev.map(prevTodo =>
              prevTodo.id === todo.id
                ? { ...prevTodo, ...updatedTodo }
                : prevTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setLoadingTodos(prev => {
            const newState = { ...prev };

            delete newState[todo.id];

            return newState;
          });
        });
    });

    Promise.all(allToggled);
  }

  const handleSelectedBy = (value: SelectedBy) => {
    setSelectedBy(value);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onCreate={createTodo}
          toggleAll={toggleAll}
          mainInputRef={mainInputRef}
          todos={todos}
          setErrorMessage={setErrorMessage}
          isDisabletField={isDisabletField}
          title={title}
          setTitle={setTitle}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              selectedBy={selectedBy}
              isLoading={isLoading}
              tempTodo={tempTodo}
              setTempTodo={setTempTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              editCheckbox={editCheckbox}
              loadingTodos={loadingTodos}
            />

            <Footer
              selectedBy={selectedBy}
              onSelect={handleSelectedBy}
              onClear={clearComplitedTodos}
              todos={todos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
