/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface TodoListProps {
  filteredTodos: Todo[];
  updateTodoStatus: (todoId: number, completed: boolean) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  updateTodoStatus,
  deleteTodo,
  loadingTodoId,
  updateTodoTitle,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleDoubleClick = (id: number, title: string) => {
    setEditingTodoId(id);
    setNewTitle(title);
  };

  const updateTodoTitleRename = async () => {
    if (newTitle.length === 0) {
      deleteTodo(editingTodoId!);
    } else if (editingTodoId !== null && newTitle.trim()) {
      try {
        await updateTodoTitle(editingTodoId, newTitle.trim());
        setEditingTodoId(null);
      } catch (error) {
        return;
      }
    } else {
      setEditingTodoId(null);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingTodoId(null);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      await updateTodoTitleRename();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => {
          const { completed, id, title } = todo;

          return (
            <CSSTransition key={id} timeout={300} classNames="item">
              <div
                data-cy="Todo"
                className={`todo ${completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={completed}
                    onChange={() => updateTodoStatus(id, !completed)}
                  />
                </label>

                {editingTodoId === id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      updateTodoTitleRename();
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={updateTodoTitleRename}
                      autoFocus
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => handleDoubleClick(id, title)}
                    >
                      {title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => deleteTodo(id)}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loadingTodoId === id ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
