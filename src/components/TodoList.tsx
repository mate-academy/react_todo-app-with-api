import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (idToDelete: number) => void;
  deletingTodoIds: number[];
  onUpdate: (todo: Todo) => Promise<void>;
  toggleTodoIds: number[];
  editingTodoId?: number | null;
  setEditingTodoId?: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoIds,
  onUpdate,
  toggleTodoIds,
  editingTodoId,
  setEditingTodoId = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              deletingTodoIds={deletingTodoIds}
              tempTodo={tempTodo}
              onUpdate={onUpdate}
              toggleTodoIds={toggleTodoIds}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
