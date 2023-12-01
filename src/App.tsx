import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

import { ErrorOnPage } from './components/ErrorOnPage';

import { FilterBy } from './utils/FilterBy';
import { Todo } from './types/Todo';
import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './todos';

import { getFilteredTodos } from './utils/NewfilterTodos';

import { ErrorMessages } from './types/ErrorNessages';
import { client } from './utils/fetchClient';

const USER_ID = 1333;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newError, setNewError] = useState<ErrorMessages | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteTodosId, setDeleteTodosId] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isTodoShow = todos.length > 0;

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setNewError(ErrorMessages.LoadError);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const deleteTodo = async (todoId: number) => {
    try {
      setDeleteTodosId((prev) => [...prev, todoId]);

      const removeNewTodo = await removeTodo(todoId);

      if (!removeNewTodo) {
        setNewError(ErrorMessages.DeleteError);

        return;
      }

      setTodos((prev) => {
        const filterPrev = prev.filter((todo) => todo.id !== todoId);

        return [...filterPrev];
      });
    } catch (error) {
      setNewError(ErrorMessages.DeleteError);
    } finally {
      setDeleteTodosId([]);
    }
  };

  const filterTodos = useMemo(() => {
    return getFilteredTodos(todos, filterBy);
  }, [todos, filterBy]);

  const clearTodoTitle = () => {
    setNewTodoTitle('');
  };

  const addNewTodo = async (title: string): Promise<null | Todo> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setNewError(ErrorMessages.TitleError);

      return null;
    }

    try {
      const newTodoStr = {
        completed: false,
        title: trimmedTitle,
        userId: USER_ID,
      };

      const newTodo = await createTodo(newTodoStr);

      clearTodoTitle();

      setTodos((prev) => [...prev, newTodo]);

      return newTodo;
    } catch (error) {
      setNewError(ErrorMessages.TitleError);

      return null;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const updateTodoItem = async (todoId: number, updatedTodo: Todo) => {
    const trimmedTitle = updatedTodo.title.trim();

    if (!trimmedTitle) {
      setNewError(ErrorMessages.TitleError);

      return;
    }

    try {
      setNewError(null);
      await client.patch<Todo>(`/todos/${todoId}`, {
        ...updatedTodo,
        title: trimmedTitle,
      });

      setTodos(prevTodos => prevTodos.map(
        todo => (todo.id === todoId ? updatedTodo : todo)
        ));
    } catch (error) {
      setNewError(ErrorMessages.UpdateError);
    }
  };

  const handleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updateTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updateTodos);
  };

  const handleCheckBox = async (updateNewTodo: Todo): Promise<void> => {
    try {
      const newTodo = {
        ...updateNewTodo,
        completed: !updateNewTodo.completed,
      };

      await updateTodo(newTodo);

      setTodos((current) => current
        .map((todo) => (todo.id === newTodo.id ? newTodo : todo)));
    } catch (error) {
      setNewError(ErrorMessages.TitleError);
    }
  };

  const removeCompletTodos = async (todoIds: number[]) => {
    try {
      const deletePromises = todoIds.map((todoId) => deleteTodo(todoId));

      await Promise.all(deletePromises);
    } catch (error) {
      setNewError(ErrorMessages.DeleteError);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isTodoShow={isTodoShow}
          newTodoTitle={newTodoTitle}
          handleNewTodoTitle={handleInputChange}
          addNewTodo={addNewTodo}
          checkAllTodos={handleAll}
        />

        {isLoading
          ? (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          ) : (
            <section className="todoapp__main">
              <TodoList
                todos={filterTodos}
                deleteId={deleteTodosId}
                deleteTodo={deleteTodo}
                editTodo={updateTodoItem}
                checkedTodo={handleCheckBox}
              />
            </section>
          )}

        <TodoFooter
          todos={todos}
          filterBy={filterBy}
          filterTodos={setFilterBy}
          deleteTodo={removeCompletTodos}
        />

        {newError && (
          <ErrorOnPage
            isError={newError}
            setNewError={setNewError}
          />
        )}
      </div>
    </div>
  );
};
