package pt.unl.fct.di.adc.adc2024.daos.enums;

public enum UserLevels {

    LEVEL_0(Integer.MIN_VALUE),
    LEVEL_1(100),
    LEVEL_2(200),
    LEVEL_3(300),
    LEVEL_4(400),
    LEVEL_5(500),
    LEVEL_6(600),
    LEVEL_7(700),
    LEVEL_8(800),
    LEVEL_9(900),
    LEVEL_10(1000),
    LEVEL_11(1100),
    LEVEL_12(1200),
    LEVEL_13(1300),
    LEVEL_14(1400),
    LEVEL_15(1500),
    LEVEL_16(1600),
    LEVEL_17(1700),
    LEVEL_18(1800),
    LEVEL_19(1900),
    LEVEL_20(2000),
    LEVEL_21(2100),
    LEVEL_22(2200),
    LEVEL_23(2300),
    LEVEL_24(2400),
    LEVEL_25(2500),
    LEVEL_26(2600),
    LEVEL_27(2700),
    LEVEL_28(2800),
    LEVEL_29(2900),
    LEVEL_30(Integer.MAX_VALUE);


    public static final String U_PREFIX = "LEVEL_";

    public static final int USER_MAX = 30;

    private final int expRequiredLevelUp;

    UserLevels(int expRequiredLevelUp) {
        this.expRequiredLevelUp = expRequiredLevelUp;
    }

    public int getExpRequiredLevelUp() {
        return expRequiredLevelUp;
    }
}
