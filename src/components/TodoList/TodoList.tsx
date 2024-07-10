import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/Todo.context';
import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useDeleteTodo } from '../DeleteTodo/useDeleteTodo';
import { useCompleteTodo } from '../CompleteTodo/useCompleteTodo';

interface Props {
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo, loadingIds } = useContext(TodoContext);

  const { onDelete } = useDeleteTodo();
  const { onCompleteTodo } = useCompleteTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isLoading = loadingIds.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={isLoading}
                onDelete={onDelete}
                onCheck={onCompleteTodo}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}

        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo"> */}
        {/* <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form> */}

        {/* <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div> */}
        {/* </div> */}
      </TransitionGroup>
    </section>
  );
};
