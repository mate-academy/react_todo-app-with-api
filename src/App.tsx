/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  deleteTodo,
  createTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

// const USER_ID = 857;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    if (todoStatus === TodoStatus.active) {
      return todos.filter(todo => !todo.completed);
    }

    if (todoStatus === TodoStatus.completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, todoStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getActiveTodosArray = () => {
    return todos.filter(todo => !todo.completed);
  };

  const getCompletedTodosArray = () => {
    return todos.filter(todo => todo.completed);
  };

  const addTodo = () => {
    const correctTitle = newTodoTitle.trim();

    const newTempTodo = {
      id: 0,
      title: correctTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsDisabledInput(true);
    setTempTodo(newTempTodo);
    setIsLoadingTodo(ids => [...ids, 0]);

    createTodo({ title: correctTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
        setIsDisabledInput(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
        setIsLoadingTodo(ids => ids.filter(todoId => todoId !== 0));
      });
  };

  const deleteTodoId = (todoId: number) => {
    setIsLoadingTodo(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoadingTodo([]);
      });
  };

  const updateTodoTitle = (todo: Todo) => {
    setIsLoadingTodo(ids => [...ids, todo.id]);

    updateTodo(todo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoFromServer.id ? todoFromServer : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoadingTodo([]);
      });
  };

  const updateToggle = (toggleTodo: Todo) => {
    setIsLoadingTodo(ids => [...ids, toggleTodo.id]);

    const updatedTodo = { ...toggleTodo, completed: !toggleTodo.completed };

    updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoFromServer.id ? todoFromServer : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoadingTodo([]);
      });
  };

  const handleToggleAll = () => {
    let activeTodos = getActiveTodosArray();

    if (activeTodos.length === 0) {
      activeTodos = todos.map(todo => ({ ...todo, completed: false }));
    } else {
      activeTodos = activeTodos.map(todo => ({ ...todo, completed: true }));
    }

    activeTodos.forEach(todo =>
      updateToggle({ ...todo, completed: !todo.completed }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodo={setNewTodoTitle}
          addTodo={addTodo}
          onError={setErrorMessage}
          onDisabled={isDisabledInput}
          todos={todos}
          handleToggleAll={handleToggleAll}
          getCompletedTodosArray={getCompletedTodosArray}
        />

        <TodoList
          todos={preparedTodos}
          onDelete={deleteTodoId}
          tempTodo={tempTodo}
          isLoadingTodo={isLoadingTodo}
          onUpdateTodo={updateTodoTitle}
          updateToggle={updateToggle}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todos={todos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            onDelete={deleteTodoId}
            activeTodosArray={getActiveTodosArray}
            completedTodosArray={getCompletedTodosArray}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
