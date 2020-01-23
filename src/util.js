
function sleep(ms) {
    return new Promise(resolve=> setTimeout(resolve,ms));
}

export async function until(fn) {
    while(!fn()) {
        await sleep(0);
    }
}
