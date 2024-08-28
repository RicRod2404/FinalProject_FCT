import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { notificationsSelector } from "../store/notifs";

export default function NotificationsIcon({ isDark }) {
  const notifications = useSelector(notificationsSelector);
  const router = useRouter();

  function handlePress() {
    router.push("../Notifications");
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <FontAwesome6
          name={"bell"}
          size={27}
          color={isDark ? "#fffef6" : "#3f3f3f"}
        />
        {notifications.notifications.length > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notifications.notifications.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
});
