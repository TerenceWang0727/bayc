import { 
  Transfer as TransferEvent,
  BoredApeYachtClub as BoardApeYachtClubContract
} from '../generated/BoredApeYachtClub/BoredApeYachtClub'

import GlobalConstants from '../helper/utils'

import {
    Ape, User, Transaction
} from '../generated/schema'

export function handleTransfer(event: TransferEvent): void{
    let ape = Ape.load(event.params.tokenId.toString());
    if(!ape){
        ape = new Ape(event.params.tokenId.toString());
        ape.creator = event.params.to.toHexString();
        ape.createdAtTimestamp = event.block.timestamp;
        

        let apeContract = BoardApeYachtClubContract.bind(event.address);
        ape.contentURI = apeContract.tokenURI(event.params.tokenId);
    }
    ape.owner = event.params.to.toHexString();
    ape.save();

    let user = User.load(event.params.to.toHexString());
    if(!user){
        user = new User(event.params.to.toHexString());
        user.save();
    }

    let transaction = Transaction.load(GlobalConstants.globalId(event));
    if(!transaction){
        transaction = new Transaction(GlobalConstants.globalId(event))
        transaction.createdAtTimestamp = event.block.timestamp;
        transaction.from = event.params.from.toHexString();
        transaction.to = event.params.to.toHexString();
        let apeContract = BoardApeYachtClubContract.bind(event.address);
        transaction.price = apeContract.apePrice();
        transaction.save();
    }


    
}