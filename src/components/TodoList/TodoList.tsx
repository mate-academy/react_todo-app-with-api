import cn from 'classnames';

import { Todo, UpdateData } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  handleDelete: (todoId: number) => void,
  processedTodosId: number[],
  handleUpdateTodo: (todoId: number, fieldsToUpdate: UpdateData) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, handleDelete, processedTodosId, handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <TodoItem
            todo={todo}
            onDelete={() => handleDelete(todo.id)}
            toDelete={processedTodosId.includes(todo.id)}
            onUpdate={(fields) => handleUpdateTodo(todo.id, fields)}
          />
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
