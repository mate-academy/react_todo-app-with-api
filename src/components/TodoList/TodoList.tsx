import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  loadingId: number[];
  removeTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  changeTodo: (
    property: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    todoId: number,
  ) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loadingId,
  removeTodo,
  tempTodo,
  changeTodo,
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
              key={todo.id}
              todo={todo}
              loadingId={loadingId}
              removeTodo={removeTodo}
              changeTodo={changeTodo}
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
              loadingId={loadingId}
              removeTodo={removeTodo}
              changeTodo={changeTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
