import cn from 'classnames';
import { memo, useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  todo: Todo;
  temporary?: boolean,
  isDeleting?: boolean,
  todoForDeleltingIds?: number[],
  deleteTodo?: (todoId: number) => Promise<void>,
  isUpdating?: boolean,
  newTodoField?: React.RefObject<HTMLInputElement>,
  updateTodo?: (todoId: number, newTodoData: Partial<Todo>) => Promise<void>,
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    temporary = false,
    isDeleting,
    todoForDeleltingIds,
    isUpdating,
    newTodoField,
    deleteTodo = () => { },
    updateTodo = () => { },
  } = props;

  const [newTitle, setNewTitle] = useState(todo.title);
  const [isTitleChanged, setIsTitleChanged] = useState(false);

  const cancelEditing = useCallback(() => {
    setIsTitleChanged(false);
    setNewTitle(todo.title);
  }, []);

  const changeTodoTitle = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (normalizedTitle === '') {
      deleteTodo(todo.id);

      return;
    }

    updateTodo(
      todo.id,
      { title: normalizedTitle },
    );

    setIsTitleChanged(false);
  }, [newTitle]);

  const isLoading = temporary
    || ((isDeleting || isUpdating)
      && todoForDeleltingIds?.includes(todo.id));

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => updateTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isTitleChanged ? (
        <NewTodoField
          title={newTitle}
          className="todo__title-field"
          newTodoField={newTodoField}
          changeInput={setNewTitle}
          submitForm={changeTodoTitle}
          cancelEditing={cancelEditing}
        />
      ) : (
        <>
          {/* eslint-disable-next-line max-len */}
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTitleChanged(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {isLoading && <Loader />}
    </div>
  );
});
