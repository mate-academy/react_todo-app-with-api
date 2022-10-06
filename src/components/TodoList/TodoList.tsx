import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[]
  deleteTodo: (todoId: number) => void
  selectedTodoId: number | null
  completedTodos: number[]
  isClicked: (todoId: number, title: string) => void
  doubleClickTodoId: number | null
  changeTitle: string
  setChangeTitle: (todoText: string) => void
  changeStatusTodo: (todoId: number, status: boolean) => void
  changeTitleTodo: (
    todoId: number,
    title: string,
    event: React.FocusEvent<HTMLInputElement> | null
  ) => void
  onKeyDownTitleTodo: (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
    title: string
  ) => void
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  selectedTodoId,
  deleteTodo,
  completedTodos,
  isClicked,
  doubleClickTodoId,
  changeTitle,
  setChangeTitle,
  changeStatusTodo,
  changeTitleTodo,
  onKeyDownTitleTodo,

}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const {
          completed,
          id,
          title,
        } = todo;

        return (

          // сделай тудушку отдельным компонентом
          <div
            data-cy="Todo"
            className={classNames('todo', {
              'item-enter-done': !completed,
              completed,
            })}
            key={id}
            onDoubleClick={() => isClicked(todo.id, title)}
          >
            <>
              {doubleClickTodoId === todo.id ? (
                <>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                      onClick={() => changeStatusTodo(todo.id, todo.completed)}
                    />
                  </label>
                  <form onSubmit={(event) => event.preventDefault()}>
                    <input
                      type="text"
                      className="
                        todoapp__new-todo
                        todo__title
                        todo__title--decoration-none
                       "
                      // даный елемент не отображается на странице и не есть доступным для людей с ограничными возможностями
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      value={changeTitle}
                      onChange={(event) => {
                        setChangeTitle(event.target.value);
                      }}
                      onBlur={(event) => changeTitleTodo(
                        id,
                        changeTitle,
                        event,
                      )}
                      onKeyDown={(event) => onKeyDownTitleTodo(
                        event,
                        id,
                        changeTitle,
                      )}

                    />
                  </form>
                </>
              ) : (
                <>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      defaultChecked
                      onClick={() => changeStatusTodo(todo.id, completed)}
                    />
                  </label>

                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                  >
                    {!title ? 'Empty todo' : title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}
            </>
            { (selectedTodoId === todo.id
              || completedTodos.includes(todo.id))
              && (
                <div
                  data-cy="TodoLoader"
                  className="
                  overlay
                  is-flex
                  is-justify-content-center
                  is-align-items-center
                  "
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
          </div>
        );
      })}
    </section>
  );
};
