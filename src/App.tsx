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
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [typeError, setTypeError] = useState(ErrorTypes.default);
  const [hasEditTodo, setHasEditTodo] = useState(false);
  const [todoForUpdate, setTodoForUpdate] = useState<Todo | null>(null);
  const [indexUpdatedTodo, setIndexUpdatedTodo] = useState(0);

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
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorGet);
    }
  }

  (function handleTempTodo() {
    if (tempTodo) {
      visibleTodos.splice(indexUpdatedTodo, 1, tempTodo);
    }
  }());

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleStatus = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    setStatus(event.currentTarget.type);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIndexUpdatedTodo(todos.length);
    setDisableInput(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: input,
      completed: false,
    });

    setInput('');
    try {
      await createTodo(USER_ID, {
        title: input,
        userId: USER_ID,
        completed: false,
      });

      await loadedTodos();
      setTempTodo(null);
      setDisableInput(false);
      setIndexUpdatedTodo(0);
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorPost);
      setTempTodo(null);
      setDisableInput(false);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    // event.preventDefault();
    // if (todo) {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todo.title,
      completed: todo.completed,
    });

    try {
      await updateTodo(todo.id, {
        title: todo.title,
        completed: todo.completed,
      });
      setTypeError(ErrorTypes.default);
      setTempTodo(null);
      setTodoForUpdate(null);
    } catch (error) {
      setTempTodo(null);
      setTodoForUpdate(null);
      setTypeError(ErrorTypes.ErrorPatch);
    }
    // }
  };

  const handleRemoveTodo = async (todo: Todo, indexTodo: number) => {
    setIndexUpdatedTodo(indexTodo);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todo.title,
      completed: todo.completed,
    });

    try {
      await deleteTodo(todo.id);
      setTempTodo(null);
      setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      setTypeError(ErrorTypes.default);
    } catch (error) {
      setTypeError(ErrorTypes.ErrorDelete);
      setTempTodo(null);
    }
  };

  const handleChangeStatusTodo = async (
    // event:  React.MouseEvent<HTMLInputElement, MouseEvent>,
    todoId: number,
  ) => {
    let newTodo: Todo | null = null;

    await setTodos(todos.map((todo, index) => {
      if (todo.id !== todoId) {
        return todo;
      }

      setIndexUpdatedTodo(index);
      newTodo = { ...todo, completed: !todo.completed };

      return { ...todo, completed: !todo.completed };
    }));

    if (newTodo) {
      handleUpdateTodo(newTodo);
    }
  };

  const handleChangeStatusAllTodo = async () => {
    const arr: Todo[] = [];

    if (itemsLeftCount > 0) {
      await setTodos(prev => prev.map(
        (todo) => {
          arr.push({ ...todo, completed: true });

          return ({ ...todo, completed: true });
        },
      ));
    } else {
      await setTodos(prev => prev.map(
        (todo) => {
          arr.push({ ...todo, completed: false });

          return ({ ...todo, completed: false });
        },
      ));
    }

    arr.map(todo => handleUpdateTodo(todo));
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
          disabeled={disableInput}
          onChangeStatusAllTodo={handleChangeStatusAllTodo}
        />

        <Main
          visibleTodos={visibleTodos}
          onRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
          onEditTodo={handleEditTodo}
          hasEditTodo={hasEditTodo}
          setHasEditTodo={setHasEditTodo}
          onUpdateTodo={handleUpdateTodo}
          setIndexUpdatedTodo={setIndexUpdatedTodo}
          indexUpdatedTodo={indexUpdatedTodo}
          onChangeStatusTodo={handleChangeStatusTodo}
          todoForUpdate={todoForUpdate}
          setTodoForUpdate={setTodoForUpdate}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            selectedStatus={status}
            onHandleStatus={handleStatus}
            itemsLeftCount={itemsLeftCount}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {typeError !== ErrorTypes.default
        && (
          <ErrorMessages
            typeError={typeError}
            setTypeError={setTypeError}
          />
        )}
    </div>
  );
};
