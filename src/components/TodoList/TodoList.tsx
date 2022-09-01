import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { memo } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  selectedTodoId: number | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, data: {}) => void;
  loading: boolean;
  changedTodosId: number[];
  errorMessage: string;
}

export const TodoList = memo<Props>((props) => {
  const {
    todos,
    selectedTodoId,
    onDeleteTodo,
    onUpdateTodo,
    loading,
    changedTodosId,
    errorMessage,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            classNames="slide"
            timeout={300}
          >
            <TodoItem
              todo={todo}
              selectedTodoId={selectedTodoId}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              loading={loading}
              changedTodosId={changedTodosId}
              errorMessage={errorMessage}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
});
