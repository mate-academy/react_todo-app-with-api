import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds?: number[];
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
  onEditTodo?: (currentTodo: Todo) => void;
  isEditing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
  onCheckedTodo?: (currentTodo: Todo) => void;
  serverError?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDeleteTodo = () => {},
  onEditTodo = () => {},
  isEditing = false,
  setIsEditing = () => {},
  onCheckedTodo = () => {},
  serverError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                onloadingTodoIds={loadingTodoIds}
                todo={todo}
                onDelete={onDeleteTodo}
                onEdit={onEditTodo}
                isEditingTodo={isEditing}
                setIsEditingTodo={setIsEditing}
                onChecked={onCheckedTodo}
                errorFromServer={serverError}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
