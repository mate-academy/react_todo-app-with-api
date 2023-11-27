/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { getTodos, updateTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | number>(false);
  const [todosError, setTodosError] = useState(ErrorMessage.Default);
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId] = useState<Array<number>>([]);
  const [filteredTodos, setFilTodos] = useState<Todo[]>([]);
  const [newTodoLoad, setNewTodoLoad] = useState(-1);
  const [processDelete, setProcDelete] = useState(false);
  const [updatedTodos, setUpdatedTodos] = useState(false);

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
    } catch (error) {
      setTodosError(ErrorMessage.UnableToLoadTodos);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTodosError(ErrorMessage.Default);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [todosError, setTodosError]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setFilTodos(todos);
  }, [todos]);

  useEffect(() => {
    const newTodos = todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    });

    setFilTodos(newTodos);
  }, [todos, filter]);

  useEffect(() => {
    setTimeout(() => {
      setNewTodoLoad(-1);
    }, 3000);
  }, [newTodoLoad]);

  const handleUpdate = async (todo: Todo) => {
    setProcessingTodoId(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, todo);

      setTodos(prev => prev.map(prevTodo => (
        prevTodo.id === updatedTodo.id
          ? updatedTodo
          : prevTodo
      )));
    } catch (error) {
      setTodosError(ErrorMessage.UnableToUpdateTodo);

      throw new Error();
    } finally {
      setProcessingTodoId(prev => prev.filter(id => id !== todo.id));
    }
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    await Promise.all(todosToUpdate.map(todo => (
      handleUpdate({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={filteredTodos}
          todo={todos}
          setTodos={setTodos}
          setTodosError={setTodosError}
          tempTodos={tempTodos}
          setTempTodos={setTempTodos}
          onTodoToggle={toggleAll}
          setIsLoading={setIsLoading}
          setNewTodoLoad={setNewTodoLoad}
          updatedTodos={updatedTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {
            filteredTodos.map(todo => (
              <TodoItem
                todo={todo}
                key={todo.id}
                todos={filteredTodos}
                setTodos={setTodos}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setTodosError={setTodosError}
                onTodoUpdate={handleUpdate}
                isNew={todo.id === newTodoLoad}
                isDeleting={(todo.completed && processDelete) && true}
                processingTodoId={processingTodoId}
                setUpdatedTodos={setUpdatedTodos}
              />
            ))
          }
          {tempTodos && (
            <TodoItem
              todo={tempTodos}
              todos={filteredTodos}
              setTodos={setTodos}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setTodosError={setTodosError}
              onTodoUpdate={handleUpdate}
              isNew={(tempTodos.id === newTodoLoad) && true}
              isDeleting={(tempTodos.completed && processDelete) && true}
              processingTodoId={processingTodoId}
              setUpdatedTodos={setUpdatedTodos}
            />
          )}

        </section>

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            todosArray={todos}
            setFilter={setFilter}
            filter={filter}
            setTodos={setTodos}
            setTodosError={setTodosError}
            setIsLoading={setIsLoading}
            setProcDelete={setProcDelete}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !todosError },
        )}
      >
        {/* eslint-disable jsx-a11y/control-has-associated-label  */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setTodosError(ErrorMessage.Default);
          }}
        />
        {todosError}
      </div>
    </div>
  );
};
