import React, { useEffect, useState } from 'react';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodos,
} from './api/todos';

import ErrorNotification from './components/ErrorNotification';
import Footer from './components/Footer';
import Header from './components/Header';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState(0);
  const [updatingTodoId, setUpdatingTodoId] = useState(0);

  const allCompletedTodos = todos.every(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const todosLength = todos.length;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const addNewTodo = async (title: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  };

  const handleToggleCompleted = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodos(todo.id, { ...todo, completed: !areAllCompleted }),
        ),
      );
      setTodos(updatedTodos);
    } catch {
      onErrorMessage('Unable to update a todo');
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setDeletingId(todo.id);
      deleteTodo(todo.id)
        .then(() =>
          setTodos(prevState =>
            prevState.filter(todoItem => todoItem.id !== todo.id),
          ),
        )
        .catch(() => onErrorMessage('Unable to delete a todo'))
        .finally(() => setDeletingId(0));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onErrorMessage={onErrorMessage}
          allCompletedTodos={allCompletedTodos}
          deletingId={deletingId}
          onAddTodo={addNewTodo}
          handleToggleCompleted={handleToggleCompleted}
          todosLength={todosLength}
        />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          onErrorMessage={onErrorMessage}
          tempTodo={tempTodo}
          selectedStatus={selectedStatus}
          setDeletingId={setDeletingId}
          deletingId={deletingId}
          setUpdatingTodoId={setUpdatingTodoId}
          updatingTodoId={updatingTodoId}
        />
        {todos.length !== 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={handleClearCompleted}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        )}
      </div>
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
