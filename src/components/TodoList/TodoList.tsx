import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (n: number) => void,
  updateTodo: (t: Todo) => void,
  todosIdsAreLoading: number[],
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deleteTodo,
  updateTodo,
  todosIdsAreLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              todosIdsAreLoading={todosIdsAreLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              todosIdsAreLoading={todosIdsAreLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
