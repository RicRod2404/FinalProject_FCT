package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import pt.unl.fct.di.adc.adc2024.daos.Message;
import pt.unl.fct.di.adc.adc2024.dtos.forms.chats.StatusNotification;
import pt.unl.fct.di.adc.adc2024.dtos.responses.ChatResponse;
import pt.unl.fct.di.adc.adc2024.services.ChatService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController extends AbstractController {

    private final ChatService chatService;

    @MessageMapping("/chat/msg-{chatId}")
    @SendTo("/topic/msg-{chatId}")
    public Message receiveMessageUser(@DestinationVariable String chatId, @Payload Message form) {
        //Message msg = chatService.receiveMessageUser(convert(form, Message.class), chatId);
        //return convert(msg, ChatForm.class);
        return chatService.receiveMessageUser(form, chatId);
    }

    @MessageMapping("/chat/writing-{chatId}")
    @SendTo("/topic/writing-{chatId}")
    public StatusNotification notify(@DestinationVariable String chatId, @Payload StatusNotification notification) {
        return notification;
    }

    // Created because... WS NOT SUPPORTED IN GAE STANDARD!!!!!!!!!
    @PostMapping("/rest/chats/messages/{chatId}")
    public ResponseEntity<Message> sendMessage(@PathVariable String chatId, @RequestBody Message message) {
        return ok(chatService.sendMessage(chatId, message), Message.class);
    }

    @PostMapping("/rest/chats/{nickname}")
    public ResponseEntity<ChatResponse> createChat(@PathVariable String nickname) {
        return ok(chatService.createChat(nickname), ChatResponse.class);
    }

    @PostMapping("/rest/chats")
    public ResponseEntity<List<String>> createMultipleChats(@RequestBody String[] nicknames) {
        return ok(chatService.createMultipleChats(nicknames));
    }

    @GetMapping("/rest/chats")
    @SneakyThrows
    public ResponseEntity<List<ChatResponse>> getChats() {
        var token = new TypeToken<List<ChatResponse>>() {
        }.getType();
        return ok(chatService.getChats().get(), token);
    }

    @GetMapping("/rest/chats/messages")
    @SneakyThrows
    public ResponseEntity<Page<Message>> getMessages(@RequestParam String chatId, @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "1000") int size) {
        return ok(chatService.getMessages(chatId, page, size).get());
    }

    @PutMapping("/rest/chats/{chatId}")
    public ResponseEntity<Void> hideChat(@PathVariable String chatId) {
        return ok(chatService.hideChat(chatId));
    }

}
