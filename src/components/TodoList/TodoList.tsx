import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TempoTodoItem } from '../TempTodoItem/TempTodoItem';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null;
  deleteTodo: (todoId: number) => void,
  uptadeTodoStatus: (todoId: number, completed: boolean) => void,
  loadingTodoId: number[],
  onChangeTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, tempoTodo, loadingTodoId,
  uptadeTodoStatus, deleteTodo, onChangeTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          uptadeTodoStatus={uptadeTodoStatus}
          loading={loadingTodoId.includes(todo.id)}
          onChangeTodoTitle={onChangeTodoTitle}
        />
      ))}
      {tempoTodo && (
        <TempoTodoItem tempoTodo={tempoTodo} key={tempoTodo.id} />
      )}
    </section>

  );
};
