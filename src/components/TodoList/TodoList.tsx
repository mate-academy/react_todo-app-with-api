import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[];
  allTodos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setErrorMessage: (a: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  allTodos,
  setTodos,
  setAllTodos,
  setErrorMessage,
}) => {
  const [editingId, setEditingId] = useState<number>();
  const [editingTitle, setEditingTitle] = useState<string>('');

  useEffect(() => {
    setTodos(todos);
  }, []);

  const handleChecked = async (id: number | undefined) => {
    const updatedTodos = allTodos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };

        client.patch(`/todos/${id}`, updatedTodo)
          .catch(error => {
            setErrorMessage('Unable to update todo completion status');
            // eslint-disable-next-line no-console
            console.error('An error occurred:', error);
          });

        return updatedTodo;
      }

      return todo;
    });

    setTodos(updatedTodos);
    setAllTodos(updatedTodos);
  };

  const handleRemoveTodo = async (id: number | undefined) => {
    try {
      await client.delete(`/todos/${id}`);
      setTodos((prevTodos: Todo[]) => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete todos');
    }
  };

  const handleDoubleClick = (id: number | undefined, newTitle: string) => {
    setEditingId(id);
    setEditingTitle(newTitle);
  };

  const handleSaveEdit = async (id: number | undefined) => {
    if (!editingTitle.trim()) {
      return;
    }

    if (id) {
      try {
        const updatedTodo
          = { ...todos.find(todo => todo.id === id), title: editingTitle };

        await client.patch(`/todos/${id}`, updatedTodo);

        const updatedTodos
          = todos.map(todo => (todo.id === id ? updatedTodo : todo));

        setTodos(updatedTodos);
      } catch (error) {
        setErrorMessage('Unable to update todo');
      } finally {
        setEditingId(undefined);
        setEditingTitle('');
      }
    }
  };

  return (
    <div>
      {todos.map(todo => {
        const { id, title, completed } = todo;
        const isBeingEdited = editingId === id;

        return (
          <div
            className={classNames('todo', {
              completed,
              editing: isBeingEdited,
            })}
            key={id}
          >
            {isBeingEdited ? (
              <input
                className="todo__edit-todo"
                type="text"
                value={editingTitle}
                onChange={event => setEditingTitle(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    handleSaveEdit(id);
                  }
                }}
                onBlur={() => setEditingId(undefined)}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            ) : (
              <>
                <label className="todo__status-label" htmlFor={`toggle-view-${id}`}>
                  <input
                    type="checkbox"
                    className="todo__status"
                    id={`toggle-view-${id}`}
                    checked={completed}
                    onChange={() => handleChecked(id)}
                  />
                </label>

                <span
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleRemoveTodo(id)}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
