package pt.unl.fct.di.adc.adc2024.services;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.EmailChange;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.Role;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserStatus;
import pt.unl.fct.di.adc.adc2024.dtos.forms.user.*;
import pt.unl.fct.di.adc.adc2024.repositories.*;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder encoder;

    private final UserRepository users;

    private final CommunityRepository communities;

    private final RankingRepository rankings;

    private final TreapRepository treaps;

    private final StorageService storage;

    private final EmailService email;

    private final ChatRepository chats;

    private final EmailChangeRepository emailChanges;

    //private final CacheManager cacheManager;

    @Transactional
    public Optional<User> create(User user)
            throws ExecutionException, InterruptedException, MessagingException {

        user.setPassword(encoder.encode(user.getPassword()));
        user.setEmail(user.getEmail().toLowerCase().trim());
        user.setNickname(user.getNickname().trim());
        rankings.save(new Ranking(true, user.getId(), user.getNickname(), 0, 0, 0));
        var u = users.save(user);

        email.sendHashEmail(user, "welcomeEmail", "Welcome to Treap!");
        return Optional.of(u);
    }

    public Optional<Void> resendEmail(String email) {
        var u = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        this.email.sendHashEmail(u, "welcomeEmail", "Welcome to Treap!");
        return Optional.empty();
    }

    @Cacheable(value = USERS, key = "#nickname")
    public User get(String nickname) throws ExecutionException, InterruptedException {
        return users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public Optional<User> edit(EditUserForm form, MultipartFile profilePic)
            throws ExecutionException, InterruptedException {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        u.setName(form.getName());
        u.setPhoneNum(form.getPhoneNum());
        u.setAddress(form.getAddress());
        u.setPostalCode(form.getPostalCode());
        u.setNif(form.getNif());

        if (form.isProfilePicDeleted()) {
            storage.deleteFile(u.getId(), StorageService.Folder.PROFILE_PICS);
            u.setProfilePic(null);
        }

        if (!form.isProfilePicDeleted() && profilePic != null) {
            if (principal.getId().equals(u.getId()))
                u.setProfilePic(storage.uploadFile(u.getId(), StorageService.Folder.PROFILE_PICS, profilePic).get());
            else {
                users.save(u);
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
        }

        return Optional.of(users.save(u));
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#nickname")
    public Optional<User> editBannerPic(String nickname, MultipartFile bannerPic)
            throws ExecutionException, InterruptedException {
        User u = users.findByNickname(nickname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (bannerPic == null)
            u.setBannerPic("");
        else
            u.setBannerPic(storage.uploadFile(u.getId(), StorageService.Folder.BANNERS, bannerPic).get());

        return Optional.of(users.save(u));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = USERS, key = "#nickname"),
            @CacheEvict(value = FEED, key = "#nickname")
    })
    public Optional<Void> delete(String nickname) throws ExecutionException, InterruptedException {
        User u = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (u.getRole().getCredentialLevel() >= principal.getRole().getCredentialLevel() && !principal.getNickname().equals(u.getNickname()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if (principal.getRole().getCredentialLevel() == u.getRole().getCredentialLevel() + 1 && principal.getRole() != Role.SU)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);


        //var userCache = cacheManager.getCache(USERS);
        //var feedCache = cacheManager.getCache(FEED);
        //var communityCache = cacheManager.getCache(COMMUNITIES);
        //var listCommunityMembersCache = cacheManager.getCache(LIST_COMMUNITY_MEMBERS);

        for (var id : u.getFriends()) {
            var friend = users.findById(id).orElse(null);
            if (friend != null) {
                friend.getFriends().remove(u.getId());
                users.save(friend);
                //userCache.evict(friend.getNickname());
            }
        }

        for (var id : u.getFriendRequests()) {
            var request = users.findById(id).orElse(null);
            if (request != null) {
                request.getFriends().remove(u.getId());
                users.save(request);
                //userCache.evict(request.getNickname());
            }
        }

        for (var id : u.getFriendRequestsSent()) {
            var request = users.findById(id).orElse(null);
            if (request != null) {
                request.getFriendRequests().remove(u.getId());
                users.save(request);
                //userCache.evict(request.getNickname());
            }
        }

        var t = treaps.findAllByUserId(u.getId());
        //feedCache.evict(u.getNickname());
        treaps.deleteAll(t);

        for (var communityId : u.getCommunities()) {
            var community = communities.findById(communityId).get();
            var chat = chats.findById(community.getId()).get();

            community.getMembersId().remove(u.getId());
            community.getModeratorsId().remove(u.getId());
            community.setCurrentMembers(community.getCurrentMembers() - 1);

            if (community.getCurrentMembers() == 0) {
                var r = rankings.findAllByTargetId(community.getId());
                rankings.deleteAll(r);
                communities.delete(community);
                storage.deleteFile(community.getId(), StorageService.Folder.COMMUNITIES);
                chats.delete(chat);
            }
            else {
                chat.getUsers().remove(u.getNickname());
                chat.getHiddenUsers().remove(u.getNickname());
                u.getChats().remove(chat.getId());
                chats.save(chat);
            }

            if (community.getLeaderId().equals(u.getId())) {
                if (!community.getModeratorsId().isEmpty()) {
                    var newLeader = users.findById(community.getModeratorsId().iterator().next()).get();
                    community.setLeaderId(newLeader.getId());
                    community.setLeaderNickname(newLeader.getNickname());
                    communities.save(community);
                }
                else if (!community.getMembersId().isEmpty()) {
                    var newLeader = users.findById(community.getMembersId().iterator().next()).get();
                    community.setLeaderId(newLeader.getId());
                    community.setLeaderNickname(newLeader.getNickname());
                    community.getModeratorsId().add(newLeader.getId());
                    community.getMembersId().remove(newLeader.getId());
                    communities.save(community);
                }
                else {
                    var r = rankings.findAllByTargetId(community.getId());
                    rankings.deleteAll(r);
                    communities.delete(community);
                    storage.deleteFile(community.getId(), StorageService.Folder.COMMUNITIES);
                }
            }
            //communityCache.evict(community.getName());
            //listCommunityMembersCache.evict(community.getName());
        }

        for (var chatId : u.getChats()) {
            var chat = chats.findById(chatId).get();
            chat.getUsers().remove(u.getNickname());
            chat.getHiddenUsers().remove(u.getNickname());
            chat.setChatName("Conta eliminada");
            chat.setChatPic("");
            chat.setOwnerDeleted(true);
            chats.save(chat);
        }

        storage.deleteFile(u.getId(), StorageService.Folder.PROFILE_PICS);
        users.delete(u);
        return Optional.empty();
    }

    @Async
    public Future<Page<User>> list(String query, Integer page, Integer size) {
        String end = query + "\uFFFF";
        var pageable = PageRequest.of(page, size);
        Page<User> res;
        if (query != null && !query.isEmpty())
            res = users.findByNicknameLike(query, end, pageable);
        else
            res = users.findAll(pageable);
        return CompletableFuture.completedFuture(res);
    }

    @Async
    public Future<List<String>> search(String query) {
        String end = query + "\uFFFF";
        var pageable = PageRequest.of(0, 10);
        var lu = users.findByNicknameLike2(query, end, pageable);
        return CompletableFuture.completedFuture(new ArrayList<>(lu.stream().limit(10).map(User::getNickname).toList()));
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changeRole(ChangeRoleForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setRole(form.getRole());

        return users.save(u);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changeStatus(ChangeStatusForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal.getRole().getCredentialLevel() <= u.getRole().getCredentialLevel())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        u.setStatus(form.getStatus());

        return users.save(u);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changePassword(ChangePasswordForm form) {
        User u = users.findByNicknameAndStatus(form.getNickname(), UserStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setPassword(encoder.encode(form.getNewPassword()));

        return users.save(u);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User changePrivacy() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        principal.setPublic(!principal.isPublic());
        return users.save(principal);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User requestEmail(String email) {

        if (!email.matches(".+@.+\\..+"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (users.existsByEmail(email.toLowerCase()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        var u = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var oldEmail = u.getEmail();

        var hash = new BigInteger(650, new SecureRandom()).toString(16);
        u.setVerifyHash(hash);
        users.save(u);

        emailChanges.save(new EmailChange(u.getId(), u.getEmail(), email.toLowerCase(), hash));

        this.email.sendNotificationEmail(u.getNickname(), oldEmail, email.toLowerCase(), "notifyEmailChange", "An email change was requested");
        u.setEmail(email.toLowerCase());
        this.email.sendHashEmail(u, "changeEmail", "Email change request");

        return u;
    }

    @Transactional
    public User changeEmail(String verifyHash) {
        try {
            EmailChange ec = emailChanges.findByVerifyHash(verifyHash)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            User u = users.findById(ec.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            //cacheManager.getCache(USERS).evict(u.getNickname());
            u.setEmail(ec.getNewEmail());
            u.setVerifyHash("");
            return users.save(u);
        } catch (Exception e) {
            EmailChange ec = emailChanges.findByVerifyHash(verifyHash)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            return users.findByEmail(ec.getNewEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        }
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User forgotPasswordEmail(String to) {
        User u = users.findByEmail(to)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setVerifyHash(new BigInteger(650, new SecureRandom()).toString(32));
        users.save(u);
        email.sendHashEmail(u, "forgotPasswordEmail", "Password Reset");

        return u;
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User changeForgottenPassword(ForgotPasswordForm form) {
        User u = users.findByVerifyHash(form.getVerifyHash())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setPassword(encoder.encode(form.getNewPassword()));
        u.setVerifyHash("");

        return users.save(u);
    }

    @Transactional
    public User activateAccount(String verifyHash) {
        User u = users.findByVerifyHash(verifyHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setStatus(UserStatus.ACTIVE);
        u.setVerifyHash("");

        return users.save(u);
    }

    @Transactional
    public Optional<User> finishRegister(String nickname) {
        User u = users.findByNickname(nickname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setFinishedRegister(true);

        return Optional.of(users.save(u));
    }

    public boolean isFinishedRegister(String nickname) {
        return users.findByNickname(nickname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)).isFinishedRegister();
    }

}
