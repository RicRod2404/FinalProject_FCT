import { View } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import NotificationsIcon from "./NotificationsIcon";

const TopBarContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  padding-left: 0;
  height: 60px;
  background-color: ${(props) => (props.isDark ? "#150f4c" : "#fffef6")};
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.isDark ? "#050224" : "#E0E0E0")};
`;

const LogoAndTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => (props.isDark ? "#fffef6" : "#150f4c")};
`;

const Icon = styled.Image`
  width: 90px;
  height: 90px;
`;
export default function TopBar({ isDark = false, title, children, onClick }) {
  useEffect(() => {}, []);

  const src = {
    uri: "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/logo.png",
  };

  return (
    <TopBarContainer isDark={isDark}>
      <LogoAndTitleContainer>
        <Icon source={src} />
        <Title isDark={isDark}>{title}</Title>
      </LogoAndTitleContainer>
      <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <>
          {children}
        </>
      </View>
    </TopBarContainer>
  );
}
