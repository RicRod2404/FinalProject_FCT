import styled from "styled-components";

interface HomeBreadcrumb {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const StyledBreadcrumbItem = styled.li`
  cursor: pointer;
  &:hover {
    color: var(--hover-veronica);
  }
  &.active {
    color: var(--teal);
    font-weight: bold;
  }
`;

export default function HomeBreadcrumb({
  activeSection,
  setActiveSection,
}: HomeBreadcrumb) {

  function handleSectionChange(section: string) {
    setActiveSection(section);
  }

  return (
    <nav
      style={{
        marginTop: "3rem",
        display: "flex",
        justifyContent:"center",
      }}
    >
      <ol
        className="breadcrumb"
        style={{ display: "flex", alignItems: "center", marginBottom: "0" }}
      >
        <StyledBreadcrumbItem
          className={`breadcrumb-item ${
            activeSection === "Semana" ? "active" : ""
          }`}
          onClick={() => handleSectionChange("Semana")}
          style={{ cursor: "pointer" }}
        >
          Semanal
        </StyledBreadcrumbItem>
        <StyledBreadcrumbItem
          className={`breadcrumb-item ${
            activeSection === "Mês" ? "active" : ""
          }`}
          onClick={() => handleSectionChange("Mês")}
          style={{ cursor: "pointer" }}
        >
          Mensal
        </StyledBreadcrumbItem>
        <StyledBreadcrumbItem
          className={`breadcrumb-item ${
            activeSection === "Ano" ? "active" : ""
          }`}
          onClick={() => handleSectionChange("Ano")}
          style={{ cursor: "pointer" }}
        >
          Anual
        </StyledBreadcrumbItem>
      </ol>
    </nav>
  );
}
