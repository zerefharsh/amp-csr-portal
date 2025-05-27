// Create this as a new component: components/ui/phone-input.tsx

"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, value = "", ...props }, ref) => {
    
    const formatPhoneNumber = (input: string) => {
      // Remove all non-digits
      const digits = input.replace(/\D/g, '');
      
      // Apply formatting based on length
      if (digits.length === 0) return '';
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange?.(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow backspace to work naturally
      if (e.key === 'Backspace') {
        const cursorPosition = (e.target as HTMLInputElement).selectionStart || 0;
        const currentValue = (e.target as HTMLInputElement).value;
        
        // If cursor is after a formatting character, move it back
        if (cursorPosition > 0 && 
            (currentValue[cursorPosition - 1] === ')' || 
             currentValue[cursorPosition - 1] === ' ' || 
             currentValue[cursorPosition - 1] === '-')) {
          e.preventDefault();
          const newValue = currentValue.slice(0, cursorPosition - 2) + currentValue.slice(cursorPosition);
          const formatted = formatPhoneNumber(newValue);
          onChange?.(formatted);
        }
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="(555) 123-4567"
        maxLength={14} // (xxx) xxx-xxxx
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };