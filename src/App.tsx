/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { FilterPanel } from './FilterPanel';
import { InputForm } from './InputForm';
import { Notifications } from './Notifications';
import { TodoList } from './TodoList';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTypeEnum';

const USER_ID = 10592;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [removeTodoIsClicked, setRemoveTodoIsClicked] = useState(false);
  const [editTodoIsClicked, setEditTodoIsClicked] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterType>(FilterType.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [fetchTodosStatus, setFetchTodosStatus] = useState(false);
  const [onEmptyFormSubmit, setOnEmptyFormSubmit] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toggleTodoIsFailed, setToggleTodoIsFailed] = useState(false);
  const [updatingTogosToggle, setUpdatingTodosToggle] = useState<number[]>([]);
  const [deletingCompletedTodos,
    setDeletingCompletedTodos] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const allTodosCompleted = useMemo(() => {
    return filteredTodos.every((todo) => todo.completed);
  }, [filteredTodos]);

  const notAllTodosCompleted = useMemo(() => {
    return filteredTodos.every((todo) => todo.completed);
  }, [filteredTodos]);

  const showNotification = removeTodoIsClicked
  || editTodoIsClicked
  || onEmptyFormSubmit
  || toggleTodoIsFailed;

  const getTodos = async () => {
    try {
      const data = await client.get(`/todos?userId=${USER_ID}`) as Todo[];

      setTodos(data);
      setFetchTodosStatus(true);
    } catch {
      setFetchTodosStatus(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const filteredTodosArr = useMemo(() => {
    return todos.filter((todo) => {
      if (filterMode === FilterType.Active) {
        return !todo.completed;
      }

      if (filterMode === FilterType.Completed) {
        return todo.completed;
      }

      return todo;
    });
  }, [todos, filterMode]);

  useEffect(() => {
    setFilteredTodos(filteredTodosArr);
  }, [filteredTodosArr]);

  const handleToggleAllClick = async () => {
    const updatedTodos = filteredTodosArr.map((todo) => ({
      ...todo,
      completed: !allTodosCompleted,
    }));

    try {
      setUpdatingTodosToggle(updatedTodos.map((todo) => todo.id));

      await Promise.all(
        updatedTodos.map(async (todo) => {
          await fetch(`https://mate.academy/students-api/todos/${todo.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
              },
              body: JSON.stringify({
                completed: todo.completed,
              }),
            });
        }),
      );
      setTodos(updatedTodos);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`An error occurred while toggling all todos ${error}`);
      setToggleTodoIsFailed(true);
    } finally {
      setUpdatingTodosToggle([]);
    }
  };

  return USER_ID
    ? (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this buttons is active only if there are some active todos */}
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
                inactive: notAllTodosCompleted,
              })}
              onClick={handleToggleAllClick}
            />

            {/* Add a todo on form submit */}
            <InputForm
              setFilteredTodos={setFilteredTodos}
              setOnEmptyFormSubmit={setOnEmptyFormSubmit}
              setTempTodo={setTempTodo}
              isInputDisabled={isInputDisabled}
              setIsInputDisabled={setIsInputDisabled}
            />
          </header>

          <TodoList
            todos={filteredTodos}
            setRemoveTodoIsClicked={setRemoveTodoIsClicked}
            setEditTodoIsClicked={setEditTodoIsClicked}
            tempTodo={tempTodo}
            setTodos={setTodos}
            setToggleTodoIsFailed={setToggleTodoIsFailed}
            updatingTodosToggle={updatingTogosToggle}
            deletingCompletedTodos={deletingCompletedTodos}
            setIsInputDisabled={setIsInputDisabled}
          />

          {/* Hide the footer if there are no todos */}
          {!!todos.length
          && (
            <FilterPanel
              setFilterMode={setFilterMode}
              filteredTodos={filteredTodos}
              setFilteredTodos={setFilteredTodos}
              setDeletingCompletedTodos={setDeletingCompletedTodos}
            />
          )}
        </div>

        {/* Notification is shown in case of any error */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        {showNotification && (
          <Notifications
            removeTodoIsClicked={removeTodoIsClicked}
            setRemoveTodoIsClicked={setRemoveTodoIsClicked}
            editTodoIsClicked={editTodoIsClicked}
            setEditTodoIsClicked={setEditTodoIsClicked}
            onEmptyFormSubmit={onEmptyFormSubmit}
            setOnEmptyFormSubmit={setOnEmptyFormSubmit}
            toggleTodoIsFailed={toggleTodoIsFailed}
            setToggleTodoIsFailed={setToggleTodoIsFailed}
            // toggleAllIsClicked={toggleAllIsClicked}
            // setToggleAllIsClicked={setToggleAllIsClicked}
          />
        ) }
        {!fetchTodosStatus
          && (
            <p>
              We failed to load todos. Try again.
            </p>
          )}
      </div>
    )
    : <UserWarning />;
};
