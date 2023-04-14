import { useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  handleDelete: (todoId: number) => void,
  tempTodo: Todo | null,
  handleToggle: (todo: Todo) => void,
  updating: number,
  handleChangingTitle: (todo: Todo, title: string) => void,
};

export const ToDoList: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  tempTodo,
  handleToggle,
  updating,
  handleChangingTitle,
}) => {
  const [isRenaming, setIsRenaming] = useState(0);
  // const startRenamingTitle = useMemo(
  //   () => visibleTodos.find(todo => todo.id === isRenaming),
  //   [isRenaming],
  // );
  const renamingTodo = useMemo(
    () => visibleTodos.find(todo => todo.id === isRenaming),
    [isRenaming],
  );
  const startTitle = useMemo(
    () => (
      renamingTodo
        ? renamingTodo.title
        : ''
    ),
    [isRenaming],
  );
  const [newTitle, setNewTitle] = useState(startTitle);

  const handleRenamingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <div
          className={todo.completed ? 'todo completed' : 'todo'}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
          </label>

          {isRenaming === todo.id
            ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                handleChangingTitle(todo, newTitle);
              }}
              >
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={handleRenamingTitle}
                />
              </form>
            )
            : (
              <>
                <button
                  type="button"
                  className="todo__title"
                  onClick={(event) => {
                    if (event.detail === 2) {
                      setIsRenaming(todo.id);
                    }
                  }}
                >
                  {todo.title}
                </button>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          <div
            className={`modal overlay ${updating === todo.id && 'is-active'}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div className={tempTodo.completed ? 'todo completed' : 'todo'}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
