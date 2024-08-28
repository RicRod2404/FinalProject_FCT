package pt.unl.fct.di.adc.adc2024.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pt.unl.fct.di.adc.adc2024.daos.Message;
import pt.unl.fct.di.adc.adc2024.daos.Ranking;
import pt.unl.fct.di.adc.adc2024.daos.Treap;
import pt.unl.fct.di.adc.adc2024.daos.User;
import pt.unl.fct.di.adc.adc2024.daos.enums.CommunityLevels;
import pt.unl.fct.di.adc.adc2024.daos.enums.UserLevels;
import pt.unl.fct.di.adc.adc2024.daos.statistics.DailyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.MonthlyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.WeeklyStatistics;
import pt.unl.fct.di.adc.adc2024.daos.statistics.YearlyStatistics;
import pt.unl.fct.di.adc.adc2024.dtos.responses.TreapResponse;
import pt.unl.fct.di.adc.adc2024.repositories.*;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.DailyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.MonthlyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.WeeklyStatisticsRepository;
import pt.unl.fct.di.adc.adc2024.repositories.statistics.YearlyStatisticsRepository;

import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.*;
import static pt.unl.fct.di.adc.adc2024.daos.enums.CommunityLevels.COM_MAX;
import static pt.unl.fct.di.adc.adc2024.daos.enums.CommunityLevels.C_PREFIX;
import static pt.unl.fct.di.adc.adc2024.daos.enums.Role.GBO;
import static pt.unl.fct.di.adc.adc2024.daos.enums.UserLevels.USER_MAX;
import static pt.unl.fct.di.adc.adc2024.daos.enums.UserLevels.U_PREFIX;

@Service
@RequiredArgsConstructor
public class TreapService {

    /*
     * Should use the url from the user, but if no profile pic is set, it won't save any url.
     * If the user later on changes the picture, the treap will be displayed with the default pic.
     * In order to avoid that, the default pic url is set here, setting the picture "artificially".
     */
    private static final String DEFAULT_PROFILE_URL = "https://storage.googleapis.com/treapapp.appspot.com/profilepics/";
    private static final double PERSONAL_EXP_MULTIPLIER = 1.2;
    private static final double COMMUNITY_EXP_MULTIPLIER = 1.1;


    private final TreapRepository treaps;

    private final UserRepository users;

    private final CommunityRepository communities;

    private final RankingRepository rankings;

    private final MessageRepository messages;

    private final DailyStatisticsRepository dailyStatistics;

    private final WeeklyStatisticsRepository weeklyStatistics;

    private final MonthlyStatisticsRepository monthlyStatistics;

    private final YearlyStatisticsRepository yearlyStatistics;

    private final ModelMapper mapper;

    //private final CacheManager cacheManager;

    @Transactional
    @SuppressWarnings("ConstantConditions")
    public Optional<Treap> create(Treap treap) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        treap.setUserId(principal.getId());
        treap.setProfilePic(DEFAULT_PROFILE_URL + principal.getId());
        var t = treaps.save(treap);

        var tmp = principal.getLeafPoints();
        principal.setLeafPoints(tmp + treap.getLeafPoints());

        int month = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();
        updateRankings(principal, treap, month, year);
        updateExperience(principal, treap);
        updateStatistics(principal, treap, month, year);

        /*var cache = cacheManager.getCache(FEED);
        for (var id : principal.getFriends())
            cache.evict(users.findById(id).get().getNickname());
        cache.evict(principal.getNickname());*/

