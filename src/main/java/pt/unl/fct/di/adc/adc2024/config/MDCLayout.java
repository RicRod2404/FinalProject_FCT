package pt.unl.fct.di.adc.adc2024.config;

import ch.qos.logback.classic.PatternLayout;

public class MDCLayout extends PatternLayout {

    static {
        DEFAULT_CONVERTER_MAP.put("customMdc", MDCConverter.class.getName());
    }

}
