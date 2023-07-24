import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TodoList.css';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  isProcessings: number[];
  onUpdate: (todoId: number, args: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos, tempTodo, onDelete, isProcessings, onUpdate,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isProcessings={isProcessings}
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
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
