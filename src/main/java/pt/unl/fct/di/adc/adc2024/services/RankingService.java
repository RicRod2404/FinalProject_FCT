package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;
import pt.unl.fct.di.adc.adc2024.repositories.RankingRepository;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final RankingRepository rankings;

    @Async
    public Future<Page<Ranking>> getMonthlyRanking(boolean isUser, int month, int year, int page, int size) {
        var pageable = PageRequest.of(page, size);

        return CompletableFuture.completedFuture(rankings.findAllByUserAndMonthAndYearOrderByLeafPointsDesc(isUser, month, year, pageable));
    }

    @Async
    public Future<Page<Ranking>> getYearlyRanking(boolean isUser, int year, int page, int size) {
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(rankings.findAllByUserAndYearOrderByLeafPointsDesc(isUser, year, pageable));
    }

    @Async
    public Future<Page<Ranking>> getLifetimeRanking(boolean isUser, int page, int size) {
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(rankings.findAllByUserAndMonthAndYearOrderByLeafPointsDesc(isUser, 0, 0, pageable));
    }
}
