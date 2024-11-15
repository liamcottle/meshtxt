import GlobalState from "./GlobalState.js";
import {BleConnection, Constants, Protobuf, SerialConnection, Types,} from "@meshtastic/js";

class Connection {

    static async connectViaBluetooth() {
        await this.connect(new BleConnection(), {
            filters: [
                {
                    services: [
                        Constants.ServiceUuid,
                    ],
                },
            ],
        });
    }

    static async connectViaSerial() {
        await this.connect(new SerialConnection(), {
            concurrentLogOutput: true,
        });
    }

    static async connect(connection, connectionArgs) {

        // check if already connected
        if(GlobalState.isConnected){
            alert("Already connected");
            return;
        }

        // setup connection listeners
        await this.setupConnectionListeners(connection);

        // connect to device
        await connection.connect(connectionArgs);

        // update state
        GlobalState.connection = connection;
        GlobalState.isConnected = true;

    }

    static async disconnect() {

        // do nothing if already disconnected
        if(!GlobalState.isConnected){
            return;
        }

        // disconnect and clear ui data
        GlobalState.connection.disconnect();
        GlobalState.isConnected = false;

    }

    static async setupConnectionListeners(connection) {

        // setup packet listeners
        connection.events.onFromRadio.subscribe((data) => {
            if(data.payloadVariant.case.toString() === "packet") {
                const meshPacket = data.payloadVariant.value;
                if(meshPacket.payloadVariant.case === "decoded"){
                    const dataPacket = meshPacket.payloadVariant.value;
                    if(dataPacket.portnum === Protobuf.Portnums.PortNum.ROUTING_APP){
                        // todo handle nack for "no channel" etc
                        const ackFrom = meshPacket.from;
                        const requestId = dataPacket.requestId;
                        this.onPacketAck(requestId, ackFrom);
                    }
                }
            }
        });

        // listen for our node number
        connection.events.onMyNodeInfo.subscribe((data) => {
            console.log("onMyNodeInfo", data);
            GlobalState.myNodeId = data.myNodeNum;
        });

        // listen for node info
        GlobalState.nodesById = {};
        connection.events.onNodeInfoPacket.subscribe((data) => {

            console.log("onNodeInfoPacket", data);

            const nodeId = data.num;
            GlobalState.nodesById[nodeId] = data;

            // check if we found our own node info
            if(nodeId === GlobalState.myNodeId){
                GlobalState.myNodeUser = data.user;
            }

        });

        // listen for channels
        GlobalState.channelsByIndex = {};
        connection.events.onChannelPacket.subscribe((data) => {
            console.log("onChannelPacket", data);
            GlobalState.channelsByIndex[data.index] = data;
        });

        // listen for new messages
        connection.events.onMessagePacket.subscribe((data) => {
            console.log("onMessagePacket", data);
            GlobalState.messages.push(data);
        });

        // listen for device status changes
        connection.events.onDeviceStatus.subscribe((data) => {

            // check if device is now disconnected
            if(data === Types.DeviceStatusEnum.DeviceDisconnected){
                this.disconnect();
            }

        });

    }

    static onPacketAck(requestId, ackedByNodeId) {

        console.log(`got ack for request id ${requestId} from ${ackedByNodeId}`);

        // find message by request id
        const message = GlobalState.messages.find((m) => m.id === requestId);
        if(!message){
            return;
        }

        // update ack
        message.acked_by_id = ackedByNodeId;

    }

}

export default Connection;