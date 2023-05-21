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
import { ErrorType } from './types/ErrorTypes';
import { UpdateDataTodo } from './types/UpdateDataTodo';

type IsCompleted = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedFilter, setCompletedFilter] = useState<IsCompleted>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUploadingTitle, setIsUploadingTitle] = useState(false);
  const [isLoadingTodoIds, setIsLoadingTodoIds] = useState<number[]>([]);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [errors, setErrors] = useState<ErrorType[]>([]);

  const addError = (error: ErrorType) => {
    setErrors(currentErrors => [error, ...currentErrors]);
    setTimeout(() => {
      setErrors(currentErrors => currentErrors
        .filter(filterError => filterError !== error));
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      addError(ErrorType.LOADED);
    }
  };

  const updateTodoRequest
  = async (todoId: number, data: UpdateDataTodo) => {
    setIsLoadingTodoIds(currentIds => [...currentIds, todoId]);
    try {
      await updateTodo(data, todoId);
      setTodos(curTodos => curTodos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      addError(ErrorType.UPDATED);
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
        updateTodoRequest(todo.id, { completed: true });
      }

      if (todo.completed) {
        updateTodoRequest(todo.id, { completed: false });
      }
    });
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
      addError(ErrorType.CREATED);
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
      addError(ErrorType.DELETED);
    }

    setIsLoadingTodoIds([]);
  };

  const clearAllCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const updateTitle = (title: string, todoId: number) => {
    if (title === '') {
      deleteTodo(todoId);

      return;
    }

    updateTodoRequest(todoId, { title });
  };

  useEffect(() => {
    loadTodos();
  }, []);
  useEffect(() => {
    const isAllTodosCompleted = !todos.some(todo => !todo.completed);

    setIsAllCompleted(isAllTodosCompleted);
  }, [todos]);

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          uploadNewTodo={uploadNewTodo}
          addError={addError}
          isUploadingTitle={isUploadingTitle}
          toggleAllTodosStatus={toggleAllTodosStatus}
          isAllCompleted={isAllCompleted}
        />
        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            isLoading
            deleteTodo={deleteTodo}
            updateTodoCompleted={updateTodoRequest}
            updateTitle={updateTitle}
          />
        )}
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          isLoadingTodoIds={isLoadingTodoIds}
          updateTodoCompleted={updateTodoRequest}
          updateTitle={updateTitle}
        />
        {todos.length !== 0 && (
          <Footer
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            todos={todos}
            clearAllCompletedTodos={clearAllCompletedTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div className={classNames('notification', 'is-danger', 'is-light',
        'has-text-weight-normal', { hidden: !(errors.length) })}
      >
        {errors.includes(ErrorType.LOADED) && <p>Unable to load a todo</p>}
        {errors.includes(ErrorType.EMPTYTITLE)
         && <p>Title can&apos;t be empty </p>}
        {errors.includes(ErrorType.CREATED) && <p>Unable to add a todo</p>}
        {errors.includes(ErrorType.DELETED) && <p>Unable to delete a todo</p>}
        {errors.includes(ErrorType.UPDATED) && <p>Unable to update a todo</p>}
        <button
          type="button"
          className="delete"
          onClick={() => setErrors([])}
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
