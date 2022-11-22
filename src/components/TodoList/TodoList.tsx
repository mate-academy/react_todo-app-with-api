import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todos: Todo[];
  onDelete(arg0: number): void;
  loaderForTodo: number[];
  isAdding: boolean;
  temporaryTodoTitle: string;
  onChangeCompleting(arg0: Todo, arg1: boolean): void;
  onChangingTitle(arg0: Todo, arg1: string): void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  loaderForTodo,
  isAdding,
  temporaryTodoTitle,
  onChangeCompleting,
  onChangingTitle,
}) => {
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [isRenamingTodoID, setIsRenamingTodoID] = useState<number | null>(null);
  const [changedTodoTitle, setChangedTodoTitle] = useState('');

  const toggleCompleting = async (todo: Todo) => {
    if (todo.completed) {
      onChangeCompleting(todo, false);
    } else {
      onChangeCompleting(todo, true);
    }
  };

  const activateTitleField = (todo: Todo) => {
    setIsRenamingTodoID(todo.id);
    setChangedTodoTitle(todo.title);
  };

  const cancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsRenamingTodoID(null);
    }
  };

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isRenamingTodoID]);

  const handleSubmitTodoTitleField = async (
    todo: Todo, event: React.FormEvent,
  ) => {
    event.preventDefault();
    setIsRenamingTodoID(null);

    if (!changedTodoTitle || !/\S/.test(changedTodoTitle)) {
      onDelete(todo.id);

      return;
    }

    if (todo.title !== changedTodoTitle) {
      onChangingTitle(todo, changedTodoTitle);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
              onClick={() => toggleCompleting(todo)}
            />
          </label>

          {isRenamingTodoID === todo.id ? (
            <form
              onSubmit={(e) => handleSubmitTodoTitleField(todo, e)}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                value={changedTodoTitle}
                onChange={
                  e => setChangedTodoTitle(e.target.value)
                }
                className="todo__title-field"
                onBlur={(e) => handleSubmitTodoTitleField(todo, e)}
                onKeyDown={cancelEditing}
                ref={todoTitleField}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => activateTitleField(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onDelete(todo.id)}
              >
                ×
              </button>
            </>
          )}

          {loaderForTodo.includes(todo.id) && <Loader />}
        </div>
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {temporaryTodoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <Loader />
        </div>
      )}
    </section>
  );
});
