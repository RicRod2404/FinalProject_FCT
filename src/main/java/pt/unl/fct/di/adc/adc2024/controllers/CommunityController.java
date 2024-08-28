package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pt.unl.fct.di.adc.adc2024.daos.Community;
import pt.unl.fct.di.adc.adc2024.dtos.forms.community.*;
import pt.unl.fct.di.adc.adc2024.dtos.responses.CommunityRequestResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.CommunityResponse;
import pt.unl.fct.di.adc.adc2024.dtos.responses.ListCommunityMembersResponse;
import pt.unl.fct.di.adc.adc2024.services.CommunityService;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/communities")
public class CommunityController extends AbstractController {

    private final CommunityService communityService;

    @PostMapping
    public ResponseEntity<CommunityResponse> create(@Validated @RequestPart CommunityForm form, @RequestPart(required = false) MultipartFile communityPic) throws ExecutionException, InterruptedException {
        return ok(communityService.create(convert(form, Community.class), communityPic), CommunityResponse.class);
    }

    @GetMapping("/{name}")
    public ResponseEntity<CommunityResponse> get(@PathVariable String name) {
        return ok(communityService.get(name), CommunityResponse.class);
    }

    @PutMapping("/{name}")
    public ResponseEntity<CommunityResponse> edit(@Validated @RequestPart EditCommunityForm form, @RequestPart(required = false) MultipartFile communityPic) throws ExecutionException, InterruptedException {
        return ok(communityService.edit(form, communityPic), CommunityResponse.class);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> delete(@PathVariable String name) {
        return ok(communityService.delete(name));
    }

    @GetMapping
    @SneakyThrows
    public ResponseEntity<List<CommunityResponse>> listRandom() {
        var token = new TypeToken<List<CommunityResponse>>() {
        }.getType();
        var result = communityService.listRandom().get();
        return ok(result, token);
    }

    @GetMapping("/search/{query}")
    @SneakyThrows
    public ResponseEntity<List<String>> search(@PathVariable String query) {
        return ok(communityService.search(query).get());
    }

    @PutMapping("/join/{name}")
    public ResponseEntity<Void> join(@PathVariable String name) {
        return ok(communityService.join(name));
    }

    @PutMapping("/leave")
    public ResponseEntity<Void> leave(@Validated @RequestBody LeaveCommunityForm form) {
        return ok(communityService.leave(form));
    }

    @GetMapping("/requests/{name}")
    @SneakyThrows
    public ResponseEntity<List<CommunityRequestResponse>> getRequests(@PathVariable String name) {
        return ok(communityService.getRequests(name).get());
    }

    @PutMapping("/accept")
    public ResponseEntity<Void> acceptRequest(@Validated @RequestBody RequestCommunityForm form) {
        return ok(communityService.acceptRequest(form));
    }

    @PutMapping("/reject")
    public ResponseEntity<Void> rejectRequest(@Validated @RequestBody RequestCommunityForm form) {
        return ok(communityService.rejectRequest(form));
    }

    @GetMapping("/user/{nickname}")
    @SneakyThrows
    public ResponseEntity<List<CommunityResponse>> listUserCommunities(@PathVariable String nickname) {
        var token = new TypeToken<List<CommunityResponse>>() {
        }.getType();
        return ok(communityService.listUserCommunities(nickname).get(), token);
    }

    @GetMapping("/members/{name}")
    @SneakyThrows
    public ResponseEntity<ListCommunityMembersResponse> listMembers(@PathVariable String name) {
        return ok(communityService.listMembers(name));
    }

    @PostMapping("/promote/{name}")
    public ResponseEntity<Void> promote(@Validated @RequestBody PromoteMemberForm form) {
        return ok(communityService.promote(form));
    }

    @PostMapping("/demote/{name}")
    public ResponseEntity<Void> demote(@Validated @RequestBody DemoteMemberForm form) {
        return ok(communityService.demote(form));
    }
}
