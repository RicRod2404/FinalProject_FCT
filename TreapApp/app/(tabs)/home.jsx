import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import UserPost from "../../components/UserPost";
import { sessionSelector } from "../../store/session";
import { useSelector, useDispatch } from "react-redux";
import { httpGet } from "../../utils/http";
import NoFeedMessage from "../../components/NoFeedMessage";
import HomeStatsSection from "../../components/HomeStatsSection";
import { useRouter } from "expo-router";
import { Facebook } from "react-content-loader/native";
import {
  addNotification,
  clearNotifications,
  notificationsSelector,
} from "../../store/notifs"; // Importar as ações necessárias

const home = () => {
  const [feed, setFeed] = useState([]);
  const [isFetchingFeed, setIsFetchingFeed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasFeed, setHasFeed] = useState(false);
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch(); // Adicionar o dispatch
  const router = useRouter();
  const notifications = useSelector(notificationsSelector);

  useEffect(() => {
    onFetchFeed();
  }, []);

  useEffect(() => {
    if (session.isLogged) {
      // Limpar notificações anteriores
      dispatch(clearNotifications());

      // Carregar notificações de pedidos pendentes
      httpGet("/friends/requests").then((response) => {
        response.data.forEach((request) => {
          dispatch(addNotification(`${request} pediu para o seguir.`));
        });
      });

      httpGet(`/communities/user/${session.nickname}`).then((response) => {
        const userCommunities = response.data.filter(
          (community) => community.leaderNickname === session.nickname
        );
        userCommunities.forEach((community) => {
          httpGet(`/communities/requests/${community.name}`).then(
            (response) => {
              for (let i = 0; i < response.data.length; i++) {
                const requester = response.data[i];
                if (requester) {
                  dispatch(
                    addNotification(
                      `${requester.nickname} pediu para entrar na sua comunidade: ${community.name}`
                    )
                  );
                }
              }
            }
          );
        });
      });
    }
  }, [session.isLogged, session.nickname]);

  async function onFetchFeed() {
    setIsFetchingFeed(true);
    httpGet("/treaps/feed?nickname=" + session.nickname)
      .then((res) => {
        setFeed(res.data);
        setHasFeed(thereIsData());
      })
      .catch((err) => {
        console.log(err);
      });
    setIsFetchingFeed(false);
  }

  function onRefresh() {
    setRefreshing(true);
    setIsFetchingFeed(true);
    onFetchFeed();
    setRefreshing(false);
    setIsFetchingFeed(false);
  }

  function thereIsData() {
    return feed.length > 0;
  }

  return (
    <SafeAreaView style={styles.background}>
      <TopBar title={"Início"}></TopBar>
      {/* No feed to show */}
      {!isFetchingFeed && !feed.length > 0 && (
        <>
          <HomeStatsSection />
          <NoFeedMessage />
        </>
      )}
      {/* Feed to show */}
      {!isFetchingFeed && feed.length > 0 && (
        <FlatList
          data={feed}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <UserPost treap={item} />}
          ListHeaderComponent={<HomeStatsSection />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {/* Loading feed */}
      {isFetchingFeed && (
        <>
          <HomeStatsSection />
          <Facebook />
          <Facebook />
        </>
      )}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fffef6",
    height: "100%",
  },
});
