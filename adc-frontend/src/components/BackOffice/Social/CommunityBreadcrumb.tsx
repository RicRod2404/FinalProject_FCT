import { Button } from "react-bootstrap";
import { InputGroup, Form } from "react-bootstrap";
import styled from "styled-components";

interface CommunityBreadCrumbProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StyledBreadcrumbItem = styled.li`
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    color: var(--hover-veronica);
  }
  &.active {
    color: var(--teal);
    font-weight: bold;
  }
`;

export default function CommunityBreadCrumb({
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
}: CommunityBreadCrumbProps) {
  function handleSectionChange(section: string) {
    setActiveSection(section);
  }

  return (
    <nav
      style={{
        marginTop: "4rem",
        marginLeft: "13rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ol
        className="breadcrumb"
        style={{ display: "flex", alignItems: "center", marginBottom: "0" }}
      >
        <StyledBreadcrumbItem
          className={`breadcrumb-item ${activeSection === "minhasComunidades" ? "active" : ""
            }`}
          onClick={() => handleSectionChange("minhasComunidades")}
          style={{ cursor: "pointer" }}
        >
          As Minhas Comunidades
        </StyledBreadcrumbItem>
        <StyledBreadcrumbItem
          className={`breadcrumb-item ${activeSection === "explorar" ? "active" : ""
            }`}
          onClick={() => handleSectionChange("explorar")}
          style={{ cursor: "pointer" }}
        >
          Explorar
        </StyledBreadcrumbItem>
      </ol>
      <InputGroup
        className="mb-3"
        style={{ maxWidth: "300px", marginLeft: "auto" }}
      >
        <Form.Control
          type="text"
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          style={{
            height: "2.4rem",
            backgroundColor: "var(--federal-blue)",
            border: "none",
          }}
        >
          Pesquisar
        </Button>
      </InputGroup>
    </nav>
  );
}
