import { createApp } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import vClickOutside from "click-outside-vue3";
import "./style.css";

import App from './components/App.vue';
import GlobalState from "./js/GlobalState.js";
import {BleConnection, Protobuf, SerialConnection} from "@meshtastic/js";

const routes = [
    {
        name: "main",
        path: '/',
        component: () => import("./components/pages/MainPage.vue"),
    },
    {
        name: "connect",
        path: '/connect',
        component: () => import("./components/pages/ConnectPage.vue"),
    },
    {
        name: "connect.http",
        path: '/connect/http',
        component: () => import("./components/pages/ConnectViaHttpPage.vue"),
    },
    {
        name: "channel.messages",
        path: '/channels/:channelId/messages',
        props: true,
        component: () => import("./components/pages/ChannelMessagesPage.vue"),
    },
    {
        name: "node",
        path: '/nodes/:nodeId',
        props: true,
        component: () => import("./components/pages/NodePage.vue"),
    },
    {
        name: "node.messages",
        path: '/nodes/:nodeId/messages',
        props: true,
        component: () => import("./components/pages/NodeMessagesPage.vue"),
    },
    {
        name: "node.files",
        path: '/nodes/:nodeId/files',
        props: true,
        component: () => import("./components/pages/NodeFilesPage.vue"),
    },
    {
        name: "node.settings",
        path: '/nodes/:nodeId/settings',
        props: true,
        component: () => import("./components/pages/settings/NodeSettingsPage.vue"),
    },
    {
        name: "node.settings.user",
        path: '/nodes/:nodeId/settings/user',
        props: true,
        component: () => import("./components/pages/settings/NodeUserSettingsPage.vue"),
    },
    {
        name: "node.settings.channels",
        path: '/nodes/:nodeId/settings/channels',
        props: true,
        component: () => import("./components/pages/settings/NodeChannelsSettingsPage.vue"),
    },
    {
        name: "node.settings.channels.edit",
        path: '/nodes/:nodeId/settings/channels/:channelId',
        props: true,
        component: () => import("./components/pages/settings/NodeChannelSettingsPage.vue"),
    },
    {
        name: "node.traceroutes",
        path: '/nodes/:nodeId/traceroutes',
        props: true,
        component: () => import("./components/pages/NodeTraceRoutesPage.vue"),
    },
    {
        name: "node.traceroutes.run",
        path: '/nodes/:nodeId/traceroutes/run',
        props: true,
        component: () => import("./components/pages/NodeRunTraceRoutePage.vue"),
    },
    {
        name: "traceroute",
        path: '/traceroutes/:traceRouteId',
        props: true,
        component: () => import("./components/pages/TraceRoutePage.vue"),
    },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes: routes,
});

// preload all route components, so they are available even if the server deploys a new version before the user navigates to a page
for(const route of routes){
    if(typeof route.component === 'function'){
        route.component();
    }
}

createApp(App)
    .use(router)
    .use(vClickOutside)
    .mount('#app');

// disconnect from ble and serial before unloading page (chrome webview on android was crashing without this...)
// don't disconnect from http connection, as this seem to cause an infinite loop issue, and the crash was from ble anyway...
window.addEventListener("beforeunload", () => {
    if(GlobalState.connection){
        if(GlobalState.connection instanceof BleConnection || GlobalState.connection instanceof SerialConnection){
            GlobalState.connection.disconnect();
            GlobalState.isConnected = false;
        }
    }
});

// debug access to global state and protobufs
window.GlobalState = GlobalState;
window.Protobuf = Protobuf;
