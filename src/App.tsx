/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, getTodos, createTodo, onDelete, onChange } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const visibleTodos = getVisibleTodos(todos, status);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const addTodo = (todoTitle: string) => {
    const newTitle = todoTitle.trim();

    if (!newTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    setLoadingTodos(current => [...current, 0]);

    const newTodo = {
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(resultTodo => {
        setTodos([...todos, resultTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const deleteTodo = async (id: number) => {
    setLoadingTodos(current => [...current, id]);

    return onDelete(id)
      .then(() => {
        setTodos(todoState => todoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(deletingTodoId => deletingTodoId !== id),
        );
      });
  };

  const deleteCompletedTodo = () => {
    const completedTodos = todos.filter(item => item.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const handleRename = (todo: Todo) => {
    setLoadingTodos(current => [...current, todo.id]);

    onChange(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  const handleToggleStatus = (todo: Todo) => {
    setLoadingTodos(current => [...current, todo.id]);

    onChange({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(current => current.filter(id => id !== todo.id));
      });
  };

  function handleToggleAllStatus() {
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      completedTodos.forEach(handleToggleStatus);
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          handleToggleAllStatus={handleToggleAllStatus}
          todos={todos}
          inputRef={inputRef}
        />

        <TodoList
          visibleTodos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          handleToggleStatus={handleToggleStatus}
          handleRename={handleRename}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
