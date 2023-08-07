/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { changeTodo, deleteTodo } from '../api/todos';
import { DELETING_ERROR, UPDATING_ERROR } from '../utils/constants';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorHandler: (str: string) => void;
  loadingTodos: Todo[];
  setLoadingTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  updateTodoStatus: (id: number, completed: boolean) => void;
  prevTitle: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  updateTodos: (updatedTodo: Todo) => void;
}

export const Main: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  setTodos,
  errorHandler,
  loadingTodos,
  setLoadingTodos,
  updateTodoStatus,
  prevTitle,
  setTitle,
  updateTodos,
}) => {
  const [onEdit, setOnEdit] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const editRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (onEdit && editRef.current) {
      editRef.current.focus();
    }
  }, [onEdit]);

  const handleDoubleClick = (id: number, title: string) => {
    setOnEdit(id);
    setNewTitle(title);
  };

  const handleDelete = (id: number) => {
    const todoForDelete = filteredTodos.filter((todo) => todo.id === id);

    setLoadingTodos((prevLoadingTodos) => [
      ...prevLoadingTodos,
      ...todoForDelete,
    ]);

    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch(() => errorHandler(DELETING_ERROR))
      .finally(() => {
        setLoadingTodos((prevLoadingTodos) => prevLoadingTodos
          .filter((todo) => todo.id !== id));
      });
  };

  const handleSubmit = (id: number, title: string) => {
    if (newTitle.trim() !== '') {
      if (newTitle === title) {
        setOnEdit(null);

        return;
      }

      setTitle(newTitle);

      const todoOnChange = filteredTodos.find((t) => t.id === id);

      if (todoOnChange) {
        setLoadingTodos((prevLoadingTodos) => [
          ...prevLoadingTodos,
          todoOnChange,
        ]);

        changeTodo(id, { ...todoOnChange, title: newTitle })
          .then((updatedTodo) => {
            const typedUpdatedTodo = updatedTodo as Todo;

            updateTodos(typedUpdatedTodo);
          })
          .catch(() => errorHandler(UPDATING_ERROR));
      }
    } else {
      handleDelete(id);
    }

    setOnEdit(null);
    setTitle('');
  };

  const handleKeyUp = useCallback(
    (
      event: React.KeyboardEvent<HTMLInputElement>,
      id: number,
      title: string,
    ) => {
      if (event.key === 'Enter') {
        handleSubmit(id, title);
      } else if (event.key === 'Escape') {
        setNewTitle(prevTitle);
        setOnEdit(null);
      }
    },
    [prevTitle, newTitle],
  );

  const toggleSingle = (id: number) => {
    updateTodoStatus(
      id,
      !filteredTodos.find((todo) => todo.id === id)?.completed || false,
    );
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map((todo) => {
          const { id, title, completed } = todo;
          const isTodoLoading = loadingTodos.includes(todo);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <div
                key={id}
                className={`todo ${completed ? 'completed' : ''}`}
                onDoubleClick={() => handleDoubleClick(id, title)}
              >
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                    onClick={() => toggleSingle(id)}
                  />
                </label>

                {!onEdit || onEdit !== id ? (
                  <TodoItem
                    title={title}
                    id={id}
                    handleDelete={handleDelete}
                    isTodoLoading={isTodoLoading}
                  />
                ) : (
                  <input
                    ref={editRef}
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.currentTarget.value)}
                    onBlur={() => handleSubmit(id, title)}
                    onKeyUp={(event) => handleKeyUp(event, id, title)}
                    type="text"
                    className="edit"
                  />
                )}
              </div>
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>

              <button type="button" className="todo__remove">
                ×
              </button>

              <div className={`modal overlay ${cn({ 'is-active': tempTodo })}`}>
                <div className="modal-background has-background-white-ter" />
                <div className="todoapp__loading-content">
                  <p className="todoapp__loading-content--caption">
                    Loading...
                  </p>
                  <div className="loader" />
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
