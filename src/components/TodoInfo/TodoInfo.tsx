import React, { memo, useState, useCallback } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

interface Props {
  todo: Todo;
  newTodoField?: React.RefObject<HTMLInputElement>;
  removeTodo: (todoId: number) => Promise<void>;
  isAddingTodo: boolean;
  onUpdateTodo: (todoId: number, updateData: Partial<Todo>) => Promise<void>
  selectedTodosId?: number[];
}

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  newTodoField,
  removeTodo,
  isAddingTodo,
  onUpdateTodo,
  selectedTodosId,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [changeTitle, setChangeTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleteTodo = async () => {
    setIsLoading(true);

    await removeTodo(id);

    setIsLoading(false);
  };

  const handleUpdateTodo = async (
    todoId: number,
    updateData: Partial<Todo>,
  ) => {
    await onUpdateTodo(todoId, updateData);
  };

  const cancelUpdate = useCallback(() => {
    setChangeTitle(false);
    setNewTitle(title);
  }, []);

  const changeTodoTitle = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    const normalizeTitle = newTitle.trim();

    if (normalizeTitle === todo.title) {
      cancelUpdate();

      return;
    }

    if (normalizeTitle === '') {
      handleDeleteTodo();

      return;
    }

    onUpdateTodo(
      todo.id,
      { title: normalizeTitle },
    );
    setChangeTitle(false);
  }, [newTitle]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleUpdateTodo(todo.id,
            { completed: !completed })}
        />
      </label>

      {changeTitle ? (
        <TodoTitleField
          title={newTitle}
          newTodoField={newTodoField}
          setTitle={setNewTitle}
          submitForm={changeTodoTitle}
          cancelUpdate={cancelUpdate}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setChangeTitle(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isLoading
            || isAddingTodo
            || selectedTodosId?.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
