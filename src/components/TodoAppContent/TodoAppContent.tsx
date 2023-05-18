import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoListContext } from '../../context/TodoListContext';

type Props = {
  todoList: Todo[];
  onDelete: (id: number) => void;
  onCompletedToggle: (id: number, isCompleted: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  onDelete,
  onCompletedToggle,
  onTitleChange,
}) => {
  const { tempTodo } = useContext(TodoListContext);

  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
        />
      )}
    </section>
  );
};
