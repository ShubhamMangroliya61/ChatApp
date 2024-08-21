// CustomInputField.jsx
import React from 'react';
import TextField from '@mui/material/TextField';

const CustomInputField = React.forwardRef(
    (
        {
            label,
            id,
            placeholder,
            type = "text",
            value,
            required = false,
            onChange,
            disabled = false,
            error
        },
        ref
    ) => {
        return (
            <div className="mb-3">
                <TextField
                    id={id}
                    label={label}
                    variant="standard"
                    color="secondary"
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    required={required}
                    onChange={onChange}
                    disabled={disabled}
                    inputRef={ref}
                    error={error}
                    className='w-full'
                />
            </div>
        );
    }
);

export default CustomInputField;
