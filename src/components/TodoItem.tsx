import React,
{
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import * as TodoServices from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todo: Todo;
  deletePost: (todoId: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<ErrorType | null>>;
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    deletePost,
    setTodos,
    setError,
  },
) => {
  const handleCheckbox = () => {
    setTodos((prevTodos) => {
      return prevTodos.map((todor) => (todor.id === todo.id
        ? { ...todor, completed: !todor.completed }
        : todor));
    });
  };

  const [todoEditId, setTodoEditId] = useState(0);
  const [todoEdit, setTodoEdit] = useState('');

  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editRef.current?.focus();
  }, [todoEditId]);

  const handleDoubleClick = () => {
    const { id, title } = todo;

    setTodoEditId(id);
    setTodoEdit(title);
  };

  const resetChange = () => {
    setTodoEditId(0);
    setTodoEdit('');
  };

  const saveChange = async () => {
    try {
      const updatedTodo = await TodoServices.updateTodos({
        id: todo.id,
        title: todoEdit,
        userId: todo.userId,
        completed: todo.completed,
      });

      setTodos((todos) => {
        return todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
      });

      resetChange();
    } catch (error) {
      setError(ErrorType.UpdateTodoError);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoEdit(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Escape':
        resetChange();
        break;
      case 'Enter':
        saveChange();
        break;
      default:
        break;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed }, { editing: todoEditId === todo.id })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
          aria-label={`Mark todo "${todo.title}" as completed`}
        />
      </label>

      {todoEditId === todo.id ? (
        <input
          data-cy="TodoEditInput"
          type="text"
          className="todo__edit"
          value={todoEdit}
          onChange={handleChange}
          onBlur={resetChange}
          onKeyDown={handleKeyDown}
          ref={editRef}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deletePost(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
