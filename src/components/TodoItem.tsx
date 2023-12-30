import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TododsContext/TodosContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setErrorMessage, setTodos,
  } = useContext(TodosContext);
  const [isDeliting, setIsDeliting] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editTitleFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editTitleFieldRef.current) {
      editTitleFieldRef.current.focus();
    }
  });

  const editTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsDeliting(true);

    deleteTodo(todoId)
      .then(() => setTodos(
        curentTodos => curentTodos.filter(curtodo => curtodo.id !== todoId),
      ))
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsDeliting(false));
  };

  const toggleCompletedTodo = (updatedTodo: Todo) => {
    setToggled(true);

    updateTodo({ ...updatedTodo, completed: !updatedTodo.completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(td => td.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setToggled(false));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);

    if (newTitle.trim().length === 0) {
      handleDeleteTodo(todo.id);
    } else if (newTitle === todo.title) {
      setIsEditing(false);
    } else {
      updateTodo({ ...todo, title: newTitle })
        .then(newTodo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(td => td.id === newTodo.id);

            newTodos.splice(index, 1, newTodo);

            return newTodos;
          });
        })
        .catch((error) => {
          setErrorMessage('Unable to update a todo');
          throw error;
        })
        .finally(() => {
          setIsEditing(false);
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => toggleCompletedTodo(todo)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={editTitle}
              ref={editTitleFieldRef}
              onBlur={handleSubmit}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
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
          </>
        )}

      {(todo.id === 0 || isDeliting || toggled || isEditing) && (
        <Loader />
      )}
    </div>
  );
};
