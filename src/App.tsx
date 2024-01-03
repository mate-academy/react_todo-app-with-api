/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as postServise from './api/todos';
import { Errors } from './types/Errors';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Filter } from './types/Filter';
import { filterTodo } from './utils/filterFunc';

const USER_ID = 12047;

export const App: React.FC = () => {
  const [error, setError] = useState<Errors | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const filteredTodo = filterTodo(todos, filterType);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.ERRORS_EMPTY_TITLE);

      return;
    }

    setIsSubmiting(true);

    try {
      const newTodo = await postServise.createTodo({
        completed: false,
        title: title.trim(),
        userId: USER_ID,
      });

      setTodos(currentTodo => [...currentTodo, newTodo]);
      setTitle('');
    } catch (newError) {
      setError(Errors.UNABLE_ADD);
      throw newError;
    } finally {
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setIsSubmiting(false);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await postServise.deleteTodo(todoId);
    } catch (removeError) {
      setError(Errors.UNABLE_DELETE);
    }

    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  };

  const toggleTodo = async (todoId: number) => {
    const completedTodo = todos.map(todo => (
      todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : { ...todo }
    ));
    const currentTodo = completedTodo.find(complted => complted.id === todoId);

    try {
      await postServise.updateTodo({
        todo: currentTodo,
        todoId,
      });
    } catch {
      setError(Errors.UNABLE_UPDATE);
    }

    setTodos(completedTodo);
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    await Promise.all(todos.map(async (todo) => {
      try {
        await postServise.updateTodo({
          todo: { ...todo, completed: !allCompleted },
          todoId: todo.id,
        });
      } catch (updateError) {
        setError(Errors.UNABLE_UPDATE);
      }
    }));

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  const clearCompleted = () => {
    const filteredTodos = todos.filter(todo => todo.completed);

    filteredTodos.map(todo => removeTodo(todo.id));
    const clearTodo = todos.map(todo => (
      { ...todo, completed: false }
    ));

    setTodos(clearTodo);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(false);

      const currentTodo = todos.find(todo => todo.id === editingId);

      if (currentTodo) {
        try {
          const updatedTitle = event.currentTarget.value;
          const updatedTodos = todos.map(todo => {
            if (todo.id === editingId) {
              return { ...todo, title: updatedTitle };
            }

            return todo;
          });

          await postServise.updateTodo({
            todo: { ...currentTodo, title: updatedTitle },
            todoId: editingId,
          });

          setTodos(updatedTodos);
        } catch (updateError) {
          setError(Errors.UNABLE_UPDATE);
        }
      }
    }
  };

  const handleEditingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    const completedTodo = todos.map(todo => {
      if (todo.id === editingId) {
        return { ...todo, title: event.target.value };
      }

      return todo;
    });

    setTodos(completedTodo);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const todosFromServer = await postServise.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setError(Errors.UNABLE);
      }
    };

    getData();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isSubmiting={isSubmiting}
          title={title}
          handleFormSubmit={handleFormSubmit}
          inputRef={inputRef}
          handleChangeInput={handleChangeInput}
          toggleAll={toggleAll}
        />

        <TodoList
          handleBlur={handleBlur}
          handleDoubleClick={handleDoubleClick}
          handleEditingChange={handleEditingChange}
          isEditing={isEditing}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          filteredTodo={filteredTodo}
          handleKeyPress={handleKeyPress}
        />

        {!!todos.length && (
          <TodoFooter
            setFilterType={setFilterType}
            filterType={filterType}
            filteredTodo={filteredTodo}
            clearCompleted={clearCompleted}
          />
        )}
        {error && (
          <ErrorNotification setError={setError} error={error} />
        )}
      </div>
    </div>
  );
};
