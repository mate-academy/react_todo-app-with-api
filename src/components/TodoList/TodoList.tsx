import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
// import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todosLength: number;
  visibleTodos: Todo[];
  tempTodo: Todo | null;

  loadingIds: number[];

  editingId: number | null;
  editedTitle: string;
  isCancelling: boolean;

  editInputRef: React.RefObject<HTMLInputElement>;

  setEditedTitle: (value: string) => void;
  setEditingId: (id: number | null) => void;
  setIsCancelling: (value: boolean) => void;

  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onRename: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todosLength,
  visibleTodos,
  tempTodo,
  loadingIds,
  editingId,
  editedTitle,
  isCancelling,
  editInputRef,
  setEditedTitle,
  setEditingId,
  setIsCancelling,
  onToggle,
  onDelete,
  onRename,
}) => {
  return (
    (todosLength > 0 || tempTodo) && (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          <div>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                in={true}
                timeout={300}
                classNames="item"
                unmountOnExit
              >
                <TodoItem
                  todo={todo}
                  loading={loadingIds.includes(todo.id)}
                  editingId={editingId}
                  editedTitle={editedTitle}
                  isCancelling={isCancelling}
                  editInputRef={editInputRef}
                  setEditedTitle={setEditedTitle}
                  setEditingId={setEditingId}
                  setIsCancelling={setIsCancelling}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onRename={onRename}
                />
                {/* <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      aria-label="Todo status"
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      // readOnly
                      onChange={() => handleToggle(todo)}
                      disabled={loadingIds.includes(todo.id)}
                    />
                  </label>
                  {editingId === todo.id ? (
                    <form
                      onSubmit={async event => {
                        event.preventDefault();

                        await handleRename(todo);
                      }}
                    >
                      <input
                        ref={editInputRef}
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={editedTitle}
                        // autoFocus
                        onChange={e => setEditedTitle(e.target.value)}
                        onBlur={() => {
                          if (isCancelling) {
                            setIsCancelling(false);

                            return;
                          }

                          handleRename(todo);
                        }}
                        onKeyUp={event => {
                          if (event.key === 'Escape') {
                            setIsCancelling(true);
                            setEditingId(null);
                          }
                        }}
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => {
                          setEditingId(todo.id);
                          setEditedTitle(todo.title);
                        }}
                      >
                        {todo.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => handleDelete(todo.id)}
                      >
                        ×
                      </button>
                    </>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      loadingIds.includes(todo.id) ? 'is-active' : ''
                    }`}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div> */}
              </CSSTransition>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    aria-label="Todo status"
                    type="checkbox"
                    className="todo__status"
                    disabled
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button type="button" className="todo__remove" disabled>
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </div>
        </TransitionGroup>
      </section>
    )
  );
};
