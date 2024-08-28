import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/MessagesTopBar";
import { httpGet, httpPost } from "../utils/http";
import { useSelector } from "react-redux";
import { sessionSelector } from "../store/session";
import { useLocalSearchParams } from 'expo-router';
import carIcon from "../assets/images/car.png";
import trainIcon from "../assets/images/train.png";
import bikeIcon from "../assets/images/bike.png";
import walkIcon from "../assets/images/walk.png";

const Mensagens = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const session = useSelector(sessionSelector);
  const [sendIcon, setSendIcon] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const flatListRef = useRef();
  const iconAnim = useRef(new Animated.Value(1)).current;
  const iconTranslate = useRef(new Animated.Value(0)).current;
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const { nickname } = useLocalSearchParams();  // Use useLocalSearchParams to get the nickname

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const icons = [carIcon, trainIcon, bikeIcon, walkIcon];
    setSendIcon(icons[Math.floor(Math.random() * icons.length)]);
    httpGet("chats")
      .then((res) => setChats(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (nickname) {
      const chat = chats.find(chat => chat.chatName.includes(nickname));
      if (chat) {
        handleChatPress(chat);
      }
    }
  }, [nickname, chats]);

  const getMsgs = (chatId) => {
    if (!chatId) return;
    httpGet(`chats/messages?chatId=${chatId}`)
      .then((res) => {
        setCurrentChat((prevChat) => ({
          ...prevChat,
          messages: res.data.content || [],
        }));
      })
      .catch(console.error);
  };

  const handleChatPress = (chat) => {
    if (intervalId) clearInterval(intervalId);
    setCurrentChat(null);
    setModalVisible(true);
    httpGet(`chats/messages?chatId=${chat.id}`)
      .then((res) => {
        const chatName = chat.chatName
          .replace(` - ${session.nickname}`, "")
          .replace(`${session.nickname} - `, "");
        setCurrentChat({ ...chat, chatName, messages: res.data.content || [] });
        const id = setInterval(() => getMsgs(chat.id), 2000);
        setIntervalId(id);
      })
      .catch(console.error);
  };

  const sendMessage = () => {
    if (!currentChat || msg.trim() === "") return;

    const duration = sendIcon === walkIcon ? 1000 : 500;

    Animated.parallel([
      sendIcon === bikeIcon || sendIcon === walkIcon
        ? Animated.timing(iconTranslate, {
          toValue: 200,
          duration: duration,
          useNativeDriver: true,
        })
        : Animated.timing(iconAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
    ]).start(() => {
      httpPost(`chats/messages/${currentChat.id}`, {
        originNickname: session.nickname,
        message: msg,
      })
        .then(() => {
          setMsg("");
          setShouldScrollToBottom(true);
          getMsgs(currentChat.id);
          iconAnim.setValue(1);
          iconTranslate.setValue(0);

          const icons = [carIcon, trainIcon, bikeIcon, walkIcon];
          const newSendIcon = icons[Math.floor(Math.random() * icons.length)];
          setSendIcon(newSendIcon);
        })
        .catch(console.error);
    });
  };

  useEffect(() => {
    return () => intervalId && clearInterval(intervalId);
  }, [intervalId]);

  useEffect(() => {
    if (shouldScrollToBottom && flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, currentChat]);

  return (
    <SafeAreaView style={styles.background}>
      <TopBar title="Mensagens" isDark={false} />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <Text style={styles.chat}>
              {item.chatName
                .replace(` - ${session.nickname}`, "")
                .replace(`${session.nickname} - `, "")}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
          if (intervalId) clearInterval(intervalId);
        }}
      >
        <SafeAreaView style={styles.modalBackground}>
          <TopBar
            title={currentChat ? currentChat.chatName : "Chat"}
            isDark={false}
          />
          {currentChat && (
            <>
              <FlatList
                ref={flatListRef}
                data={currentChat.messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.messageContainer,
                      item.originNickname != session.nickname
                        ? styles.messageContainerLeft
                        : styles.messageContainerRight,
                    ]}
                  >
                    <Text
                      style={[
                        styles.nickname,
                        item.originNickname != session.nickname
                          ? styles.nicknameLeft
                          : styles.nicknameRight,
                      ]}
                    >
                      {item.originNickname}
                    </Text>
                    <View
                      style={[
                        styles.message,
                        item.originNickname != session.nickname
                          ? styles.messageLeft
                          : styles.messageRight,
                      ]}
                    >
                      <Text>{item.message}</Text>
                      <Text
                        style={[
                          styles.timestamp,
                          item.originNickname != session.nickname
                            ? styles.timestampLeft
                            : styles.timestampRight,
                        ]}
                      >
                        {formatTimestamp(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                )}
                inverted
              />
              <View style={styles.sendingRow}>
                <TextInput
                  placeholder="Escrever mensagem..."
                  value={msg}
                  onChangeText={setMsg}
                  style={styles.messageBox}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={styles.sendButton}
                >
                  <Animated.Image
                    source={sendIcon}
                    style={[
                      styles.sendIcon,
                      sendIcon === bikeIcon || sendIcon === walkIcon
                        ? { transform: [{ translateX: iconTranslate }] }
                        : { transform: [{ scale: iconAnim }] },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Mensagens;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fffef6",
    flex: 1,
  },
  modalBackground: {
    backgroundColor: "#fffef6",
    flex: 1,
  },
  table: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  chat: {
    padding: 16,
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 1,
    borderColor: "lightgrey",
    borderBottomWidth: 1,
  },
  chatContainer: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  messages: {
    marginTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "70%",
    marginHorizontal: 10, // Add margin to the sides
  },
  messageContainerLeft: {
    alignSelf: "flex-start",
  },
  messageContainerRight: {
    alignSelf: "flex-end",
  },
  nickname: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  nicknameLeft: {
    alignSelf: "flex-start",
  },
  nicknameRight: {
    alignSelf: "flex-end",
  },
  message: {
    padding: 10,
    borderRadius: 10,
  },
  messageLeft: {
    backgroundColor: "#e1ffc7",
  },
  messageRight: {
    backgroundColor: "#ddd2fa",
  },
  timestamp: {
    fontSize: 12,
    color: "grey",
    marginTop: 5,
  },
  timestampLeft: {
    alignSelf: "flex-start",
  },
  timestampRight: {
    alignSelf: "flex-end",
  },
  sendingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    marginBottom: 10,
  },
  messageBox: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    width: "75%",
  },
  sendButton: {
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    width: "15%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
});
