import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodoContext';
import { deleteTodos, updateTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [activeTitle, setActiveTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);
  const {
    todos,
    setTodos,
    todoLoader,
    setTodoLoader,
    addErrorMessage,
    activeTodoId,
    setActiveTodoId,
  } = useContext(TodosContext);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [activeTodoId]);

  const handleDeleteTodo = (id: number) => {
    setTodoLoader(id);

    deleteTodos(id)
      .then(() => setTodos(todos.filter(curTodo => curTodo.id !== id)))
      .catch(() => addErrorMessage(ErrorMessage.UnableToDelete))
      .finally(() => setTodoLoader(null));
  };

  const handleUpdateTodos = (currentItem: Todo) => {
    const updatedTodos = [...todos];
    const todoIndex = todos.findIndex(el => el.id === currentItem.id);

    updatedTodos.splice(todoIndex, 1, currentItem);

    return updatedTodos;
  };

  const updateTodo = (item: Todo) => {
    setTodoLoader(item.id);

    updateTodos(item)
      .then(currentItem => {
        setTodos(handleUpdateTodos(currentItem));
      })
      .catch(() => {
        addErrorMessage(ErrorMessage.UnableToUpdate);
      })
      .finally(() => setTodoLoader(null));
  };

  const doubleClickEvent = () => {
    setActiveTitle(todo.title);
    setActiveTodoId(todo.id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (!activeTitle.trim()) {
      setTodoLoader(todo.id);

      deleteTodos(todo.id)
        .then(() => {
          setTodos(todos.filter(curTodo => curTodo.id !== todo.id));
          setActiveTodoId(null);
        })
        .catch(() => addErrorMessage(ErrorMessage.UnableToDelete))
        .finally(() => setTodoLoader(null));
    }

    if (todo.title !== activeTitle.trim()) {
      setTodoLoader(todo.id);

      updateTodos({ ...todo, title: activeTitle.trim() })
        .then(currentItem => {
          setTodos(handleUpdateTodos(currentItem));
          setActiveTodoId(null);
        })
        .catch(() => {
          addErrorMessage(ErrorMessage.UnableToUpdate);
        })
        .finally(() => setTodoLoader(null));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setActiveTodoId(null);
      setActiveTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>

      {activeTodoId === todo.id ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={activeTitle}
            onChange={e => setActiveTitle(e.target.value)}
            ref={titleField}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={doubleClickEvent}
          >
            {todo.title}
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

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': todoLoader === todo.id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
