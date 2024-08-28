package pt.unl.fct.di.adc.adc2024.controllers;

import com.google.common.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;
import pt.unl.fct.di.adc.adc2024.dtos.responses.RankingResponse;
import pt.unl.fct.di.adc.adc2024.services.RankingService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/rankings")
public class RankingController extends AbstractController {

    private final RankingService rankingService;

    @GetMapping("/users/monthly")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getMonthlyRankingU(@RequestParam int month, @RequestParam int year,
                                                                   @RequestParam(defaultValue = "0") Integer page,
                                                                   @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getMonthlyRanking(true, month, year, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/users/yearly")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getYearlyRankingU(@RequestParam int year,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                  @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getYearlyRanking(true, year, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/users")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getLifetimeRankingU(@RequestParam(defaultValue = "0") Integer page,
                                                                    @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getLifetimeRanking(true, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/communities/monthly")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getMonthlyRankingC(@RequestParam int month, @RequestParam int year,
                                                                   @RequestParam(defaultValue = "0") Integer page,
                                                                   @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getMonthlyRanking(false, month, year, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/communities/yearly")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getYearlyRankingC(@RequestParam int year,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                  @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getYearlyRanking(false, year, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/communities")
    @SneakyThrows
    public ResponseEntity<Page<RankingResponse>> getLifetimeRankingC(@RequestParam(defaultValue = "0") Integer page,
                                                                    @RequestParam(defaultValue = "50") Integer size) {
        var token = new TypeToken<List<RankingResponse>>() {
        }.getType();
        Page<Ranking> result = rankingService.getLifetimeRanking(false, page, size).get();
        Page<RankingResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }
}
