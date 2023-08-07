import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo?: Todo | null,
  removeTodo: (todoId: number) => void,
  updateTodo: (todo: Todo) => void,
  loadingTodoIds: number[],
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updateTodo,
  loadingTodoIds,
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
              updateTodo={(updTodo) => updateTodo(updTodo)}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
            />
          </CSSTransition>
        ))}

        {tempTodo?.id !== undefined && tempTodo?.id > 0 && (
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
