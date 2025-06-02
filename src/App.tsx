/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';

import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setLoading(true);

    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }

  function addTodo(newTitle: string) {
    setInputDisabled(true);
    const trimmedTitle = newTitle.trim();

    setTempTodo({
      id: 0,
      userId: postService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    const newToDo = {
      userId: postService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    postService
      .addTodo(newToDo)
      .then(addedTodo => {
        setTodos(prev => [...prev, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  function updateTodo(todoId: number, data: object) {
    setIsUpdating(todoId);

    if ('title' in data) {
      setIsEditingTitle(todoId);
    }

    postService
      .updateTodo(todoId, data)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === todoId ? { ...todo, ...data } : todo,
          ),
        );
        setIsEditingTitle(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsUpdating(null);
      });
  }

  function deleteTodo(todoId: number) {
    setIsUpdating(todoId);

    postService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsUpdating(null);
      });
  }

  function clearCompletedTodos(todoIds: number[]) {
    for (const id of todoIds) {
      deleteTodo(id);
    }
  }

  //Set focus to the input field
  useEffect(() => {
    if (inputRef.current && !inputDisabled && isEditingTitle === null) {
      inputRef.current.focus();
    }
  }, [inputDisabled, isUpdating, isEditingTitle]);

  useEffect(loadTodos, []);

  //Show error message for 3 seconds (if any)
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId); // clear if component re-renders
  }, [errorMessage]);

  //Show warning if USER_ID is not provided
  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      {loading && <div>Loading...</div>}

      {!loading && (
        <TodoList
          loading={loading}
          todos={todos}
          setSelectedStatus={setSelectedStatus}
          selectedStatus={selectedStatus}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          onDelete={deleteTodo}
          onAdd={addTodo}
          onUpdate={updateTodo}
          inputDisabled={inputDisabled}
          tempTodo={tempTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          inputRef={inputRef}
          isUpdating={isUpdating}
          clearCompletedTodos={clearCompletedTodos}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
        />
      )}
    </>
  );
};
