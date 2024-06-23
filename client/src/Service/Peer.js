class PeerService {
    constructor() {
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.1.google.com:19302",
                            "stun:global.stun.twilio.com:3478", 
                        ],
                    },
                ],
            });
        }
    }

    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    };

    async setLocalDescription(ans){ // whenever call accepted handlecallaccpeted then it sets to local desription
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }

    }
    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer();// created offer
            await this.peer.setLocalDescription(new RTCSessionDescription(offer)); // set the offer in local
            return offer;

        }
    }
}

export default new PeerService();