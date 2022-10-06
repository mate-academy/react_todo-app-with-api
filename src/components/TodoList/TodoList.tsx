import { Loader } from '../Loader/Loader';
import { Props } from './TodolistPropTypes';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList : React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingTodoId,
  setloadingTodoId,
  toggleStatus,
  setErrorMessage,
  changeTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {loadingTodoId === 0 && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-labe">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <Loader />
        </div>
      )}

      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            setloadingTodoId={setloadingTodoId}
            toggleStatus={toggleStatus}
            setErrorMessage={setErrorMessage}
            onDeleteTodo={onDeleteTodo}
            loadingTodoId={loadingTodoId}
            changeTitle={changeTitle}
          />
        );
      })}

    </section>
  );
};
