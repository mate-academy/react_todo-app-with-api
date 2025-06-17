import { TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition } from 'react-transition-group';

interface TodoListProps {
  filteredTodos: Todo[];
  handleTodoDelete: (todoId: number) => void;
  tempTodo: Todo | null;
  todoInOperation: number[];
  handleTodoStatusToggle: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  handleTodoDelete,
  tempTodo,
  todoInOperation,
  handleTodoStatusToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onTodoDelete={() => handleTodoDelete(todo.id)}
              isProcessingDeleteTodo={todoInOperation.includes(todo.id)}
              onToggleCompleted={() => handleTodoStatusToggle(todo)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              onTodoDelete={() => handleTodoDelete(tempTodo.id)}
              isProcessingDeleteTodo={true}
              onToggleCompleted={() => handleTodoStatusToggle(tempTodo)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
