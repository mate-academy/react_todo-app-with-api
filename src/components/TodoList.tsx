import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { LoadedTodo } from '../types/LoadedTodo';
import { ChangedTodo } from '../types/ChangedTodo';

type Props = {
  todos: Todo[],
  onTodoRemove: (id: number) => void,
  onTodoChange: (id: number, data: ChangedTodo) => void,
  todoLoaded: LoadedTodo,
  setTodoLoaded: React.Dispatch<React.SetStateAction<LoadedTodo>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoRemove,
  onTodoChange,
  todoLoaded,
  setTodoLoaded,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isTodoEdit, setIsTodoEdit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [currentTodo, setCurrentTodo] = useState(0);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setIsTodoEdit(false);
      }
    });
  }, [isTodoEdit]);

  function editTodo(id: number, title: string, status: boolean) {
    setIsTodoEdit(false);

    if (newTitle === '') {
      setTimeout(() => onTodoRemove(id), 1000);

      return;
    }

    onTodoChange(id, { title: newTitle, completed: status });
    setNewTitle(title);
  }

  const handleTodoStatusInputClick = (
    id: number, title: string, status: boolean,
  ) => {
    setTodoLoaded({ todoId: id, loaded: false });

    if (newTitle === '' && isTodoEdit) {
      setTimeout(() => onTodoRemove(id), 1000);

      return;
    }

    onTodoChange(id, { title, completed: !status });
  };

  const handleEditTodoInputBlur = (
    id: number, title: string, status: boolean,
  ) => {
    editTodo(id, title, status);
  };

  const handleEditTodoInputKeyPress = (
    e: React.KeyboardEvent, id: number, title: string, status: boolean,
  ) => {
    if (e.key !== 'Enter') {
      return;
    }

    editTodo(id, title, status);
  };

  const handleTodoTitleSpanDoubleClick = (id: number, title: string) => {
    setIsTodoEdit(true);
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
                handleTodoStatusInputClick(todo.id, todo.title, todo.completed);
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
                 handleEditTodoInputBlur(todo.id, todo.title, todo.completed);
               }}
               onKeyPress={(e) => {
                 handleEditTodoInputKeyPress(
                   e, todo.id, todo.title, todo.completed,
                 );
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
