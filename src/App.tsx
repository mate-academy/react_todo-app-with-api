/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TempToDo } from './components/TempToDo';
import { Footer } from './components/Footer';
import { ToDoItem } from './components/ToDoItem';

export const App: React.FC = () => {
  // #region loadToDOs
  const [todos, setToDos] = useState<Todo[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempToDo, setTempToDo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    postService
      .getTodos(USER_ID)
      .then(setToDos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const filteredToDos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });
  // #endregion
  // #region add, delete
  const addToDo = async (newTodo: Todo) => {
    setErrorMessage('');
    setTempToDo({
      id: 0,
      title: newTodo.title,
      completed: newTodo.completed,
      userId: newTodo.userId,
    });

    try {
      const createdTodo = await postService.createTodo({
        title: newTodo.title,
        completed: newTodo.completed,
        userId: newTodo.userId,
      });

      setToDos(currentTodos => [...currentTodos, createdTodo]);
      setTempToDo(null);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTempToDo(null);
      throw error;
    } finally {
      setLoadingTodoId(null);
    }
  };

  const deleteToDo = async (todoId: number) => {
    setErrorMessage('');
    setLoadingTodoId(todoId);

    try {
      await postService.deleteTodo(todoId);

      setToDos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setLoadingTodoId(null);
    }
  };

  const deleteCompletedToDos = async () =>
    Promise.all(
      todos.filter(todo => todo.completed).map(todo => deleteToDo(todo.id)),
    );

  const updateTodo = async (todoId: number, updatedFields: Partial<Todo>) => {
    setLoadingTodoId(todoId);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        setErrorMessage('Todo not found');
        throw new Error(errorMessage);
      }

      const isUnchanged = Object.entries(updatedFields).every(
        ([key, value]) => todoToUpdate[key as keyof Todo] === value,
      );

      if (isUnchanged) {
        return;
      }

      const updatedTodo = await postService.updateTodo({
        ...todoToUpdate,
        ...updatedFields,
      });

      setToDos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setLoadingTodoId(null);
    }
  };

  const allCompleted = todos.every(todo => todo.completed);

  const toggleAllTodos = async () => {
    const newStatus = !allCompleted;

    try {
      await Promise.all(
        todos.map(todo => {
          return todo.completed !== newStatus
            ? updateTodo(todo.id, { completed: newStatus })
            : Promise.resolve();
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to toggle all todos');
    }
  };

  // #endregion

  if (!USER_ID) {
    setErrorMessage('User ID is not defined');

    return;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toggleAll={toggleAllTodos}
          addToDo={addToDo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          todos={todos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredToDos.map(todo => (
            <ToDoItem
              key={todo.id}
              todo={todo}
              deleteToDo={deleteToDo}
              updateTodo={updateTodo}
              loadingToDoId={loadingTodoId}
              isEditing={editingTodoId === todo.id}
              setIsEditing={isEditing =>
                setEditingTodoId(isEditing ? todo.id : null)
              }
            />
          ))}

          <TempToDo tempToDo={tempToDo} />
        </section>

        <Footer
          todos={todos}
          setFilter={setFilter}
          deleteCompletedToDos={deleteCompletedToDos}
          filter={filter}
        />
      </div>

      {/* Error notification */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
