import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[] | null,
  tempTodo?: Todo | null,
  removeTodo: (todoId: number) => void,
  removingId: number | null,
  updateTodo: (todo: Todo) => void,
};

export const TodoList:React.FC<Props> = ({
  todos, tempTodo, removeTodo, removingId, updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              removingId={removingId}
              updateTodo={(updTodo) => updateTodo(updTodo)}
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
              updateTodo={(updTodo) => updateTodo(updTodo)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
