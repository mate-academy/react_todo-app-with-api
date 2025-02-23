/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { wait } from './utils/fetchClient';
import { Status } from './types/Status';
import { Errors } from './types/Errors';
import { DispatchContext, StateContext } from './context/TodosContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TempTodo } from './components/TempTodo';

const USER_ID = 211;

export const App: React.FC = () => {
  const { todos, status } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isTempTodo, setIsTempTodo] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.none);
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);

  const titleInput = useRef<HTMLInputElement>(null);

  let visibleTodos: Todo[] = todos;

  switch (status) {
    case Status.Active:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case Status.Completed:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    default:
      break;
  }

  const handleError = (message: Errors) => {
    setErrorMessage(message);
    wait(3000).then(() => {
      setErrorMessage(Errors.none);

      if (titleInput.current) {
        titleInput.current.focus();
      }
    });
  };

  useEffect(() => {
    getTodos()
      .then(data => {
        dispatch({ type: 'getTodos', payload: data });
      })
      .catch(() => handleError(Errors.load));
  }, [dispatch]);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [todos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);
    setIsTempTodo(true);

    if (newTodoTitle.trim() === '') {
      handleError(Errors.title);
      setIsDisabled(false);
      setIsTempTodo(false);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    addTodo(newTodo)
      .then(todo => {
        dispatch({ type: 'addTodo', payload: todo });
        setNewTodoTitle('');
      })
      .catch(() => handleError(Errors.add))
      .finally(() => {
        setIsDisabled(false);
        setIsTempTodo(false);
      });
  };

  const handleDelete = (deletingTodoId: number) => {
    setSelectedTodo(prev => [...prev, deletingTodoId]);

    deleteTodo(deletingTodoId)
      .then(() => {
        dispatch({ type: 'deleteTodo', payload: deletingTodoId });
      })
      .catch(() => handleError(Errors.delete))
      .finally(() =>
        setSelectedTodo(prev => prev.filter(n => n !== deletingTodoId)),
      );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleAddTodo={handleAddTodo}
          isDisabled={isDisabled}
          titleInput={titleInput}
          setSelectedTodo={setSelectedTodo}
          handleError={handleError}
        />

        <TodoList
          todos={visibleTodos}
          handleDelete={handleDelete}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          handleError={handleError}
        />

        {isTempTodo && <TempTodo title={newTodoTitle.trim()} />}

        {/* Hide the footer if there are no todos */}
        {!!todos.length && <Footer handleDelete={handleDelete} />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
