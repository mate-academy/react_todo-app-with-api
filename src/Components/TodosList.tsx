import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

import { ErrorType } from '../types/ErrorType';

type ListOfTodos = {
  todos: Todo[],
  updateTodoStatus: (todo: Todo) => void,
  onDeleteTodo: (todo: Todo) => void,
  loadingIds: number[],
  tempTodo: Todo | null,
  updateTodoOnServer: (id: number, todo: Todo) => Promise<Todo>,
  updateLoadingStatus: (id: number[]) => void,
  updateTodosList: (updatedTodos: Todo[]) => void;
  updateError: (error: ErrorType) => void,
};

export const TodosList: React.FC<ListOfTodos> = ({
  todos,
  updateTodoStatus,
  onDeleteTodo,
  loadingIds,
  tempTodo,
  updateTodoOnServer,
  updateLoadingStatus,
  updateTodosList,
  updateError,
}) => {
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [newTitleEdit, setNewTitleEdit] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handlechangeEdit = (
    event: React.ChangeEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    setNewTitleEdit(event.currentTarget.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoToEdit]);

  useEffect(() => {
    if (todoToEdit) {
      setNewTitleEdit(todoToEdit.title);
    }
  }, [todoToEdit]);

  const handleUpdateTodoOnServer = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setTodoToEdit(null);
    }

    if ((event.key === 'Enter' || event.type === 'blur')) {
      event.preventDefault();
      if (newTitleEdit.trim() !== '' && todoToEdit) {
        if (newTitleEdit === todoToEdit.title) {
          setTodoToEdit(null);

          return;
        }

        const prevTodosList = structuredClone(todos);
        const updatedTodo = {
          ...todoToEdit,
          title: newTitleEdit,
        };

        const updatedTodos = todos.map(todo => {
          if (todo.id === todoToEdit.id) {
            return updatedTodo;
          }

          return todo;
        });

        updateTodosList(updatedTodos);

        updateLoadingStatus([todoToEdit.id]);
        setTodoToEdit(null);

        try {
          const updatedTodoFromServer: Todo = await updateTodoOnServer(
            todoToEdit.id, updatedTodo,
          );

          updateTodosList([...todos].map(todo => {
            if (todo.id === updatedTodoFromServer.id) {
              return updatedTodoFromServer;
            }

            return todo;
          }));
        } catch {
          updateError(ErrorType.update);
          updateTodosList(prevTodosList);
        } finally {
          updateLoadingStatus([]);
        }
      } else if (todoToEdit) {
        try {
          onDeleteTodo(todoToEdit);
        } catch {
          updateError(ErrorType.delete);
        }
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleUpdateTodoOnServer(
      event as unknown as React.KeyboardEvent<HTMLInputElement>,
    );
  };

  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <li
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => updateTodoStatus(todo)}
            />
          </label>

          {todoToEdit?.id === todo.id ? (
            <form>
              <input
                ref={inputRef}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitleEdit}
                onDoubleClick={() => setTodoToEdit(todo)}
                onChange={handlechangeEdit}
                onKeyDown={handleUpdateTodoOnServer}
                onBlur={handleBlur}
              />
            </form>
          ) : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => setTodoToEdit(todo)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => onDeleteTodo(todo)}
              >
                ×
              </button>
            </>
          )}

          <div
            className={classNames(
              'modal',
              'overlay',
              {
                'is-active': tempTodo?.id === todo.id
                  || loadingIds.some(id => todo.id === id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </li>
      ))}

    </ul>
  );
};
