/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
// import classNames from 'classnames';
import { TodoData } from './types/TodoData';
import {
  addTodo, getTodos, deleteTodo, updateTodo,
} from './api/todos';
import { Notification } from './components/Notification';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { ActionError } from './types/ActionError';
import { NewTodo } from './components/NewTodo';
import { Todo } from './components/Todo';

const USER_ID = 10524;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoData[]>([]);
  const [errorMessage, setErrorMessage]
  = useState<ActionError>(ActionError.NONE);
  const [tempTodo, setTempTodo] = useState<TodoData | null>(null);
  const [wasAnyTodoCompleted, setWasTodoCompleted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.ALL);

  useEffect(() => {
    getTodos(USER_ID)
      .then((downloadedTodos) => {
        setTodos(downloadedTodos);
        setFilteredTodos(downloadedTodos);
        setWasTodoCompleted(downloadedTodos.some(todo => todo.completed));
      })
      .catch(() => {
        setErrorMessage(ActionError.READ);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(ActionError.NONE);
      }, 3000);
    }
  }, [errorMessage]);

  const handleTodoAdd = useCallback((newTodoTitle: string) => {
    const newTodo = {
      title: newTodoTitle,
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      title: newTodoTitle,
      id: 0,
      completed: false,
      userId: USER_ID,
    });

    return addTodo(newTodo, USER_ID)
      .then(() => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setFilteredTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(() => setErrorMessage(ActionError.ADD))
      .finally(() => setTempTodo(null));
  }, [todos]);

  const handleTodoDelete = useCallback((todoId: number) => {
    return deleteTodo(todoId, USER_ID)
      .then(() => {
        const newTodos = todos.filter(todo => todo.id !== todoId);

        setTodos(newTodos);
        setFilteredTodos(newTodos);
      })
      .catch(() => setErrorMessage(ActionError.DELETE));
  }, [todos]);

  const handleCompletedTodosDelete = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(todoId => deleteTodo(todoId, USER_ID)),
    )
      .then(() => {
        const updatedTodos = todos
          .filter(todo => !completedTodoIds.includes(todo.id));

        setTodos(updatedTodos);
        setFilteredTodos(updatedTodos);
      })
      .catch(() => setErrorMessage(ActionError.DELETE));
  };

  const handleTodoUpdate = useCallback((updatedTodo: TodoData) => {
    return updateTodo(updatedTodo, USER_ID)
      .then(() => {
        const todoToUpdateIndex = todos
          .findIndex(todo => todo.id === updatedTodo.id);

        const newTodos = [...todos.slice(0, todoToUpdateIndex),
          updatedTodo, ...todos.slice(todoToUpdateIndex + 1)];

        setTodos(newTodos);
        setFilteredTodos(newTodos);
        setWasTodoCompleted(newTodos.some(todo => todo.completed));
      })
      .catch(() => setErrorMessage(ActionError.UPDATE));
  }, [todos]);

  const handleTodosToggle = () => {
    const isAllTodosDone = todos.every(todo => todo.completed);

    Promise.all(
      todos.map((todo) => {
        const updatedTodo = {
          ...todo,
          completed: !isAllTodosDone,
        };

        updateTodo(updatedTodo, USER_ID);

        return updatedTodo;
      }),
    ).then((updatedTodos) => {
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);
    }).catch(() => setErrorMessage(ActionError.UPDATE));
  };

  useMemo(() => {
    switch (filterStatus) {
      case Status.ALL:
        setFilteredTodos([...todos]);
        break;
      case Status.COMPLETED:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case Status.ACTIVE:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      default:
        break;
    }
  }, [todos, filterStatus]);

  const handleFilterStatusChange = useCallback((chosenFilter: Status) => {
    setFilterStatus(chosenFilter);
  }, []);

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const uncompletedTodosCountInfo = `${uncompletedTodos.length} ${uncompletedTodos.length === 1 ? 'item' : 'items'} left`;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleTodosToggle}
          />
          <NewTodo onTodoAdd={handleTodoAdd} />
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            onTodoDelete={handleTodoDelete}
            onTodoUpdate={handleTodoUpdate}
          />
          {tempTodo
          && (
            <Todo
              todo={tempTodo}
              onTodoDelete={handleTodoDelete}
              onTodoUpdate={handleTodoUpdate}
            />
          )}
        </section>
      </div>
      <footer className="todoapp__footer">
        <span className="todo-count">{uncompletedTodosCountInfo}</span>
        <Filter onFilterStatusChange={handleFilterStatusChange} />
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleCompletedTodosDelete}
          disabled={!wasAnyTodoCompleted}
          style={
            {
              opacity: wasAnyTodoCompleted ? '1' : '0',
              cursor: wasAnyTodoCompleted ? 'pointer' : 'default',
            }
          }
        >
          Clear completed
        </button>
      </footer>

      <Notification errorMessage={errorMessage} />
    </div>
  );
};
