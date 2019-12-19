var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)

function preload() {
    this.load.image('ship', 'assets/spaceShips_001.png')	
    this.load.image('otherPlayer', 'assets/enemyBlack5.png')
}

const socket = io()

function create() {
    const self = this
    this.socket = io()
    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id])
            }
        })
    })
    this.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(self, playerInfo)
    })
    this.socket.on('disconnect', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy()
            }
        })
    })
}

function addPlayer(self, playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40)
    if (playerInfo.team === 'blue')
        self.ship.setTint(0x0000ff)
    else
        self.ship.setTint(0xff0000)
    self.ship.setDrag(100)
    self.ship.setAngularDrag(100)
    self.ship.setMaxVelocity(200)
}

function addOtherPlayers(self, playerInfo){
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40)
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff)
    } else {
      otherPlayer.setTint(0xff0000)
    }
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer)
}

function update() {

}