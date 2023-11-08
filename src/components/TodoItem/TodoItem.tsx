import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessages';
import { TodosContext } from '../TodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  item: Todo,
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const {
    setTodos,
    setErrorMessage,
    setErrorWithTimeout,
  } = useContext(TodosContext);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);

  const editTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTitleField.current && isEdited) {
      editTitleField.current.focus();
    }
  }, [isEdited]);

  const handleDeleteButton = (todoId: string) => {
    setIsWaiting(true);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== +todoId));
      })
      .catch(() => {
        setErrorWithTimeout(ErrorMessage.Deleting, setErrorMessage);
      })
      .finally(() => setIsWaiting(false));
  };

  const handleTodoUpdate = (todo: Todo, updatedTitle?: string) => {
    setIsWaiting(true);

    let updatedTodo: Todo;

    if (updatedTitle) {
      updatedTodo = {
        ...todo,
        title: updatedTitle.trim(),
      };
    } else {
      updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };
    }

    return updateTodo(todo.id.toString(), updatedTodo)
      .then(() => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(responseTodo => responseTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
        setIsEdited(false);
      })
      .catch(() => {
        setErrorWithTimeout(ErrorMessage.Updating, setErrorMessage);
      })
      .finally(() => setIsWaiting(false));
  };

  const handleInputBlur = (todo: Todo) => {
    if (newTitle.trim() !== '' && newTitle !== todo.title) {
      handleTodoUpdate(todo, newTitle);
    }

    if (newTitle === '') {
      handleDeleteButton(todo.id.toString());
    }

    if (newTitle === todo.title) {
      setIsEdited(false);
    }
  };

  const handleInputKeyEvents = (
    todo: Todo,
    event?: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event) {
      if (event.key === 'Enter') {
        handleInputBlur(todo);
      }

      if (event.key === 'Escape') {
        setIsEdited(false);
        setNewTitle(todo.title);
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: item.completed })}
      onDoubleClick={() => setIsEdited(true)}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={item.completed}
          onChange={() => handleTodoUpdate(item)}
        />
      </label>

      {isEdited
        ? (
          <input
            ref={editTitleField}
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyUp={(event) => handleInputKeyEvents(item, event)}
            onBlur={() => handleInputBlur(item)}
          />
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {item.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteButton(item.id.toString())}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isWaiting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
