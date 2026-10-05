import * as React from 'react';
import { Switch as ShadcnSwitch } from '../ui/switch';

export interface SwitchProps {
  on: boolean;
  set: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  on,
  set,
  label,
  disabled = false,
}) => {
  return (
    <ShadcnSwitch
      checked={on}
      onCheckedChange={set}
      aria-label={label}
      disabled={disabled}
    />
  );
};
