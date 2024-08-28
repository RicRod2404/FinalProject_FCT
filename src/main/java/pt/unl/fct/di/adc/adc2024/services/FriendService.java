package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;
import pt.unl.fct.di.adc.adc2024.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.FRIENDS;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final UserRepository users;

    //private final CacheManager cacheManager;

    @Transactional
    public Optional<Void> sendFriendRequest(String friendNickname) {
        var friend = users.findByNickname(friendNickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (friend.getFriends().contains(principal.getId()) || principal.getId().equals(friend.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        friend.getFriendRequests().add(principal.getId());
        principal.getFriendRequestsSent().add(friend.getId());
        users.save(friend);
        users.save(principal);
        return Optional.empty();
    }

    @Async
    public Future<List<String>> getFriendRequests() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var friendRequests = new ArrayList<String>();

        List<String> toRemove = new ArrayList<>();
        for (var id : principal.getFriendRequests()) {
            var user = users.findById(id).orElse(null);
            if (user != null)
                friendRequests.add(user.getNickname());
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                principal.getFriendRequests().remove(id);

            users.save(principal);
        }

        return CompletableFuture.completedFuture(friendRequests);
    }

    @Async
    public Future<List<String>> getFriendRequestsSent() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var friendRequestsSent = new ArrayList<String>();

        List<String> toRemove = new ArrayList<>();
        for (var id : principal.getFriendRequestsSent()) {
            var user = users.findById(id).orElse(null);
            if (user != null)
                friendRequestsSent.add(user.getNickname());
            else
                toRemove.add(id);

        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                principal.getFriendRequestsSent().remove(id);

            users.save(principal);
        }

        return CompletableFuture.completedFuture(friendRequestsSent);
    }

    @Cacheable(value = FRIENDS, key = "#nickname")
    public List<String> getFriends(String nickname) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var friends = new ArrayList<String>();

        if ((principal.getRole() == Role.USER || principal.getRole() == Role.GC) && !user.isPublic() &&
                !principal.getFriends().contains(user.getId()) && !principal.getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        List<String> toRemove = new ArrayList<>();
        for (var id : user.getFriends()) {
            var u = users.findById(id).orElse(null);
            if (u != null)
                friends.add(u.getNickname());
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                user.getFriends().remove(id);

            users.save(user);
        }

        return friends;
    }

    @Transactional
    public Optional<Void> acceptFriendRequest(String friendNickname) {
        var friend = users.findByNickname(friendNickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!principal.getFriendRequests().contains(friend.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        principal.getFriendRequests().remove(friend.getId());
        principal.getFriendRequestsSent().remove(friend.getId());
        principal.getFriends().add(friend.getId());
        friend.getFriendRequestsSent().remove(principal.getId());
        friend.getFriendRequests().remove(principal.getId());
        friend.getFriends().add(principal.getId());

        users.save(principal);
        users.save(friend);

        //var cache = cacheManager.getCache(FRIENDS);
        //cache.evict(principal.getNickname());
        //cache.evict(friend.getNickname());

        return Optional.empty();
    }

    @Transactional
    public Optional<Void> rejectFriendRequest(String friendNickname) {
        var friend = users.findByNickname(friendNickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        principal.getFriendRequests().remove(friend.getId());
        friend.getFriendRequestsSent().remove(principal.getId());

        users.save(principal);
        users.save(friend);

        return Optional.empty();
    }

    @Transactional
    public Optional<Void> cancelFriendRequest(String friendNickname) {
        var friend = users.findByNickname(friendNickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!principal.getFriendRequestsSent().contains(friend.getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        principal.getFriendRequestsSent().remove(friend.getId());
        friend.getFriendRequests().remove(principal.getId());

        users.save(principal);
        users.save(friend);

        return Optional.empty();
    }

    @Transactional
    public Optional<Void> removeFriend(String friendNickname) {
        var friend = users.findByNickname(friendNickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        principal.getFriends().remove(friend.getId());
        friend.getFriends().remove(principal.getId());

        users.save(principal);
        users.save(friend);

        //var cache = cacheManager.getCache(FRIENDS);
        //cache.evict(principal.getNickname());
        //cache.evict(friend.getNickname());

        return Optional.empty();
    }
}
