import { FC } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (id: number) => void;
  updateTodo: (id: number, data: Partial<Todo>) => void;
  loadTodoById: number[];
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  tempTodo,
  onRemove,
  updateTodo,
  loadTodoById,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              updateTodo={updateTodo}
              todo={todo}
              onRemove={onRemove}
              loadTodoById={loadTodoById}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              updateTodo={updateTodo}
              todo={tempTodo}
              onRemove={onRemove}
              loadTodoById={loadTodoById}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
