package pt.unl.fct.di.adc.adc2024.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static pt.unl.fct.di.adc.adc2024.config.RedisConfig.SPAM;

//@Component
@RequiredArgsConstructor
public class SpamFilter extends OncePerRequestFilter {

    //private final CacheManager cacheManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        /*var ip = request.getHeader("X-Forwarded-For");
        if (ip == null) {
            ip = request.getRemoteAddr();
        }
        else {
            ip = ip.split(",")[0];
        }
        var cache = cacheManager.getCache(SPAM);
        var count = cache.get(ip, Integer.class);

        if (count != null && count > 500) {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
            return;
        }

        cache.put(ip, count == null ? 1 : count + 1);
        filterChain.doFilter(request, response);*/
    }
}
