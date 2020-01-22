
function sleep(ms:number) {
    return new Promise(resolve=> setTimeout(resolve,ms));
}

export async function until(fn:any) {
    while(!fn()) {
        await sleep(0);
    }
}
