package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.Chat;
import pt.unl.fct.di.adc.adc2024.daos.Message;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.repositories.ChatRepository;
import pt.unl.fct.di.adc.adc2024.repositories.MessageRepository;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chats;

    private final MessageRepository messages;

    private final UserRepository users;

    @Transactional
    public Message receiveMessageUser(Message message, String chatId) {
        chats.findById(chatId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        message.setChatId(chatId);

        return messages.save(message);
    }

    @Transactional
    public Optional<Chat> createChat(String nickname) {
        var user = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var first = nickname + " - " + principal.getNickname();
        var second = principal.getNickname() + " - " + nickname;

        if (chats.existsByChatName(first)) {
            var chat = chats.findByChatName(first);
            if (!chat.getHiddenUsers().contains(principal.getNickname()))
                throw new ResponseStatusException(HttpStatus.CONFLICT);

            chat.getHiddenUsers().remove(principal.getNickname());
            return Optional.of(chats.save(chat));
        }

        if (chats.existsByChatName(second)) {
            var chat = chats.findByChatName(second);
            if (!chat.getHiddenUsers().contains(principal.getNickname()))
                throw new ResponseStatusException(HttpStatus.CONFLICT);

            chat.getHiddenUsers().remove(principal.getNickname());
            return Optional.of(chats.save(chat));
        }

        var chat = new Chat();
        chat.setChatName(principal.getNickname() + " - " + nickname);
        chat.setChatPic("https://storage.googleapis.com/treapapp.appspot.com/profilepics/" +
                " - " + principal.getId() + " - " + user.getId());

        user.getChats().add(chat.getId());
        principal.getChats().add(chat.getId());

        chat.getUsers().add(principal.getNickname());
        chat.getUsers().add(user.getNickname());

        var op = chats.save(chat);
        users.save(user);
        users.save(principal);

        return Optional.of(op);
    }

    @Transactional
    public Message sendMessage(String chatId, Message message) {
        var c = chats.findById(chatId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (c.isOwnerDeleted())
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

        message.setChatId(chatId);
        return messages.save(message);
    }

    @Transactional
    public List<String> createMultipleChats(String[] nicknames) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        for (String nickname : nicknames) {
            var user = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            var first = nickname + " - " + principal.getNickname();
            var second = principal.getNickname() + " - " + nickname;

            if (chats.existsByChatName(first)) {
                var chat = chats.findByChatName(first);
                chat.getHiddenUsers().remove(principal.getNickname());
                chats.save(chat);
            }
            else if (chats.existsByChatName(second)) {
                var chat = chats.findByChatName(second);
                chat.getHiddenUsers().remove(principal.getNickname());
                chats.save(chat);
            }
            else {
                var chat = new Chat();
                chat.setChatName(principal.getNickname() + " - " + nickname);
                chat.setChatPic("https://storage.googleapis.com/treapapp.appspot.com/profilepics/" +
                        " - " + principal.getId() + " - " + user.getId());

                user.getChats().add(chat.getId());
                principal.getChats().add(chat.getId());

                chat.getUsers().add(principal.getNickname());
                chat.getUsers().add(user.getNickname());

                chats.save(chat);
                users.save(user);
                users.save(principal);
            }
        }

        return Arrays.asList(nicknames);
    }

    @Async
    public Future<List<Chat>> getChats() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var chats = new ArrayList<Chat>();

        for (String chatId : principal.getChats()) {
            var chat = this.chats.findById(chatId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            if (!chat.getHiddenUsers().contains(principal.getNickname()))
                chats.add(chat);
        }

        return CompletableFuture.completedFuture(chats);
    }

    @Async
    public Future<Page<Message>> getMessages(String chatId, int page, int size) {
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(messages.findAllByChatIdOrderByTimestampDesc(chatId, pageable));
    }

    @Transactional
    public Optional<Void> hideChat(String chatId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var chat = chats.findById(chatId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!chat.getUsers().contains(principal.getNickname()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        chat.getHiddenUsers().add(principal.getNickname());
        chats.save(chat);
        return Optional.empty();
    }


}
