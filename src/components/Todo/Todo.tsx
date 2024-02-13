import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo as TodoInterface } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

interface Props {
  title: string,
  id: number,
  completed: boolean,
  handleDelete: (todoId: number) => void,
  selectedTodos: number[],
  onClick: (
    todoId: number,
    { completed }: Pick<TodoInterface, 'completed'>,
  ) => void
  editTodoTitle: (n: number) => void,
  editableTodo: TodoInterface | null,
  setEditableTodo: React.Dispatch<React.SetStateAction<TodoInterface | null>>,
  handleError: (err: Errors) => void,
  setSelectedTodos: React.Dispatch<React.SetStateAction<number[]>>,
  setTodos: React.Dispatch<React.SetStateAction<TodoInterface[]>>,
}

export const Todo: React.FC<Props> = ({
  title,
  id = 0,
  completed,
  handleDelete,
  selectedTodos,
  onClick,
  editTodoTitle,
  editableTodo,
  setEditableTodo,
  handleError,
  setSelectedTodos,
  setTodos,
}) => {
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [newTodoName, setNewTodoName] = useState('');

  const updateCurrentTodo = async (
    chosenTodo: TodoInterface,
    newTitle: string,
  ) => {
    if (!newTitle && editableTodo) {
      try {
        setSelectedTodos(prevTodosIds => [...prevTodosIds, editableTodo.id]);

        deleteTodo(editableTodo.id);

        setSelectedTodos(prevTodosIds => prevTodosIds
          .filter(prevId => prevId !== editableTodo.id));
      } catch (err) {
        handleError(Errors.UnableToDelete);
      } finally {
        setSelectedTodos(prevTodosIds => prevTodosIds
          .filter(prevId => prevId !== editableTodo.id));

        setEditableTodo(null);
      }

      return;
    }

    try {
      setSelectedTodos(prev => [...prev, chosenTodo.id]);

      await updateTodo(
        chosenTodo.id,
        { title: newTitle },
      );

      setTodos(prevTodos => prevTodos.map(prevTodo => ({
        ...prevTodo,
        title: prevTodo.id === chosenTodo.id
          ? newTodoName
          : prevTodo.title,
      })));

      setEditableTodo(null);
    } catch (err) {
      setTodos(prevTodos => prevTodos.map(prevTodo => ({
        ...prevTodo,
        title: prevTodo.id === chosenTodo.id
          ? chosenTodo.title
          : prevTodo.title,
      })));

      handleError(Errors.UnableToUpdate);
    } finally {
      setSelectedTodos(prev => prev
        .filter(todoId => todoId !== chosenTodo.id));

      setEditableTodo(null);
    }
  };

  const handleTitleEditingComplete = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editableTodo) {
      handleError(Errors.UnableToUpdate);

      return;
    }

    if (title === newTodoName) {
      return;
    }

    updateCurrentTodo(editableTodo, newTodoName);
  };

  const handleOnBlur = async (
  ) => {
    if (!editableTodo) {
      handleError(Errors.UnableToUpdate);

      return;
    }

    if (editableTodo.title === newTodoName) {
      setEditableTodo(null);

      return;
    }

    updateCurrentTodo(editableTodo, newTodoName);
  };

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onClick(id, { completed })}
        />
      </label>

      {
        editableTodo && editableTodo.id === id
          ? (
            <form
              onSubmit={handleTitleEditingComplete}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTodoName}
                ref={todoTitleField}
                onChange={(e) => setNewTodoName(e.target.value)}
                onBlur={handleOnBlur}
              />
            </form>
          )
          : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                editTodoTitle(id);
                setNewTodoName(title);
              }}
            >
              {title}
            </span>
          )
      }

      {!editableTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === 0 || selectedTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
