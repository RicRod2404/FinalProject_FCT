package pt.unl.fct.di.adc.adc2024.controllers;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.unl.fct.di.adc.adc2024.services.FriendService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/friends")
public class FriendController extends AbstractController {

    private final FriendService friendService;

    @PutMapping("/{friendNickname}")
    public ResponseEntity<Void> sendFriendRequest(@PathVariable String friendNickname) {
        return ok(friendService.sendFriendRequest(friendNickname));
    }

    @GetMapping("/requests")
    @SneakyThrows
    public ResponseEntity<List<String>> getFriendRequest() {
        return ok(friendService.getFriendRequests().get());
    }

    @GetMapping("/requests/sent")
    @SneakyThrows
    public ResponseEntity<List<String>> getFriendRequestsSent() {
        return ok(friendService.getFriendRequestsSent().get());
    }

    @GetMapping({"/{nickname}"})
    @SneakyThrows
    public ResponseEntity<List<String>> getFriends(@PathVariable String nickname) {
        return ok(friendService.getFriends(nickname));
    }

    @PutMapping("/accept/{friendNickname}")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable String friendNickname) {
        return ok(friendService.acceptFriendRequest(friendNickname));
    }

    @PutMapping("/reject/{friendNickname}")
    public ResponseEntity<Void> rejectFriendRequest(@PathVariable String friendNickname) {
        return ok(friendService.rejectFriendRequest(friendNickname));
    }

    @PutMapping("/cancel/{friendNickname}")
    public ResponseEntity<Void> cancelFriendRequest(@PathVariable String friendNickname) {
        return ok(friendService.cancelFriendRequest(friendNickname));
    }

    @PutMapping("/remove/{friendNickname}")
    public ResponseEntity<Void> removeFriend(@PathVariable String friendNickname) {
        return ok(friendService.removeFriend(friendNickname));
    }
}
