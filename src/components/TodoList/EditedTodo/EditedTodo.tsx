import React, { FormEventHandler, KeyboardEventHandler } from 'react';
import classNames from 'classnames';
import { Todo } from '../../../types/Todo';
import { useTodosProvider } from '../../../providers/TodosContext';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type EditedTodoProps = {
  todo: Todo;
};

export const EditedTodo: React.FC<EditedTodoProps> = (
  { todo }: EditedTodoProps,
) => {
  const {
    toggleCompleted,
    editedTodoId,
    updateTitle,
    updatedTitle,
    handleEscape,
    updateTitleHandler,
    doubleClickHandler,
    isFocusedEditForm,
  } = useTodosProvider();

  const { id, completed } = todo;

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    if (editedTodoId !== null) {
      updateTitle(editedTodoId);
    }
  };

  const handlePressedKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleEscape();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        // eslint-disable-next-line
        completed: completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          title="checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompleted(id)}
        />
      </label>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={updatedTitle}
          onChange={(event) => updateTitleHandler(event.target.value)}
          onDoubleClick={() => doubleClickHandler(id)}
          onKeyUp={handlePressedKey}
          onBlur={handleSubmit}
          ref={(input) => isFocusedEditForm && input && input.focus()}
        />
      </form>
      <TodoLoader todo={todo} />
    </div>
  );
};
