/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodo, getTodos, deleteTodo, updateTodo,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';
import { ErrorTypes } from './types/ErrorTypes';

const USER_ID = 10548;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('all');
  const [disableInput, setDisableInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes | null>(null);
  const [hasEditTodo, setHasEditTodo] = useState(false);
  const [todoForUpdate, setTodoForUpdate] = useState<Todo | null>(null);
  const [idTodoForCheange, setIdTodoForSpinner] = useState<number[]>([]);

  const getVisibleTodos = (statusTodo: string, todosArr: Todo[]) => {
    switch (statusTodo) {
      case 'active':
        return [...todosArr].filter(todo => !todo.completed);
      case 'completed':
        return [...todosArr].filter(todo => todo.completed);
      default:
        return [...todosArr];
    }
  };

  const visibleTodos = getVisibleTodos(status, todos);

  const itemsLeftCount = todos.filter(todo => !todo.completed).length;

  async function loadedTodos() {
    try {
      const result = await getTodos(USER_ID);

      setTodos(result);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(ErrorTypes.ErrorGet);
    }
  }

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleStatus = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    setStatus(event.currentTarget.dataset.type || 'all');
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableInput(true);
    const todoTempo = {
      id: 0,
      userId: USER_ID,
      title: input,
      completed: false,
    };

    todos.splice(todos.length, 1, todoTempo);

    setIdTodoForSpinner((prev) => [...prev, todoTempo.id]);

    setInput('');
    try {
      const createdTodo = await createTodo(USER_ID, {
        title: input,
        userId: USER_ID,
        completed: false,
      });

      todos.splice(todos.length - 1, 1);
      await setTodos(prev => [...prev, createdTodo]);
      setDisableInput(false);
      setIdTodoForSpinner([]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(ErrorTypes.ErrorPost);
      // setTempTodo(null);
      setDisableInput(false);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    setIdTodoForSpinner((prev) => [...prev, todo.id]);

    try {
      await updateTodo(todo.id, {
        title: todo.title,
        completed: todo.completed,
      });
      setErrorMessage(null);
      setTodoForUpdate(null);
      setIdTodoForSpinner([]);
    } catch (error) {
      setErrorMessage(ErrorTypes.ErrorPatch);
    }
  };

  const handleRemoveTodo = async (todo: Todo) => {
    setIdTodoForSpinner((prev) => [...prev, todo.id]);

    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      setErrorMessage(null);
      setIdTodoForSpinner([]);
    } catch (error) {
      setErrorMessage(ErrorTypes.ErrorDelete);
    }
  };

  const handleChangeStatusTodo = async (
    todoId: number,
  ) => {
    let newTodo: Todo | null = null;

    await setTodos(todos.map((todo) => {
      if (todo.id !== todoId) {
        return todo;
      }

      newTodo = { ...todo, completed: !todo.completed };

      return { ...todo, completed: !todo.completed };
    }));

    if (newTodo) {
      handleUpdateTodo(newTodo);
    }
  };

  const handleChangeStatusAllTodo = async () => {
    try {
      const todosStatus = await Promise.all(todos.map(
        ({ id }) => {
          setIdTodoForSpinner((prev) => [...prev, id]);

          return updateTodo(id, {
            completed: !todos.every(todo => todo.completed),
          });
        },
      ));

      setTodos(todosStatus);
      setIdTodoForSpinner([]);
    } catch {
      setErrorMessage(ErrorTypes.ErrorPatch);
    }
  };

  const handleDeleteCompletedTodo = async () => {
    try {
      const comletedTodos = todos.filter(todo => todo.completed);

      await Promise.all(comletedTodos.map(async todo => {
        setIdTodoForSpinner((prev) => [...prev, todo.id]);

        await deleteTodo(todo.id);
      }));

      setTodos(prev => prev.filter(todo => todo.completed === false));
      setIdTodoForSpinner([]);
    } catch (error) {
      setErrorMessage(ErrorTypes.ErrorDelete);
    }
  };

  const handleEditTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    setTodos(todos.map((todo) => {
      if (todo.id !== todoId) {
        return todo;
      }

      setTodoForUpdate({ ...todo, title: event.target.value });

      return { ...todo, title: event.target.value };
    }));
  };

  const handleDeleteErrorMessage = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    loadedTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodo={itemsLeftCount}
          inputValue={input}
          onHandleInput={handleChangeInput}
          onHandleAddTodo={handleAddTodo}
          disabled={disableInput}
          onChangeStatusAllTodo={handleChangeStatusAllTodo}
        />

        <Main
          visibleTodos={visibleTodos}
          onRemoveTodo={handleRemoveTodo}
          onEditTodo={handleEditTodo}
          hasEditTodo={hasEditTodo}
          setHasEditTodo={setHasEditTodo}
          onUpdateTodo={handleUpdateTodo}
          onChangeStatusTodo={handleChangeStatusTodo}
          todoForUpdate={todoForUpdate}
          setTodoForUpdate={setTodoForUpdate}
          idTodoForCheange={idTodoForCheange}
        />

        {!!todos.length && (
          <Footer
            selectedStatus={status}
            onHandleStatus={handleStatus}
            itemsLeftCount={itemsLeftCount}
            onDeleteCompletedTodo={handleDeleteCompletedTodo}
          />
        )}

      </div>

      {errorMessage
        && (
          <ErrorMessages
            errorMessage={errorMessage}
            onDeleteError={handleDeleteErrorMessage}
          />
        )}
    </div>
  );
};
