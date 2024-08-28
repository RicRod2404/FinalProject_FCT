package pt.unl.fct.di.adc.adc2024.daos.enums;

public enum CommunityLevels {
    LEVEL_0(Integer.MIN_VALUE, 0),
    LEVEL_1(100, 10),
    LEVEL_2(200, 25),
    LEVEL_3(300, 50),
    LEVEL_4(400, 65),
    LEVEL_5(500, 80),
    LEVEL_6(600, 100),
    LEVEL_7(700, 125),
    LEVEL_8(800, 150),
    LEVEL_9(900, 180),
    LEVEL_10(Integer.MAX_VALUE, 200);


    public static final String C_PREFIX = "LEVEL_";
    public static final int COM_MAX = 10;

    private final int expRequiredLevelUp;

    private final int maxNumOfMembers;

    CommunityLevels(int expRequiredLevelUp, int maxNumOfMembers) {
        this.expRequiredLevelUp = expRequiredLevelUp;
        this.maxNumOfMembers = maxNumOfMembers;
    }

    public int getExpRequiredLevelUp() {
        return expRequiredLevelUp;
    }

    public int getMaxNumOfMembers() {
        return maxNumOfMembers;
    }

}
