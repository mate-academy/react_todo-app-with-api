import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  onRemoveTodo:(id: number) => void,
  deletingTodoId: number,
  isDeletingCompleted: boolean,
  onChangeTitle: (todo: Todo, title: string) => void,
  onToggleTodo: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  onRemoveTodo,
  deletingTodoId,
  isDeletingCompleted,
  onChangeTitle,
  onToggleTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deletingTodoId={deletingTodoId}
          onRemoveTodo={onRemoveTodo}
          isDeletingCompleted={isDeletingCompleted}
          onChangeTitle={onChangeTitle}
          onToggleTodo={onToggleTodo}
        />
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          className={classNames(
            'todo',
            { completed: tempTodo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>
          <span className="todo__title">{tempTodo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemoveTodo(tempTodo.id)}
          >
            ×
          </button>
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
