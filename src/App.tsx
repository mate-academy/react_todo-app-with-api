/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import {
  USER_ID,
  createTodo,
  destroyTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { TodoInfo } from './components/TodoInfo/TodoInfo';

type IsCompleted = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState<IsCompleted>('all');
  const [isEmptyTitleError, setIsEmptyTitleError] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isCreatingError, setIsCreatingError] = useState(false);
  const [isDeletedError, setIsDeletedError] = useState(false);
  const [isUpdateCompletedError, setIsUpdateCompletedError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUploadingTitle, setIsUploadingTitle] = useState(false);
  const [isLoadingTodoIds, setIsLoadingTodoIds] = useState<number[]>([]);

  // changeCompletedTo - on what should update todo(completed field of todo)
  const updateTodoCompletedStatus
  = async (todoId: number, changeCompletedTo: boolean) => {
    setIsLoadingTodoIds(currentIds => [...currentIds, todoId]);
    try {
      await updateTodo({ completed: changeCompletedTo }, todoId);
      setTodos(curTodos => curTodos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed: changeCompletedTo };
        }

        return todo;
      }));
    } catch {
      setIsUpdateCompletedError(true);
    }

    setIsLoadingTodoIds([]);
  };

  const toggleAllTodosStatus = () => {
    // is Any Todos With Not Completed Status?
    const toggleToCompletedStatus = todos.some(todo => !todo.completed);

    todos.forEach(todo => {
      if (toggleToCompletedStatus && todo.completed) {
        return;
      }

      if (toggleToCompletedStatus && (todo.completed === false)) {
        updateTodoCompletedStatus(todo.id, true);
      }

      if (todo.completed) {
        updateTodoCompletedStatus(todo.id, false);
      }
    });
  };

  const loadTodos = async () => {
    console.log('loadtodos()');
    setIsLoadingError(false);
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setIsLoadingError(true);
    }
  };

  const uploadNewTodo = async (title: string) => {
    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });
    setIsUploadingTitle(true);
    try {
      const newTodo = await createTodo(title);

      setTodos(curTodos => [newTodo, ...curTodos]);
    } catch (error) {
      setIsCreatingError(true);
    }

    setIsUploadingTitle(false);

    setTempTodo(null);
  };

  const deleteTodo = async (id: number) => {
    setIsLoadingTodoIds(currentIds => [...currentIds, id]);
    try {
      await destroyTodo(id);
      setTodos(curTodo => curTodo.filter(todo => todo.id !== id));
    } catch {
      setIsDeletedError(true);
    }

    setIsLoadingTodoIds([]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const closeAllWarnings = () => {
    setIsLoadingError(false);
    setIsEmptyTitleError(false);
    setIsCreatingError(false);
    setIsDeletedError(false);
    setIsUpdateCompletedError(false);
  };

  useEffect(() => {
    setTimeout(() => closeAllWarnings(), 3000);
  }, [todos, isEmptyTitleError]);

  const visibleTodos = todos.filter(todo => {
    switch (completedFilter) {
      case ('active'):
        return !todo.completed;

      case ('completed'):
        return todo.completed;

      default:
        return true;
    }
  });

  const isAnyError = isLoadingError || isCreatingError || isEmptyTitleError
    || isDeletedError || isUpdateCompletedError;
  // console.log(isLoadingError, 'isloadinerro');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          uploadNewTodo={uploadNewTodo}
          setIsEmptyTitleError={setIsEmptyTitleError}
          isUploadingTitle={isUploadingTitle}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />
        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            isLoading
            deleteTodo={deleteTodo}
            updateTodoCompleted={updateTodoCompletedStatus}
          />
        )}
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          isLoadingTodoIds={isLoadingTodoIds}
          updateTodoCompleted={updateTodoCompletedStatus}
        />
        {todos.length !== 0 && (
          <Footer
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            todos={todos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={classNames('notification', 'is-danger', 'is-light',
        'has-text-weight-normal', { hidden: !(isAnyError) })}
      >
        {isLoadingError && <p>Unable to load a todo</p>}
        {isEmptyTitleError && <p>Title can&apos;t be empty </p>}
        {isCreatingError && <p>Unable to add a todo</p>}
        {isDeletedError && <p>Unable to delete a todo</p>}
        {isUpdateCompletedError && <p>Unable to update a todo</p>}
        <button
          type="button"
          className="delete"
          onClick={closeAllWarnings}
        />
        {/* show only one message at a time */}
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
