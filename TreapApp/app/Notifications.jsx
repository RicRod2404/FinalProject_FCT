import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../components/NotifsTopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import { notificationsSelector } from '../store/notifs';

const Notif = () => {
    const notifications = useSelector(notificationsSelector);

    return (
        <SafeAreaView style={styles.background}>
            <TopBar title="Notificações" />
            <ScrollView>
                <View style={styles.table}>
                    <View style={styles.notifContainer}>
                        {notifications.notifications.length > 0 ? (
                            notifications.notifications.map((notification, index) => (
                                <Text key={index} style={styles.notif}>{notification}</Text>
                            ))
                        ) : (
                            <Text style={styles.notif}>Sem notificações.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Notif;

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#fffef6',
        flex: 1,
    },
    table: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    notif: {
        padding: 16,
        fontSize: 18,
        fontWeight: '500',
        marginVertical: 1,
    },
    notifContainer: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
});
