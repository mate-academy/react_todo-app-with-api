import classNames from 'classnames';
import { FC, memo } from 'react';
import { Todo } from '../types/Todo';
import { FormToChangeTitle } from './FormToChangeTitle';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  selectedTodoId: number;
  isLoading: boolean;
  openForm: boolean;
  handleChangeTodoTitle: (newTitle: string, oldtitle: string) => void;
  handleChangeComplition: (todoId: number, isCompleted: boolean) => void;
  handleDoubleClick:(todoId: number) => void;
  closeInput: () => void;
  loadedTodosIds: number[],
}

export const TodosList: FC<Props> = memo((props) => {
  const {
    todos,
    onDelete,
    selectedTodoId,
    isLoading,
    openForm,
    closeInput,
    handleChangeTodoTitle,
    handleChangeComplition,
    handleDoubleClick,
    loadedTodosIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          // eslint-disable-next-line quote-props
          className={classNames('todo', { 'completed': todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                handleChangeComplition(todo.id, todo.completed);
              }}
            />
          </label>

          {openForm && selectedTodoId === todo.id
            ? (
              <FormToChangeTitle
                prevTitle={todo.title}
                handleTitleChange={handleChangeTodoTitle}
                closeInput={closeInput}
              />
            )
            : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                role="button"
                onDoubleClick={() => {
                  handleDoubleClick(todo.id);
                }}
                aria-hidden="true"
              >
                {todo.title}
              </span>
            )}

          {((isLoading && selectedTodoId === todo.id)
            || loadedTodosIds.includes(todo.id))
            && (
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}

          {!openForm && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          )}

        </div>
      ))}
    </section>
  );
});
