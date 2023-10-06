/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import * as TodoSevise from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessages } from './types/ErrorMessage';
import { filterTodos } from './utils/FilterTodos';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessages>(ErrorMessages.None);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');

  const visibleTodos = filterTodos(todos, status);
  const hasCompleted = todos.some(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleLoading = (todoId: number[]) => {
    setIsLoading(prevArray => prevArray.concat(todoId));
  };

  const handleFilterStatus = (todosStatus: Status) => (
    setStatus(todosStatus));

  useEffect(() => {
    TodoSevise.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.UnableLoadTodo));
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage, isDisabled]);

  const handleAddTodo = (titleTodo: string) => {
    return TodoSevise.addTodo(titleTodo.trim())
      .then((newTodo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
        setIsDisabled(false);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableAddTodo);
        setTempTodo(null);
        // throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsDisabled(true);
    setIsLoading(prevArray => [...prevArray, todoId]);

    TodoSevise.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessages.UnableDeleteToso))
      .finally(() => {
        setIsDisabled(false);
        setIsLoading([]);
      });
  };

  const handleUpdateTodo = (todo: Todo, newTitle: string) => {
    TodoSevise.updateTodo({
      ...todo,
      title: newTitle,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currentTodo => (
            currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo
          )));
      })
      .catch(() => setErrorMessage(ErrorMessages.UnableUpdateTodo))
      .finally(() => setIsLoading([]));
  };

  const handleToggleChange = (todo: Todo) => {
    setIsLoading(prevArray => [...prevArray, todo.id]);
    TodoSevise.updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currentTodo => (
            currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo
          )));
      })
      .catch(() => setErrorMessage(ErrorMessages.UnableUpdateTodo))
      .finally(() => setIsLoading([]));
  };

  const handelClearComplited = () => {
    const allCompleatedTodos = todos.filter(todo => todo.completed === true);

    allCompleatedTodos.forEach(todo => (
      setIsLoading(prevArray => [...prevArray, todo.id])
    ));

    Promise.all(allCompleatedTodos.map(todo => TodoSevise.deleteTodo(todo.id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => (
        setErrorMessage(ErrorMessages.UnableDeleteToso)
      ))
      .finally(() => {
        setIsLoading([]);
        setIsDisabled(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onToddoAdd={handleAddTodo}
          onToggleChange={handleToggleChange}
          todos={visibleTodos}
          inputRef={inputRef}
          setTempTodo={setTempTodo}
          setIsDisabled={setIsDisabled}
          setErrorMessage={setErrorMessage}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isDisabled={isDisabled}
        />
        <TodoList
          handleDeleteTodo={handleDeleteTodo}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          handleLoading={handleLoading}
          handleUpdateTodo={handleUpdateTodo}
          handleToggleChange={handleToggleChange}
        />
        {/* <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              onTodoDelete={handleDeleteTodo}
              isLoading={isLoading}
              handleLoading={handleLoading}
              key={todo.id}
              onTodoUpdate={handleUpdateTodo}
              onToggleChange={handleToggleChange}
            />
          ))}

          {(tempTodo) && (
            <TodoItem
              todo={tempTodo}
              onTodoDelete={handleDeleteTodo}
              isLoading={isLoading}
              handleLoading={handleLoading}
              onTodoUpdate={handleUpdateTodo}
              onToggleChange={handleToggleChange}
              key={tempTodo.id}
            />
          )}
        </section> */}

        {Boolean(todos.length)
          && (
            <Footer
              onFilterStatus={handleFilterStatus}
              todosFilterStatus={status}
              onDeleteCompleated={handelClearComplited}
              hasCompleted={hasCompleted}
              activeTodosCount={activeTodosCount}
            />
          )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
