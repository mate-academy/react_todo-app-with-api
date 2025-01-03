/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { TodoError } from '../types/types';
import { updatePost } from '../api/todos';
import { Todo } from './Todo';

interface Props {
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  filteredTodos: TodoType[] | undefined;
  deletedTodoId: number[] | null;
  tempTodo: TodoType | null;
  setErrors: (error: TodoError) => void;
  handleDelete: (id: number) => Promise<boolean>;
  defaultTempTodo: TodoType;
  activeChangeId: number | null;
  setActiveChangeId: (id: number) => void;
  loaderId: number[];
  updateStatus: (todo: TodoType) => void;
  loseFocus: (id: number) => void;
  editedTodo: string;
  setEditedTodo: (title: string) => void;
  setLoaderId: (id: number[]) => void;
}

export const TodoList: React.FC<Props> = ({
  setTodos,
  filteredTodos,
  deletedTodoId,
  setActiveChangeId,
  activeChangeId,
  setErrors,
  tempTodo,
  handleDelete,
  defaultTempTodo,
  loaderId,
  updateStatus,
  loseFocus,
  editedTodo,
  setEditedTodo,
  setLoaderId,
}) => {
  const edit = async (todo: TodoType) => {
    if (!editedTodo) {
      try {
        const deleteSuccessful = await handleDelete(todo.id);

        if (deleteSuccessful) {
          setTodos(prev => prev.filter(el => el.id !== todo.id));
        }
      } catch {
        await setActiveChangeId(todo.id);
        setEditedTodo(editedTodo);
        setErrors(TodoError.DeleteError);
        setTimeout(() => {
          setErrors('' as TodoError);
        }, 3000);
      }

      return;
    }

    if (editedTodo === todo.title) {
      loseFocus(0);

      return;
    }

    try {
      setLoaderId([todo.id]);
      await updatePost({ ...todo, title: editedTodo.trim() });
      loseFocus(0);
      setTodos(prevTodos =>
        prevTodos.map(prevTodo =>
          prevTodo.id === todo.id
            ? { ...prevTodo, title: editedTodo.trim() }
            : prevTodo,
        ),
      );
    } catch {
      setActiveChangeId(todo.id);
      setEditedTodo(editedTodo);
      setErrors(TodoError.UpdateError);
      setTimeout(() => {
        setErrors('' as TodoError);
      }, 3000);
    } finally {
      setLoaderId([]);
    }
  };

  const handleEdit = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: TodoType,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      edit(todo);
    }

    if (event.key === 'Escape') {
      setActiveChangeId(0);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          deletedTodoId={deletedTodoId}
          setActiveChangeId={setActiveChangeId}
          activeChangeId={activeChangeId}
          handleDelete={handleDelete}
          loaderId={loaderId}
          updateStatus={updateStatus}
          editedTodo={editedTodo}
          setEditedTodo={setEditedTodo}
          handleEdit={handleEdit}
          edit={edit}
        />
      ))}

      {Boolean(tempTodo) && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {defaultTempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
