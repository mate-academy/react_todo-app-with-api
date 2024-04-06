import React, { useEffect, useRef, useState } from 'react';

import {
  addNewTodo,
  updateTodoById,
  deleteTodoById,
  getTodosByUserId,
  USER_ID,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { getPreparedTodos } from './client/getPreparedTodos';

import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterOptions } from './types/FilterOptions';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';
import { Main } from './components/Main/Main';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NoError,
  );
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const visibleTodos = getPreparedTodos(todos, filterOption);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const isAllTodosCompleted = todos.length === completedTodos.length;

  const handleShowError = (message: ErrorMessages) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessages.NoError);
    }, 3000);
  };

  const handleTodoDelete = (todoId: number) => {
    setProcessingTodoIds(prevProcessing => [...prevProcessing, todoId]);

    deleteTodoById(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleShowError(ErrorMessages.Delete);
      })
      .finally(() =>
        setProcessingTodoIds(prevProcessing =>
          prevProcessing.filter(id => id !== todoId),
        ),
      );
  };

  const handleAddNewTodo = (title: string) => {
    setIsInputDisabled(true);

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addNewTodo(newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleShowError(ErrorMessages.Add);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleUpdateTodoStatus = (todoToUpdate: Todo) => {
    setProcessingTodoIds(prevProcessing => [
      ...prevProcessing,
      todoToUpdate.id,
    ]);

    updateTodoById(todoToUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            updatedTodo.id === todo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        handleShowError(ErrorMessages.Update);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevProcessing =>
          prevProcessing.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleUpdateTodoTitle = (todoToUpdate: Todo) => {
    setProcessingTodoIds(prevProcessing => [
      ...prevProcessing,
      todoToUpdate.id,
    ]);

    return updateTodoById(todoToUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            updatedTodo.id === todo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        handleShowError(ErrorMessages.Update);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevProcessing =>
          prevProcessing.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      handleShowError(ErrorMessages.EmptyTitle);

      return;
    } else {
      setErrorMessage(ErrorMessages.NoError);
      handleAddNewTodo(normalizedTitle);
    }
  };

  const handleFilter = (value: FilterOptions) => {
    setFilterOption(value);
  };

  const handleDeleteAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleTodoDelete(todo.id);
      }
    });
  };

  const handleChangeStatus = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo =>
        handleUpdateTodoStatus({ ...todo, completed: !todo.completed }),
      );
    } else {
      completedTodos.forEach(todo =>
        handleUpdateTodoStatus({ ...todo, completed: !todo.completed }),
      );
    }
  };

  useEffect(() => {
    getTodosByUserId()
      .then(setTodos)
      .catch(() => handleShowError(ErrorMessages.Load));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTodoTitle}
          setNewTitle={setNewTodoTitle}
          onSubmit={handleSubmit}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          isTodosEmpty={!Boolean(todos.length)}
          isButtonActive={isAllTodosCompleted}
          onChangeStatus={handleChangeStatus}
        />
        <Main
          todos={visibleTodos}
          onDelete={handleTodoDelete}
          processingTodoIds={processingTodoIds}
          onUpdateStatus={handleUpdateTodoStatus}
          onUpdateTitle={handleUpdateTodoTitle}
          inputRef={inputRef}
        />
        {tempTodo && (
          <TodoItem todo={tempTodo} isShowLoader={Boolean(tempTodo)} />
        )}
        {!!todos.length && (
          <Footer
            counter={activeTodos.length}
            filterOption={filterOption}
            onFilter={handleFilter}
            isClearButtonShowing={Boolean(completedTodos.length)}
            onDeleteCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <Error message={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
