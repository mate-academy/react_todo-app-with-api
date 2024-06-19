/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { Header } from './Components/Header/Header';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer/Footer';
import { TodoList } from './Components/TodoList/TodoList';
import { Errors } from './Components/Errors/Errors';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [inputTitle, setInputTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const isClearAllButtonActive = todos.length - itemsLeft > 0;

  function onAdd({ userId, completed }: Todo) {
    setInputDisabled(true);
    const trimmedTitle = inputTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setInputDisabled(false);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setLoadingTodoId(current => [...current, 0]);

    addTodos({ userId, title: trimmedTitle, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setInputTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setInputDisabled(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodoId(current => current.filter(todoId => todoId !== 0));
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  function onDelete(todoId: number) {
    setInputDisabled(true);
    setLoadingTodoId(curr => [...curr, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodoId(curr =>
          curr.filter(deletingTodoId => todoId !== deletingTodoId),
        );
        setInputDisabled(false);
      });
  }

  function deleteAllComplete() {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodos.forEach(todoId => onDelete(todoId));
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setTimeout(() => setErrorMessage(''), 3000));
  }, []);

  const filteredTodos = useMemo((): Todo[] => {
    switch (status) {
      case Status.Completed:
        return todos.filter(todo => todo.completed);

      case Status.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [todos, status]);

  const toggleTodo = (todo: Todo) => {
    setLoadingTodoId(curr => [...curr, todo.id]);

    updateTodos({
      ...todo,
      completed: !todo.completed,
    })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodoId(curr =>
          curr.filter(updatedTodoId => updatedTodoId !== todo.id),
        );
      });
  };

  const toggleAllTodos = () => {
    if (todos.filter(todo => !todo.completed).length > 0) {
      todos.filter(todo => !todo.completed).forEach(toggleTodo);
    } else {
      todos.filter(todo => todo.completed).forEach(toggleTodo);
    }
  };

  function updateTodo(todo: Todo) {
    setLoadingTodoId(current => [...current, todo.id]);

    return updateTodos(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setLoadingTodoId(current =>
          current.filter(deletingTodoId => todo.id !== deletingTodoId),
        );
      });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onSubmit={onAdd}
          setError={setErrorMessage}
          inputDisabled={inputDisabled}
          setInputDisabled={() => setInputDisabled}
          inputTitle={inputTitle}
          handleTitleChange={handleTitleChange}
          error={errorMessage}
          toggleAll={toggleAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={onDelete}
          isLoading={loadingTodoId}
          tempTodo={tempTodo}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            status={status}
            onClick={setStatus}
            itemsLeft={itemsLeft}
            clearAllButtonActive={isClearAllButtonActive}
            deleteAllComplete={deleteAllComplete}
          />
        )}
      </div>
      <Errors error={errorMessage} onClose={() => setErrorMessage('')} />
    </div>
  );
};
