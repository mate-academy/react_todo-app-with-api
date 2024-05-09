import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { TodoItemType } from '../../types/TodoItemType';
import { TodoListContext } from '../../contexts/TodoListContext';
import { TodoLoader } from '../TodoLoader/TodoLoader';

export const TodoItem: React.FC<TodoItemType> = ({ todo, tempTodo }) => {
  const { id, title, completed } = todo;
  const { deleteTodo, updateTodo } = useContext(TodoListContext);
  const [loading, setLoading] = useState(false);
  const [queryNewTodo, setQueryNewTodo] = useState(title);
  const [isEditing, setEditing] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleField?.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (tempTodo) {
      setLoading(true);
    }
  }, [tempTodo]);

  const handlerDeleteTodo = () => {
    setLoading(true);

    deleteTodo(id);
  };

  const handlerChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryNewTodo(e.target.value);
  };

  const handlerUpdateStatusTodo = () => {
    updateTodo(id, { completed: !completed });
  };

  const handlerUpdateTodo = () => {
    if (queryNewTodo === title) {
      setEditing(false);

      return;
    }

    if (queryNewTodo.trim()) {
      updateTodo(id, { title: queryNewTodo });
    } else {
      deleteTodo(id);
    }
  };

  const handlerOnBlur = () => {
    handlerUpdateTodo();

    setEditing(false);
  };

  const handlerSumbit = (e: FormEvent) => {
    e.preventDefault();

    handlerUpdateTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          onClick={handlerUpdateStatusTodo}
          id="status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handlerSumbit}>
          <input
            onBlur={handlerOnBlur}
            onChange={handlerChangeQuery}
            ref={todoTitleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={queryNewTodo}
          />
        </form>
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {title}
        </span>
      )}
      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          onClick={handlerDeleteTodo}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <TodoLoader isLoading={loading} />
    </div>
  );
};
