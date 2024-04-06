import React from 'react';

import { Form } from '../Form/Form';
import classNames from 'classnames';

type Props = {
  newTitle: string;
  setNewTitle: (event: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isTodosEmpty: boolean;
  isButtonActive: boolean;
  onChangeStatus: () => void;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isInputDisabled,
  inputRef,
  isTodosEmpty,
  isButtonActive,
  onChangeStatus,
}) => {
  return (
    <header className="todoapp__header">
      {!isTodosEmpty && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isButtonActive,
          })}
          data-cy="ToggleAllButton"
          onClick={onChangeStatus}
        />
      )}

      <Form
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        onSubmit={onSubmit}
        isDisabled={isInputDisabled}
        inputRef={inputRef}
      />
    </header>
  );
};
