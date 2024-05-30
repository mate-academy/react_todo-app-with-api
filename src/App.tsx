import { FC, useEffect, useRef, useState } from 'react';

import { USER_ID, todoService } from './api/todos';
import { UserWarning } from './UserWarning';
import Footer from './components/Footer';
import Header from './components/Header';
import TodoList from './components/TodoList';

import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>('all');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOAD));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let visibleTodos = todos;

  if (selectedStatus === 'active') {
    visibleTodos = activeTodos;
  }

  if (selectedStatus === 'completed') {
    visibleTodos = completedTodos;
  }

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(Errors.TITLE);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    todoService
      .addTodo(newTodo)
      .then((resTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, resTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADD);
      })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodosIds(current => [...current, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.DELETE);
      })
      .finally(() => {
        setLoadingTodosIds(current => current.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  const updateToggleStatus = (todo: Todo) => {
    setLoadingTodosIds(current => [...current, todo.id]);

    todoService
      .updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => setErrorMessage(Errors.UPDATE))
      .finally(() => {
        setLoadingTodosIds(current => current.filter(id => id !== todo.id));
      });
  };

  const updateTodoName = (todo: Todo) => {
    setLoadingTodosIds(current => [...current, todo.id]);

    return todoService
      .updateTodo({ ...todo })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.UPDATE);
        throw new Error();
      });
  };

  const updateAllToggleStatus = () => {
    if (activeTodos.length) {
      activeTodos.forEach(updateToggleStatus);
    } else {
      completedTodos.forEach(updateToggleStatus);
    }
  };

  const isAllToggleButtonVisible = !activeTodos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          ref={inputRef}
          addTodo={addTodo}
          title={title}
          setTitle={setTitle}
          toggleAll={updateAllToggleStatus}
          isToggleVisible={isAllToggleButtonVisible}
        />
        <TodoList
          todos={visibleTodos}
          selectedStatus={selectedStatus}
          deleteTodo={deleteTodo}
          onToggle={updateToggleStatus}
          tempTodo={tempTodo}
          loadingTodosIds={loadingTodosIds}
          onRename={updateTodoName}
          setLoadingTodosIds={setLoadingTodosIds}
        />

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodos.length}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            deleteAllCompleted={deleteAllCompleted}
            clearAllVisible={!!completedTodos.length}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(Errors.DEFAULT)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
