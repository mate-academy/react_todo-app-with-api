/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import { SingleTodo } from '../components/singleTodo';

type Props = {
  filtredTodos: Todo[];
  editingTodoId: number | null;
  handleEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editingTitle: string;
  handleEditBlur: () => void;
  handleEdit: (todo: Todo) => void;
  loader: number[];
  handleEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateTodoStatus: (updatedTodo: Todo) => Promise<void>;
  handleDelete: (todoId: number) => void;
  title: string;
  addingTodo: boolean;
};

export const TodoList: React.FC<Props> = ({
  filtredTodos,
  editingTodoId,
  handleEditSubmit,
  editingTitle,
  handleEditBlur,
  handleEdit,
  loader,
  handleEditChange,
  onUpdateTodoStatus,
  handleDelete,
  title,
  addingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos.map(todo => (
        <SingleTodo
          key={todo.id}
          todo={todo}
          editingTodoId={editingTodoId}
          handleEditSubmit={handleEditSubmit}
          editingTitle={editingTitle}
          handleEditBlur={handleEditBlur}
          handleEdit={handleEdit}
          loader={loader}
          handleEditChange={handleEditChange}
          onUpdateTodoStatus={onUpdateTodoStatus}
          handleDelete={handleDelete}
        />
        // <div
        //   data-cy="Todo"
        //   className={todo.completed ? 'todo completed' : 'todo'}
        //   key={todo.id}
        // >
        //   <label className="todo__status-label">
        //     <input
        //       data-cy="TodoStatus"
        //       type="checkbox"
        //       className="todo__status"
        //       checked={todo.completed}
        //       onClick={() => onUpdateTodoStatus(todo)}
        //       disabled={loader.length !== 0}
        //     />
        //   </label>

        //   {editingTodoId === todo.id ? (
        //     <form onSubmit={handleEditSubmit}>
        //       <input
        //         data-cy="TodoTitleField"
        //         type="text"
        //         className="todo__title-field"
        //         value={editingTitle}
        //         onChange={handleEditChange}
        //         onBlur={handleEditBlur}
        //         autoFocus
        //       />
        //     </form>
        //   ) : (
        //     <span
        //       data-cy="TodoTitle"
        //       className="todo__title"
        //       onDoubleClick={() => handleEdit(todo)}
        //     >
        //       {todo.title}
        //     </span>
        //   )}

        //   {editingTodoId !== todo.id && (
        //     <button
        //       type="button"
        //       className="todo__remove"
        //       data-cy="TodoDelete"
        //       onClick={() => handleDelete(todo.id)}
        //     >
        //       ×
        //     </button>
        //   )}

        //   <div
        //     data-cy="TodoLoader"
        //     className={classNames('modal overlay', {
        //       'is-active': loader?.includes(todo.id),
        //     })}
        //   >
        //     <div className="modal-background has-background-white-ter" />
        //     <div className="loader" />
        //   </div>
        // </div>
      ))}
      {addingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
