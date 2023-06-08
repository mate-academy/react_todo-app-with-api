import {
  ChangeEvent, FormEvent, useEffect, useState,
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

  // const titleRef = useRef();

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

  const handleTitleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!newTitle.length || !editTodo) {
      handleError('Title can\'t be empty');

      return;
    }

    const newTodo = {
      title: newTitle,
    };

    handleIsUpdating(true);
    handleUpdatingIds([editTodo.id]);
    updateTodo(editTodo.id, newTodo)
      .then(handleCleaner)
      .then(() => setEditTodo(null))
      .catch(() => handleError('Unable to update a todo'));
  };

  const handleNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  // const handleFocus = () => {
  //   titleRef.current.focus();
  // };

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
                checked={completed}
                onClick={() => handleUpdateCompleted(id, completed)}
              />
            </label>

            {editTodo && editTodo.id === id
              ? (
                <form onSubmit={handleTitleSubmit}>
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder={todo.title}
                    value={newTitle}
                    onChange={handleNewTitle}
                    onBlur={handleTitleSubmit}
                    // onFocus={handleFocus}
                    // ref={titleRef}
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

            {/* overlay will cover the todo while it is being updated */}
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

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
