export function log(arg1, arg2) {
    // eslint-disable-next-line no-console
    console.log(arg1, arg2);
}
export function debug(arg1, arg2) {
    if (process.env.NODE_ENV === "debug") {
        // eslint-disable-next-line no-console
        console.debug(arg1, arg2);
    }
}
export function time(timerName) {
    // eslint-disable-next-line no-console
    console.time(timerName);
}
export function timeLog(timerName) {
    if (process.env.NODE_ENV === "debug") {
        // eslint-disable-next-line no-console
        console.timeLog(timerName);
    }
}
export function clearScreen() {
    if (process.env.NODE_ENV === "debug") {
        debug("Clearing screen disabled in debug mode", {});
        return;
    }
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    // eslint-disable-next-line no-console
    console.clear();
}
//# sourceMappingURL=console.js.map