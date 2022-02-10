import { KeyValue } from '../../lib/keyboard';
import { getStatuses } from '../../lib/statuses';
import { Key } from './Key';
import { useEffect } from 'react';
import { ENTER_TEXT, DELETE_TEXT } from '../../constants/strings';
import { KeyStates } from '../../lib/getKeyStates';

type Props = {
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  keyStates: KeyStates;
};

export const Keyboard = ({ onChar, onDelete, onEnter, keyStates }: Props) => {
  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter();
    } else if (value === 'DELETE') {
      onDelete();
    } else {
      onChar(value);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter();
      } else if (e.code === 'Backspace') {
        onDelete();
      } else {
        const key = e.key.toUpperCase();
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key);
        }
      }
    };
    window.addEventListener('keyup', listener);
    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [onEnter, onDelete, onChar]);

  return (
    <div>
      <div className="flex justify-center mb-1">
        <Key value="Q" onClick={onClick} status={keyStates['Q']} />
        <Key value="W" onClick={onClick} status={keyStates['W']} />
        <Key value="E" onClick={onClick} status={keyStates['E']} />
        <Key value="R" onClick={onClick} status={keyStates['R']} />
        <Key value="T" onClick={onClick} status={keyStates['T']} />
        <Key value="Y" onClick={onClick} status={keyStates['Y']} />
        <Key value="U" onClick={onClick} status={keyStates['U']} />
        <Key value="I" onClick={onClick} status={keyStates['I']} />
        <Key value="O" onClick={onClick} status={keyStates['O']} />
        <Key value="P" onClick={onClick} status={keyStates['P']} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="A" onClick={onClick} status={keyStates['A']} />
        <Key value="S" onClick={onClick} status={keyStates['S']} />
        <Key value="D" onClick={onClick} status={keyStates['D']} />
        <Key value="F" onClick={onClick} status={keyStates['F']} />
        <Key value="G" onClick={onClick} status={keyStates['G']} />
        <Key value="H" onClick={onClick} status={keyStates['H']} />
        <Key value="J" onClick={onClick} status={keyStates['J']} />
        <Key value="K" onClick={onClick} status={keyStates['K']} />
        <Key value="L" onClick={onClick} status={keyStates['L']} />
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="ENTER" onClick={onClick}>
          {ENTER_TEXT}
        </Key>
        <Key value="Z" onClick={onClick} status={keyStates['Z']} />
        <Key value="X" onClick={onClick} status={keyStates['X']} />
        <Key value="C" onClick={onClick} status={keyStates['C']} />
        <Key value="V" onClick={onClick} status={keyStates['V']} />
        <Key value="B" onClick={onClick} status={keyStates['B']} />
        <Key value="N" onClick={onClick} status={keyStates['N']} />
        <Key value="M" onClick={onClick} status={keyStates['M']} />
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  );
};
