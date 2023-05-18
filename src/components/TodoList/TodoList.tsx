// import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface P {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isLoadingTodoIds: number[];
  updateTodoCompleted: (todoId: number, changeToCompleted: boolean) => void;
}

export const TodoList: React.FC<P> = ({
  todos,
  deleteTodo,
  isLoadingTodoIds,
  updateTodoCompleted,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
        isLoading={isLoadingTodoIds.includes(todo.id)}
        updateTodoCompleted={updateTodoCompleted}
      />
    ))}
  </section>
);
