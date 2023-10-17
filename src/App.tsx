/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { TodoAppHeader } from './components/TodoAppHeader';
import { utils } from './utils/variables';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const { prepearedTodos, USER_ID } = utils;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const todoList = prepearedTodos(todos, filterType);

  useEffect(() => {
    setIsLoading(true);
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.loadError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    if (newTitle.trim().length === 0) {
      setErrorMessage(ErrorTypes.emptyError);

      return;
    }

    setTempTodo({
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    });

    todoService.createTodo({
      title: newTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.submitError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodoById = (todoId: number) => {
    setIsLoading(true);
    setCompletedTodos(todos.filter(todo => todo.id === todoId));
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.deleteError);
      })
      .finally(() => {
        setIsLoading(false);
        setCompletedTodos([]);
      });
  };

  const deleteCompletedTodo = () => {
    setIsLoading(true);
    const completedList = todos.filter(todo => todo.completed);

    setCompletedTodos(completedList);

    Promise.all(completedList.map(todo => todoService.deleteTodo(todo.id)))
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(currentTodo => (
          !currentTodo.completed
        )));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.clearError);
      })
      .finally(() => {
        setIsLoading(false);
        setCompletedTodos([]);
      });
  };

  const updateTodo = (currentTodo: Todo) => {
    setIsLoading(true);
    setCompletedTodos(todos.filter(todo => currentTodo.id === todo.id));
    todoService.updateTodo(currentTodo).then(data => {
      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(todo => (
          todo.id === data.id
        ));

        newTodos[index] = currentTodo;

        return newTodos;
      });
    }).catch(() => {
      setErrorMessage(ErrorTypes.updateError);
    })
      .finally(() => {
        setIsLoading(false);
        setCompletedTodos([]);
      });
  };

  const updateStatusForAllTodos = async () => {
    const isEveryCompletedTodos = todos.every(todo => todo.completed);

    setCompletedTodos(todos.filter(currentTodo => (
      currentTodo.completed === isEveryCompletedTodos
    )));

    const filtredTodos = todos.filter(todo => (
      todo.completed === isEveryCompletedTodos
    ));

    setIsLoading(true);

    try {
      await Promise.all(filtredTodos.map(todo => todoService.updateTodo(
        { ...todo, completed: !isEveryCompletedTodos },
      )));

      setTodos(currentTodos => {
        return [...currentTodos].map(currentTodo => ({
          ...currentTodo,
          completed: !isEveryCompletedTodos,
        }));
      });
    } catch (error) {
      setErrorMessage(ErrorTypes.updateError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <div className="is-loading" />
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={todos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          addTodo={addTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          updateStatusForAllTodos={updateStatusForAllTodos}
        />

        <TodoList
          todos={todoList}
          tempTodo={tempTodo}
          deleteTodoById={deleteTodoById}
          isLoading={isLoading}
          completedTodos={completedTodos}
          updateTodo={updateTodo}
        />

        {todos.length ? (
          <TodoFooter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        ) : null}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
