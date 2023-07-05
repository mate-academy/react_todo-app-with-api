import {
  ChangeEvent, FocusEvent, FormEvent,
  KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[],
  filter: Filter,
  tempTodo: Todo | null,
  handleError: (error: string) => void,
  isUpdating: boolean,
  handleIsUpdating: (status: boolean) => void,
  updatingIds: number[],
  handleUpdatingIds: (ids: number[]) => void,
  handleLoadTodos: () => void,
}

export const TodoList = ({
  todos, filter, tempTodo, handleError, handleLoadTodos,
  isUpdating, handleIsUpdating, updatingIds, handleUpdatingIds,
}: TodoListProps) => {
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    handleLoadTodos();
  }, [isUpdating]);

  const titleRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.All:
        return true;
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        throw new Error('wrong filter selected');
    }
  });

  const handleCleaner = () => {
    handleIsUpdating(false);
    handleUpdatingIds([]);
  };

  const handleDelete = (id: number) => {
    handleIsUpdating(true);
    handleUpdatingIds([id]);
    deleteTodo(id)
      .then(() => handleCleaner())
      .catch(() => handleError('Unable to delete a todo'));
  };

  const handleUpdateCompleted = (id:number, completed: boolean) => {
    handleIsUpdating(true);
    handleUpdatingIds([id]);
    const updatedTodo = {
      completed: !completed,
    };

    updateTodo(id, updatedTodo)
      .then(() => handleCleaner())
      .catch(() => handleError('Unable to update a todo'));
  };

  const handleEditToto = (todo: Todo) => {
    setEditTodo(todo);
    setNewTitle(todo.title);
  };

  const handleTitleSubmit = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement, Element>,
    id: number,
  ) => {
    event.preventDefault();
    if (!newTitle.length || !editTodo) {
      handleDelete(id);

      return;
    }

    const editId = editTodo.id;
    const newTodo = {
      title: newTitle,
    };

    handleIsUpdating(true);
    handleUpdatingIds([editId]);
    setEditTodo(null);
    updateTodo(editId, newTodo)
      .then(handleCleaner)
      .catch(() => handleError('Unable to update a todo'));
  };

  const handleNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleFocus = () => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };

  useEffect(() => {
    handleFocus();
  }, [editTodo]);

  const handleEsc = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTodo(null);
    }
  };

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => {
        const {
          id, title, completed,
        } = todo;

        return (
          <div className={`todo ${completed ? 'completed' : ''}`} key={id}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                onClick={() => handleUpdateCompleted(id, completed)}
              />
            </label>

            {editTodo && editTodo.id === id
              ? (
                <form onSubmit={(event) => handleTitleSubmit(event, id)}>
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={newTitle}
                    onChange={handleNewTitle}
                    onBlur={(event) => handleTitleSubmit(event, id)}
                    onKeyUp={(key) => handleEsc(key)}
                    ref={titleRef}
                  />
                </form>
              )
              : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={() => handleEditToto(todo)}
                  >
                    {title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => handleDelete(id)}
                  >
                    ×
                  </button>
                </>
              )}

            <div className={`modal overlay ${isUpdating && updatingIds.includes(id) ? 'is-active' : ''}`}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
