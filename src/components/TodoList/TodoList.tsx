import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isDeletingCompleted: boolean;
  isUpdatingAllTodo: boolean;
  toggleStatus: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isDeletingCompleted,
  isUpdatingAllTodo,
  toggleStatus,
}) => {
  return (
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            isPerentLoading={
              (isDeletingCompleted && todo.completed)
              || (isUpdatingAllTodo && todo.completed === toggleStatus)
            }
          />
        </CSSTransition>
      ))}

      {tempTodo !== null && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            isPerentLoading={tempTodo !== null}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
