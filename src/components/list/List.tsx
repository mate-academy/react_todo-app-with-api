import cn from 'classnames';
import { KeyboardEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Title {
  title: string;
}

interface Completed {
  completed: boolean;
}

type Props = {
  todoList: Todo[];
  setTodoList:(todos: Todo[]) => void,
  setError:(text: string) => void,
  processing:number[]
  removeTodo:(id: number, sortBy: 'id') => void
  editTodo:(id: number, itemToEdit: Title | Completed) => void
};

export const List: React.FC<Props> = ({
  todoList,
  processing,
  removeTodo,
  editTodo,
}) => {
  const [renameCurrentTitle, setRenameCurrentTitle] = useState<Todo | []>([]);

  const onEditTitleByKeyDown = (
    todo: Todo, e: null | KeyboardEvent<HTMLInputElement>,
  ) => {
    const previousTitle = todo.title;

    if (e?.key === 'Enter') {
      if (previousTitle === e?.target.value) {
        setRenameCurrentTitle([]);

        return;
      }

      if (e.target.value.trim()) {
        editTodo(todo.id, { title: e.target.value.trim() });
      } else {
        removeTodo(todo.id, 'id');
      }
    }
  };

  const onEditTitleByBlur = (todo: Todo, title: string) => {
    const previousTitle = todo.title;

    if (previousTitle === title) {
      setRenameCurrentTitle([]);

      return;
    }

    if (title) {
      editTodo(todo.id, { title: title.trim() });
    } else {
      removeTodo(todo.id, 'id');
    }
  };

  return (
    <section className="todoapp__main">

      { todoList.map((todo: Todo) => (
        <div
          className={cn('todo ', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => editTodo(todo.id, { completed: !todo.completed })}
            />
          </label>
          { renameCurrentTitle !== todo
            ? (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => setRenameCurrentTitle(todo)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => removeTodo(todo.id, 'id')}
                >
                  ×
                </button>
              </>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onDoubleClick={() => setRenameCurrentTitle(todo)}
                  onKeyDown={(e) => onEditTitleByKeyDown(todo, e)}
                  onBlur={(e) => onEditTitleByBlur(todo, e.target.value)}
                />
              </form>
            )}

          <div className={cn('modal overlay',
            {
              'is-active ': processing.includes(todo.id) || !todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
