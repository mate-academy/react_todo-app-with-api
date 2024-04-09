import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  USER_ID,
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FilterBy';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processingTodos, setProcessingTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setErrorText] = useState<Errors>(Errors.NoError);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const preparedTodos = getFilteredTodos(todos, filterBy);
  const addToProcessingListById = (todoId: number) => {
    const todoToAdd = todos.find(todo => todo.id === todoId);

    if (todoToAdd === undefined) {
      return;
    }

    setProcessingTodos(prevTodos => [...prevTodos, todoToAdd]);
  };

  const removeFromProcessingListById = (todoId: number) => {
    setProcessingTodos(prevTodos =>
      prevTodos.filter(prevTodo => prevTodo.id !== todoId),
    );
  };

  const handleFilterByClick = (statusFilterByValue: FilterBy) => {
    setFilterBy(statusFilterByValue);
  };

  const handleHideError = () => {
    setErrorText(Errors.NoError);
  };

  const handleError = useCallback((message: Errors) => {
    setErrorText(message);
    wait(3000).then(() => handleHideError());
  }, []);

  const handleTodoDelete = (todoId: number) => {
    addToProcessingListById(todoId);
    setErrorText(Errors.NoError);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(prevTodo => todoId !== prevTodo.id);
        });
      })
      .catch(() => {
        handleError(Errors.Delete);
      })
      .finally(() => {
        removeFromProcessingListById(todoId);
      });
  };

  const handleCompletedTodoDelete = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleTodoDelete(todo.id);
      }
    });
  };

  const handleTodoAdd = (newTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setErrorText(Errors.NoError);

    postTodo(newTodo)
      .then(res => {
        setTitle('');

        setTodos(prevTodos => {
          return [
            ...prevTodos,
            {
              ...newTodo,
              id: res.id,
            },
          ];
        });
      })
      .catch(() => {
        handleError(Errors.Add);
      })
      .finally(() => {
        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    addToProcessingListById(updatedTodo.id);
    setErrorText(Errors.NoError);

    updateTodo(updatedTodo)
      .then(resp => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => (todo.id === resp.id ? resp : todo));
        });
      })
      .catch(() => {
        handleError(Errors.Update);
      })
      .finally(() => {
        removeFromProcessingListById(updatedTodo.id);
      });
  };

  const handleTodoCheck = (checkedTodo: Todo) => {
    handleTodoUpdate({
      ...checkedTodo,
      completed: !checkedTodo.completed,
    });
  };

  useEffect(() => {
    const fetchTodos = () => {
      getTodos()
        .then(data => {
          setTodos(data);
        })
        .catch(() => {
          handleError(Errors.Loading);
        });
    };

    fetchTodos();
  }, [handleError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isPosting={!!tempTodo}
          onAddNewTodo={handleTodoAdd}
          onError={handleError}
          title={title}
          setTitle={setTitle}
          inputRef={inputRef}
          onTodoCheck={handleTodoCheck}
        />

        <Main
          todos={preparedTodos}
          processingTodos={processingTodos}
          tempTodo={tempTodo}
          onTodoDelete={handleTodoDelete}
          onTodoCheck={handleTodoCheck}
          onTodoUpdate={handleTodoUpdate}
        />

        {!!todos.length && (
          <Footer
            onFilterByClick={handleFilterByClick}
            todos={todos}
            filterBy={filterBy}
            onCompletedTodoDelete={handleCompletedTodoDelete}
          />
        )}
      </div>

      <Error error={error} onHideError={handleHideError} />
    </div>
  );
};
