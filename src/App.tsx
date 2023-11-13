import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';

import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { ErrorMessage } from './components/ErrorMessage';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodos,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [modifyingTodoIds, setModifyingTodoIds] = useState<Array<number>>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      throw error;
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return Filter.All;
    }
  });

  const addTodoHandler = async (title: string) => {
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await createTodo(title);

      setTodos((prevTodo) => [...prevTodo, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodoHandler = async (id: number) => {
    setErrorMessage('');

    setModifyingTodoIds((prevId) => [...prevId, id]);

    try {
      await deleteTodo(id);

      setTodos((prevTodo) => prevTodo.filter((todo) => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setModifyingTodoIds((prevId) => prevId.filter((todoId) => todoId !== id));
    }
  };

  const deleteCompletedTodos = async () => {
    const allCompleted = todos.filter((todo) => todo.completed);

    await Promise.allSettled(
      allCompleted.map((todo) => deleteTodoHandler(todo.id)),
    );
  };

  const updateTodoHandler = async (todo: Todo) => {
    setModifyingTodoIds((prevTodo) => [...prevTodo, todo.id]);

    try {
      const updatedTodo = await updateTodos(todo);

      setTodos((currTodo) => (currTodo
        .map((prevTodo) => (prevTodo.id === updatedTodo.id
          ? updatedTodo
          : prevTodo))));
    } catch (error) {
      setErrorMessage('Unable to update todo');
      throw error;
    } finally {
      setModifyingTodoIds((prev) => prev.filter((id) => id !== todo.id));
    }
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    await Promise.all(todosToUpdate.map(todo => (
      updateTodoHandler({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          onError={setErrorMessage}
          onTodoAdd={addTodoHandler}
          isActive={todos.every((todo) => todo.completed)}
          onTodoToggle={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodoHandler={deleteTodoHandler}
              tempTodo={tempTodo}
              modifyingTodoIds={modifyingTodoIds}
              onTodoUpdate={updateTodoHandler}
            />

            <TodoFilter
              todos={todos}
              onClearButtonDelete={deleteCompletedTodos}
              filterBy={filterBy}
              onFilterClick={setFilterBy}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
