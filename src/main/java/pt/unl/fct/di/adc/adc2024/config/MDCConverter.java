package pt.unl.fct.di.adc.adc2024.config;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class MDCConverter extends ClassicConverter {
    @Override
    public String convert(ILoggingEvent event) {
        var mdc = event.getMDCPropertyMap();
        var builder = new StringBuilder();

        mdc.entrySet().forEach(entry -> {
            builder.append("[")
                    .append(entry.getKey())
                    .append("=")
                    .append(entry.getValue())
                    .append("]")
                    .append(" ");
        });
        return builder.toString();
    }
}
