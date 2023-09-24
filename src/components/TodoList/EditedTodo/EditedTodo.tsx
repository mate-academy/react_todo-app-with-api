import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../../types/Todo';
import { useTodosProvider } from '../../../providers/TodosContext';

type EditedTodoProps = {
  todo: Todo,
};

export const EditedTodo: React.FC<EditedTodoProps> = ({ todo }) => {
  const {
    toggleCompleted, editedTodoId, updateTitle, updatedTitle, handleEscape,
    updateTitleHandler, handleDoubleClick, isFocusedEditForm,
  } = useTodosProvider();

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (editedTodoId !== null) {
      updateTitle(editedTodoId);
    }
  };

  const handlePressedKey: React.KeyboardEventHandler<HTMLInputElement>
      = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();

          handleEscape();
        }
      };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo.id)}
        />
      </label>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={updatedTitle}
          onChange={
            (event) => updateTitleHandler(event.target.value)
          }
          onDoubleClick={() => handleDoubleClick(todo.id)}
          onKeyUp={handlePressedKey}
          onBlur={handleSubmit}
          ref={input => isFocusedEditForm && input && input.focus()}
        />
      </form>
      <TodoLoader todo={todo} />
    </div>
  );
};
