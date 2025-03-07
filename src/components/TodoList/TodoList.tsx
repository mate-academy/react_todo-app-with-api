import { Todo } from '../../types/Todo';
import { updateTodoStatus, updateTodoTitle, deleteTodo } from '../../api/todos';
import { useState, useEffect, useRef } from 'react';

type Prop = {
  filteredTodos: Todo[] | undefined;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setActionError: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  loadingId: number;
  setLoadingId: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoList: React.FC<Prop> = ({
  filteredTodos,
  setActionError,
  setTodos,
  tempTodo,
  loadingId,
  setLoadingId,
}) => {
  //const [editing, setEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const editFormRef = useRef<HTMLInputElement | null>(null);

  const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
      setEditTodoId(0);
    } else if (event.key === 'Enter') {
    }
  };

  useEffect(() => {
    if (editTodoId !== 0) {
      editFormRef?.current?.focus();
    }
  }, [editTodoId]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboardEvent);

    return () => {
      window.removeEventListener('keyup', handleKeyboardEvent);
    };
  }, []);

  const markTodoComplete = (updateTodo: Todo) => {
    updateTodoStatus(updateTodo)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setActionError('update');
      })
      .finally(() => {
        setLoadingId(0);
      });

    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingId(todoId);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setActionError('delete');
      })
      .finally(() => {
        setLoadingId(0);
      });

    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  const handleEditMode = (todo: Todo) => {
    //setEditing(true);
    setEditTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const handleUpdateTodo = (
    event: React.FormEvent | React.FocusEvent<HTMLInputElement>,
    updateTodo: Todo,
  ) => {
    event.preventDefault();
    //If there is not edited title then delete the Todo
    if (editTitle.trim().length === 0) {
      handleDeleteTodo(updateTodo.id);
    } else if (editTitle.trim() === updateTodo.title) {
      setEditTodoId(0);
      setEditTitle('');
    } else {
      if (!loadingId) {
        setLoadingId(updateTodo.id);
        updateTodoTitle(updateTodo.id, editTitle.trim())
          .then(updatedTodo => {
            setTodos(prevTodos =>
              prevTodos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo,
              ),
            );
            setLoadingId(0);
            setEditTodoId(0);
            setEditTitle('');
          })
          .catch(() => {
            setActionError('update');
            setLoadingId(0);
          })
          
      }
    }

    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={todo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              aria-label="Mark as completed"
              onChange={() => {
                markTodoComplete(todo);
                setLoadingId(todo.id);
              }}
            />
          </label>
          {editTodoId === todo.id ? (
            <form onSubmit={event => handleUpdateTodo(event, todo)}>
              <input
                ref={editFormRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editTitle}
                onBlur={event => handleUpdateTodo(event, todo)}
                onChange={event => setEditTitle(event.target.value)}
              />
            </form>
          ) : (
            <>
              <span
                key={todo.id}
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditMode(todo)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  handleDeleteTodo(todo.id);
                  setLoadingId(todo.id);
                }}
              >
                ×
              </button>
            </>
          )}

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingId === todo.id ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          key={tempTodo.id}
          className={tempTodo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              aria-label="Mark as completed"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
