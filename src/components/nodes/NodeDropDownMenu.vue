<template>
    <DropDownMenu>
        <template v-slot:button>
            <IconButton v-if="node" class="bg-transparent text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </IconButton>
        </template>
        <template v-slot:items>

            <!-- node details -->
            <div class="p-2 border-b">
                <div class="text-sm text-gray-500 font-semibold">{{ getNodeLongName(node.num) }}</div>
                <div class="flex space-x-1 text-sm text-gray-500">

                    <!-- node num -->
                    <div>{{ getNodeHexId(node.num) }}</div>

                    <!-- hops away -->
                    <div v-if="node.hopsAway !== -1" class="flex my-auto text-sm text-gray-500 space-x-1">
                        <span>•</span>
                        <span v-if="node.hopsAway === 0">Direct</span>
                        <span v-else-if="node.hopsAway === 1">1 Hop</span>
                        <span v-else>{{ node.hopsAway }} Hops</span>
                    </div>

                    <!-- snr (only shown for direct nodes) -->
                    <div v-if="node.hopsAway === 0" class="my-auto text-sm text-gray-500">
                        <span>• SNR {{ node.snr }}</span>
                    </div>

                </div>
            </div>

            <!-- node info button -->
            <RouterLink :to="{ name: 'node', params: { nodeId: node.num }}">
                <DropDownMenuItem>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                    </svg>
                    <span>Node Info</span>
                </DropDownMenuItem>
            </RouterLink>

            <!-- direct message button -->
            <RouterLink :to="{ name: 'node.messages', params: { nodeId: node.num }}">
                <DropDownMenuItem>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
                    </svg>
                    <span>Direct Message</span>
                </DropDownMenuItem>
            </RouterLink>

            <!-- transfer files button -->
            <RouterLink :to="{ name: 'node.files', params: { nodeId: node.num }}">
                <DropDownMenuItem>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                    <span>Transfer Files</span>
                </DropDownMenuItem>
            </RouterLink>

            <!-- exchange node info button -->
            <DropDownMenuItem @click="onRequestNodeInfo(node)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" />
                </svg>
                <span>Request Node Info</span>
            </DropDownMenuItem>

            <!-- ping button -->
            <DropDownMenuItem @click="onPingNode(node)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" />
                </svg>
                <span>Ping Node</span>
            </DropDownMenuItem>

            <!-- trace route button -->
            <RouterLink :to="{ name: 'node.traceroutes', params: { nodeId: node.num }}">
                <DropDownMenuItem>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256" class="size-5">
                        <path d="M235.81,75.79A27.91,27.91,0,0,1,216,84a28.49,28.49,0,0,1-5.67-.58l-30.57,56.77,0,0a28,28,0,1,1-44.43,6.49l-26.06-26.06A28.07,28.07,0,0,1,96,124a28.41,28.41,0,0,1-5.67-.58L59.76,180.18l0,0a28,28,0,1,1-39.6,0h0a28,28,0,0,1,25.47-7.61l30.57-56.77,0,0a28.05,28.05,0,0,1,0-39.61h0a28,28,0,0,1,44.43,33.12l26.06,26.06a28.1,28.1,0,0,1,19-2.77l30.57-56.77,0,0a28,28,0,0,1,0-39.6h0a28,28,0,0,1,39.6,39.6Z"></path>
                    </svg>
                    <span>Trace Routes</span>
                </DropDownMenuItem>
            </RouterLink>

            <!-- view on map button -->
            <div class="border-b">
                <a :href="`https://meshtastic.liamcottle.net/?node_id=${node.num}`" target="_blank">
                    <DropDownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                            <path fill-rule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clip-rule="evenodd" />
                        </svg>
                        <span>View on Meshtastic Map</span>
                    </DropDownMenuItem>
                </a>
            </div>

            <!-- node info button -->
            <RouterLink :to="{ name: 'node.settings', params: { nodeId: node.num }}">
                <DropDownMenuItem>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
                    </svg>
                    <span>Settings</span>
                </DropDownMenuItem>
            </RouterLink>

            <!-- delete message history button -->
            <DropDownMenuItem v-if="showDeleteMessageHistoryButton" @click="onDeleteMessageHistory(node)">
                <svg class="size-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
                <span class="text-red-500">Delete Message History</span>
            </DropDownMenuItem>

            <!-- forget node button -->
            <DropDownMenuItem @click="onDeleteNode(node)">
                <svg class="size-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
                <span class="text-red-500">Forget Node</span>
            </DropDownMenuItem>

        </template>
    </DropDownMenu>
</template>

<script>
import NodeUtils from "../../js/NodeUtils.js";
import IconButton from "../IconButton.vue";
import DropDownMenu from "../DropDownMenu.vue";
import DropDownMenuItem from "../DropDownMenuItem.vue";
import NodeAPI from "../../js/NodeAPI.js";
import Database from "../../js/Database.js";

export default {
    name: 'NodeDropDownMenu',
    components: {
        DropDownMenuItem,
        DropDownMenu,
        IconButton,
    },
    props: {
        node: Object,
        showDeleteMessageHistoryButton: Boolean,
    },
    emits: [
        "node-deleted",
    ],
    methods: {
        getNodeHexId: (nodeId) => NodeUtils.getNodeHexId(nodeId),
        getNodeShortName: (nodeId) => NodeUtils.getNodeShortName(nodeId),
        getNodeLongName: (nodeId) => NodeUtils.getNodeLongName(nodeId),
        getNodeColour: (nodeId) => NodeUtils.getNodeColour(nodeId),
        getNodeTextColour: (nodeId) => NodeUtils.getNodeTextColour(nodeId),
        onRequestNodeInfo(node) {

            // request node info
            NodeAPI.requestNodeInfo(node.num);

            // show alert
            alert("A request has been sent to the node to send its info back to us.");

        },
        async onPingNode(node) {
            try {
                const pingResult = await NodeAPI.ping(node.num);
                const pingDurationMillis = pingResult.duration_millis;
                const hopsAway = pingResult.hops_away;
                alert(`[${this.getNodeShortName(node.num)}] replied to ping in ${pingDurationMillis}ms with ${hopsAway} hops back.`);
            } catch(e){}
        },
        async onDeleteMessageHistory() {

            // confirm user wants to delete message history
            if(!confirm("Are you sure you want to delete all message history with this node?")){
                return;
            }

            // delete message history
            await Database.Message.deleteNodeMessages(this.node.num);

        },
        onDeleteNode(node) {

            // confirm user wants to remove this node
            if(!confirm("Are you sure you want to forget this node?")){
                return;
            }

            // remove node
            NodeAPI.removeNodeByNum(node.num);

            // emit event
            this.$emit("node-deleted", node);

        },
    },
}
</script>
