import styled from "styled-components";
import { Avatar } from "@mui/material";
const StyledImage = styled(Avatar)`
  margin-right: 20px;
  border-radius: 50%;
  cursor: pointer;
`;
// Componente Logo que usa o StyledLogo
interface ProfileImageProps {
  icon: string;
  onProfileClick?: () => void;
  width?: string;
  height?: string;
}

export default function ProfileImage({ icon, onProfileClick, width, height }: ProfileImageProps) {
  return (
    <div onClick={onProfileClick}>
      <StyledImage
        src={icon}
        style={{ width: width ? width : "45px", height: height ? height : "45px" }}
      />
    </div>
  );
}
