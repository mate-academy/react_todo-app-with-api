/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  isLoading: boolean;
  deletedTodoId: number | null;
  onEdit: (id: number, data: Partial<Todo>) => Promise<void>;
  editedTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  isLoading,
  deletedTodoId: deletingTodoId,
  onEdit,
  editedTodoId: editingTodoId,
}) => {
  const timeout = 300;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={timeout} classNames="item">
            <TodoItem
              todoItem={todo}
              onDelete={onDelete}
              isLoading={isLoading}
              deletingTodoId={deletingTodoId}
              onEdit={onEdit}
              editingTodoId={editingTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition key={0} timeout={timeout} classNames="temp-item">
            <TempTodo
              tempTodo={tempTodo}
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
