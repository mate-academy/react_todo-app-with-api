/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useState, useEffect, ChangeEvent } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos, addNewTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Error } from './utils/Error';
import { FilterValue } from './utils/FilterValue';

const USER_ID = 6752;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValue.All);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.NoError);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(Error.Loading);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getFilteringTodos = () => {
    let visibleTodos = [...todos];

    switch (filterValue) {
      case FilterValue.Active: visibleTodos = visibleTodos.filter(
        (todo) => !todo.completed,
      );
        break;
      case FilterValue.Completed: visibleTodos = visibleTodos.filter(
        (todo) => todo.completed,
      );
        break;
      default:
        break;
    }

    return visibleTodos;
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setNewTodoTitle('');
    setTempTodo({ ...newTodo, id: 0 });

    if (!newTodoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setShowNotification(true);

      return;
    }

    if (newTodoTitle.trim()) {
      try {
        setIsLoading(true);
        const newTodoResponse = await addNewTodo(newTodo);

        setTodos((prevTodos) => [...prevTodos, newTodoResponse]);
        setTempTodo(null);
      } catch (error) {
        setErrorMessage(Error.Adding);
        setShowNotification(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id:number) => {
    try {
      setIsLoading(true);
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(Error.Deleting);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCompletedTodos = () => {
    todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
        handleDelete(todo.id);
      }

      return todo;
    });
    setTodos(todos);
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const changeStatus = (todo:Todo) => {
    try {
      setIsLoading(true);
      setTodos(todos => todos.map(todoItem => (todoItem.id === todo.id ? { ...todoItem, completed: !todoItem.completed } : todoItem)));
      updateTodo(todo);
    } catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Updating);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTitle = (todo:Todo, editedTitle: string) => {
    try {
      setIsLoading(true);
      setTodos(todos => todos.map(todoItem => (todoItem.id === todo.id ? { ...todoItem, title: editedTitle } : todoItem)));
      updateTodo(todo);
    } catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Updating);
    } finally {
      setIsLoading(false);
    }
  };

  function isAllTodosChecked(todos: Todo[]) {
    for (const todo of todos) {
      if (!todo.completed) {
        return false;
      }
    }

    return true;
  }

  const changeStatusAllTodos = () => {
    try {
      setIsLoading(true);
      setTodos(todos => todos.map((todoItem) => (!todoItem.completed ? { ...todoItem, completed: true } : todoItem)));
    } catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Updating);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos
             && (
               <button
                 type="button"
                 className={classNames('todoapp__toggle-all', { active: !isAllTodosChecked })}
                 onClick={() => changeStatusAllTodos()}
               />
             )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleInput}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {{ tempTodo } && (
            <TodoList
              todos={getFilteringTodos()}
              handleDelete={handleDelete}
              changeStatus={changeStatus}
              changeTitle={changeTitle}
            />
          )}
        </section>
        {todos.length !== 0 &&(
          <Footer
            setFilterValue={setFilterValue}
            filterValue={filterValue}
            todos={todos}
            clearCompletedTodos={clearCompletedTodos}
            completedTodos={completedTodos}
          />
        )}
      </div>
      {errorMessage
        && (
          <Notification
            errorMessage={errorMessage}
            showNotification={showNotification}
            setShowNotification={setShowNotification}
          />
        )}
    </div>
  );
};
