import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  USER_ID: number;
  setFocusedInput: (arg: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setErrorMessage,
  USER_ID,
  setFocusedInput,
}) => {
  const [editing, setEditing] = useState(false);
  const [currentIdToLoading, setCurrentIdToLoading]
    = useState<number | null>(null);
  const [todoTitle, setTodoTitle] = useState(todo.title.trim());

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && editing) {
      titleField.current.focus();
    }
  }, [editing]);

  function getTodoById(todoId: number): Todo | null {
    return todos.find((item: Todo) => item.id === todoId) || null;
  }

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setCurrentIdToLoading(todoId);
    setFocusedInput(false);

    deleteTodo(todoId)
      .then(() => {
        const updatedTodos = todos.filter(item => item.id !== todoId);

        setTodos(updatedTodos);
        setEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setCurrentIdToLoading(null);

        setFocusedInput(true);
      })
      .finally(() => {
        setCurrentIdToLoading(null);
        setFocusedInput(true);
      });
  };

  const handleTitleSubmit = async (PressedKey: string) => {
    if (PressedKey !== 'Enter' && PressedKey !== 'Escape') {
      return;
    }

    if (currentIdToLoading !== null) {
      return;
    }

    const todoToUpdate = getTodoById(todo.id);

    if (!todoToUpdate) {
      return;
    }

    if (PressedKey === 'Escape') {
      setTodoTitle(todoToUpdate.title);
      setEditing(false);

      return;
    }

    if (PressedKey === 'Enter') {
      if (todoTitle.trim() === '') {
        handleDelete(todo.id);

        return;
      }

      if (todoTitle.trim() === todo.title.trim()) {
        setEditing(false);

        return;
      }

      setCurrentIdToLoading(todo.id);
      setErrorMessage('');

      try {
        const updatedTodo = await updateTodo({
          id: todo.id,
          userId: USER_ID,
          title: todoTitle.trim(),
          completed: todo.completed,
        });

        setTodos(todos.map(
          item => (item.id === updatedTodo.id ? updatedTodo : item),
        ));
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      } finally {
        setCurrentIdToLoading(null);
        setEditing(false);
      }
    }
  };

  const handleTitleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event?.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      handleTitleSubmit(e.key);
    }
  };

  const handleBlur = async () => {
    if (editing) {
      await handleTitleSubmit('Enter');
      setEditing(false);
    }
  };

  const handleCheckboxClick = () => {
    setErrorMessage('');
    setCurrentIdToLoading(todo.id);

    updateTodo({
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: !todo.completed,
    })
      .then(newTodo => {
        setTodos(todos.map(item => {
          if (item.id === newTodo.id) {
            return {
              ...item,
              completed: !item.completed,
            };
          }

          return item;
        }));
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setCurrentIdToLoading(null);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}

    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheckboxClick}
        />
      </label>

      {!editing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleField}
            value={todoTitle}
            onChange={handleTitleEditing}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay', { 'is-active': currentIdToLoading === todo.id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
