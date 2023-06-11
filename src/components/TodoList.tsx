import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import '../styles/animations.css';

interface TodoListProps {
  visibleTodos: TodoType[];
  onTodoRemove: (id: number) => void;
  tempTodo: TodoType | null;
  isLoading: number[];
  onToggleTodo: (id: number) => void;
  onEditTodo: (id: number) => void;
  editedTodoId: number | null;
  editedTodoText: string;
  setEditedTodoText: (newTitle: string) => void;
  onEditedTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setEditedTodoId: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onTodoRemove,
  tempTodo,
  isLoading,
  onToggleTodo,
  onEditTodo,
  editedTodoId,
  editedTodoText,
  setEditedTodoText,
  onEditedTodoSubmit,
  setEditedTodoId,
  inputRef,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <Todo
                inputRef={inputRef}
                editedTodoText={editedTodoText}
                setEditedTodoText={setEditedTodoText}
                onToggleTodo={onToggleTodo}
                todo={todo}
                key={todo.id}
                onTodoRemove={onTodoRemove}
                onEditTodo={onEditTodo}
                editedTodoId={editedTodoId}
                onEditedTodoSubmit={onEditedTodoSubmit}
                setEditedTodoId={setEditedTodoId}
                isLoading={isLoading}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>
              <div className={cn('modal overlay',
                { 'is-active': tempTodo !== null })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
