import React from "react";
import TextField from '@mui/material/TextField';

const CustomInput = React.forwardRef(({
    label,
    placeholder,
    name,
    type = "text",
    value,
    defaultValue,
    required = false,
    onChange,
    disabled = false,
}, ref) => {
    return (
        <div className="flex flex-col gap-1 w-full mt-3">
            <TextField
                color="secondary"
                label={label}
                variant="outlined"
                type={type}
                name={name}
                id={name}
                required={required}
                placeholder={placeholder}
                className="bg-transparent px-2 py-1 border rounded-lg disabled:bg-gray-800"
                onChange={onChange}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                inputRef={ref}
            />
        </div>
    );
});

export default CustomInput;
