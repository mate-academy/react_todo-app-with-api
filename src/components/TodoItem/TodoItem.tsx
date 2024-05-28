import { useState } from 'react';
import cn from 'classnames';

import { useTodosContext } from '../../context/TodosContext';

import { updateTodo } from '../../api/todos';

import { Todo } from '../../types/Todo';
import { EditForm } from './EditForm';
import { TodoLoader } from './TodoLoader';
import { Errors } from '../../types/Errors';

type TodoItemProps = {
  todo: Todo;
  deletingTodo?: (id: number) => void;
};

export const TodoItem: React.FunctionComponent<TodoItemProps> = ({
  todo,
  deletingTodo,
}) => {
  const { setTodos, setErrorMessage, setLoadingIds } = useTodosContext();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  function updatingTodo(updatedTodo: Todo) {
    setLoadingIds(prev => [...prev, updatedTodo.id]);

    setEditing(false);
    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todoForUpdate =>
            todoForUpdate.id === updatedTodo.id ? updatedTodo : todoForUpdate,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.updateError);
        setEditing(true);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  }

  function updatingAndDeleteting() {
    const normalizedEditedTitle = editedTitle.trim();
    const updatedTodo = { ...todo, title: normalizedEditedTitle };

    if (!updatedTodo.title) {
      deletingTodo?.(todo.id);

      return;
    }

    updatingTodo(updatedTodo);
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatingAndDeleteting();
  };

  const handleDeleteTodo = (todoId: number) => {
    deletingTodo?.(todoId);
  };

  const handleOnBlur = () => {
    if (editedTitle !== todo.title) {
      updatingAndDeleteting();
    } else {
      setEditing(false);
    }
  };

  const handleToggleTodoStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    updatingTodo(updatedTodo);
  };

  const handleOnEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodoStatus}
        />
      </label>

      {editing ? (
        <EditForm
          handleEditSubmit={handleEditSubmit}
          handleOnBlur={handleOnBlur}
          handleOnEscape={handleOnEscape}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          editing={editing}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo?.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <TodoLoader todo={todo} />
    </div>
  );
};
