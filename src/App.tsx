/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { TodoappHeader } from './Components/TodoappHeader';
import { TodoappList } from './Components/TodoappList';
import { TodoappFooter } from './Components/TodoappFooter';
import { Todo } from './types/Todo';
import { TodoappError } from './Components/TodoappError';
import {
  createTodo,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { Filter } from './types/Filter';

const USER_ID = 11828;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [todosError, setTodosError] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await getTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setTodosError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case Filter.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const handleDelete = async (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);

    try {
      const isTodoDelete = await deleteTodos(id);

      if (isTodoDelete) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        setTodosError('Unable to delete a todo');
      }
    } catch (e) {
      setTodosError('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleTodoAdd = async (title: string) => {
    setProcessingTodoIds(prev => [...prev, 0]);
    setTemporaryTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    try {
      const createdTodo = await createTodo(title);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setTemporaryTodo(null);
      setTodosError('Unable to add a todo');

      throw new Error('Some error');
    } finally {
      setTemporaryTodo(null);
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== 0));
    }
  };

  const updateTodo = async (todo: Todo) => {
    setProcessingTodoIds((prevTodo) => [...prevTodo, todo.id]);

    try {
      const updatedTodo = await updateTodos(todo);

      setTodos((currentTodo) => (currentTodo
        .map((prevTodo) => (prevTodo.id === updatedTodo.id
          ? updatedTodo
          : prevTodo))));
    } catch (error) {
      setTodosError('Unable to update todo');
      throw error;
    } finally {
      setProcessingTodoIds((prev) => prev.filter((id) => id !== todo.id));
    }
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    try {
      await Promise.all(todosToUpdate.map(todo => (
        updateTodo({
          ...todo,
          completed: !isAllCompleted,
        })
      )));
    } catch (error) {
      setTodosError('Unable to update todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoappHeader
          todos={visibleTodos}
          onTodoAdd={handleTodoAdd}
          onError={setTodosError}
          onAllToggle={toggleAll}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <>
            <TodoappList
              todos={visibleTodos}
              processingTodoIds={processingTodoIds}
              handleDelete={handleDelete}
              temporaryTodo={temporaryTodo}
              setTodosError={setTodosError}
              onTodoUpdate={updateTodo}
            />

            <TodoappFooter
              todos={todos}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              handleDelete={handleDelete}
            />
          </>
        )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoappError
        todosError={todosError}
        setTodosError={setTodosError}
      />
    </div>
  );
};
