import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  handleDelete: (id: number) => void;
  deletingTodoId: number | null;
  handleToggle: (todoId: number) => Promise<void>;
  updatingTodoIds: number[];
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleRename: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoList = ({
  todos,
  tempTodo,
  isAdding,
  handleDelete,
  deletingTodoId,
  handleToggle,
  updatingTodoIds,
  editingTodoId,
  setEditingTodoId,
  handleRename,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              handleDelete={handleDelete}
              isLoading={todo.id === deletingTodoId}
              handleToggle={handleToggle}
              isUpdating={updatingTodoIds.includes(todo.id)}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              handleRename={handleRename}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={isAdding} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
