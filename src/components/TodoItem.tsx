/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<unknown>;
  updateTodo: (newTodo: Todo) => Promise<Todo>;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, updateTodo,
}) => {
  const [editValue, setEditValue] = useState(todo.title);
  const [editingTodoId, setEditingTodoId] = useState(0);
  const [loading, setLoading] = useState(false); // Track loading state
  const inputRef = useRef<HTMLInputElement>(null);

  const { todos, setTodos, USER_ID } = useContext(TodosContext);

  useEffect(() => {
    if (editingTodoId === todo.id) {
      inputRef.current?.focus();
    }
  }, [editingTodoId, todo.id]);

  const updateTitle = (newTitle: string) => {
    setLoading(true);

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id)
        .then(() => {
          const newTodos = todos.filter((t) => t.id !== todo.id);

          setTodos(newTodos);
          setEditingTodoId(0);
          setLoading(false);
        });
    } else {
      const newTodo: Todo = {
        id: todo.id,
        title: trimmedTitle,
        userId: USER_ID,
        completed: todo.completed,
      };

      const newTodos = [...todos];
      const index = newTodos.findIndex(
        currentTodo => currentTodo.id === newTodo.id,
      );

      newTodos.splice(index, 1, newTodo);
      updateTodo(newTodo).then(() => {
        setTodos(newTodos);
        setEditingTodoId(0);
        setLoading(false);
      });
    }
  };

  const updatedComplete = () => {
    setLoading(true);

    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    };

    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => (
      currentTodo.id === newTodo.id
    ));

    newTodos.splice(index, 1, newTodo);

    updateTodo(newTodo)
      .then(() => setTodos(newTodos))
      .finally(() => setLoading(false));
  };

  const handlePressKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      updateTitle(editValue.trim());
    } else if (event.key === 'Escape') {
      setEditValue(todo.title.trim());
      setEditingTodoId(0);
    }
  };

  const handleOnBlueEditValue = () => {
    const trimmedTitle = editValue.trim();

    if (trimmedTitle !== todo.title) {
      updateTitle(trimmedTitle);
    } else {
      setEditValue(todo.title.trim());
      setEditingTodoId(0);
    }
  };

  const handleChangeEditValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditValue(event.target.value);
  };

  const handleDeleteValue = () => {
    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => currentTodo.id === todo.id);

    newTodos.splice(index, 1);

    deleteTodo(todo.id)
      .then(() => setTodos(newTodos));
  };

  const handleDoubleClick = () => {
    setEditingTodoId(todo.id);
    setEditValue(todo.title.trim());
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed },
        { editind: editingTodoId === todo.id })}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${todo.id}`}
          onChange={updatedComplete}
          checked={todo.completed}
        />
      </label>

      {editingTodoId !== todo.id ? (
        <>
          <label data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </label>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteValue}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={handleChangeEditValue}
            onBlur={handleOnBlueEditValue}
            ref={inputRef}
            onKeyDown={handlePressKey}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { active: loading })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
