import { Errors } from '../../types/Errors';
import { ToggleAllButton } from '../../components/ToggleAllButton';
import { Form } from '../../components/Form';
import { UpdateReasons } from '../../types/UpdateReasons';

type Props = {
  todosCount: number;
  isAllCompleted: boolean;
  setTitle: (title: string) => void;
  setCurrentError: (error: Errors | null) => void;
  isNewTodoAdding: boolean;
  isAdded: boolean | null;
  currentError: Errors | null;
  isTodoDeleting: boolean;
  setTypeOfStatusChange: (statusChanging: boolean | null) => void;
  setReasonForUpdate: (reason: UpdateReasons | null) => void;
  needAutoFocus: boolean | null;
};

export const Header: React.FC<Props> = ({
  todosCount,
  isAllCompleted,
  setTitle,
  setCurrentError,
  isNewTodoAdding,
  isAdded,
  isTodoDeleting,
  setTypeOfStatusChange,
  setReasonForUpdate,
  needAutoFocus,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosCount > 0 && (
        <ToggleAllButton
          isAllCompleted={isAllCompleted}
          setTypeOfStatusChange={setTypeOfStatusChange}
          setReasonForUpdate={setReasonForUpdate}
        />
      )}

      {/* Add a todo on form submit */}
      <Form
        setTitle={setTitle}
        setCurrentError={setCurrentError}
        isNewTodoAdding={isNewTodoAdding}
        isAdded={isAdded}
        isTodoDeleting={isTodoDeleting}
        needAutoFocus={needAutoFocus}
      />
    </header>
  );
};
