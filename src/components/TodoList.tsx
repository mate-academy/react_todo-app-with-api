import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './TodoProvider';

export const TodoList: React.FC = () => {
  const { filteredTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}

        />
      ))}
    </section>
  );
};
