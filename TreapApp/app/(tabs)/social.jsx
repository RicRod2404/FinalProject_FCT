import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
  Switch,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { httpGet, httpPut, httpDelete, httpPost } from "../../utils/http";
import { sessionSelector } from "../../store/session";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import defaultImage from "../../assets/images/defaultCommunityPic.png";
import emptyGreyImage from "../../assets/images/emptyGrey.png";
import lockedImage from "../../assets/images/locked.png";
import unlockedImage from "../../assets/images/unlocked.png";
import settingsImage from "../../assets/images/settings.png";
import promoteIcon from "../../assets/images/promote.png";
import demoteIcon from "../../assets/images/demote.png";
import chatIcon from "../../assets/images/chat.png";
import changePhotoIcon from "../../assets/images/changePhoto.png";
import leafIcon from "../../assets/images/leaf.png";
import placeIcon from "../../assets/images/place.png";
import ImageViewing from "react-native-image-viewing";
import { useRouter } from "expo-router";

const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const Social = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Posições");
  const [selectedPeriod, setSelectedPeriod] = useState("Máximo");
  const session = useSelector(sessionSelector);
  const [allFriends, setAllFriends] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");
  const [requestsSent, setRequestsSent] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minLevelToJoin: 1,
    isPublic: false,
  });
  const [communityPic, setCommunityPic] = useState(null);
  const [allCommunities, setAllCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [communityDetails, setCommunityDetails] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [isOtherCommunity, setIsOtherCommunity] = useState(false);
  const [communityMembers, setCommunityMembers] = useState({
    leaderNickname: "root",
    members: [
      { nickname: "root" },
      { nickname: "rodrigo" },
      { nickname: "Gwarrior" },
    ],
    moderators: [{ nickname: "clameach" }],
  });
  const [communityRequests, setCommunityRequests] = useState([]);
  const [communitySearch, setCommunitySearch] = useState([]);
  const [communitySettingsModalVisible, setCommunitySettingsModalVisible] =
    useState(false);
  const [editFormData, setEditFormData] = useState({
    oldName: "",
    name: "",
    description: "",
    minLevelToJoin: "",
    isPublic: "",
    communityPic: null,
  });
  const [editCommunityPic, setEditCommunityPic] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [friendsProfilePics, setFriendsProfilePics] = useState({});
  const [monthlyRankingU, setMonthlyRankingU] = useState([]);
  const [yearlyRankingU, setYearlyRankingU] = useState([]);
  const [lifetimeRankingU, setLifetimeRankingU] = useState([]);
  const [monthlyRankingC, setMonthlyRankingC] = useState([]);
  const [yearlyRankingC, setYearlyRankingC] = useState([]);
  const [lifetimeRankingC, setLifetimeRankingC] = useState([]);
  const [nameInputHeight, setNameInputHeight] = useState(40); // Altura inicial
  const [descriptionInputHeight, setDescriptionInputHeight] = useState(40); // Altura inicial
  const [editNameInputHeight, setEditNameInputHeight] = useState(40); // Altura inicial
  const [editDescriptionInputHeight, setEditDescriptionInputHeight] = useState(40); // Altura inicial



  const fetchMonthlyRankingU = async (month, year, page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/users/monthly?month=${month}&year=${year}&page=${page}&size=${size}`);
      setMonthlyRankingU(response.data.content);
    } catch (error) {
      console.error("Error fetching monthly user ranking:", error);
    }
  };

  const fetchYearlyRankingU = async (year, page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/users/yearly?year=${year}&page=${page}&size=${size}`);
      setYearlyRankingU(response.data.content);
    } catch (error) {
      console.error("Error fetching yearly user ranking:", error);
    }
  };

  const fetchLifetimeRankingU = async (page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/users?page=${page}&size=${size}`);
      setLifetimeRankingU(response.data.content);
    } catch (error) {
      console.error("Error fetching lifetime user ranking:", error);
    }
  };

  const fetchMonthlyRankingC = async (month, year, page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/communities/monthly?month=${month}&year=${year}&page=${page}&size=${size}`);
      setMonthlyRankingC(response.data.content);
    } catch (error) {
      console.error("Error fetching monthly community ranking:", error);
    }
  };

  const fetchYearlyRankingC = async (year, page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/communities/yearly?year=${year}&page=${page}&size=${size}`);
      setYearlyRankingC(response.data.content);
    } catch (error) {
      console.error("Error fetching yearly community ranking:", error);
    }
  };

  const fetchLifetimeRankingC = async (page = 0, size = 50) => {
    try {
      const response = await httpGet(`/rankings/communities?page=${page}&size=${size}`);
      setLifetimeRankingC(response.data.content);
    } catch (error) {
      console.error("Error fetching lifetime community ranking:", error);
    }
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  
  useEffect(() => {
    if (session.isLogged) {
      onRefresh();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Jan = 0, Dec = 11
      const currentYear = currentDate.getFullYear();
      fetchMonthlyRankingU(currentMonth, currentYear);
      fetchYearlyRankingU(currentYear);
      fetchLifetimeRankingU();
      fetchMonthlyRankingC(currentMonth, currentYear);
      fetchYearlyRankingC(currentYear);
      fetchLifetimeRankingC();
    }
  }, [session.isLogged]);

  const clearCommunityDetails = () => {
    setCommunityDetails(null);
    setCommunityMembers({
      leaderNickname: "root",
      members: [],
      moderators: [],
    });
    setCommunityRequests([]);
  };

  const getUserProfilePic = async (nickname) => {
    try {
      const response = await httpGet(`/users/${nickname}`);
      setFriendsProfilePics(prevState => ({
        ...prevState,
        [nickname]: response.data.profilePic
      }));
      return response.data.profilePic;
    } catch (error) {
      console.error("Error fetching user profile pic:", error);
      return defaultImageUri;
    }
  };


  const fetchCommunityMembers = async (communityName) => {
    try {
      const response = await httpGet(`communities/members/${communityName}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching community members:", error);
      return [];
    }
  };

  const fetchCommunityRequests = async (communityName) => {
    try {
      const response = await httpGet(`/communities/requests/${communityName}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching community requests:", error);
      return [];
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await httpGet("/communities");
      const allCommunities = response.data;

      try {
        const joinedResponse = await httpGet(
          "/communities/user/" + session.nickname
        );
        const joinedCommunitiesData = joinedResponse.data;
        const userCommunities = joinedCommunitiesData.filter(
          (community) => community.leaderNickname == session.nickname
        );

        const joinedCommunitiesList = joinedCommunitiesData.filter(
          (community) => community.leaderNickname != session.nickname
        );

        const otherCommunities = allCommunities.filter(
          (community) =>
            community.leaderNickname != session.nickname &&
            !joinedCommunitiesList.some(
              (joined) => joined.name == community.name
            )
        );

        // Ordenando as listas alfabeticamente pelo nome da comunidade
        userCommunities.sort((a, b) => a.name.localeCompare(b.name));
        joinedCommunitiesList.sort((a, b) => a.name.localeCompare(b.name));
        otherCommunities.sort((a, b) => a.name.localeCompare(b.name));

        setMyCommunities(userCommunities);
        setJoinedCommunities(joinedCommunitiesList);
        setAllCommunities(otherCommunities);
      } catch (joinedError) {
        console.error("Error fetching joined communities:", joinedError);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchCommunityDetails = async (communityName) => {
    try {
      const response = await httpGet(`/communities/${communityName}`);
      setCommunityDetails(response.data);
      setIsOtherCommunity(
        allCommunities.some((community) => community.name === communityName)
      );

      const members = await fetchCommunityMembers(communityName);
      setCommunityMembers(members);

      //caso o usuário seja líder ou moderador da comunidade, ele pode ver os pedidos de entrada
      if (members.leaderNickname == session.nickname || members.moderators.some((moderator) => moderator.nickname == session.nickname)) {
        const requests = await fetchCommunityRequests(communityName);
        setCommunityRequests(requests);
      }
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const joinCommunity = async (communityName) => {
    try {
      await httpPut(`/communities/join/${communityName}`);
      if (allCommunities.some((community) => community.name == communityName && !community.isPublic)) {
        ToastAndroid.show("Pedido enviado", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Entrou na comunidade", ToastAndroid.SHORT);
      }

      onRefresh();
      setViewModalVisible(false);
    } catch (error) {
      console.error("Error joining community:", error.message);
      const regex403 = /403/;
      if (regex403.test(error.message)) {
        ToastAndroid.show("Nível insuficiente", ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show("Erro ao entrar na comunidade", ToastAndroid.SHORT);
    }
  };

  const leaveCommunity = async (communityName) => {
    Alert.alert(
      "Sair da Comunidade",
      `Tem a certeza de que deseja sair da comunidade ${communityName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const form = {
                name: communityName,
                nickname: session.nickname,
              };
              await httpPut("/communities/leave", form);
              ToastAndroid.show("Saiu da comunidade", ToastAndroid.SHORT);
              onRefresh();
              setViewModalVisible(false);
              clearCommunityDetails();
            } catch (error) {
              console.error("Erro ao sair da comunidade:", error);
              ToastAndroid.show("Erro ao sair da comunidade", ToastAndroid.SHORT);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openChatWith = async (nickname) => {
    setViewModalVisible(false);
    setCommunitySettingsModalVisible(false);
    setModalVisible(false);

    try {
      const response = await httpPost(`/chats/${nickname}`);
      router.push(`../DM?nickname=${nickname}`);
    } catch (error) {
      const regex409 = /409/;
      const regex404 = /404/;
      if (regex409.test(error.message) || regex404.test(error.message)) {
        // Redirecionar para o chat existente
        router.push(`../DM?nickname=${nickname}`);
        return;
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    httpGet("/friends/requests/sent")
      .then((response) => {
        setRequestsSent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sent friend requests:", error);
      });

    httpGet(`/friends/${session.nickname}`)
      .then((response) => {
        setAllFriends(response.data);

        httpGet("/friends/requests")
          .then((response) => {
            setAllRequests(response.data);
            setRefreshing(false);
          })
          .catch((error) => {
            console.error("Error fetching friend requests:", error);
            setRefreshing(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
        setRefreshing(false);
      });

    fetchCommunities();
  };

  const acceptFriendRequest = (friendNickname) => {
    httpPut(`/friends/accept/${friendNickname}`)
      .then(() => {
        onRefresh();
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
      });
  };

  const rejectFriendRequest = (friendNickname) => {
    Alert.alert(
      "Rejeitar pedido de amizade",
      `Deseja rejeitar o pedido de amizade de ${friendNickname}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            httpPut(`/friends/reject/${friendNickname}`)
              .then(() => {
                onRefresh();
                ToastAndroid.show("Pedido rejeitado", ToastAndroid.SHORT);
              })
              .catch((error) => {
                console.error("Erro ao rejeitar o pedido de amizade:", error);
                ToastAndroid.show("Erro ao rejeitar o pedido de amizade", ToastAndroid.SHORT);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const removeFriend = (friendNickname) => {
    Alert.alert(
      "Remover amigo",
      `Deseja remover ${friendNickname} da sua lista de amigos?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            httpPut(`/friends/remove/${friendNickname}`)
              .then(() => {
                onRefresh();
                ToastAndroid.show("Amigo removido", ToastAndroid.SHORT);
              })
              .catch((error) => {
                console.error("Erro ao remover o amigo:", error);
                ToastAndroid.show("Erro ao remover o amigo", ToastAndroid.SHORT);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const searchFriend = (nickname) => {
    if (nickname == "") {
      setFriendSearch("");
      return;
    }
    httpGet(`/users/search/${nickname}`)
      .then((response) => {
        if (response.data.length == 0) {
          setFriendSearch("");
          return;
        }
        let filteredUsers = response.data.filter((user) => {
          return (
            user !== session.nickname &&
            !allFriends.includes(user) &&
            !allRequests.includes(user) &&
            !requestsSent.includes(user)
          );
        });
        if (filteredUsers.length === 0) {
          setFriendSearch("");
          return;
        }
        setFriendSearch(filteredUsers);
      })
      .catch((error) => {
        console.error("Error searching for user:", error);
      });
  };

  const sendFriendRequest = (friendNickname) => {
    httpPut(`/friends/${friendNickname}`)
      .then(() => {
        onRefresh();
        setFriendSearch(friendSearch.filter((user) => user !== friendNickname));
      })
      .catch((error) => {
        console.error("Error sending friend request:", error);
      });
  };

  const cancelFriendRequest = (friendNickname) => {
    httpPut(`/friends/cancel/${friendNickname}`)
      .then(() => {
        onRefresh();
      })
      .catch((error) => {
        console.error("Error cancelling friend request:", error);
      });
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileInputChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCommunityPic(result.assets[0]);
    }
  };

  const handleFormSubmit = async () => {
    if (
      formData.name == "" ||
      formData.description == ""
    ) {
      ToastAndroid.show("Nome e descrição são obrigatórios", ToastAndroid.SHORT);
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + "community.json";
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(formData), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const requestData = new FormData();
      requestData.append("form", {
        uri: fileUri,
        name: "community.json",
        type: "application/json",
      });

      if (communityPic) {
        requestData.append("communityPic", {
          uri: communityPic.uri,
          name: communityPic.fileName,
          type: communityPic.mimeType,
        });
      }

      const response = await axios.post("/communities", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalVisible(false);
      onRefresh();
      setFormData({
        name: "",
        description: "",
        minLevelToJoin: 1,
        isPublic: false,
      });
      setCommunityPic(null);
      ToastAndroid.show("Comunidade criada com sucesso", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error creating community:", error);
      setFormData({
        name: "",
        description: "",
        minLevelToJoin: 1,
        isPublic: false,
      });
      setCommunityPic(null);
      const regex409 = /409/;
      const regex403 = /403/;
      if (regex409.test(error.message)) {
        ToastAndroid.show("Já existe uma comunidade com esse nome", ToastAndroid.SHORT);
        return;
      } else if (regex403.test(error.message)) {
        ToastAndroid.show("Precisa de estar pelo menos em nível 5", ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show("Erro ao criar a comunidade: " + error.message, ToastAndroid.SHORT);
    }
    onRefresh();
  };

  const cancelCreateCommunity = () => {
    setModalVisible(false);
    setFormData({
      name: "",
      description: "",
      minLevelToJoin: 1,
      isPublic: false,
    });
    setCommunityPic(null);
  };

  const openImageModal = (imageUri) => {
    if (
      typeof imageUri != "string" ||
      imageUri == "" ||
      imageUri == "null" ||
      imageUri == "undefined" ||
      !imageUri
    ) {
      imageUri = defaultImageUri;
    }
    setSelectedImageUri(imageUri);
    setImageModalVisible(true);
  };

  const showCommunityVisibilityNotification = (isPublic) => {
    ToastAndroid.show(`Esta comunidade é ${isPublic ? "pública" : "privada"}`, ToastAndroid.SHORT);
  };

  const searchCommunity = async (communityName) => {
    if (communityName === "") {
      setCommunitySearch([]);
      return;
    }
    try {
      const response = await httpGet(`/communities/search/${communityName}`);
      const communityDetails = await Promise.all(
        response.data.map(async (communityName) => {
          const communityDetailResponse = await httpGet(`/communities/${communityName}`
          );
          return communityDetailResponse.data;
        })
      );
      setCommunitySearch(communityDetails);
    } catch (error) {
      console.error("Error searching for community:", error);
    }
  };

  const openCommunitySettingsModal = () => {
    setEditFormData({
      oldName: communityDetails.name,
      name: communityDetails.name,
      description: communityDetails.description,
      minLevelToJoin: communityDetails.minLevelToJoin,
      isPublic: communityDetails.isPublic,
      communityPic: null,
    });
    setViewModalVisible(false);
    setCommunitySettingsModalVisible(true);
  };

  const closeCommunitySettingsModal = () => {
    setCommunitySettingsModalVisible(false);
    setViewModalVisible(true);
    setDeleteConfirmation("");
  };

  const handleEditInputChange = (name, value) => {
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFileInputChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditCommunityPic(result.assets[0]);
      setEditFormData({
        ...editFormData,
        communityPic: result.assets[0].uri,
      });
    }
  };

  const confirmEditCommunity = async () => {
    if (
      editFormData.name == "" ||
      editFormData.description == ""
    ) {
      ToastAndroid.show("Nome e descrição são obrigatórios", ToastAndroid.SHORT);
      return;
    }
    try {
      const fileUri = FileSystem.documentDirectory + "editCommunity.json";
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(editFormData),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      const requestData = new FormData();
      requestData.append("form", {
        uri: fileUri,
        name: "editCommunity.json",
        type: "application/json",
      });

      if (editCommunityPic) {
        requestData.append("communityPic", {
          uri: editCommunityPic.uri,
          name: editCommunityPic.fileName,
          type: editCommunityPic.mimeType,
        });
      } else {
        const uriTemp = communityDetails.communityPic
          ? communityDetails.communityPic
          : defaultImageUri;
        requestData.append("communityPic", {
          uri: uriTemp,
          name: "communityPic.png",
          type: "image/png",
        });
      }

      const response = await axios.put(
        `/communities/${editFormData.oldName}`,
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      closeCommunitySettingsModal();
      await fetchCommunityDetails(editFormData.name); // Atualiza os detalhes da comunidade após a edição
      onRefresh();
      setEditFormData({
        oldName: "",
        name: "",
        description: "",
        minLevelToJoin: "",
        isPublic: "",
        communityPic: null,
      });
      setEditCommunityPic(null);
      ToastAndroid.show("Comunidade editada com sucesso", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error editing community:", error);
      setEditFormData({
        oldName: "",
        name: "",
        description: "",
        minLevelToJoin: "",
        isPublic: "",
        communityPic: null,
      });
      setEditCommunityPic(null);
      ToastAndroid.show("Erro ao editar a comunidade: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleEditFormSubmit = async () => {
    Alert.alert(
      "Editar Comunidade",
      `Tem a certeza de que deseja editar a comunidade ${editFormData.oldName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => confirmEditCommunity(),
        },
      ],
      { cancelable: false }
    );
    setDeleteConfirmation("");
  };

  const deleteCommunity = async (communityName) => {
    try {
      await httpDelete(`/communities/${communityName}`);
      ToastAndroid.show("Comunidade apagada", ToastAndroid.SHORT);
      closeCommunitySettingsModal();
      onRefresh();
      // Fechar a modal de detalhes da comunidade
      setViewModalVisible(false);
    } catch (error) {
      console.error("Erro ao apagar a comunidade:", error);
      ToastAndroid.show("Erro ao apagar a comunidade: " + error.message, ToastAndroid.SHORT);
    }
  };

  const confirmDeleteCommunity = () => {
    if (deleteConfirmation === editFormData.oldName) {
      deleteCommunity(editFormData.oldName);
    } else {
      ToastAndroid.show("O nome da comunidade não corresponde", ToastAndroid.SHORT);
    }
  };

  const promoteMember = async (communityName, memberNickname) => {
    try {
      const form = {
        name: communityName,
        nickname: memberNickname,
      };
      await httpPost(`/communities/promote/${communityName}`, form);
      ToastAndroid.show(`${memberNickname} foi promovido`, ToastAndroid.SHORT);
      await fetchCommunityDetails(communityName); // Atualiza os detalhes da comunidade após a promoção
      onRefresh();
    } catch (error) {
      console.error("Erro ao promover membro:", error);
      ToastAndroid.show("Erro ao promover membro", ToastAndroid.SHORT);
    }
  };

  const demoteMember = async (communityName, memberNickname) => {
    try {
      const form = {
        name: communityName,
        nickname: memberNickname,
      };
      await httpPost(`/communities/demote/${communityName}`, form);
      ToastAndroid.show(`${memberNickname} foi despromovido`, ToastAndroid.SHORT);
      await fetchCommunityDetails(communityName); // Atualiza os detalhes da comunidade após a despromoção
      onRefresh();
    } catch (error) {
      console.error("Erro ao despromover membro:", error);
      ToastAndroid.show("Erro ao despromover membro", ToastAndroid.SHORT);
    }
  };

  const renderMemberActions = (communityName, member) => {
    if (!myCommunities.some((community) => community.name == communityName)) {
      return null; // Não renderiza ícones se a comunidade não estiver em `myCommunities`
    }

    // Se o membro for líder da comunidade, não renderiza ícones
    if (communityMembers.leaderNickname === member.nickname) {
      return null;
    }

    const isModerator = communityMembers.moderators.some(
      (moderator) => moderator.nickname === member.nickname
    );

    return (
      <View style={styles.actionIconsContainer}>
        <TouchableOpacity onPress={() => promoteMember(communityName, member.nickname)}>
          <Image source={promoteIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        {isModerator && (
          <TouchableOpacity onPress={() => demoteMember(communityName, member.nickname)}>
            <Image source={demoteIcon} style={styles.actionIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderMember = (communityName, member, index) => (
    <View key={index} style={styles.memberRow}>
      <Image
        source={{ uri: member.profilePic || defaultImageUri }}
        style={styles.memberImage}
      />
      <Text style={styles.memberText}>{member.nickname}</Text>
      {renderMemberActions(communityName, member)}
    </View>
  );

  const acceptCommunityRequest = async (communityName, nickname) => {
    try {
      const form = {
        name: communityName,
        nickname: nickname,
      };
      await httpPut(`/communities/accept`, form);
      ToastAndroid.show(`${nickname} foi aceite na comunidade`, ToastAndroid.SHORT);
      fetchCommunityDetails(communityName);
    } catch (error) {
      console.error("Erro ao aceitar pedido de entrada:", error);
      ToastAndroid.show("Erro ao aceitar pedido de entrada", ToastAndroid.SHORT);
    }
  };

  const rejectCommunityRequest = async (communityName, nickname) => {
    try {
      const form = {
        name: communityName,
        nickname: nickname,
      };
      await httpPut(`/communities/reject`, form);
      ToastAndroid.show(`${nickname} foi rejeitado na comunidade`, ToastAndroid.SHORT);
      fetchCommunityDetails(communityName);
    } catch (error) {
      console.error("Erro ao rejeitar pedido de entrada:", error);
      ToastAndroid.show("Erro ao rejeitar pedido de entrada", ToastAndroid.SHORT);
    }
  };

  const renderRequestActions = (communityName, request) => {
    const isLeader = communityDetails.leaderNickname === session.nickname;
    const isModerator = communityMembers.moderators.some(
      (moderator) => moderator.nickname === session.nickname
    );

    if (!isLeader && !isModerator) {
      return null; // Não renderiza os botões se o usuário não for líder ou moderador
    }

    return (
      <View style={styles.requestActionsContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptCommunityRequest(communityName, request.nickname)}
        >
          <Text style={{ color: "white" }}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectCommunityRequest(communityName, request.nickname)}
        >
          <Text style={{ color: "white" }}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRequest = (communityName, request, index) => (
    <View key={index} style={styles.memberRow}>
      <Image
        source={{ uri: request.profilePic || defaultImageUri }}
        style={styles.memberImage}
      />
      <Text style={styles.memberText}>{request.nickname}</Text>
      {renderRequestActions(communityName, request)}
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "Posições":
        return (
          <>
            <View style={styles.periodTabs}>
              {["Máximo", "1 Ano", "1 Mês"].map((period, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.periodTab,
                    selectedPeriod === period && styles.selectedPeriodTab,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={styles.periodTabText}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={{ marginTop: 20, alignSelf: "center" }}>Eu</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Image source={placeIcon} style={styles.placeIcon} />
                  <Text style={styles.headerText}>Nome</Text>
                  <Image source={leafIcon} style={styles.leafIcon} />
                </View>
                {lifetimeRankingU.find((place) => place.targetName == session.nickname) && selectedPeriod == "Máximo" && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{lifetimeRankingU.findIndex((place) => place.targetName == session.nickname) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{session.nickname}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{lifetimeRankingU.find((place) => place.targetName == session.nickname).leafPoints}</Text>
                  </View>
                )}
                {yearlyRankingU.find((place) => place.targetName == session.nickname) && selectedPeriod == "1 Ano" ? (
                  <View style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{yearlyRankingU.findIndex((place) => place.targetName == session.nickname) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{session.nickname}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{yearlyRankingU.find((place) => place.targetName == session.nickname).leafPoints}</Text>
                  </View>
                ) : (
                  selectedPeriod == "1 Ano" && (
                    <View style={styles.tableRow}>
                      <Text style={[styles.rowText, { flex: 2 }]}>-</Text>
                      <Text style={[styles.rowText, { flex: 2 }]}>{session.nickname}</Text>
                      <Text style={[styles.rowText, { flex: 2 }]}>-</Text>
                    </View>
                  )
                )}
                {monthlyRankingU.find((place) => place.targetName == session.nickname) && selectedPeriod == "1 Mês" ? (
                  <View style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{monthlyRankingU.findIndex((place) => place.targetName == session.nickname) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{session.nickname}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{monthlyRankingU.find((place) => place.targetName == session.nickname).leafPoints}</Text>
                  </View>
                ) : (
                  selectedPeriod == "1 Mês" && (
                    <View style={styles.tableRow}>
                      <Text style={[styles.rowText, { flex: 2 }]}>-</Text>
                      <Text style={[styles.rowText, { flex: 2 }]}>{session.nickname}</Text>
                      <Text style={[styles.rowText, { flex: 2 }]}>-</Text>
                    </View>
                  )
                )}
              </View>
              <Text style={{ marginTop: 20, alignSelf: "center" }}>Comunidades</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Image source={placeIcon} style={styles.placeIcon} />
                  <Text style={styles.headerText}>Nome</Text>
                  <Image source={leafIcon} style={styles.leafIcon} />
                </View>
                {selectedPeriod == "Máximo" && lifetimeRankingC.map((community, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{lifetimeRankingC.findIndex((place) => place.targetName == community.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(community.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{community.leafPoints}</Text>
                  </View>
                ))}
                {selectedPeriod == "1 Ano" && yearlyRankingC.map((community, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{yearlyRankingC.findIndex((place) => place.targetName == community.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(community.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{community.leafPoints}</Text>
                  </View>
                ))}
                {selectedPeriod == "1 Mês" && monthlyRankingC.map((community, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{monthlyRankingC.findIndex((place) => place.targetName == community.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(community.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{community.leafPoints}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ marginTop: 20, alignSelf: "center" }}>Utilizadores</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Image source={placeIcon} style={styles.placeIcon} />
                  <Text style={styles.headerText}>Nome</Text>
                  <Image source={leafIcon} style={styles.leafIcon} />
                </View>
                {selectedPeriod == "Máximo" && lifetimeRankingU.map((user, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{lifetimeRankingU.findIndex((place) => place.targetName == user.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(user.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{user.leafPoints}</Text>
                  </View>
                ))}
                {selectedPeriod == "1 Ano" && yearlyRankingU.map((user, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{yearlyRankingU.findIndex((place) => place.targetName == user.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(user.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{user.leafPoints}</Text>
                  </View>
                ))}
                {selectedPeriod == "1 Mês" && monthlyRankingU.map((user, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{monthlyRankingU.findIndex((place) => place.targetName == user.targetName) + 1}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{truncateText(user.targetName, 10)}</Text>
                    <Text style={[styles.rowText, { flex: 2 }]}>{user.leafPoints}</Text>
                  </View>
                ))}
              </View>
              <View style={{ marginBottom: 170 }} />
            </ScrollView>
          </>
        );
      case "Comunidades":
        return (
          <>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={[
                  styles.communitySearchInput,
                  isSearchActive && styles.searchInputActive,
                ]}
                placeholder="Procurar comunidades"
                placeholderTextColor="#ccc"
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
                onChangeText={searchCommunity}
              />
              {!isSearchActive && (
                <TouchableOpacity
                  style={styles.communitySearchButton}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={styles.communitySearchButtonTextContainer}>
                    <Text style={styles.communitySearchButtonText}>+</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {communitySearch.length > 0 && (
                <View style={styles.table}>
                  {communitySearch.map((community, index) => (
                    <TouchableOpacity key={`community-search-${index}`} style={styles.tableRow} onPress={() => { fetchCommunityDetails(community.name); setViewModalVisible(true); }}>
                      <TouchableOpacity onPress={() => openImageModal(community.communityPic ? community.communityPic : defaultImage)}>
                        <Image source={community.communityPic ? { uri: community.communityPic } : defaultImage} style={styles.roundImage} />
                      </TouchableOpacity>
                      <Text style={[styles.rowText, { flex: 2, fontWeight: "500" }]}>{community.name}</Text>
                      <Text style={[styles.rowText, { flex: 2, fontWeight: community.description ? "300" : "100" }]}>{community.description ? community.description : "Sem descrição"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                As Tuas Comunidades
              </Text>
              <View style={styles.table}>
                {myCommunities.map((community) => (
                  <TouchableOpacity key={community.name} style={styles.tableRow} onPress={() => { fetchCommunityDetails(community.name); setViewModalVisible(true); }}>
                    <Image source={community.communityPic ? { uri: community.communityPic } : defaultImage} style={styles.roundImage} />
                    <Text style={[styles.rowText, { flex: 2, fontWeight: "500" }]}>{truncateText(community.name, 15)}</Text>
                    <Text style={[styles.rowText, { flex: 2, fontWeight: community.description ? "300" : "100" }]}>{community.description ? truncateText(community.description, 15) : "Sem descrição"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Comunidades a que Pertences
              </Text>
              <View style={styles.table}>
                {joinedCommunities.map((community) => (
                  <TouchableOpacity key={community.name} style={styles.tableRow} onPress={() => { fetchCommunityDetails(community.name); setViewModalVisible(true); }}>
                    <TouchableOpacity onPress={() => openImageModal(community.communityPic ? community.communityPic : defaultImage)}>
                      <Image source={community.communityPic ? { uri: community.communityPic } : defaultImage} style={styles.roundImage} />
                    </TouchableOpacity>
                    <Text style={[styles.rowText, { flex: 2, fontWeight: "500" }]}>{truncateText(community.name, 15)}</Text>
                    <Text style={[styles.rowText, { flex: 2, fontWeight: community.description ? "300" : "100" }]}>{community.description ? truncateText(community.description, 15) : "Sem descrição"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Outras Comunidades
              </Text>
              <View style={styles.table}>
                {allCommunities.map((community) => (
                  <TouchableOpacity key={community.name} style={styles.tableRow} onPress={() => { fetchCommunityDetails(community.name); setViewModalVisible(true); }}>
                    <TouchableOpacity onPress={() => openImageModal(community.communityPic ? community.communityPic : defaultImage)}>
                      <Image source={community.communityPic ? { uri: community.communityPic } : defaultImage} style={styles.roundImage} />
                    </TouchableOpacity>
                    <Text style={[styles.rowText, { flex: 2, fontWeight: "500" }]}>{truncateText(community.name, 15)}</Text>
                    <Text style={[styles.rowText, { flex: 2, fontWeight: community.description ? "300" : "100" }]}>{community.description ? truncateText(community.description, 15) : "Sem descrição"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        );
      case "Amizades":
        return (
          <>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Procurar amigos"
                placeholderTextColor="#ccc"
                onChangeText={searchFriend}
              />
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {friendSearch !== "" && (
                <View style={styles.table}>
                  {friendSearch.map((friend, index) => (
                    <View key={`friend-search-${index}`} style={styles.tableRow}>
                      <Image source={{ uri: friendsProfilePics[friend] || defaultImageUri }} style={styles.roundImage} onLoad={() => { if (!friendsProfilePics[friend]) { getUserProfilePic(friend); } }} />
                      <Text style={[styles.rowText, { flex: 2, textAlign: "left", marginLeft: 10 }]}>{friend}</Text>
                      <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={() => { sendFriendRequest(friend); }}>
                        <Text style={{ color: "white" }}>Adicionar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {requestsSent.length > 0 && (
                <>
                  <Text
                    style={{
                      marginTop: 20,
                      alignSelf: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Pedidos de Amizade Enviados
                  </Text>
                  <View style={styles.table}>
                    {requestsSent.map((request, index) => (
                      <View key={`request-sent-${index}`} style={styles.tableRow}>
                        <Image source={{ uri: friendsProfilePics[request] || defaultImageUri }} style={styles.roundImage} onLoad={() => { if (!friendsProfilePics[request]) { getUserProfilePic(request); } }} />
                        <Text style={[styles.rowText, { flex: 2, textAlign: "left", marginLeft: 10 }]}>{request}</Text>
                        <TouchableOpacity style={[styles.rejectButton, { flex: 1 }]} onPress={() => { cancelFriendRequest(request); }}>
                          <Text style={{ color: "white" }}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </>
              )}
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Amigos
              </Text>
              {allFriends.length == 0 ? (
                <Text style={{ marginTop: 20, alignSelf: "center" }}>
                  Sem amigos
                </Text>
              ) : (
                <View style={styles.table}>
                  {allFriends.map((friend, index) => (
                    <View key={`friend-${index}`} style={styles.tableRow}>
                      <Image source={{ uri: friendsProfilePics[friend] || defaultImageUri }} style={styles.roundImage} onLoad={() => { if (!friendsProfilePics[friend]) { getUserProfilePic(friend); } }} />
                      <Text style={[styles.rowText, { flex: 2, textAlign: "left", marginLeft: 10 }]}>{friend}</Text>
                      <TouchableOpacity style={[styles.chatButton, { flex: 1 }]} onPress={() => openChatWith(friend)}>
                        <Image source={chatIcon} style={styles.chatIcon} />
                      </TouchableOpacity>
                      <Text> </Text>
                      <TouchableOpacity style={[styles.removeButton, { flex: 1 }]} onPress={() => removeFriend(friend)}>
                        <Text style={{ color: "white" }}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Pedidos de Amizade
              </Text>
              {allRequests.length == 0 ? (
                <Text style={{ marginTop: 20, alignSelf: "center" }}>
                  Sem pedidos de amizade
                </Text>
              ) : (
                <View style={styles.table}>
                  {allRequests.map((request, index) => (
                    <View key={`request-${index}`} style={styles.tableRow}>
                      <Image source={{ uri: friendsProfilePics[request] || defaultImageUri }} style={styles.roundImage} onLoad={() => { if (!friendsProfilePics[request]) { getUserProfilePic(request); } }} />
                      <Text style={[styles.rowText, { flex: 2, textAlign: "left", marginLeft: 10 }]}>{request}</Text>
                      <TouchableOpacity style={[styles.acceptButton, { flex: 1 }]} onPress={() => acceptFriendRequest(request)}>
                        <Text style={{ color: "white" }}>Aceitar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.rejectButton, { flex: 1 }]} onPress={() => rejectFriendRequest(request)}>
                        <Text style={{ color: "white" }}>Rejeitar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <View style={{ marginBottom: 160 }} />
            </ScrollView>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title={"Social"} />
      <View style={styles.tabBar}>
        {["Posições", "Comunidades", "Amizades"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tabItem}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalTitle}>Criar Comunidade</Text>
              <TouchableOpacity onPress={handleFileInputChange}>
                {communityPic ? (
                  <Image source={{ uri: communityPic.uri }} style={styles.communityImage} />
                ) : (
                  <>
                    <View style={styles.imageContainer}>
                      <Image source={emptyGreyImage} style={styles.communityImage} />
                    </View>
                    <View style={styles.iconContainer}>
                      <Image source={changePhotoIcon} style={styles.changePhotoIcon} />
                    </View>
                  </>
                )}
              </TouchableOpacity>
              <TextInput
                style={[styles.modalInput, { height: nameInputHeight }]}
                placeholder="Nome da Comunidade"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                maxLength={800}
                multiline={true}
                numberOfLines={4}
                onContentSizeChange={(e) =>
                  setNameInputHeight(e.nativeEvent.contentSize.height)
                }
              />
              <TextInput
                style={[styles.modalInput, { height: descriptionInputHeight }]}
                placeholder="Descrição"
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                maxLength={800}
                multiline={true}
                numberOfLines={4}
                onContentSizeChange={(e) =>
                  setDescriptionInputHeight(e.nativeEvent.contentSize.height)
                }
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Nível mínimo:</Text>
                <Picker
                  selectedValue={formData.minLevelToJoin}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleInputChange("minLevelToJoin", itemValue)
                  }
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((level, index) => (
                    <Picker.Item key={index} label={`${level}`} value={level} />
                  ))}
                </Picker>
              </View>
              <View style={styles.switchContainer}>
                <Text>Comunidade Pública</Text>
                <Switch
                  value={formData.isPublic}
                  onValueChange={(value) =>
                    handleInputChange("isPublic", value)
                  }
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={cancelCreateCommunity}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <Text>        </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleFormSubmit}
                >
                  <Text style={styles.modalButtonText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => {
          setViewModalVisible(!viewModalVisible);
          clearCommunityDetails();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {communityDetails ? (
              <ScrollView>
                <View style={styles.communityHeader}>
                  <Text style={styles.modalTitle}>{communityDetails.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      showCommunityVisibilityNotification(
                        communityDetails.isPublic
                      )
                    }
                  >
                    <Image
                      source={
                        communityDetails.isPublic ? unlockedImage : lockedImage
                      }
                      style={styles.publicIcon}
                    />
                  </TouchableOpacity>
                  {communityDetails.leaderNickname === session.nickname && (
                    <TouchableOpacity onPress={openCommunitySettingsModal}>
                      <Image
                        source={settingsImage}
                        style={styles.settingsIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    openImageModal(
                      communityDetails.communityPic
                        ? communityDetails.communityPic
                        : defaultImage
                    )
                  }
                >
                  <Image
                    source={
                      communityDetails.communityPic
                        ? { uri: communityDetails.communityPic }
                        : defaultImage
                    }
                    style={styles.communityImage}
                  />
                </TouchableOpacity>
                {!isOtherCommunity ? (
                  <TouchableOpacity style={[styles.chatButton, { flex: 1, marginBottom: 10 }]} onPress={() => openChatWith(communityDetails.name)}>
                    <Image source={chatIcon} style={styles.chatIcon} />
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Descrição:</Text>{" "}
                  {communityDetails.description}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Nível:</Text>{" "}
                  {communityDetails.communityLevel}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Experiência:</Text>{" "}
                  {communityDetails.communityExp}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>
                    Experiência para o próximo nível:
                  </Text>{" "}
                  {communityDetails.communityExpToNextLevel}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Nível mínimo para entrar:</Text>{" "}
                  {communityDetails.minLevelToJoin}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Membros:</Text>{" "}
                  {communityDetails.currentMembers}/{communityDetails.maxMembers}
                </Text>

                {communityMembers && (
                  <>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      Líder:
                    </Text>
                    <View style={styles.membersContainer}>
                      {renderMember(communityDetails.name, {
                        nickname: communityMembers.leaderNickname,
                        profilePic: communityMembers.leaderProfilePic,
                      })}
                    </View>

                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      Moderadores:
                    </Text>
                    <View style={styles.membersContainer}>
                      {communityMembers.moderators
                        .filter(
                          (moderator) =>
                            moderator.nickname !=
                            communityDetails.leaderNickname
                        )
                        .map((member, index) =>
                          renderMember(communityDetails.name, member, index)
                        )}
                    </View>

                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      Membros:
                    </Text>
                    <View style={styles.membersContainer}>
                      {communityMembers.members
                        .filter(
                          (member) =>
                            member.nickname !=
                            communityDetails.leaderNickname &&
                            !communityMembers.moderators.some(
                              (moderator) =>
                                moderator.nickname == member.nickname
                            )
                        )
                        .map((member, index) =>
                          renderMember(communityDetails.name, member, index)
                        )}
                    </View>
                  </>
                )}

                {communityRequests.length > 0 && (
                  <>
                    <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                      Pedidos de Entrada:
                    </Text>
                    <View style={styles.membersContainer}>
                      {communityRequests.map((request, index) =>
                        renderRequest(communityDetails.name, request, index)
                      )}
                    </View>
                  </>
                )}

                {!isOtherCommunity ? (
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => leaveCommunity(communityDetails.name)}
                  >
                    <Text style={styles.modalButtonText}>Sair</Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </ScrollView>
            ) : (
              <Text>Carregando...</Text>
            )}
            {isOtherCommunity ? (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => joinCommunity(communityDetails.name)}
              >
                <Text style={styles.modalButtonText}>Entrar</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={communitySettingsModalVisible}
        onRequestClose={closeCommunitySettingsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalTitle}>Configurações da Comunidade</Text>
              <TouchableOpacity onPress={handleEditFileInputChange}>
                <View style={styles.imageContainer}>
                  {editFormData.communityPic
                    ? (
                      <Image
                        source={{ uri: editFormData.communityPic }}
                        style={styles.communityImage}
                      />
                    ) : (
                      <Image
                        source={
                          communityDetails != null && communityDetails.communityPic != undefined && communityDetails.communityPic != ""
                            ? { uri: communityDetails.communityPic }
                            : defaultImage
                        }
                        style={styles.communityImage}
                      />
                    )}
                  <View style={styles.iconContainer}>
                    <Image source={changePhotoIcon} style={styles.changePhotoIcon} />
                  </View>
                </View>
              </TouchableOpacity>
              <TextInput
                style={[styles.modalInput, { height: editNameInputHeight }]}
                placeholder="Nome da Comunidade"
                value={editFormData.name}
                onChangeText={(value) => handleEditInputChange("name", value)}
                maxLength={800}
                multiline={true}
                numberOfLines={4}
                onContentSizeChange={(e) =>
                  setEditNameInputHeight(e.nativeEvent.contentSize.height)
                }
              />
              <TextInput
                style={[styles.modalInput, { height: editDescriptionInputHeight }]}
                placeholder="Descrição"
                value={editFormData.description}
                onChangeText={(value) => handleEditInputChange("description", value)}
                maxLength={800}
                multiline={true}
                numberOfLines={4}
                onContentSizeChange={(e) =>
                  setEditDescriptionInputHeight(e.nativeEvent.contentSize.height)
                }
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Nível mínimo:</Text>
                <Picker
                  selectedValue={editFormData.minLevelToJoin}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleEditInputChange("minLevelToJoin", itemValue)
                  }
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((level, index) => (
                    <Picker.Item key={index} label={`${level}`} value={level} />
                  ))}
                </Picker>
              </View>
              <View style={styles.switchContainer}>
                <Text>Comunidade Pública</Text>
                <Switch
                  value={editFormData.isPublic}
                  onValueChange={(value) =>
                    handleEditInputChange("isPublic", value)
                  }
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeCommunitySettingsModal}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <Text>        </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleEditFormSubmit}
                >
                  <Text style={styles.modalButtonText}>Alterar</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: "red",
                  fontWeight: "200",
                  textAlign: "center",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                ⚠ Apagar Comunidade ⚠
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite o nome da comunidade para a apagar"
                value={deleteConfirmation}
                onChangeText={setDeleteConfirmation}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteCommunity}
              >
                <Text style={styles.modalButtonText}>Apagar Comunidade</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ImageViewing
        images={selectedImageUri ? [{ uri: selectedImageUri }] : []}
        imageIndex={0}
        visible={isImageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Social;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffef6",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fffef6",
  },
  tabItem: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "black", // Cor padrão do texto
  },
  selectedTabText: {
    fontWeight: "bold", // Texto do separador selecionado em negrito
    color: "#35a076", // Cor do texto do separador selecionado
  },
  content: {
    padding: 20,
    backgroundColor: "#fffef6",
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fffef6",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rowText: {
    flex: 1,
    position: "relative",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  periodTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  periodTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 15,
  },
  selectedPeriodTab: {
    backgroundColor: "#35a076",
    borderColor: "#35a076",
  },
  periodTabText: {
    fontSize: 14,
    color: "black",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchButton: {
    padding: 12,
    backgroundColor: "#35a076",
    borderRadius: 5,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "white",
    textAlign: "center",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff3d00",
    borderRadius: 5,
    padding: 1,
    backgroundColor: "#ff3d00",
    marginRight: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  acceptButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#35a076",
    borderRadius: 5,
    padding: 1,
    backgroundColor: "#35a076",
    marginRight: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  rejectButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff3d00",
    borderRadius: 5,
    padding: 1,
    backgroundColor: "#ff3d00",
    marginRight: 10,
    marginLeft: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#35a076",
    borderRadius: 5,
    padding: 1,
    backgroundColor: "#35a076",
    marginRight: 10,
    marginLeft: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  communitySearchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchInputActive: {
    borderColor: "#35a076",
  },
  communitySearchButton: {
    backgroundColor: "#35a076",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    elevation: 0,
  },
  communitySearchButtonTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  communitySearchButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "300",
    fontSize: 30,
    lineHeight: 35,
    padding: 0,
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: "#35a076",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#35a076",
    borderRadius: 5,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#ff3d00",
  },
  deleteButton: {
    backgroundColor: "red",
    flex: 1,
    alignItems: "center",
    marginBottom: -10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerLabel: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },
  seeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#35a076",
    borderRadius: 5,
    padding: 1,
    backgroundColor: "#35a076",
    marginRight: 10,
    marginLeft: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Metade do width e height para que a imagem fique redonda
    overflow: "hidden",
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: "#ff3d00",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  communityImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ff3d00",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20, // Adiciona uma margem superior para separar do conteúdo
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  communityHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },
  publicIcon: {
    width: 20,
    height: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  notificationContainer: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 1000,
  },
  notificationContent: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: "#35a076",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  leaveButton: {
    backgroundColor: "#ff3d00",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  membersContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberText: {
    fontSize: 16,
  },
  actionIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    right: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  chatIcon: {
    width: 40,
    height: 40,
  },
  chatButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginRight: 10,
    height: 35,
    elevation: 0,
    alignSelf: "center",
  },
  imageContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoIcon: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  requestActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    right: 10,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#35a076",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
  },
  leafIcon: {
    left: -40,
    width: 20,
    height: 20,
  },
  placeIcon: {
    right: -40,
    width: 20,
    height: 20,
  },
});
