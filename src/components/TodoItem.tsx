import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, changeTodoStatus, updateTodo } from '../api/todos';
import { useEffect, useRef, useState } from 'react';

import EditTodo from './EditTodo';
import TodoDisplay from './TodoDisplay';

type Props = {
  todo: Todo;
  activeTodoIds: number[];
  setActiveTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoItem = ({
  todo,
  activeTodoIds,
  setTodos,
  setActiveTodoIds,
  setError,
  inputRef,
}: Props) => {
  const { id, title, completed } = todo;
  const isLoading = activeTodoIds.includes(id);
  const [isEdited, setIsEdited] = useState(false);
  const editFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdited) {
      const input = editFieldRef.current;

      if (input) {
        input.value = title;
        input.focus();
        input.setSelectionRange(0, input.value.length);
      }
    }
  }, [isEdited, title]);

  const handleDelete = (todoId: number) => {
    setActiveTodoIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(todos =>
          todos.filter(deletedTodo => deletedTodo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setActiveTodoIds(current =>
          current.filter(activeId => activeId !== todoId),
        );
        inputRef.current?.focus();
      });
  };

  const handleChange = (todoId: number) => {
    setActiveTodoIds(current => [...current, todoId]);
    changeTodoStatus(todoId, !completed)
      .then(() => {
        setTodos(todos =>
          todos.map(currentTodo =>
            currentTodo.id === todoId
              ? { ...currentTodo, completed: !currentTodo.completed }
              : currentTodo,
          ),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setActiveTodoIds(current =>
          current.filter(activeId => activeId !== todoId),
        );
      });
  };

  const handleChangeTodo = async (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();

    const inputValue = editFieldRef.current?.value || '';

    if (inputValue.trim() !== '') {
      if (inputValue !== title) {
        setActiveTodoIds(current => [...current, id]);
        try {
          await updateTodo(id, inputValue);
          setTodos(todos =>
            todos.map(currentTodo =>
              currentTodo.id === id
                ? { ...currentTodo, title: inputValue.trim() }
                : currentTodo,
            ),
          );
          setIsEdited(false);
        } catch {
          setError('Unable to update a todo');
        } finally {
          setActiveTodoIds(current =>
            current.filter(activeId => activeId !== id),
          );
        }
      } else {
        setIsEdited(false);
      }
    } else {
      handleDelete(id);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChange(id)}
        />
      </label>
      {isEdited ? (
        <EditTodo
          handleChangeTodo={handleChangeTodo}
          title={title}
          editFieldRef={editFieldRef}
          setIsEdited={setIsEdited}
        />
      ) : (
        <TodoDisplay
          setIsEdited={setIsEdited}
          title={title}
          id={id}
          handleDelete={handleDelete}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
