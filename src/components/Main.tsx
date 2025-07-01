/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import { Todo } from '../types/Todo';
import { TodoList } from './TodoList';

interface Props {
  filtredItems: Todo[];
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo: Todo | null;
  deletingTodoId: number[];
  loadingTodoId: number[];
  startEditing: (id: number | null, currentTitle: string) => void;
  saveTitle: (id: number) => void;
  editingTodoId: number | null;
  setEditingTitle: (args: string) => void;
  editingTitle: string;
}

export const Main: React.FC<Props> = ({
  filtredItems,
  handleToggle,
  handleDelete,
  deletingTodoId,
  tempTodo,
  loadingTodoId,
  startEditing,
  saveTitle,
  editingTodoId,
  setEditingTitle,
  editingTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        todos={filtredItems}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
        tempTodo={tempTodo}
        deletingTodoId={deletingTodoId}
        loadingTodoId={loadingTodoId}
        startEditing={startEditing}
        saveTitle={saveTitle}
        editingTodoId={editingTodoId}
        setEditingTitle={setEditingTitle}
        editingTitle={editingTitle}
      />
    </section>
  );
};

Main.propTypes = {
  filtredItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      userId: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    userId: PropTypes.number.isRequired,
  }),
  deletingTodoId: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  loadingTodoId: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  startEditing: PropTypes.func.isRequired,
  saveTitle: PropTypes.func.isRequired,
  editingTodoId: PropTypes.number,
  setEditingTitle: PropTypes.func.isRequired,
  editingTitle: PropTypes.string.isRequired,
};
