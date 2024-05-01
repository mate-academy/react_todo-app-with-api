/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './utils/FilterStatus';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoListContext } from './variables/LangContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
      });
  }, []);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  const reset = () => {
    setTitle('');
  };

  function addTodo({ userId, completed }: Todo) {
    return todoService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
        throw error;
      });
  }

  function deleteTodo(todoId: number) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
        throw error;
      })
      .finally(() =>
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId)),
      );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setLoadingTodoIds(prevIds => [...prevIds, temporaryTodo.id]);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    addTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: title,
      completed: false,
    })
      .then(() => {
        reset();
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
      })
      .catch(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== temporaryTodo.id),
        ),
      );
  };

  function updateTodo(updatedTodo: Todo) {
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);
    todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.map(todoOpt => {
            if (todoOpt.id === updatedTodo.id) {
              return {
                ...todoOpt,
                completed: !todoOpt.completed,
              };
            }

            return todoOpt;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== updatedTodo.id),
        ),
      );
  }

  function updateTodoTitle(updatedTodo: Todo, titleEntered: string) {
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    return todoService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return {
                ...currentTodo,
                title: titleEntered,
              };
            }

            return currentTodo;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setErrorVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 3000);

        throw new Error('some error');
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== updatedTodo.id),
        ),
      );
  }

  function checkAllTodos(todosAll: Todo[]) {
    const todosNotCompleted = todosAll.filter(todo => todo.completed === false);

    if (todosNotCompleted.length > 0) {
      todosNotCompleted.forEach(todo => updateTodo(todo));
    } else {
      todos.forEach(todo => updateTodo(todo));
    }
  }

  function clearCompleted(deleteTodos: Todo[]) {
    const todosCompleted = deleteTodos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    todosCompleted.forEach(todoId => {
      deleteTodo(todoId);
    });
  }

  const visibleTodos = getFilteredTodos(todos, query);

  const completedTodos = todos.filter(todo => todo.completed === false);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          filteredTodos={visibleTodos}
          enteredTodo={title}
          checkAllTodos={checkAllTodos}
          handleSubmit={handleSubmit}
          handleTitleChange={handleTitleChange}
          inputRef={inputRef}
        />
        <TodoListContext.Provider
          value={{
            updateTodo,
            deleteTodo,
            updateTodoTitle,
            loadingTodoIds,
            tempTodo,
          }}
        >
          <TodoList visibleTodos={visibleTodos} />
        </TodoListContext.Provider>

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            visibleTodos={visibleTodos}
            query={query}
            filterQuery={setQuery}
            filteredCompletedTodos={completedTodos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessage
        errorVisible={errorVisible}
        errorMessage={errorMessage}
        showError={setErrorVisible}
      />
    </div>
  );
};
