package pt.unl.fct.di.adc.adc2024.config;

import com.fatboyindustrial.gsonjavatime.Converters;
import com.google.common.reflect.TypeResolver;
import com.google.gson.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.http.converter.json.GsonHttpMessageConverter;

import java.lang.reflect.Type;

/**
 * Configuration class for JSON processing.
 * Annotated with @ConditionalOnClass to only instantiate the beans if Gson class is on the classpath.
 */
@Configuration
@ConditionalOnClass(Gson.class)
public class JsonConfig {

    /**
     * Provides a TypeResolver bean.
     * TypeResolver is a utility class for resolving type parameters.
     * It is used by the PageAdapter to resolve the type of the content of a Page.
     * @return a new TypeResolver
     */
    @Bean
    public TypeResolver resolver() {
        return new TypeResolver();
    }

    @Bean
    @Primary
    public Gson getGson() {
        return Converters.registerAll(new GsonBuilder().setPrettyPrinting()
                .registerTypeAdapter(Page.class, new PageAdapter<>())).create();
    }

    @Bean
    public Gson getGsonAspect() {
        return Converters.registerAll(new GsonBuilder()
                .registerTypeAdapter(Page.class, new PageAdapter<>())).create();
    }

    /**
     * Provides a GsonHttpMessageConverter bean.
     * The converter is configured with a Gson instance that has
     * pretty printing enabled and a custom serializer for Page objects.
     * Pretty printing is used to make the JSON output more readable.
     * @return a new GsonHttpMessageConverter
     */
    @Bean
    public GsonHttpMessageConverter getMsgConverter() {
        return new GsonHttpMessageConverter(getGson());
    }

    /**
     * Custom serializer for Page objects.
     * It serializes a Page object into a JSON object with properties for page size,
     * page number, number of elements, total pages, total elements, and content.
     * The content is a JSON array of the serialized content of the Page.
     * @param <T> the type of the content of the Page
     */
    static class PageAdapter<T> implements JsonSerializer<Page<T>> {

        /**
         * Serializes a Page object into a JsonElement.
         * @param src the Page to serialize
         * @param typeOfSrc the actual type of the source object
         * @param context the context of the serialization
         * @return a JsonElement representing the serialized Page
         */
        @Override
        public JsonElement serialize(Page<T> src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject object = new JsonObject();
            object.addProperty("pageSize", src.getSize());
            object.addProperty("page", src.getNumber());
            object.addProperty("elements", src.getNumberOfElements());
            object.addProperty("totalPages", src.getTotalPages());
            object.addProperty("total", src.getTotalElements());
            JsonArray array = new JsonArray();
            src.getContent().forEach((item) -> array.add(context.serialize(item)));
            object.add("content", array);
            return object;
        }
    }
}