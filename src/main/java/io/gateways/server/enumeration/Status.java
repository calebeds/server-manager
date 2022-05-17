package io.gateways.server.enumeration;

public enum Status {
    SERVER_UP("SERVER_UP"),
    SERVER_DOWN("SERVER_DONW");
    private final String status;


    Status(String status) {
        this.status = status;
    }


    public String getStatus() {
        return this.status;
    }
}
