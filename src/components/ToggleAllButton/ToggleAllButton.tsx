import classNames from 'classnames';
import { UpdateReasons } from '../../types/UpdateReasons';

type Props = {
  isAllCompleted: boolean;
  setTypeOfStatusChange: (statusChanging: boolean | null) => void;
  setReasonForUpdate: (reason: UpdateReasons | null) => void;
};

export const ToggleAllButton: React.FC<Props> = ({
  isAllCompleted,
  setTypeOfStatusChange,
  setReasonForUpdate,
}) => {
  const handleToggleAll = () => {
    if (isAllCompleted) {
      setTypeOfStatusChange(false);
    } else {
      setTypeOfStatusChange(true);
    }

    setReasonForUpdate(UpdateReasons.allToggled);
  };

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isAllCompleted,
      })}
      data-cy="ToggleAllButton"
      onClick={handleToggleAll}
    />
  );
};
