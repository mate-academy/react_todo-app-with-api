import cn from 'classnames';
import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { editTodo, removeTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodoFromTodos: (v: number) => void;
  changeCompletedTodoById: (v: number) => void;
  setErrorMessage:(v: string) => void;
  changeTodoTitleById:(v: Todo) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  removeTodoFromTodos,
  changeCompletedTodoById,
  setErrorMessage,
  changeTodoTitleById,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  useEffect(() => {
    if (todo.loading === undefined) {
      setIsLoading(false);
    } else {
      setIsLoading(todo.loading);
    }
  }, [todo]);

  const deleteReqById = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        removeTodoFromTodos(todoId);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteTodoHandler = (todoId: number) => {
    setIsLoading(true);
    setErrorMessage('');

    deleteReqById(todoId);
  };

  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElement.current && editMode) {
      inputElement.current.focus();
    }
  }, [editMode]);

  const changeCompleteHandler = () => {
    setIsLoading(true);
    setErrorMessage('');
    const newTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    editTodo(newTodo)
      .then(() => changeCompletedTodoById(todo.id))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const saveNewTodoTitle = () => {
    editTodo({ ...todo, title: newTodoTitle.trim() })
      .then(() => {
        changeTodoTitleById(
          {
            ...todo,
            title: newTodoTitle.trim(),
          },
        );
        setNewTodoTitle(newTodoTitle.trim());
        setEditMode(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setIsLoading(false);
      });
  };

  const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keys = ['Enter', 'Escape'];

    if (!keys.includes(e.key)) {
      return;
    }

    if (e.key === 'Enter' && newTodoTitle === todo.title) {
      setEditMode(false);
    }

    setIsLoading(true);

    if (e.key === 'Enter' && newTodoTitle.trim() === '') {
      // console.log('need delete todo');
      deleteReqById(todo.id);
      // removeTodoFromTodos(todo.id);
    } else if (e.key === 'Enter') {
      saveNewTodoTitle();
    } else if (e.key === 'Escape') {
      setNewTodoTitle(todo.title);
      setEditMode(false);
      setIsLoading(false);
    }
  };

  const onBlurHandler = () => {
    if (newTodoTitle === '') {
      deleteReqById(todo.id);
    }

    if (newTodoTitle !== todo.title) {
      saveNewTodoTitle();
    }

    setEditMode(false);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      onDoubleClick={() => setEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={changeCompleteHandler}
        />
      </label>

      {editMode ? (
        // EDIT MODE
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputElement}
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            onKeyUp={e => onKeyUpHandler(e)}
            onBlur={onBlurHandler}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoHandler(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
