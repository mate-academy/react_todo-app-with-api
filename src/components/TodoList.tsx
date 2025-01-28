import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { DEFAULT_ID } from '../constants/DEFAULT_ID';
import TodoItemMemo from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: [number]) => void;
  onUpdate: (todoDataUpdate: [Todo]) => Promise<Todo | null>[];
  loadingTodoIds: number[];
};

export default function TodoListMemo({
  filteredTodos,
  tempTodo,
  onDelete,
  onUpdate,
  loadingTodoIds,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItemMemo
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isLoading={loadingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition timeout={300} classNames="temp-item">
            <TodoItemMemo
              todo={tempTodo}
              isLoading={loadingTodoIds.includes(DEFAULT_ID)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
}
