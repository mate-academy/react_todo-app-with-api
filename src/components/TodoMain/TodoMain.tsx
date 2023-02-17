import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo, update: 'title' | 'complete') => void;
  loadingAll: boolean;
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  loadingAll,
}) => {
  const [activateEditById, setActivateEditById] = useState<number>(-1);
  const [activateLoadingOnTodo, setActivateLoadingOnTodo] = useState(0);
  const [tempTodoTitle, setTempTodoTitle] = useState('');

  const updateTitle = async (todo: Todo) => {
    if (todo) {
      if (todo.title !== tempTodoTitle) {
        setActivateEditById(0);
        setActivateLoadingOnTodo(todo.id);
        await updateTodo({ ...todo, title: tempTodoTitle }, 'title');
        setActivateLoadingOnTodo(-1);
      }
    }
  };

  const onDelete = (id: number) => {
    setActivateLoadingOnTodo(id);
    deleteTodo(id);
  };

  const onSubmitChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const findTodo = todos?.find((todo) => todo.id === activateEditById);

    if (findTodo) {
      if (tempTodoTitle === '') {
        onDelete(findTodo.id);
      } else {
        updateTitle(findTodo);
      }
    }

    setActivateEditById(-1);
  };

  const activateEdit = (title: string, id: number) => {
    setTempTodoTitle(title);
    setActivateEditById(id);
  };

  const updateComplete = async (todo: Todo) => {
    setActivateLoadingOnTodo(todo.id);
    await updateTodo(todo, 'complete');
    setActivateLoadingOnTodo(-1);
  };

  useEffect(() => {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        setActivateEditById(0);
      }
    });
  }, []);

  return (
    <section className="todoapp__main">
      {todos?.map((todo) => {
        const { completed, title, id } = todo;

        return (
          <div className={cn('todo', { completed })} key={id}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                onChange={() => updateComplete(todo)}
              />
            </label>

            {activateEditById === id ? (
              <>
                <form onSubmit={onSubmitChanges}>
                  <input
                    onBlur={() => updateTitle(todo)}
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={tempTodoTitle}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setTempTodoTitle(e.currentTarget.value);
                    }}
                  />
                </form>
              </>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => activateEdit(title, id)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(id)}
                >
                  ×
                </button>

                {activateLoadingOnTodo === id || loadingAll ? (
                  <div className="modal overlay is-active">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        );
      })}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
