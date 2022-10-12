import React, {
  ChangeEvent, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Buttons } from '../../types/Enums';

type Props = {
  todo: Todo,
  removeTodo: (value: number) => void,
  setSelectedTodos: (value: number[]) => void,
  onUpdate: (todoId: number, data: Partial<Todo>) => void,
  selectedTodos: number[],
  todos: Todo[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  setSelectedTodos,
  onUpdate,
  selectedTodos,
  todos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const handleTitleUpdate = () => {
    if (!newTodoTitle) {
      removeTodo(selectedTodo);

      setIsClicked(false);

      return;
    }

    if (newTodoTitle === todo.title) {
      setIsClicked(false);

      return;
    }

    if (todos.find(element => element.title === newTodoTitle)) {
      setIsClicked(false);
    }

    onUpdate(selectedTodo, { title: newTodoTitle });
    setIsClicked(false);
    setNewTodoTitle('');
  };

  useEffect(() => {
    newTodoField.current?.focus();
  }, [selectedTodo]);

  const handleRemove = () => {
    removeTodo(todo.id);
    setSelectedTodos([todo.id]);
  };

  const handleDoubleClick = () => {
    setIsClicked(true);
    setSelectedTodo(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleBlur = () => {
    handleTitleUpdate();
    setIsClicked(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Buttons.ESC) {
      setIsClicked(false);
    }

    if (event.key === Buttons.ENTER) {
      handleTitleUpdate();
    }
  };

  const handleUpdate = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const isSelectedTodos = selectedTodos?.includes(todo.id);

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
          onClick={handleUpdate}
          defaultChecked
        />
      </label>

      {isClicked && selectedTodo === todo.id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="If your todo is empty, it will be deleted"
              onChange={event => handleTitleChange(event)}
              onBlur={handleBlur}
              onKeyDown={event => handleKeyPress(event)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleRemove}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isSelectedTodos,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
