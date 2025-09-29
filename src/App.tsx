/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorNotifications } from './components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [IsLoadLoader, setIsLoadLoader] = useState(true);
  const [isAddLoader, setIsAddLoader] = useState(false);
  const [beforeDeleteBlur, setBeforeDeleteBlur] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHiddenErrorMessage, setIsHiddenErrorMessage] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setIsLoadLoader(true);

    todoService
      .getTodos()
      .then(todosApi => {
        setTodos(todosApi);
        setIsHiddenErrorMessage(true);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.loadTodosError);
        setIsHiddenErrorMessage(false);
      })
      .finally(() => setIsLoadLoader(false));
  }

  function deleteTodo(todoId: number): Promise<void> {
    return todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteTodoError);
        setIsHiddenErrorMessage(false);
      });
  }

  function addTodo({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>): Promise<void> {
    const tempTodo: Todo = {
      id: Date.now(),
      title: title,
      completed: completed,
      userId: userId,
      isLoading: true,
    };

    setTodos(currTodos => [...currTodos, tempTodo]);

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === tempTodo.id ? { ...newTodo, isLoading: false } : todo,
          ),
        );
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.addTodoError);
        setIsHiddenErrorMessage(false);
        throw error;
      });
  }

  function updateTodo(updatedTodo: Todo): Promise<void> {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === updatedTodo.id ? { ...todo, isLoading: true } : todo,
      ),
    );

    return todoService
      .updateTodo(updatedTodo)
      .then(todoSuccess => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? todoSuccess : todo,
          ),
        );
      })
      .catch(error => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? { ...todo, isLoading: false } : todo,
          ),
        );
        setErrorMessage(ErrorMessage.updateTodoError);
        setIsHiddenErrorMessage(false);
        throw error;
      });
  }

  const handleDelete = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, isLoading: true } : todo,
      ),
    );

    setBeforeDeleteBlur(true);

    return deleteTodo(todoId).finally(() => {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, isLoading: false } : todo,
        ),
      );
      setBeforeDeleteBlur(false);
    });
  };

  useEffect(loadTodos, []);

  useEffect(() => {
    if (!isHiddenErrorMessage) {
      const timer = setTimeout(() => setIsHiddenErrorMessage(true), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isHiddenErrorMessage]);

  useEffect(() => {
    if (!beforeDeleteBlur) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeDeleteBlur]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          onSubmit={addTodo}
          onError={setErrorMessage}
          onErrorHidden={setIsHiddenErrorMessage}
          isAddLoader={isAddLoader}
          onAddLoader={setIsAddLoader}
          inputRef={inputRef}
          IsLoadLoader={IsLoadLoader}
          updateTodo={updateTodo}
        />

        <Main
          IsLoadLoader={IsLoadLoader}
          filter={filter}
          todos={todos}
          handleDelete={handleDelete}
          updateTodo={updateTodo}
        />

        <Footer
          todos={todos}
          filter={filter}
          stateFilter={setFilter}
          handleDelete={handleDelete}
        />
      </div>
      <ErrorNotifications
        errorMessage={errorMessage}
        isHiddenErrorMessage={isHiddenErrorMessage}
      />
    </div>
  );
};
