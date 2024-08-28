import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { Stack } from "react-bootstrap";

interface PasswordFieldProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  className?: string;
}

export default function PasswordField(props: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack direction="horizontal" gap={3}>
      <TextField
        className={props.className || "col-12"}
        name={props.name}
        required
        type={showPassword ? "text" : "password"}
        label={props.label}
        onChange={props.handleChange}
      />
      <IconButton onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </Stack>
  );
}
