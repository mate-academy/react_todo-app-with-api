import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

interface TodoListProps {
  visibleTodos: TodoType[];
  onTodoRemove: (id: number) => void;
  tempTodo: TodoType | null;
  isLoading: number[];
  onToggleTodo: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onTodoRemove,
  tempTodo,
  isLoading,
  onToggleTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => {
        return (
          !isLoading.includes(todo.id)
            ? (
              <Todo
                onToggleTodo={onToggleTodo}
                todo={todo}
                key={todo.id}
                onTodoRemove={onTodoRemove}
              />
            )
            : (
              <div
                className={cn('todo', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input type="checkbox" className="todo__status" />
                </label>

                <span className="todo__title">{todo.title}</span>
                <button type="button" className="todo__remove">×</button>
                <div className={cn('modal overlay',
                  { 'is-active': isLoading.includes(todo.id) })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )
        );
      })}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>
          <div className={cn('modal overlay',
            { 'is-active': tempTodo !== null })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
