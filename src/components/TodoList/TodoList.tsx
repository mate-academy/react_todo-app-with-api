import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  allLoading: boolean;
  allComplete: boolean;
  batchOperation: string | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (id: number, todo: Partial<Todo>) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  allLoading,
  allComplete,
  batchOperation,
  onDeleteTodo,
  onUpdateTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => {
        const { id, title, completed } = todo;

        return (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              title={title}
              id={id}
              completed={completed}
              allLoading={allLoading}
              allComplete={allComplete}
              batchOperation={batchOperation}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        );
      })}

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="item"
        >
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
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