        return Optional.of(t);
    }

    @Async
    public Future<Page<Treap>> list(String nickname, int page, int size) {
        var u = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if ((principal.getRole().getCredentialLevel() < GBO.getCredentialLevel()) &&
                !u.isPublic() && !u.getFriends().contains(principal.getId()) && !principal.getId().equals(u.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(treaps.findAllByUserId(u.getId(), pageable));
    }


    @Cacheable(value = FEED, key = "#nickname")
    public List<TreapResponse> feed(String nickname) {
        var u = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        List<Treap> list = new ArrayList<>(treaps.findAllByUserId(u.getId()));
        for (var id : u.getFriends())
            list.addAll(treaps.findAllByUserId(id));

        list.sort((a, b) -> b.getLastModifiedDate().compareTo(a.getLastModifiedDate()));

        return list.stream().limit(200).map(user -> mapper.map(user, TreapResponse.class)).toList();
    }

    private void updateRankings(User principal, Treap treap, int month, int year) {
        // USER RANKING
        Ranking r = rankings.findByTargetIdAndMonthAndYear(principal.getId(), 0, 0).get();
        r.setLeafPoints(r.getLeafPoints() + treap.getLeafPoints());
        rankings.save(r);
        var ranking = rankings.findByTargetIdAndMonthAndYear(principal.getId(), month, year);
        if (ranking.isPresent()) {
            r = ranking.get();
            r.setLeafPoints(ranking.get().getLeafPoints() + treap.getLeafPoints());
        } else
            r = new Ranking(true, principal.getId(), principal.getNickname(), treap.getLeafPoints(), month, year);

        rankings.save(r);

        // COMMUNITY RANKING
        for (var communityId : principal.getCommunities()) {
            r = rankings.findByTargetIdAndMonthAndYear(communityId, 0, 0).get();
            r.setLeafPoints(r.getLeafPoints() + treap.getLeafPoints());
            rankings.save(r);
            ranking = rankings.findByTargetIdAndMonthAndYear(communityId, month, year);
            if (ranking.isPresent()) {
                r = ranking.get();
                r.setLeafPoints(ranking.get().getLeafPoints() + treap.getLeafPoints());
            } else {
                var community = communities.findById(communityId).get();
                r = new Ranking(false, communityId, community.getName(), treap.getLeafPoints(), month, year);
            }
            rankings.save(r);
        }
    }

    private void updateExperience(User principal, Treap treap) {
        // USER EXP
        principal.setLevelExp((int) (treap.getLeafPoints() * PERSONAL_EXP_MULTIPLIER));
        boolean possibleLevelUp = true;

        while (possibleLevelUp) {
            var userExp = principal.getLevelExp();
            var expToLevelUp = UserLevels.valueOf(U_PREFIX + principal.getLevel()).getExpRequiredLevelUp();
            if (userExp >= expToLevelUp && principal.getLevel() != USER_MAX) {
                principal.setLevel(principal.getLevel() + 1);
                var levelup = UserLevels.valueOf(U_PREFIX + principal.getLevel());
                principal.setLevelExp(userExp - expToLevelUp);
                principal.setLevelExpToNextLevel(levelup.getExpRequiredLevelUp());
            } else {
                possibleLevelUp = false;
            }
        }

        users.save(principal);
        //cacheManager.getCache(USERS).evict(principal.getNickname());


        // COMMUNITY EXP
        var communityExp = (int) (treap.getLeafPoints() * COMMUNITY_EXP_MULTIPLIER);
        possibleLevelUp = true;

        for (var communityId : principal.getCommunities()) {
            var community = communities.findById(communityId).get();
            community.setCommunityExp(community.getCommunityExp() + communityExp);
            while (possibleLevelUp) {
                var expToLevelUpCommunity = CommunityLevels.valueOf(C_PREFIX + community.getCommunityLevel()).getExpRequiredLevelUp();
                if (community.getCommunityExp() >= expToLevelUpCommunity && community.getCommunityLevel() != COM_MAX) {
                    community.setCommunityLevel(community.getCommunityLevel() + 1);
                    community.setCommunityExpToNextLevel(CommunityLevels.valueOf(C_PREFIX + community.getCommunityLevel()).getExpRequiredLevelUp());
                    community.setMaxMembers(CommunityLevels.valueOf(C_PREFIX + community.getCommunityLevel()).getMaxNumOfMembers());
                    community.setCommunityExp(community.getCommunityExp() - expToLevelUpCommunity);
                    messages.save(new Message(UUID.randomUUID().toString(), communityId, LocalDateTime.now(), "system", "A comunidade subiu para nível " + community.getCommunityLevel() + "!"));
                } else {
                    possibleLevelUp = false;
                    communities.save(community);
                    //cacheManager.getCache(COMMUNITIES).evict(community.getName());
                }
            }
        }
    }

    private void updateStatistics(User principal, Treap treap, int month, int year) {
        int week = LocalDateTime.now().get(WeekFields.ISO.weekOfMonth());
        int weekDay = LocalDateTime.now().getDayOfWeek().getValue();

        DailyStatistics daily = dailyStatistics.findByUserIdAndWeekDayAndWeekOfMonthAndMonthAndYear(principal.getId(), weekDay, week, month, year)
                .orElseGet(() -> new DailyStatistics(principal.getId(), weekDay, week, month, year));
        WeeklyStatistics weekly = weeklyStatistics.findByUserIdAndWeekOfMonthAndMonthAndYear(principal.getId(), week, month, year)
                .orElseGet(() -> new WeeklyStatistics(principal.getId(), week, month, year));
        MonthlyStatistics monthly = monthlyStatistics.findByUserIdAndMonthAndYear(principal.getId(), month, year)
                .orElseGet(() -> new MonthlyStatistics(principal.getId(), month, year));
        YearlyStatistics yearly = yearlyStatistics.findByUserIdAndYear(principal.getId(), year)
                .orElseGet(() -> new YearlyStatistics(principal.getId(), year));

        int dailyTreaps = daily.getTreaps();
        int weeklyTreaps = weekly.getTreaps();
        int monthlyTreaps = monthly.getTreaps();
        int yearlyTreaps = yearly.getTreaps();
        daily.setTreaps(dailyTreaps + 1);
        weekly.setTreaps(weeklyTreaps + 1);
        monthly.setTreaps(monthlyTreaps + 1);
        yearly.setTreaps(yearlyTreaps + 1);

        daily.setCarbonFootprint((daily.getCarbonFootprint() * dailyTreaps + treap.getCarbonFootprint()) / daily.getTreaps());
        weekly.setCarbonFootprint((weekly.getCarbonFootprint() * weeklyTreaps + treap.getCarbonFootprint()) / weekly.getTreaps());
        monthly.setCarbonFootprint((monthly.getCarbonFootprint() * monthlyTreaps + treap.getCarbonFootprint()) / monthly.getTreaps());
        yearly.setCarbonFootprint((yearly.getCarbonFootprint() * yearlyTreaps + treap.getCarbonFootprint()) / yearly.getTreaps());

        daily.setDistance(daily.getDistance() + treap.getDistance());
        weekly.setDistance(weekly.getDistance() + treap.getDistance());
        monthly.setDistance(monthly.getDistance() + treap.getDistance());
        yearly.setDistance(yearly.getDistance() + treap.getDistance());

        for (var stop : treap.getPointList()) {
            if (stop.getTransport() != null && !stop.getTransport().isEmpty()) {
                switch (stop.getTransport()) {
                    case "WALKING" -> {
                        daily.setStopsByFoot(daily.getStopsByFoot() + 1);
                        weekly.setStopsByFoot(weekly.getStopsByFoot() + 1);
                        monthly.setStopsByFoot(monthly.getStopsByFoot() + 1);
                        yearly.setStopsByFoot(yearly.getStopsByFoot() + 1);

                        int steps = (int) (treap.getDistance() * 700);
                        daily.setSteps(daily.getSteps() + steps);
                        weekly.setSteps(weekly.getSteps() + steps);
                        monthly.setSteps(monthly.getSteps() + steps);
                        yearly.setSteps(yearly.getSteps() + steps);
                    }
                    case "DRIVING" -> {
                        daily.setStopsByCar(daily.getStopsByCar() + 1);
                        weekly.setStopsByCar(weekly.getStopsByCar() + 1);
                        monthly.setStopsByCar(monthly.getStopsByCar() + 1);
                        yearly.setStopsByCar(yearly.getStopsByCar() + 1);
                    }
                    case "TRANSIT" -> {
                        daily.setStopsByTransports(daily.getStopsByTransports() + 1);
                        weekly.setStopsByTransports(weekly.getStopsByTransports() + 1);
                        monthly.setStopsByTransports(monthly.getStopsByTransports() + 1);
                        yearly.setStopsByTransports(yearly.getStopsByTransports() + 1);
                    }
                    case "BICYCLING" -> {
                        daily.setStopsByBike(daily.getStopsByBike() + 1);
                        weekly.setStopsByBike(weekly.getStopsByBike() + 1);
                        monthly.setStopsByBike(monthly.getStopsByBike() + 1);
                        yearly.setStopsByBike(yearly.getStopsByBike() + 1);
                    }
                }
            }
        }

        dailyStatistics.save(daily);
        weeklyStatistics.save(weekly);
        monthlyStatistics.save(monthly);
        yearlyStatistics.save(yearly);
    }

}
