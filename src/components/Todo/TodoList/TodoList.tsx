import { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoContextType } from '../../../types/TodoContextType';
import { TodoContext } from '../TodoContext';
import TodoListItem from './TodoListItem/TodoListItem';

type Props = {
  selectedClass: string,
};

const TodoList: React.FC<Props> = ({ selectedClass }) => {
  const { visibleTodos } = useContext(TodoContext) as TodoContextType;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          selectedClass={selectedClass}
        />
      ))}
    </section>
  );
};

export default TodoList;
