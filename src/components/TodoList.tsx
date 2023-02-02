import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[],
  handleDeleteClick: (todoId: number) => void,
  processingTodo: number[],
  updateTodo: (todoToUpdate: Todo) => void,
  toggleTodoStatus: (id: number, status: boolean) => void,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    handleDeleteClick,
    processingTodo,
    updateTodo,
    toggleTodoStatus,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          key={todo.id}
          todo={todo}
          handleDeleteClick={handleDeleteClick}
          processingTodo={processingTodo}
          updateTodo={updateTodo}
          toggleTodoStatus={toggleTodoStatus}
        />
      ))}
    </section>
  );
});
