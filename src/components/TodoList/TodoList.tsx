/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TemporaryTodo } from '../TemporaryTodo/TemporaryTodo';

type Props = {
  updateTitle: (title: string, todoId: number) => void,
  removeTodo: (todoId: number) => void,
  tempTodo: unknown,
  todoTitle: string,
  todos: Todo[],
  processingTodoIds: number[],
  toggleClick: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  updateTitle,
  removeTodo,
  tempTodo,
  todoTitle,
  todos,
  processingTodoIds,
  toggleClick,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number>(0);
  const [editingTitle, setEditingTitle] = useState('');

  const inputReference = useRef<HTMLInputElement>(null);

  const stopEditing = () => {
    setEditingTodoId(0);
    setEditingTitle('');
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
    todoId: number,
  ) => {
    event.preventDefault();

    if (!editingTitle) {
      removeTodo(todoId);
      stopEditing();

      return;
    }

    if (title !== editingTitle) {
      updateTitle(editingTitle, editingTodoId);
    }

    stopEditing();
  };

  useEffect(() => {
    if (editingTodoId) {
      inputReference.current?.focus();
    }
  }, [editingTodoId]);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              title="status"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => toggleClick(todo)}
            />
          </label>

          {editingTodoId === todo.id ? (
            <form
              onSubmit={(event) => handleSubmit(event, todo.title, todo.id)}
              onBlur={(event) => handleSubmit(event, todo.title, todo.id)}
            >
              <label>
                <input
                  type="text"
                  ref={inputReference}
                  className="todo__title-field"
                  value={editingTitle}
                  placeholder="Empty title will be deleted"
                  onChange={(event) => setEditingTitle(event.target.value)}
                  onKeyUp={(event) => {
                    if (event.key === 'Escape') {
                      stopEditing();
                    }
                  }}
                />
              </label>
            </form>

          ) : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => {
                  setEditingTodoId(todo.id);
                  setEditingTitle(todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => removeTodo(todo.id)}
              >
                x
              </button>
            </>
          )}

          <div className={classNames(
            'modal overlay',
            { 'is-active': processingTodoIds.includes(todo.id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo !== null && <TemporaryTodo title={todoTitle} />}
    </section>
  );
};
