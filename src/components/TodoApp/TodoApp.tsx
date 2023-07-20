/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { getTodos } from '../../api/todos';
import { createTodo, deleteTodo, updateTodo } from '../../utils/workWithTodos';
import { filterTodos } from '../../utils/sortTodos';

import { Todo } from '../../types/Todo';
import { SortType } from '../../types/SortType';
import { ErrorNames } from '../../types/ErrorNames';

import { TodoAppHeader } from './TodoAppHeader/TodoAppHeader';
import { TodoAppBody } from './TodoAppBody/TodoAppBody';
import { TodoAppFooter } from './TodoAppFooter/TodoAppFooter';
import { Todo as TodoItem } from './Todo/Todo';
import { Notification } from '../Notification/Notification';

import './todoApp.scss';

type Props = {
  userId: number,
};

export const TodoApp: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState(SortType.ALL);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState(0);
  const [errorMessage, setErrorMessage] = useState(ErrorNames.None);
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(0);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage(ErrorNames.LoadingError));
  }, []);

  const handleSortTypeChange = (sortedType: SortType) => {
    setSortType(sortedType);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleFormSubmit = async (
    title: string,
  ) => {
    if (!title.trim().length) {
      setErrorMessage(ErrorNames.TitleError);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      userId,
      completed: false,
    });

    setIsInputDisabled(true);

    try {
      const createdTodo = await createTodo({ title, completed: false, userId });

      setTempTodo(null);
      setTodoTitle('');
      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage(ErrorNames.AddError);
    } finally {
      setIsInputDisabled(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setIsUpdatingTodoId(todoId);

      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorNames.DeleteError);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(currentTodo => {
      handleDeleteTodo(currentTodo.id);
    });
  };

  const handleUpdateTodo = async (
    title = '',
    todoId: number,
    completed: boolean,
  ) => {
    try {
      setIsUpdatingTodoId(todoId);

      if (!title.length) {
        handleDeleteTodo(todoId);

        return;
      }

      const updatedTodo = await updateTodo({
        title,
        completed,
        id: todoId,
        userId,
      });

      setTodos(currentTodos => {
        return currentTodos
          .map(todo => (todo.id === todoId ? updatedTodo as Todo : todo));
      });
    } catch {
      setErrorMessage(ErrorNames.UpdateError);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  const setAllTodosComplete = async () => {
    const newCompletedValue = !isCompleted;

    setIsUpdatingTodoId(todos.length);

    try {
      const updateTodoAtIndex = async (index: number) => {
        const todo = todos[index];

        if (index >= todos.length) {
          return;
        }

        await handleUpdateTodo(todo.title, todo.id, newCompletedValue);
        await updateTodoAtIndex(index + 1);
      };

      await updateTodoAtIndex(0);
    } finally {
      setIsCompleted(newCompletedValue);
      setIsUpdatingTodoId(0);
    }
  };

  const handleEditedTodoFormSubmit = async (
    title: string,
    todoId: number,
    todoCompleted: boolean,
  ) => {
    try {
      setIsUpdatingTodoId(todoId);
      await handleUpdateTodo(title, todoId, todoCompleted);
    } catch {
      setErrorMessage(ErrorNames.UpdateError);
    } finally {
      setIsBeingEdited(0);
      setIsUpdatingTodoId(0);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todoTitle={todoTitle}
          handleTodoTitleChange={handleTodoTitleChange}
          isInputDisabled={isInputDisabled}
          handleFormSubmit={handleFormSubmit}
          setAllTodosComplete={setAllTodosComplete}
          isCompleted={isCompleted}
        />

        {todos.length !== 0 && (
          <>
            <TodoAppBody
              todos={filterTodos(sortType, todos)}
              onDelete={handleDeleteTodo}
              isUpdatingTodoId={isUpdatingTodoId}
              handleUpdateTodo={handleUpdateTodo}
              isClicked={isClicked}
              setIsClicked={setIsClicked}
              isBeingEdited={isBeingEdited}
              setIsBeingEdited={setIsBeingEdited}
              handleEditedTodoFormSubmit={handleEditedTodoFormSubmit}
            />

            {tempTodo && (
              <TodoItem
                title={tempTodo.title}
                completed={tempTodo.completed}
                id={tempTodo.id}
              />
            )}

            <TodoAppFooter
              activeTodosCount={activeTodos.length}
              sortType={sortType}
              handleSortTypeChange={handleSortTypeChange}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {errorMessage !== ErrorNames.None && (
        <Notification
          errorText={errorMessage}
          setHasError={() => setErrorMessage(ErrorNames.None)}
        />
      )}
    </div>
  );
};
