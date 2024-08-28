import Button from "@mui/material/Button";

export default function StyledButton({ children, onClick }: any) {
  return (
    <Button
      onClick={onClick}
      sx={{
        my: 2,
        background: "var(--federal-blue)",
        color: "var(--baby-powder)",
        display: "block",
        ":hover": { background: "var(--veronica)" },
      }}
      variant="contained"
    >
      {children}
    </Button>
  );
}
