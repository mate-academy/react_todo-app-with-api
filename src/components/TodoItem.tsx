/* eslint-disable */
import React, { useState, Fragment, useRef } from 'react';
import { Button } from './Button';
import { Todo } from '../types/Todo';
import { editTodo } from '../api/todos';
import { ErroMessage } from '../utils/errorMessages';

type Props = {
  todo: Todo;
  isLoading: number[];
  onDelete: (todoItem: Todo, shouldFocus: boolean) => void;
  addEditedTodos?: (editedTodo: Todo) => void;
  handleErrorMessages?: (newErrorMessage: ErroMessage) => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete = () => {},
  addEditedTodos = () => {},
  handleErrorMessages = () => {},
  setIsLoading = () => {},
}) => {
  const [editToggle, setEditToggle] = useState(false);
  const [editQuery, setEditQuery] = useState('');
  const editInputref: React.RefObject<HTMLInputElement> = useRef(null);

  const onDoubleClickHandle = () => {
    console.log('edit');
    setEditQuery(todo.title);
    setEditToggle(true);
  };
  const onEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditQuery(e.target.value.trimStart());
  };
  const onSubmitForm = async (
    todo: Todo,
    e?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (e) {
      e.preventDefault();
    }

    if (todo.title === editQuery) {
      setEditToggle(false);
      return;
    }
    const editedTodo: Todo = {
      ...todo,
      title: editQuery.trim(),
    };

    try {
      if (editQuery.length === 0) {
        onDelete(todo, false);
      }
      setIsLoading(prev => [...prev, editedTodo.id]);

      const editedTodoResponse = await editTodo<Todo>(todo.id, editedTodo);

      addEditedTodos(editedTodoResponse);
      setEditToggle(false);
    } catch {
      handleErrorMessages(ErroMessage.UPDATE);
      editInputref.current?.focus();
    } finally {
      setIsLoading(prev => prev.filter(id => id !== editedTodo.id));
    }
  };
  const onCheckboxChange = async () => {
    const editedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      setIsLoading(prev => [...prev, editedTodo.id]);

      const editedTodoResponse = await editTodo<Todo>(todo.id, editedTodo);

      addEditedTodos(editedTodoResponse);
    } catch {
      handleErrorMessages(ErroMessage.UPDATE);
    } finally {
      setIsLoading(prev => prev.filter(id => id !== editedTodo.id));
    }
  };
  const onKeyUphandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditToggle(false);
    }
  };
  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCheckboxChange()}
        />
      </label>
      {editToggle ? (
        <form onSubmit={e => onSubmitForm(todo, e)}>
          <input
            ref={editInputref}
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editQuery}
            onChange={e => onEditInputChange(e)}
            onBlur={() => {
              setEditToggle(false);
              onSubmitForm(todo);
            }}
            onKeyUp={e => onKeyUphandler(e)}
          />
        </form>
      ) : (
        <Fragment>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onDoubleClickHandle()}
          >
            {todo.title}
          </span>

          <Button
            type="button"
            className="todo__remove"
            dataCy="TodoDelete"
            onClick={() => onDelete(todo, true)}
          >
            ×
          </Button>
        </Fragment>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
