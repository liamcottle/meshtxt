import protobufjs from "protobufjs";
import {Protobuf} from "@meshtastic/js";
import NodeUtils from "./NodeUtils.js";
import NodeAPI from "./NodeAPI.js";

class FileTransferAPI {

    // static memory cache for loaded protobuf
    static _fileTransferPacket = null;

    static async getOrLoadFileTransferPacketProto() {

        // return from memory cache if available
        if(this._fileTransferPacket != null){
            return this._fileTransferPacket;
        }

        // otherwise load protobuf and cache in memory
        const root = await protobufjs.load("../protos/file_transfer.proto");
        this._fileTransferPacket = root.lookupType("FileTransferPacket");
        return this._fileTransferPacket;

    }

    static async sendFileTransferPacket(nodeId, data) {

        // create file transfer packet
        const FileTransferPacket = await this.getOrLoadFileTransferPacketProto();
        const fileTransferPacket = FileTransferPacket.encode(FileTransferPacket.fromObject(data)).finish();

        // send file transfer packet to destination
        const portNum = Protobuf.Portnums.PortNum.PRIVATE_APP;
        const byteData = fileTransferPacket;
        const channel = NodeUtils.getNodeChannel(nodeId);
        await NodeAPI.sendPacketAndWaitForResponse(nodeId, portNum, byteData, channel, false);

    }

    static async offerFileTransfer(nodeId, fileTransferId, fileName, fileSize) {
        await this.sendFileTransferPacket(nodeId, {
            offerFileTransfer: {
                id: fileTransferId,
                fileName: fileName,
                fileSize: fileSize,
            },
        });
    }

    static async rejectFileTransfer(nodeId, fileTransferId) {
        await this.sendFileTransferPacket(nodeId, {
            rejectFileTransfer: {
                fileTransferId: fileTransferId,
            },
        });
    }

    static async cancelFileTransfer(nodeId, fileTransferId) {
        await this.sendFileTransferPacket(nodeId, {
            cancelFileTransfer: {
                fileTransferId: fileTransferId,
            },
        });
    }

    static async completeFileTransfer(nodeId, fileTransferId) {
        await this.sendFileTransferPacket(nodeId, {
            completedFileTransfer: {
                fileTransferId: fileTransferId,
            },
        });
    }

    static async requestFileChunk(nodeId, fileTransferId, offset, length) {
        await this.sendFileTransferPacket(nodeId, {
            requestFileChunk: {
                fileTransferId: fileTransferId,
                offset: offset,
                length: length,
            },
        });
    }

    static async sendFileChunk(nodeId, fileTransferId, offset, length, data) {
        await this.sendFileTransferPacket(nodeId, {
            fileChunk: {
                fileTransferId: fileTransferId,
                offset: offset,
                length: length,
                data: data,
            },
        });
    }

}

export default FileTransferAPI;
