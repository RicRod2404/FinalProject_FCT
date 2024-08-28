import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const IconWraper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "30rem",
  width: "30rem",
  borderRadius: "50%",
  border: "1px solid #ccc",
});

export default function Admin() {
  return (
    <div style = {{display: 'flex', alignItems: "center", justifyContent:"center", width:"100%", height: "100%", marginTop: "5rem", marginLeft: "10rem"}}>
      <IconWraper>
        <FontAwesomeIcon
          icon={faUserTie}
          style={{ width: "20rem", height: "20rem", color: "var(--grey)" }}
        />
      </IconWraper>
    </div>
  );
}
