package pt.unl.fct.di.adc.adc2024.daos.enums;

public enum Role {
    SU(5),
    GS(4),
    GA(3),
    GBO(2),
    GC(1),
    USER(0);

    private final int credentialLevel;

    Role(int credentialLevel) {
        this.credentialLevel = credentialLevel;
    }

    public int getCredentialLevel() {
        return credentialLevel;
    }
}
