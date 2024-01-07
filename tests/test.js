const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('CosmoNFT', function () {
    let deployer, user1, user2;
    let CosmoNFT;

    let DEPLOYER_MINT = 5;
    let USER1_MINT = 3;
    let MINT_PRICE = ethers.parseEther('0.1');

    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();

        const CosmoNFTFactory = await ethers.getContractFactory('CosmoNFT');
        CosmoNFT = await CosmoNFTFactory.connect(deployer).deploy();

    });

    it('Minting Tests', async function () {

        /** CODE YOUR SOLUTION HERE */
 
        //Deployer mints 
        for (let i = 0; i < DEPLOYER_MINT; i++) {
            await expect(CosmoNFT.connect(deployer).mint({ value: MINT_PRICE }))
                .to.emit(CosmoNFT, 'Transfer');
        }
        // Deployer should own token ids 1-5
        for (let i = 1; i <= 5; i++) {
            expect(await CosmoNFT.ownerOf(i)).to.equal(deployer.address);
        }

        // TODO: User 1 mints
        // User1 should own token ids 6-8
        for (let i = 0; i < USER1_MINT; i++) {
            await expect(CosmoNFT.connect(user1).mint({ value: MINT_PRICE }))
                .to.emit(CosmoNFT, 'Transfer');
        }

        // TODO: Check Minting
        for (let i = 6; i <= 8; i++) {
            expect(await CosmoNFT.ownerOf(i)).to.equal(user1.address);
        }

    });


    it('Transfers Tests', async function () {

        /** CODE YOUR SOLUTION HERE */
        //Deployer mints
        for (let i = 0; i < DEPLOYER_MINT; i++) {
            await expect(CosmoNFT.connect(deployer).mint({ value: MINT_PRICE }))
                .to.emit(CosmoNFT, 'Transfer');
        }
        //User 1 mints
        for (let i = 0; i < USER1_MINT; i++) {
            await expect(CosmoNFT.connect(user1).mint({ value: MINT_PRICE }))
                .to.emit(CosmoNFT, 'Transfer');
        }
 
        // TODO: Transfering tokenId 6 from user1 to user2
        await expect(CosmoNFT.connect(user1).transferFrom(user1.address, user2.address, 6)).to.emit(CosmoNFT, 'Transfer');

        // TODO: Checking that user2 owns tokenId 6
        expect(await CosmoNFT.ownerOf(6)).to.equal(user2.address); //deployer 1,2,3,4,5, user1 7,8 user2 6
 
        // TODO: Deployer approves User1 to spend tokenId 3
        await CosmoNFT.connect(deployer).approve(user1.address, 3);

        // TODO: Test that User1 has approval to spend TokenId3
        expect(await CosmoNFT.getApproved(3)).to.equal(user1.address);


        // TODO: Use approval and transfer tokenId 3 from deployer to User1
        await expect(CosmoNFT.connect(user1).transferFrom(deployer.address, user1.address, 3)).to.emit(CosmoNFT, 'Transfer');


        // TODO: Checking that user1 owns tokenId 3
        expect(await CosmoNFT.ownerOf(3)).to.equal(user1.address); //deployer 1,2,4,5, user1 7,8,3 user2 6

 
        // TODO: Checking balances after transfer
        // Deployer: 5 minted, 1 sent, 0 received
        // User1: 3 minted, 1 sent, 1 received
        // User2: 0 minted, 0 sent, 1 received
        expect(await CosmoNFT.balanceOf(deployer.address)).to.equal(4);
        expect(await CosmoNFT.balanceOf(user1.address)).to.equal(3);
        expect(await CosmoNFT.balanceOf(user2.address)).to.equal(1);

    });

});
