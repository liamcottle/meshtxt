<template>
    <Page>

        <!-- app bar -->
        <AppBar title="User Settings" :subtitle="subtitle">
            <template v-slot:leading>
                <NodeIcon v-if="node" :node-id="node.num" class="mr-3"/>
            </template>
            <template v-slot:trailing>
                <SaveButton :is-saving="isSaving" @click="save"/>
            </template>
        </AppBar>

        <!-- loading -->
        <div v-if="isLoading" class="mx-auto my-auto p-2">
            <FetchingDataInfo/>
        </div>

        <!-- loaded -->
        <div v-else-if="user != null" class="flex h-full w-full overflow-hidden">

            <div class="w-full overflow-y-auto">

                <div class="bg-white divide-y">

                    <div class="w-full p-2">
                        <div class="block mb-2 text-sm font-medium text-gray-900">Short Name</div>
                        <input v-model="user.shortName" type="text" placeholder="e.g: LIAM" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </div>

                    <div class="w-full p-2">
                        <div class="block mb-2 text-sm font-medium text-gray-900">Long Name</div>
                        <input v-model="user.longName" type="text" placeholder="e.g: Liam Cottle" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    </div>

                </div>

            </div>

        </div>

        <!-- failed to load -->
        <div v-else class="mx-auto my-auto p-2">

            <!-- info -->
            <div class="flex flex-col mx-auto my-auto text-gray-700 text-center">
                <div class="mb-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
                        <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="font-semibold">{{ errorTitle }}</div>
                <div>{{ errorSubtitle }}</div>
            </div>

            <!-- retry button -->
            <div class="w-full mt-2">
                <button @click="getOwner" type="button" class="mx-auto flex cursor-pointer bg-white rounded shadow px-3 py-2 text-black font-semibold hover:bg-gray-100">
                    Try Again
                </button>
            </div>

        </div>

    </Page>
</template>

<script>
import Page from "../Page.vue";
import AppBar from "../../AppBar.vue";
import IconButton from "../../IconButton.vue";
import GlobalState from "../../../js/GlobalState.js";
import NodeIcon from "../../nodes/NodeIcon.vue";
import NodeUtils from "../../../js/NodeUtils.js";
import NodeAPI from "../../../js/NodeAPI.js";
import DialogUtils from "../../../js/DialogUtils.js";
import SaveButton from "../../SaveButton.vue";
import FetchingDataInfo from "../../FetchingDataInfo.vue";
import RoutingError from "../../../js/exceptions/RoutingError.js";

export default {
    name: 'UserSettingsPage',
    components: {
        FetchingDataInfo,
        SaveButton,
        NodeIcon,
        IconButton,
        AppBar,
        Page,
    },
    props: {
        nodeId: String | Number,
    },
    data() {
        return {
            isLoading: false,
            isSaving: false,
            errorTitle: null,
            errorSubtitle: null,
            user: null,
        };
    },
    mounted() {
        this.getOwner();
    },
    methods: {
        getNodeLongName: (nodeId) => NodeUtils.getNodeLongName(nodeId),
        async getOwner() {

            // mark as loading
            this.isLoading = true;
            this.errorTitle = null;
            this.errorSubtitle = null;

            // get owner info from node
            try {
                this.user = await NodeAPI.remoteAdminGetOwner(this.nodeId);
            } catch(e) {

                // check if this is a routing error
                if(e instanceof RoutingError){
                    this.errorTitle = "Routing Error";
                    this.errorSubtitle = e.getRoutingErrorMessage();
                    return;
                }

                // standard error
                this.errorTitle = "Failed to Load";
                this.errorSubtitle = e;

            } finally {

                // no longer loading
                this.isLoading = false;

            }

        },
        async save() {

            // do nothing if already saving
            if(this.isSaving){
                return;
            }

            // mark as saving
            this.isSaving = true;

            // save owner info to node
            try {
                await NodeAPI.remoteAdminSetOwner(this.nodeId, this.user);
                DialogUtils.showSettingsSavedAlert();
            } catch(e) {
                DialogUtils.showErrorAlert(e);
            }

            // no longer saving
            this.isSaving = false;

        },
    },
    computed: {
        node() {
            return GlobalState.nodesById[this.nodeId];
        },
        subtitle() {
            return this.node ? this.getNodeLongName(this.node.num) : "Unknown Node";
        },
    },
}
</script>
