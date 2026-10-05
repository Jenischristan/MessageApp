import * as React from 'react';
import { Input as ShadcnInput, InputProps as ShadcnInputProps } from '../ui/input';

export interface InputProps extends ShadcnInputProps {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <ShadcnInput ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';
