import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';

import { getTodos, deleteTodo, updateTodo } from './api/todos';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoListState } from './types/TodoListState';
import { Errors } from './types/Errors';

const USER_ID = 12018;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<TodoListState>(TodoListState.All);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => setErrorMessage(Errors.Load));
  }, []);

  const filterTodoList = (todoId: number) => {
    setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  };

  const handleAddTempTodo = (todo: Todo) => {
    setTodoList(prevState => [...prevState, todo]);
  };

  const handleRemoveTempTodo = () => {
    setTodoList(prevState => prevState.filter(todo => todo.id !== 0));
  };

  const [activeTodos, completedTodos] = useMemo(() => {
    let active = 0;
    let completed = 0;

    if (todoList) {
      active = todoList.filter(todo => !todo.completed).length;
      completed = todoList.filter(todo => todo.completed).length;
    }

    return [active, completed];
  }, [todoList]);

  const todoListToShow: Todo[] | null = useMemo(() => {
    switch (filter) {
      case TodoListState.Completed:
        return todoList.filter(todo => !todo.completed);

      case TodoListState.Active:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [todoList, filter]);

  const handleTodoAdded = (todo: Todo) => {
    setTodoList(prevTodos => [...prevTodos, todo]);
  };

  const clearCompleted = () => {
    const todoToClear = todoList.filter(todo => todo.completed);
    const deletePromise: Promise<unknown>[] = [];

    todoToClear.forEach(item => {
      const promise = deleteTodo(item.id)
        .catch(() => {
          setErrorMessage(Errors.Delete);
          throw new Error();
        });

      deletePromise.push(promise);
    });

    Promise.all(deletePromise)
      .then(() => {
        setTodoList(prevState => prevState.filter(todo => !todo.completed));
      });
  };

  const handleTodoUpdated = (todo: Todo) => {
    setTodoList(prevState => {
      return prevState.map(stateTodo => {
        return stateTodo.id === todo.id ? todo : stateTodo;
      });
    });
  };

  const handleToggleAll = () => {
    const updatePromises: Promise<unknown>[] = [];

    todoList.forEach(item => {
      const {
        id,
        userId,
        title,
        completed,
      } = item;

      const promise = activeTodos > 0
        ? updateTodo(id, userId, title, true)
        : updateTodo(id, userId, title, !completed);

      promise.then((res) => {
        handleTodoUpdated(res);
        updatePromises.push(promise);
      })
        .catch(() => {
          setErrorMessage(Errors.Update);
          throw new Error();
        });
    });

    Promise.all(updatePromises)
      .then(() => {
        setTodoList(prevState => prevState.map(todo => ({
          ...todo,
          completed: !todo.completed,
        })));
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
          activeTodos={activeTodos}
          setErrorMessage={setErrorMessage}
          userId={USER_ID}
          handleTodoAdded={handleTodoAdded}
          handleAddTempTodo={handleAddTempTodo}
          handleRemoveTempTodo={handleRemoveTempTodo}
          handleToggleAll={handleToggleAll}
        />

        {todoListToShow && (
          <TodoList
            todoList={todoListToShow}
            filterTodoList={filterTodoList}
            setErrorMessage={setErrorMessage}
            handleTodoUpdated={handleTodoUpdated}
          />
        )}

        {todoList && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        clearErrorMessage={() => setErrorMessage(null)}
      />
    </div>
  );
};
