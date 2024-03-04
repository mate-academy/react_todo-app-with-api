import classNames from 'classnames';
import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { TodosContext } from '../../utils/context';
import { TodoError } from '../../types/enums/TodoError';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
};

export const TodoComponent: React.FC<Props> = ({ todo, isTempTodo }) => {
  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(title);

  const {
    todos,
    setTodos,
    setIsErrorVisible,
    setErrorMessage,
    todosIdsWithActiveLoader,
    setTodosIdsWithActiveLoader,
  } = useContext(TodosContext);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const deleteTodo = useCallback(() => {
    setTodosIdsWithActiveLoader(prevIds => [...prevIds, todo.id]);
    client
      .delete(`/todos/${todo.id}`)
      .then(() => {
        setTodos(todos.filter(el => el.id !== todo.id));
      })
      .catch(() => {
        setIsErrorVisible(true);
        setErrorMessage(TodoError.UnableToDelete);
      })
      .finally(() => {
        setTodosIdsWithActiveLoader([]);
      });
  }, [
    setTodosIdsWithActiveLoader,
    setTodos,
    setIsErrorVisible,
    setErrorMessage,
    todo.id,
    todos,
  ]);

  const editTodo = useCallback(
    (parameter: string, value: string | boolean) => {
      setTodosIdsWithActiveLoader((prevIds: number[]) => [...prevIds, id]);
      client
        .patch(`/todos/${id}`, {
          [parameter]: value,
        })
        .then((changedTodo: any) => {
          const preparedTodos = todos.map(item => {
            if (item.id === changedTodo.id) {
              return { ...todo, [parameter]: changedTodo[parameter] };
            }

            return todo;
          });

          setTodos(preparedTodos);
        })
        .catch(() => {
          setIsErrorVisible(true);
          setErrorMessage(TodoError.UnableToUpdate);
        })
        .finally(() => {
          setTodosIdsWithActiveLoader([]);
        });
    },
    [
      id,
      setErrorMessage,
      setIsErrorVisible,
      setTodos,
      setTodosIdsWithActiveLoader,
      todos,
    ],
  );

  const handlerDeleteTodo = () => {
    deleteTodo();
  };

  const handlerTodoStatus = () => {
    editTodo('completed', !todo.completed);
  };

  const handleUpdateTitle = () => {
    setIsEditing(true);
  };

  const handleFinishEditTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter' && newTodoTitle) {
      editTodo('title', newTodoTitle);
    }

    if (event.key === 'Enter' && newTodoTitle === '') {
      deleteTodo();
    }
  };

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handlerEditTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleLostFocus = () => {
    if (!newTodoTitle) {
      deleteTodo();
    }

    if (newTodoTitle !== title) {
      editTodo('title', newTodoTitle);
    }

    setIsEditing(false);
  };

  return (
    <div className="todoapp__main" data-cy="TodoList">
      <li
        data-cy="Todo"
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={handlerTodoStatus}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handlerEditTodo}>
            <input
              type="text"
              className="todo__title-field"
              value={newTodoTitle}
              onChange={handleNewTodoTitle}
              onBlur={handleLostFocus}
              onKeyDown={handleFinishEditTodo}
              placeholder="Empty todo will be deleted"
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleUpdateTitle}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handlerDeleteTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active':
              todosIdsWithActiveLoader.includes(todo.id) || isTempTodo,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </li>
    </div>
  );
};
