import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { SelectedStatus, Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(SelectedStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [numOfCompletedTodos, setNumOfCompletedTodos] = useState(0);
  const [numOfActiveTodos, setNumOfActiveTodos] = useState(0);

  const countStatusesOfTodos = () => {
    const activeTodos = todos.reduce(
      (count, todo) => count + (todo.completed ? 0 : 1),
      0,
    );

    setNumOfActiveTodos(activeTodos);
    setNumOfCompletedTodos(todos.length - activeTodos);
  };

  useEffect(countStatusesOfTodos, [
    todos,
    numOfCompletedTodos,
    numOfActiveTodos,
  ]);

  const handleSetStatus = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    setSelectedStatus(target.textContent as SelectedStatus);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const changeTodo = (newTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === newTodo.id ? { ...todo, ...newTodo } : todo,
      ),
    );
  };

  const addTodo = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const deleteAllCompletedTodo = (todosToDelete: Todo[]) => {
    setTodos(currentTodos =>
      currentTodos.filter(todo => !todosToDelete.includes(todo)),
    );

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleAllCompletedTodo = (todosToToggle: Todo[]) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        const toggledTodo = todosToToggle.find(t => t.id === todo.id);

        return toggledTodo ? toggledTodo : todo;
      });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTempTodo={setTempTodo}
          onSubmit={addTodo}
          onErrorMessage={setErrorMessage}
          inputRef={inputRef}
          todos={todos}
          onToggleTodo={toggleAllCompletedTodo}
          numOfCompletedTodos={numOfCompletedTodos}
        />

        <TodoList
          todos={todos}
          status={selectedStatus}
          onChangeTodo={changeTodo}
          tempTodo={tempTodo}
          onDeleteTodo={deleteTodo}
          onErrorMessage={setErrorMessage}
        />

        <Footer
          todos={todos}
          selectedStatus={selectedStatus}
          setStatus={handleSetStatus}
          onDeleteCompletedTodo={deleteAllCompletedTodo}
          onErrorMessage={setErrorMessage}
          numOfActiveTodos={numOfActiveTodos}
          numOfCompletedTodos={numOfCompletedTodos}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
