import {
  Dispatch, FC, LegacyRef, SetStateAction, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, editTodo } from '../api/todos';

interface Props {
  todo: Todo,
  todos: Todo[],
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
}

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    todos,
    newTodoField,
    setTodos,
  } = props;

  const [editedTodoTitle, setEditedTodoTitle] = useState(todo.title);
  const [isChecked, setIsChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const onEdit = (editedTodo: Todo) => {
    setTodos((prevTodos: Todo[]) => prevTodos.map(
      (prevtodo) => (prevtodo.id === editedTodo.id ? editedTodo : prevtodo),
    ));
  };

  const onDelete = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter(prevTodo => prevTodo.id !== id));
  };

  const editTodoTitleHandler = (id: number) => {
    if (!editedTodoTitle.length) {
      onDelete(id);

      return;
    }

    editTodo(id, {
      title: editedTodoTitle,
    })
      .then(onEdit)
      .finally(() => setIsEditMode(false));
  };

  const editTodoStatusHandler = (id: number) => {
    const editedTodo: Todo | null = todos.find(
      everyTodo => everyTodo.id === id,
    ) || null;

    if (editedTodo) {
      editTodo(id, {
        completed: !editedTodo.completed,
      })
        .then(onEdit)
        .finally(() => setIsChecked((prev) => !prev));
    }
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id)
      .then(responce => {
        if (responce) {
          onDelete(id);
        }
      });
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

      {!isEditMode && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditMode(true);
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
            onChange={
              (event) => setEditedTodoTitle(event.target.value)
            }
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { isLoading: 'is-active' },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
