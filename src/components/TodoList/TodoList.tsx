import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isProcessing: number[];
  onStatusChange: (todoId: number) => void;
  onTitleChange: (todoId: number, newTitle: string) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    isProcessing,
    onStatusChange,
    onTitleChange,
    onDeleteTodo,
  } = props;
  const selectedTodoField = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const handleEditTitle = (id: number, title: string) => {
    setSelectedTodo(id);
    setNewTitle(title);
  };

  const handleSaveChages = (todoId: number, title: string) => {
    setSelectedTodo(null);
    if (newTitle === '') {
      onDeleteTodo(todoId);
    } else if (newTitle !== title) {
      onTitleChange(todoId, newTitle);
    }
  };

  const handleCancelChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <TransitionGroup>
      {todos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        return (
          <CSSTransition
            key={id}
            timeout={300}
            classNames={classNames(
              { item: id !== 0 },
              { 'temp-item': id === 0 },
            )}
          >
            <div
              data-cy="Todo"
              className={classNames('todo', { completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => onStatusChange(id)}
                />
              </label>

              {id === selectedTodo ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSaveChages(id, title);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                    onBlur={() => handleSaveChages(id, title)}
                    onKeyDown={handleCancelChanges}
                    ref={selectedTodoField}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleEditTitle(id, title)}
                  >
                    {title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => handleDeleteTodo(id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal',
                  'overlay',
                  { 'is-active': isProcessing.includes(id) || id === 0 },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};
