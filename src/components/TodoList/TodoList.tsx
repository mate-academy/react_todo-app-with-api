import '../../styles/todoapp.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todoList: Todo[];
  onRemoveTodo?: (todo: Todo) => void;
  onUpdateTodo?: (todo: Todo) => void;
  todosToLoading: Todo[];
}

export const TodoList: React.FC<Props> = ({
  todoList,
  onRemoveTodo = () => {},
  onUpdateTodo = () => {},
  todosToLoading: loadingItems,
}) => {
  return (
    <>
      {todoList.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveItem={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingItems.some(item => item.id === todo.id)}
        />
      ))}
    </>
  );
};
