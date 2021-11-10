noseX = "";
noseY = "";
GameStatus = "";

function startGame()
{
	GameStatus = "start";
	document.getElementById("status").innerHTML = "Game Is Loading";
}

function game(){
	console.log("noseX = " + noseX +", noseY = " + noseY);
}

function preload() {
	world_start = loadSound("world_start.wav");
	mario_jump = loadSound("jump.wav")
	mario_coin = loadSound("coin.wav");
	mario_gameover = loadSound("gameover.wav");
	mario_kick = loadSound("kick.wav");
	mario_die = loadSound("mariodie.wav");
	setSprites();
	MarioAnimation();
}

function setup() {
	canvas = createCanvas(1240,336);
	canvas.parent('canvas');
	
	instializeInSetup(mario);

	video = createCapture(VIDEO);
	video.size(800,400);
	video.parent('game_console');

	poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}
function modelLoaded() {
	console.log('Model Loaded!');
  }
  
  function gotPoses(results)
  {
	if(results.length > 0)
	{
		console.log(results);
	  noseX = results[0].pose.nose.x;
	  noseY = results[0].pose.nose.y;
	}
  }

function draw() {
	game()
}
function changeGameStatud(character){
	if(GameStatus=="start"&& noseX !="" && gameConfig.status==="start") {
		world_start.play();
	}
}
if(gameConfig.status==="gameover" && keyDown(control.revive)) {
	gameConfig.status = "start"
}


function manualControl(character){

	if(character.live){
		if(noseX < 300){
			character.velocity.x-=gameConfig.moveSpeed;
			character.changeAnimation('move');
			character.mirrorX(-1);
		}

		if(keyDown(noseX < 300)){
			character.velocity.x-=gameConfig.moveSpeed;
			character.changeAnimation('move');
			character.mirrorX(1);
		}

		if(!keyDown(control.left)&&!keyDown(noseX < 300)&&!keyDown(control.up)){
            character.changeAnimation('stand');
		}
	
}

}
function jumping(character){
	if( ( noseY < 200 && character.live ) || (touchIsDown&&character.live) ){
		mario_jump.play();
		character.velocity.y+=gameConfig.jump;
	}
}

function instializeInSetup(character){
	frameRate(120);

	character.scale=0.35;
	instializeCharacterStatus(character);

	bricks.displace(bricks);
	platforms.displace(platforms);
	coins.displace(coins);
	coins.displace(platforms);
	coins.collide(pipes);
	coins.displace(bricks);
}

function instializeCharacterStatus(character){
	character.scale=0.35;
	character["killing"]=0;
	character["kills"]=0;
	character["live"]=true;
	character["liveNumber"]=gameConfig.intialLifes;
	character["status"]='live';
	character["coins"];
}

function getCoins(coin,character){
	if( character.overlap(coin) && character.live && coin.get==false){
		character.coins+=1;
		coin.get=true;
		mario_coin.play();
	}
}
function checkStatus(character){
	if(character.live==false){
		character.changeAnimation('dead');
		character.dying-=1;
		reviveAfterMusic(character);
	}
	if(character.live==false && character.liveNumber==0){
		gameConfig.status="gameover";
        mario_gameover.play();
	}
}
function initializeInDraw(){
	background(109,143,252);

	if(mario.killing>0){
		mario.killing-=1;
	}else{
		mario.killing=0;
	}
}
enemyMushrooms.forEach(function(element) {
     StepOnEnemy(character,element);
	 if(element.touching.left||element.touching.right)character.live&&character.killing===0
	 die(mario);
})
function StepOnEnemy(obj1,obj2){
	
	var obj1_Left=leftSide(obj1);
	var obj1_Right=rightSide(obj1);
	var obj1_Up=upSide(obj1);
	var obj1_Down=DownSide(obj1);

	var obj2_Left=leftSide(obj2);
	var obj2_Right=rightSide(obj2);
	var obj2_Up=upSide(obj2);
	var obj2_Down=DownSide(obj2);

	if(obj1_Right>=obj2_left&&obj1_Left<=obj2_R);
	obj2.live=false;
	obj1.killing=30;
	mario_kick.play();
	obj1.kills++;
	if(obj1.velocity.y>=gameConfig.jump*0.8){
		obj1.velocity.y=gameConfig.jump*0.8;
	}else{
		obj1.velocity.y+=gameConfig.jump*0.8;
	}
}
function die(character){
	character.live=false;
	character.dying+=120;
	character.liveNumber--;
	character.status="dead";
	character.changeAnimation('dead');
	character.velocity.y-=2;
	if(character.liveNumber > 0)
	{
		mario_die.play();
	}
}