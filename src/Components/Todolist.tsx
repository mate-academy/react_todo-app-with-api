import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface TodoListPropsType {
  todosToShow: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  handleUpdateTodo: (todoId: number, todo: Partial<Todo>) => void,
}

export const TodoList: React.FC<TodoListPropsType> = ({
  todosToShow,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};
