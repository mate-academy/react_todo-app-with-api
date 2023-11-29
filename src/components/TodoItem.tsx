import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';
import { removeTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setErrorMessage,
    setLoadingTodoId,
    loadingTodoId,
  } = useContext(TodosContext);
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditin, setIsEditing] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  const deleteTodo = () => {
    setLoadingTodoId([todo.id]);
    removeTodo(id)
      .then(() => {
        setTodos(currTodos => currTodos.filter(td => td.id !== id));
      })
      .catch(() => setErrorMessage(ErrorType.deleteError))
      .finally(() => {
        setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
        setLoadingTodoId([]);
      });
  };

  const edit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTitle(title);
    setNewTitle(e.target.value);
  };

  const submit = () => {
    setIsEditing(false);

    if (newTitle.trim().length === 0) {
      deleteTodo();
    } else if (todo.title === newTitle) {
      setIsEditing(false);
    } else {
      setLoadingTodoId([todo.id]);
      updateTodo({ ...todo, title: newTitle })
        .then((newTodo) => {
          setTodos(curTodos => {
            const newTodos = [...curTodos];
            const index = newTodos.findIndex(td => td.id === todo.id);

            newTodos.splice(index, 1, newTodo);

            return newTodos;
          });
        })
        .catch(() => setErrorMessage(ErrorType.updateError))
        .finally(() => {
          setLoadingTodoId([]);

          setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
        });
    }
  };

  const handleComplete = (updatedTodo: Todo) => {
    updateTodo({ ...updatedTodo, completed: !updatedTodo.completed })
      .then((newTodo) => {
        setTodos(curTodos => {
          const newTodos = [...curTodos];
          const index = newTodos.findIndex(td => td.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorType.updateError))
      .finally(() => {
        setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleComplete(todo)}
        />
      </label>

      {isEditin ? (
        <form onSubmit={submit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={edit}
            onKeyUp={handleKeyUp}
            onBlur={submit}
            ref={titleField}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            x
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {(loadingTodoId.includes(todo.id)) && (
        <TodoLoader />
      )}
    </div>
  );
};
