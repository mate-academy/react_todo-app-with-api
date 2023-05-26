/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, postTodos, deleteTodo, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './filterTodos/filterTodos';
import { TodoList } from './TodoList/TodoList';
import { Errors } from './Errors/Errors';
import { TodoError } from './types/TodoError';

const USER_ID = 10327;

export const App: React.FC = () => {
  const [todoItem, setTodoItem] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState(TodoError.NONE);
  const [isLoadWait, setIsLoadWait] = useState(false);

  const fetchTodos = () => getTodos(USER_ID).then(setTodos);

  const todoCount = todos.filter(({ completed }) => !completed).length;
  const todoCompleted = todos.filter(todo => todo.completed === true);
  const hasCompletedTodo = todoCompleted.length > 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearTodoField = () => setTodoItem('');

  const createTodo = async (event: ChangeEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoadWait(true);

      const newTodo = {
        userId: USER_ID,
        title: todoItem,
        completed: false,
      };

      await postTodos(USER_ID, newTodo);
      fetchTodos();
      clearTodoField();
    } catch {
      setErrors(TodoError.ADD_ERROR);
    } finally {
      setIsLoadWait(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      fetchTodos();
      setIsLoadWait(true);
    } catch {
      setErrors(TodoError.REMOVE_ERROR);
    } finally {
      setIsLoadWait(false);
    }
  };

  const handleChangeTodo = async (id: number, isCompleted: boolean) => {
    try {
      await patchTodo(id, { completed: !isCompleted });
      fetchTodos();
      setIsLoadWait(true);
    } catch {
      setErrors(TodoError.UPDATE_ERROR);
    } finally {
      setIsLoadWait(false);
    }
  };

  const activeFilter = () => {
    setTodos(todos.filter((todo) => todo.completed === false));
  };

  const completedFilter = () => {
    setTodos(todos.filter((todo) => todo.completed === true));
  };

  const deleteFilter = () => {
    fetchTodos();
  };

  const deleteAllCompleted = () => {
    todoCompleted.map((todo) => handleDeleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form
            onSubmit={createTodo}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoItem}
              onChange={event => setTodoItem(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          deleteTodo={handleDeleteTodo}
          changeTodo={handleChangeTodo}
          isLoad={isLoadWait}
        />

        {todos.length > 0 && (
          <>
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${todoCount} items left`}
              </span>

              <TodoFilter
                onAll={deleteFilter}
                onActive={activeFilter}
                onCompleted={completedFilter}
              />

              {hasCompletedTodo && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={deleteAllCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <Errors error={errors} />
    </div>
  );
};
