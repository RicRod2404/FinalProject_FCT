import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Tabs, router, useRouter } from "expo-router";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
const TabIcon = ({ color, name, focused, children }) => {
  const session = useSelector(sessionSelector);
  const router = useRouter();
  useEffect(() => {
    if (!session.token) {
      router.replace("/sign-in");
    }
  }, [session]);
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
      {children}
      <Text
        style={[
          {
            fontWeight: focused ? "bold" : "regular",
            fontSize: 13,
            color: color,
          },
        ]}
      >
        {name}
      </Text>
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#35a076", //icon active
          tabBarInactiveTintColor: "#150f4c", //icon inactive
          tabBarStyle: [
            {
              backgroundColor: "#fffef6",
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              height: 80,
            },
          ],
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name={"Início"} focused={focused}>
                <FontAwesome6
                  name={"house"}
                  size={30}
                  color={focused ? styles.icon.Fcolor : styles.icon.color}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: "Social",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name={"Social"} focused={focused}>
                <FontAwesome6
                  name={"users"}
                  size={30}
                  color={focused ? styles.icon.Fcolor : styles.icon.color}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Começar",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name={"Começar"} focused={focused}>
                <FontAwesome6
                  name={"circle-dot"}
                  size={30}
                  color={focused ? styles.icon.Fcolor : styles.icon.color}
                />
              </TabIcon>
            ),
          }}
        />
        {/* <Tabs.Screen
          name="loja"
          options={{
            title: "Loja",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name={"Loja"} focused={focused}>
                <FontAwesome6
                  name={"cart-shopping"}
                  size={30}
                  color={focused ? styles.icon.Fcolor : styles.icon.color}
                />
              </TabIcon>
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name={"Eu"} focused={focused}>
                <FontAwesome6
                  name={"user"}
                  size={30}
                  color={focused ? styles.icon.Fcolor : styles.icon.color}
                  solid
                />
              </TabIcon>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  icon: {
    Fcolor: "#35a076",
    color: "#150f4c",
  },
});
