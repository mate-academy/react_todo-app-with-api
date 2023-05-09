import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  actionsTodosId: number[] | [];
  handleDeleteTodo: (id: number) => void;
  handleToggleTodo: (id: number) => void;
  setActionsTodosId: React.Dispatch<React.SetStateAction<number[] | []>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  actionsTodosId,
  handleDeleteTodo,
  handleToggleTodo,
  setActionsTodosId,
  setTodos,
  setError,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            actionsTodosId={actionsTodosId}
            handleDeleteTodo={handleDeleteTodo}
            handleToggleTodo={handleToggleTodo}
            setActionsTodosId={setActionsTodosId}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
          />
        </CSSTransition>
      ))}

      {!!tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            actionsTodosId={actionsTodosId}
            handleDeleteTodo={handleDeleteTodo}
            handleToggleTodo={handleToggleTodo}
            setActionsTodosId={setActionsTodosId}
            todos={todos}
            setTodos={setTodos}
            setError={setError}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
