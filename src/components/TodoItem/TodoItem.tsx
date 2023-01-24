import cn from 'classnames';
import {
  FC,
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';
import { LoadedUser } from '../../todoContext';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteItem: (todoId: number) => void
  onChangeTodo: (todoId: number, ...params: any) => void
  selectedTodo: number,
  setSelectedTodo: React.Dispatch<React.SetStateAction<number>>;
}

export const TodoItem: FC<Props> = memo(
  ({
    todo,
    onDeleteItem,
    onChangeTodo,
    selectedTodo,
    setSelectedTodo,
  }) => {
    const isLoadedUser = useContext(LoadedUser);
    const isSelectedTodo = todo.id === selectedTodo;
    const [newTitle, setNewTitle] = useState('');

    const clearSelectedTodo = useCallback(
      () => {
        setSelectedTodo(0);
      }, [],
    );

    const handleDoubleClick = useCallback((todoId: number) => {
      setNewTitle(todo.title);

      if (isSelectedTodo) {
        clearSelectedTodo();
      } else {
        setSelectedTodo(todoId);
      }
    }, [isSelectedTodo, todo.title, setSelectedTodo]);

    const handleSubmitForm = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newTitle) {
          onChangeTodo(todo.id, { title: newTitle });
          clearSelectedTodo();
        }
      }, [newTitle, onChangeTodo, todo.title, todo.id],
    );

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo', { completed: todo.completed },
        )}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked
            onClick={() => {
              onChangeTodo(todo.id, { completed: !todo.completed });
            }}
          />
        </label>

        {isSelectedTodo
          ? (
            <form onSubmit={handleSubmitForm}>
              <input
                data-cy="TodoTitleField"
                type="text"
                value={newTitle}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                onChange={(event) => setNewTitle(event.target.value)}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onDeleteItem(todo.id)}
              >
                ×
              </button>
            </>
          )}

        <div
          data-cy="TodoLoader"
          // className="modal overlay"
          className={cn('modal overlay', {
            'is-active': isLoadedUser,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
