package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.*;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.*;
import pt.unl.fct.di.adc.adc2024.dtos.responses.CommunityRequestResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.ListCommunityMembersResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.UserResponseReduced;
import pt.unl.fct.di.adc.adc2024.repositories.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.COMMUNITIES;
import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.LIST_COMMUNITY_MEMBERS;
import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GA;
import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GC;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communities;

    private final UserRepository users;

    private final RankingRepository rankings;

    private final ChatRepository chats;

    private final MessageRepository messages;

    private final StorageService storage;


    @Transactional
    public Optional<Community> create(Community community, MultipartFile communityPic) throws ExecutionException, InterruptedException {
        var leader = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (leader.getLevel() < 5)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        community.setName(community.getName().trim());
        community.setLeaderNickname(leader.getNickname());
        community.setLeaderId(leader.getId());
        community.getModeratorsId().add(leader.getId());
        leader.getCommunities().add(community.getId());

        if (communityPic != null)
            community.setCommunityPic(storage.uploadFile(community.getId(), StorageService.Folder.COMMUNITIES, communityPic).get());

        // Create chat
        var chat = new Chat(community.getName(), "", new HashSet<>(), new HashSet<>(), false);
        chat.setId(community.getId());
        chat.setChatPic(community.getCommunityPic());
        chat.getUsers().add(leader.getNickname());
        chats.save(chat);
        leader.getChats().add(chat.getId());
        users.save(leader);

        rankings.save(new Ranking(false, community.getId(), community.getName(), 0, 0, 0));

        return Optional.of(communities.save(community));
    }

    @Cacheable(value = COMMUNITIES, key = "#name")
    public Community get(String name) {
        return communities.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    @CacheEvict(value = COMMUNITIES, key = "#form.oldName")
    public Optional<Community> edit(EditCommunityForm form, MultipartFile communityPic) throws ExecutionException, InterruptedException {
        var community = communities.findByName(form.getOldName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal.getRole() == GC || principal.getRole().getCredentialLevel() >= GA.getCredentialLevel()) && !principal.getNickname().equals(community.getLeaderNickname()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if (!form.getName().equals(form.getOldName())) {
            community.setName(form.getName());

            var rs = rankings.findAllByTargetId(community.getId());
            for (var r : rs) {
                r.setTargetName(form.getName());
                rankings.save(r);
            }

            var cs = chats.findAllByChatName(form.getOldName());
            for (var c : cs) {
                c.setChatName(form.getName());
                messages.save(new Message(UUID.randomUUID().toString(), c.getId(), LocalDateTime.now(), "system",
                        "Nome da comunidade alterado para " + form.getName()));
                chats.save(c);
            }
        }

        if (form.getMinLevelToJoin() > 0)
            community.setMinLevelToJoin(form.getMinLevelToJoin());

        community.setDescription(form.getDescription());
        community.setPublic(form.isPublic());

        if (communityPic != null) {
            community.setCommunityPic(storage.uploadFile(community.getId(), StorageService.Folder.COMMUNITIES, communityPic).get());
        }

        communities.save(community);
        return Optional.of(community);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = COMMUNITIES, key = "#name"),
            @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#name")
    })
    public Optional<Void> delete(String name) {
        var community = communities.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal.getRole() == GC || principal.getRole().getCredentialLevel() > GA.getCredentialLevel()) && !principal.getNickname().equals(community.getLeaderNickname()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);


        for (var id : community.getModeratorsId()) {
            var user = users.findById(id).orElse(null);
            if (user != null) {
            user.getCommunities().remove(community.getId());
            users.save(user);
            }
        }

        for (var id : community.getMembersId()) {
            var user = users.findById(id).orElse(null);
            if (user != null) {
                user.getCommunities().remove(community.getId());
                users.save(user);
            }
        }

        var r = rankings.findAllByTargetId(community.getId());
        rankings.deleteAll(r);

        var chat = chats.findById(community.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        chat.setOwnerDeleted(true);
        messages.save(new Message(UUID.randomUUID().toString(), community.getId(), LocalDateTime.now(),
                "system", "The community has been deleted by the owner"));

        communities.delete(community);
        storage.deleteFile(community.getId(), StorageService.Folder.COMMUNITIES);

        return Optional.empty();
    }


    @Async
    public Future<List<Community>> listRandom() {
        List<Community> allCommunities = communities.findAll();
        Collections.shuffle(allCommunities);
        List<Community> randomCommunities = allCommunities.stream().limit(10).collect(Collectors.toList());
        return CompletableFuture.completedFuture(randomCommunities);
    }

    @Async
    public Future<List<String>> search(String query) {
        String end = query + "\uFFFF";
        var pageable = PageRequest.of(0, 10);
        var lc = communities.findByNameLike(query, end, pageable);
        return CompletableFuture.completedFuture(lc.stream().map(Community::getName).collect(Collectors.toList()));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = COMMUNITIES, key = "#name"),
            @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#name")
    })
    public Optional<Void> join(String name) {
        boolean exists = communities.existsByName(name);
        var community = communities.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        if (user.getLevel() < community.getMinLevelToJoin())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if (community.getMembersId().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        if (community.getMembersId().size() == community.getMaxMembers())
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

        if (community.isPublic()) {
            community.getMembersId().add(user.getId());
            community.setCurrentMembers(community.getCurrentMembers() + 1);
            user.getCommunities().add(community.getId());
            var chat = chats.findById(community.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            chat.getUsers().add(user.getNickname());
            user.getChats().add(community.getId());
            users.save(user);
        } else {
            community.getRequests().add(user.getId());
        }

        communities.save(community);
        return Optional.empty();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = COMMUNITIES, key = "#form.name"),
            @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#form.name")
    })
    public Optional<Void> leave(LeaveCommunityForm form) {
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        community.getMembersId().remove(user.getId());
        community.getModeratorsId().remove(user.getId());
        community.setCurrentMembers(community.getCurrentMembers() - 1);
        user.getCommunities().remove(community.getId());

        user.getChats().remove(community.getId());

        if (community.getCurrentMembers() == 0)
            communities.delete(community);
        else
            communities.save(community);

        users.save(user);
        return Optional.empty();
    }

    @Async
    public Future<List<CommunityRequestResponse>> getRequests(String name) {
        var community = communities.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal.getId().equals(community.getLeaderId()) || community.getModeratorsId().contains(principal.getId())) &&
                !(principal.getRole() == GC || principal.getRole().getCredentialLevel() >= GA.getCredentialLevel()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        List<CommunityRequestResponse> requests = new ArrayList<>();
        List<String> toRemove = new ArrayList<>();
        for (var id : community.getRequests()) {
            var user = users.findById(id).orElse(null);
            if (user != null)
                requests.add(new CommunityRequestResponse(user.getNickname(), user.getProfilePic()));
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                community.getRequests().remove(id);

            communities.save(community);
        }

        return CompletableFuture.completedFuture(requests);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = COMMUNITIES, key = "#form.name"),
            @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#form.name")
    })
    public Optional<Void> acceptRequest(RequestCommunityForm form) {
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!community.getRequests().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        if (community.getMembersId().size() == community.getMaxMembers())
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

        community.getMembersId().add(user.getId());
        community.getRequests().remove(user.getId());
        community.setCurrentMembers(community.getCurrentMembers() + 1);
        user.getCommunities().add(community.getId());

        communities.save(community);
        var chat = chats.findById(community.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        chat.getUsers().add(user.getNickname());
        user.getChats().add(community.getId());
        users.save(user);
        return Optional.empty();
    }

    @Transactional
    public Optional<Void> rejectRequest(RequestCommunityForm form) {
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!community.getRequests().contains(user.getId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        community.getRequests().remove(user.getId());

        communities.save(community);
        return Optional.empty();
    }

    @Async
    public Future<List<Community>> listUserCommunities(String nickname) {
        var user = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        List<Community> userCommunities = new ArrayList<>();
        List<String> toRemove = new ArrayList<>();

        for (var id : user.getCommunities()) {
            var community = communities.findById(id).orElse(null);
            if (community != null)
                userCommunities.add(community);
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
        for (var id : toRemove)
            user.getCommunities().remove(id);

        users.save(user);
        }

        return CompletableFuture.completedFuture(userCommunities);
    }

    @Cacheable(value = LIST_COMMUNITY_MEMBERS, key = "#name")
    public ListCommunityMembersResponse listMembers(String name) throws ExecutionException, InterruptedException {
        var community = communities.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        List<UserResponseReduced> members = new ArrayList<>();
        List<String> toRemove = new ArrayList<>();
        for (var id : community.getMembersId()) {
            var user = users.findById(id).orElse(null);
            if (user != null)
                members.add(new UserResponseReduced(user.getNickname(), user.getProfilePic()));
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                community.getMembersId().remove(id);

            communities.save(community);
        }

        List<UserResponseReduced> moderators = new ArrayList<>();
        toRemove.clear();
        for (var id : community.getModeratorsId()) {
            var user = users.findById(id).orElse(null);
            if (user != null)
                moderators.add(new UserResponseReduced(user.getNickname(), user.getProfilePic()));
            else
                toRemove.add(id);
        }

        if (!toRemove.isEmpty()) {
            for (var id : toRemove)
                community.getModeratorsId().remove(id);

            communities.save(community);
        }

        return new ListCommunityMembersResponse(community.getLeaderNickname(),
                storage.getFileURL(community.getLeaderId(), StorageService.Folder.PROFILE_PICS).get(), members, moderators);
    }

    @Transactional
    @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#form.getName")
    public Optional<Void> promote(PromoteMemberForm form) {
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (community.getModeratorsId().contains(user.getId())) {
            community.setLeaderId(user.getId());
            community.setLeaderNickname(user.getNickname());
            communities.save(community);
        }
        else {
            community.getModeratorsId().add(user.getId());
            community.getMembersId().remove(user.getId());
            communities.save(community);
        }

        return Optional.empty();
    }

    @Transactional
    @CacheEvict(value = LIST_COMMUNITY_MEMBERS, key = "#form.getName")
    public Optional<Void> demote(DemoteMemberForm form) {
        var community = communities.findByName(form.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = users.findByNickname(form.getNickname()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        community.getModeratorsId().remove(user.getId());
        community.getMembersId().add(user.getId());
        communities.save(community);

        return Optional.empty();
    }

}
