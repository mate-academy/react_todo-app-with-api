import {
  Dispatch, FC, SetStateAction, useRef, useState, useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo, TodoOptimistic } from '../types/Todo';
import { deleteTodo, editTodo } from '../api/todos';

interface Props {
  todo: TodoOptimistic,
  todos: TodoOptimistic[],
  setTodos: Dispatch<SetStateAction<TodoOptimistic[]>>,
  todoTitle: string,
  setErrorMessages: Dispatch<SetStateAction<string []>>,

}

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    todos,
    setTodos,
    todoTitle,
    setErrorMessages,
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
      });
  };

  const editTodoTitleHandler = (id: number) => {
    setErrorMessages([]);

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
      .finally(() => setIsEditMode(false));
  };

  const editTodoStatusHandler = (id: number) => {
    setErrorMessages([]);

    const editedTodo: TodoOptimistic | null = todos.find(
      everyTodo => everyTodo.id === id,
    ) || null;

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
        .finally(() => setIsChecked((prev) => !prev));
    }
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditMode]);

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
          onChange={() => {
            if (todo.id) {
              editTodoStatusHandler(todo.id);
            }
          }}
        />
      </label>

      {(!isEditMode) && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditMode(true);
              if (todo.title) {
                setEditedTodoTitle(todo.title);
              }
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              if (todo.id) {
                deleteTodoHandler(todo.id);
              }
            }}
          >
            ×
          </button>
        </>
      )}

      {isEditMode && (
        <form onSubmit={(event) => {
          event.preventDefault();
          if (todo.id) {
            editTodoTitleHandler(todo.id);
          }
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
            onBlur={() => setIsEditMode(false)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todoTitle === todo.title },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
