// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number | null;
  toggleLoader: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  onUpdate,
  isLoading,
  selectedId,
  toggleLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              onUpdate={onUpdate}
              isLoading={isLoading}
              selectedId={selectedId}
              toggleLoader={toggleLoader}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
