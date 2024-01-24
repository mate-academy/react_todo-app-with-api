import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoProvider';
import * as postServise from '../api/todos';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

type Props = {
  todoItem: Todo,
  isTempTodo?: boolean,
};

export const TodoItem: React.FC<Props> = ({ todoItem, isTempTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const {
    todos,
    setTodos,
    setError,
    removeTodo,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const toggleTodo = async (todoId: number) => {
    const completedTodo = todos.map(todo => (
      todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : { ...todo }
    ));
    const currentTodo = completedTodo.find(complted => complted.id === todoId);

    try {
      await postServise.updateTodo({
        todo: currentTodo,
        todoId,
      });
    } catch {
      setError(Errors.UNABLE_UPDATE);
    }

    setTodos(completedTodo);
  };

  const handleDoubleClick = (id: number) => {
    setEditId(id);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodos(todos);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(false);

      const currentTodo = todos.find(todo => todo.id === editingId);

      if (currentTodo) {
        try {
          const updatedTitle = event.currentTarget.value;
          const updatedTodos = todos.map(todo => {
            if (todo.id === editingId) {
              return { ...todo, title: updatedTitle };
            }

            return todo;
          });

          await postServise.updateTodo({
            todo: { ...currentTodo, title: updatedTitle },
            todoId: editingId,
          });

          setTodos(updatedTodos);
        } catch (updateError) {
          setError(Errors.UNABLE_UPDATE);
        }
      }
    }
  };

  const handleEditingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    const completedTodo = todos.map(todo => {
      if (todo.id === editingId) {
        return { ...todo, title: event.target.value };
      }

      return todo;
    });

    setTodos(completedTodo);
  };

  return (
    <div
      key={todoItem.id}
      data-cy="Todo"
      className={cn('todo', { completed: todoItem.completed })}
    >
      <label className="todo__status-label">
        <input
          onClick={() => toggleTodo(todoItem.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing && editId === todoItem.id ? (
        <input
          ref={inputRef}
          type="text"
          value={todoItem.title}
          className="todo__title-field"
          onBlur={handleBlur}
          onChange={(e) => handleEditingChange(e, todoItem.id)}
          onKeyDown={(e) => handleKeyPress(e, todoItem.id)}
        />
      ) : (
        <>
          <span
            onDoubleClick={() => handleDoubleClick(todoItem.id)}
            onBlur={handleBlur}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todoItem.title}
          </span>
        </>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todoItem.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal everplay', {
          'is-active': isTempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
