/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { USER_ID } from './helpers/userId';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import * as todoService from './api/todos';
import { ErrorMessages } from './components/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const addTodo = ({ userId, title, completed }: Todo) => {
    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    setResponse(true);

    todoService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodoTitle('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setResponse(false);
      });
  };

  const deleteTodo = (id: number) => {
    setIsLoading(currentTodos => [...currentTodos, id]);

    todoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setIsLoading(currentTodos => currentTodos.filter(todoId => id !== todoId));
        setTempTodo(null);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setIsLoading(currentTodos => [...currentTodos, updatedTodo.id]);

    todoService.updateTodo(updatedTodo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === updatedTodo.id
            ? updatedTodo
            : prevTodo
        ))
      )))
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setIsLoading(currentTodos => currentTodos.filter(todoId => updatedTodo.id !== todoId));
      });
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    await Promise.all(todosToUpdate.map(todo => (
      updateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isTodosLength = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onSubmit={addTodo}
          response={response}
          setErrorMessage={setErrorMessage}
          onToggleAll={toggleAll}
        />

        {isTodosLength && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              isLoading={isLoading}
              tempTodo={tempTodo}
            />

            <Footer
              todos={todos}
              setFilteredTodos={setFilteredTodos}
              onDelete={deleteTodo}
            />
          </>
        )}

      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
