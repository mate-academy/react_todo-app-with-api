import {
  Dispatch, FC, SetStateAction, useRef, useState, useEffect, KeyboardEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, editTodo } from '../api/todos';

interface Props {
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  selectedTodoIds: number[],
  setSelectedTodoIds: Dispatch<React.SetStateAction<number[]>>,
}

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    todos,
    setTodos,
    setErrorMessages,
    selectedTodoIds,
    setSelectedTodoIds,
  } = props;

  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const onEdit = (editedTodo: Todo) => {
    setTodos((prevTodos) => prevTodos.map(
      (prevtodo) => (prevtodo.id === editedTodo.id ? editedTodo : prevtodo),
    ));
  };

  const onDelete = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter(prevTodo => prevTodo.id !== id));
  };

  const deleteTodoHandler = (id: number) => {
    setErrorMessages([]);
    setSelectedTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(responce => {
        if (responce) {
          onDelete(id);
        }
      })
      .catch(() => {
        setErrorMessages(
          (prev: string []) => [...prev, 'Unable to delete a todo'],
        );
      })
      .finally(() => {
        setSelectedTodoIds(prev => prev.filter(prevId => prevId !== id));
      });
  };

  const editTodoTitleHandler = (id: number) => {
    setErrorMessages([]);
    setSelectedTodoIds(prev => [...prev, id]);

    if (!editedTodoTitle?.trim().length) {
      deleteTodoHandler(id);

      return;
    }

    editTodo(id, {
      title: editedTodoTitle,
    })
      .then(onEdit)
      .catch(() => {
        setErrorMessages(
          (prev: string []) => [...prev, 'Unable to update a todo'],
        );
      })
      .finally(() => {
        setIsEditMode(false);
        setSelectedTodoIds(prev => prev.filter(prevId => prevId !== id));
      });
  };

  const editTodoStatusHandler = (id: number) => {
    setErrorMessages([]);
    setSelectedTodoIds(prev => [...prev, id]);

    const editedTodo = todos.find(everyTodo => everyTodo.id === id);

    if (editedTodo) {
      editTodo(id, {
        completed: !editedTodo.completed,
      })
        .then(onEdit)
        .catch(() => {
          setErrorMessages(
            (prev: string []) => [...prev, 'Unable to update a todo'],
          );
        })
        .finally(() => {
          setIsChecked((prev) => !prev);
          setSelectedTodoIds(prev => prev.filter(prevId => prevId !== id));
        });
    }
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditMode]);

  const escapeEditMode = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditMode(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={() => editTodoStatusHandler(todo.id)}
        />
      </label>

      {(!isEditMode) && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditMode(true);
              setEditedTodoTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodoHandler(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {isEditMode && (
        <form onSubmit={(event) => {
          event.preventDefault();
          editTodoTitleHandler(todo.id);
        }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={newTodoField}
            value={editedTodoTitle}
            onChange={(event) => {
              setEditedTodoTitle(event.target.value);
            }}
            onBlur={() => {
              setIsEditMode(false);
              editTodoTitleHandler(todo.id);
            }}
            onKeyDown={event => escapeEditMode(event)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': selectedTodoIds.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
