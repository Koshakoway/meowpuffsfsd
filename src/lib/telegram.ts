import {
init,
miniApp
}
from
"@telegram-apps/sdk";

export function initTelegram(){

init();

miniApp.mount();

miniApp.ready();

miniApp.expand();

}