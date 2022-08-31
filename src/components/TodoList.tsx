import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { LoadedTodo } from '../types/LoadedTodo';

type Props = {
  todos: Todo[],
  onTodoRemove: (id: number) => void,
  onTodoChange: (id: number, data: any) => void,
  todoLoaded: LoadedTodo,
  setTodoLoaded: ({ todoId: number, loaded }: LoadedTodo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoRemove,
  onTodoChange,
  todoLoaded,
  setTodoLoaded,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isTodoEdit, setTodoEdit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [currentTodo, setCurrentTodo] = useState(0);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [currentTodo]);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setTodoEdit(false);
    }
  });

  function editTodo(id: number, title: string) {
    setTodoEdit(false);

    if (newTitle === '') {
      setTimeout(() => onTodoRemove(id), 1000);

      return;
    }

    onTodoChange(id, { title: newTitle });
    setNewTitle(title);
  }

  const handleTodoStatusInputClick = (id: number, status: boolean) => {
    setTodoLoaded({ todoId: id, loaded: false });

    if (newTitle === '' && isTodoEdit) {
      setTimeout(() => onTodoRemove(id), 1000);

      return;
    }

    onTodoChange(id, { completed: !status });
  };

  const handleEditTodoInputBlur = (id: number, title: string) => {
    editTodo(id, title);
  };

  const handleEditTodoInputKeyPress = (
    e: React.KeyboardEvent, id: number, title: string,
  ) => {
    if (e.key !== 'Enter') {
      return;
    }

    editTodo(id, title);
  };

  const handleTodoTitleSpanDoubleClick = (id: number, title: string) => {
    setTodoEdit(true);
    setCurrentTodo(id);
    setNewTitle(title.trim());
  };

  const handleRemoveBtnClick = (id: number) => {
    setTodoLoaded({ todoId: id, loaded: false });
    onTodoRemove(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
          key={todo.id}
        >
          <label
            className="todo__status-label"
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onClick={() => {
                handleTodoStatusInputClick(todo.id, todo.completed);
              }}

            />
          </label>

          {(isTodoEdit && todo.id === currentTodo)
         && (
           <form
             onSubmit={(e) => {
               e.preventDefault();
             }}
           >
             <input
               name="EditTodo"
               type="text"
               ref={newTodoField}
               className="todoapp__new-todo todoapp__new-todo-edit"
               placeholder={
                 newTitle
                   ? ''
                   : 'Empty todo will be deleted'
               }
               value={newTitle}
               onChange={(e) => {
                 setNewTitle(e.target.value);
               }}
               onBlur={() => {
                 handleEditTodoInputBlur(todo.id, todo.title);
               }}
               onKeyPress={(e) => {
                 handleEditTodoInputKeyPress(e, todo.id, todo.title);
               }}
             />
           </form>
         )}

          {(!isTodoEdit || todo.id !== currentTodo)
          && (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  handleTodoTitleSpanDoubleClick(todo.id, todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => {
                  handleRemoveBtnClick(todo.id);
                }}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              {
                'is-active':
                  todo.id === todoLoaded.todoId && !todoLoaded.loaded,
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
