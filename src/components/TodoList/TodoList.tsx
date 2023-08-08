import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo?: Todo | null,
  removeTodo: (todoId: number) => void,
  updateTodo: (todo: Todo) => void,
  loadingTodoIds: number[],
  setErrorMessage: (message: string) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updateTodo,
  loadingTodoIds,
  setErrorMessage,
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
              setErrorMessage={setErrorMessage}
            />
          </CSSTransition>
        ))}

        {tempTodo?.id !== undefined && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              updateTodo={(updTodo) => updateTodo(updTodo)}
              loadingTodoIds={loadingTodoIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
