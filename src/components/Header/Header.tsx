import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import * as todoService from '../../api/todos';
import { USER_ID } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    titleField,
    tempTodo,
  } = useContext(TodoContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allTodosAreCompleted = todos.every(task => task.completed === true);

  useEffect(() => {
    if ((titleField && titleField.current) || !tempTodo) {
      titleField.current?.focus();
    }
  }, [titleField, tempTodo]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const correctTitle = newTodoTitle.trim();
    const emptyTitle = correctTitle.length <= 0;

    if (correctTitle && !emptyTitle) {
      setIsSubmitting(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: correctTitle,
        completed: false,
      });

      todoService
        .createTodo({
          userId: USER_ID,
          title: correctTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage(Errors.AddError);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
        });
    } else {
      setErrorMessage(Errors.EmptyTitle);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const getTododsToUpdate = (tasks: Todo[]) => {
    const hasSomeActiveTodos = tasks.some(t => t.completed === false);

    if (hasSomeActiveTodos) {
      return todos.filter(t => t.completed === false);
    }

    return todos;
  };

  const changeAllTodosStatus = () => {
    const todosToUpdate = getTododsToUpdate(todos);

    todosToUpdate.forEach(currentTodo => {
      todoService
        .updateTodo({ ...currentTodo, completed: !currentTodo.completed })
        .then(updatedTodo => {
          setTodos(prevtodos =>
            prevtodos.map(task =>
              task.id === updatedTodo.id ? updatedTodo : task,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(Errors.UpdateError);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggleAllButton"
          onClick={changeAllTodosStatus}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={newTodoTitle}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
