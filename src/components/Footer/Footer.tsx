import { useContext } from 'react';
import { Filter } from '../Filter/Filter';
import { DispatchContext, StateContext } from '../../store/Store';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Action } from '../../types/Action';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);

  const dispatch = useContext(DispatchContext);

  const getUnCompletedTodos = todos.filter(todo => !todo.completed);

  const getCompletedTodos = todos.filter(todo => todo.completed);

  const deleteTodoHelper = (todo: Todo, action: Action) => {
    deleteTodo(todo.id)
      .then(() => {
        dispatch(action);
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to delete a todo' },
        });
      });
  };

  const handleDeleteTodo = () => {
    getCompletedTodos.forEach(todo => {
      deleteTodoHelper(todo, {
        type: 'REMOVE_LOCAL_TODO',
        payload: { id: todo.id },
      });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getUnCompletedTodos.length} items left
      </span>
      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteTodo}
        disabled={!getCompletedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
