import React, { useRef, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../utils/todos';
import { Loader } from '../Loader';

type Props = {
  todo: Todo,
  setError?: (value: string) => void,
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>,
  setSelectedTodoId?: (value: number) => void,
  isActive: boolean;
  isDobleClick?: boolean,
  isEditing?: boolean,
  setIsEditing?: (value: boolean) => void,
  setInputId?: (value: number) => void,
  setIsHiddenClass?: (value: boolean) => void,
  setIsDisable?: (value: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setError = () => {},
  setTodos = () => {},
  setSelectedTodoId = () => {},
  isActive,
  isDobleClick,
  isEditing,
  setIsEditing = () => {},
  setInputId = () => {},
  setIsHiddenClass = () => {},
  setIsDisable = () => {},
}) => {
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = async (todoId: number) => {
    setIsDisable(true);
    try {
      setSelectedTodoId(todoId);
      const isTodoDelete = await deleteTodo(todoId);

      if (!isTodoDelete) {
        setTodos((prevTodos: Todo[]) => prevTodos.map((t) => {
          if (t.id === todoId) {
            return { ...t, completed: false };
          }

          return t;
        }));

        setError('Unable to delete a todo');
        setIsHiddenClass(false);
      } else {
        setTodos((prevTodos: Todo[]) => prevTodos.filter(t => t.id !== todoId));
      }
    } catch (error) {
      setError('Unable to delete a todo');
      setIsHiddenClass(false);
    } finally {
      setSelectedTodoId(0);
      setIsEditing(false);
      setIsDisable(false);
    }
  };

  const handleToggleTodo = async (selectedTodo: Todo) => {
    setSelectedTodoId(selectedTodo.id);
    const newTodo = {
      id: selectedTodo.id,
      title: selectedTodo.title,
      completed: !selectedTodo.completed,
      userId: selectedTodo.userId,
    };

    try {
      await updateTodo(newTodo);

      setTodos(prev => prev.map(prevTodo => (
        prevTodo.id === newTodo.id
          ? newTodo
          : prevTodo
      )));
    } catch {
      setError('Unable to update a todo');
      setIsHiddenClass(false);
    } finally {
      setSelectedTodoId(0);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const editTodoOnServer = async (selectedTodo: Todo) => {
    const preparedTitle = editedTitle.trim();

    const newTodo = {
      id: selectedTodo.id,
      title: preparedTitle,
      completed: selectedTodo.completed,
      userId: selectedTodo.userId,
    };

    if (selectedTodo.title === newTodo.title) {
      setIsEditing(false);

      return;
    }

    if (newTodo.title === '') {
      setIsEditing(true);
      handleDeleteTodo(selectedTodo.id);
    }

    try {
      setSelectedTodoId(selectedTodo.id);
      await updateTodo(newTodo);
      setTodos(prev => {
        const prevTodos = [...prev];
        const index = prevTodos.findIndex(t => t.id === newTodo.id);

        prevTodos.splice(index, 1, newTodo);

        return prevTodos;
      });
      setIsEditing(false);
    } catch {
      setError('Unable to update a todo');
      setIsHiddenClass(false);
      setIsEditing(true);
    } finally {
      setEditedTitle('');
      setSelectedTodoId(0);
    }
  };

  const handleEditTodo = (event
  : React.FormEvent<HTMLFormElement>, selectedTodo: Todo) => {
    event.preventDefault();
    editTodoOnServer(selectedTodo);
  };

  const handleOnBlur = (selectedTodo: Todo) => {
    setIsEditing(false);
    editTodoOnServer(selectedTodo);
  };

  const handleDoubleClick = (selectedTodo: Todo) => {
    setIsEditing(true);
    setInputId(selectedTodo.id);
    setEditedTitle(selectedTodo.title);
  };

  return (
    isEditing && isDobleClick ? (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <Loader
          isActive={isActive}
        />

        <form
          onSubmit={(event) => handleEditTodo(event, todo)}
        >
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={() => handleOnBlur(todo)}
            onKeyUp={handleKeyUp}
          />
        </form>
      </div>
    ) : (
      <div
        data-cy="Todo"
        className={`todo item-enter-done ${todo.completed && 'completed'}`}
        onDoubleClick={() => handleDoubleClick(todo)}
      >
        <Loader
          isActive={isActive}
        />
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            readOnly
            checked={todo.completed}
            onClick={() => handleToggleTodo(todo)}
          />
        </label>

        <span
          data-cy="TodoTitle"
          className="todo__title"

        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>

      </div>
    )

  );
};
