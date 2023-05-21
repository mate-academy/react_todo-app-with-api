// import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateDataTodo } from '../../types/UpdateDataTodo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface P {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isLoadingTodoIds: number[];
  updateTodoCompleted: (todoId: number, data: UpdateDataTodo) => void;
  updateTitle: (title: string, todoId: number) => void;
}

export const TodoList: React.FC<P> = ({
  todos,
  deleteTodo,
  isLoadingTodoIds,
  updateTodoCompleted,
  updateTitle,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
        isLoading={isLoadingTodoIds.includes(todo.id)}
        updateTodoCompleted={updateTodoCompleted}
        updateTitle={updateTitle}
      />
    ))}
  </section>
);
