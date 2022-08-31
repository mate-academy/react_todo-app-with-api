import { FC, memo } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { PatchForm } from './PatchForm';

interface Props {
  filtredTodos: Todo[],
  openPachForm: boolean,
  isLoaded: boolean,
  selectId: number,
  loadTodoId: number[],
  handelCreateTodo: (title: string) => void,
  handlerUpdateTitle: (newTitle: string, titleBefore: string) => void,
  closeInput: () => void,
  handleChange: (todoID: number, completedTodo: boolean) => void,
  handelDoubleClick: (todoId: number) => void,
  handelDeleteTodo: (todoId: number) => Promise<void>,
}

export const TodosList: FC<Props> = memo((props) => {
  const {
    filtredTodos,
    closeInput,
    handlerUpdateTitle,
    handleChange,
    openPachForm,
    selectId,
    isLoaded,
    loadTodoId,
    handelDoubleClick,
    handelDeleteTodo,
  } = props;

  return (
    <>
      { filtredTodos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={
            cn('todo',
              { completed: todo.completed })
          }
        >

          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleChange(todo.id, todo.completed)}
            />
          </label>

          {openPachForm && selectId === todo.id
            ? (
              <PatchForm
                titleBefore={todo.title}
                handlerUpdateTitle={handlerUpdateTitle}
                closeInput={closeInput}
              />
            )
            : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                role="button"
                onDoubleClick={
                  () => handelDoubleClick(todo.id)
                }
                tabIndex={0}
                aria-hidden="true"
              >
                {todo.title}
              </span>
            )}

          {((isLoaded
          && selectId === todo.id) || loadTodoId.includes(todo.id))
          && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}

          {!openPachForm && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handelDeleteTodo(todo.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </>
  );
});
