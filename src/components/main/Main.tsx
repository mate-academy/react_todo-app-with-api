import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';
import { TempTodo } from '../todoItem/TempTodo';

interface Props {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  loading: boolean;
  loadingID: number;
  handleUpdateTodoIsCompleted: (
    id: number,
    complitedCurrVal: boolean,
  ) => void;
  editTodo: (newTitle: string, id: number) => void;
}
export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  loading,
  loadingID,
  handleUpdateTodoIsCompleted,
  editTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleSetEditingTodoId = (id: number | null) => {
    setEditingTodoId(id);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos
        && todos.map(({
          title,
          id,
          completed,
        }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              loading={loading}
              loadingID={loadingID}
              key={id}
              title={title}
              id={id}
              completed={completed}
              onDelete={handleDeleteTodo}
              onIsComplitedUpdate={handleUpdateTodoIsCompleted}
              setEditingTodoId={handleSetEditingTodoId}
              editingTodoId={editingTodoId}
              editTodo={editTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo
        && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}

      </TransitionGroup>
      {/* This is a completed todo */}
      {/* <div className="todo completed">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked
          />
        </label>

        <span className="todo__title">Completed Todo</span> */}

      {/* Remove button appears only on hover */}
      {/* <button type="button" className="todo__remove">×</button> */}

      {/* overlay will cover the todo while it is being updated */}
      {/* <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}

      {/* This todo is not completed */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* <span className="todo__title">Not Completed Todo</span>
      <button type="button" className="todo__remove">×</button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}

      {/* This todo is being edited */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}
    </section>
  );
};
