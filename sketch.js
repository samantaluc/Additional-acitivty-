const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var score = 0;
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = []; //animação do barco quebrado
var brokenBoatSpritedata, brokenBoatSpritesheet; //recursos da animação

var waterSplashAnimation = []; //animação da bola de canhão
var waterSplashSpritedata, waterSplashSpritesheet; //recursos da animação

var isGameOver = false; //variavel do gameover inicialmente sendo falsa

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json"); //carrega o arquivo de leitura dos frames
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png"); //carrega a imagem do barco quebrando-se
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");//carrega o arquivo de leitura dos frames
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");//carrega a imagem da bola atingindo a agua
}
function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);
  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
  var brokenBoatFrames = brokenBoatSpritedata.frames; 
  for (var i = 0; i < brokenBoatFrames.length; i++) { 
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
  var waterSplashFrames = waterSplashSpritedata.frames;//variavel local ligando os arquivos com os frames
  for (var i = 0; i < waterSplashFrames.length; i++) {//laço de repetição para adição de frames até o comprimento da matriz
    var pos = waterSplashFrames[i].position;//cria uma posição aleatoria pelo indice
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);//adiciona a imagem a posição
    waterSplashAnimation.push(img); //começa a gerar a animação
  }
}
function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);
  Engine.update(engine);
  ground.display();
  showBoats();
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
  }
  cannon.display();
  tower.display();
  fill("#6d4c41"); //preenche com a cor
  textSize(40); //muda o tamanho do texto /da fonte
  text(`Score:${score}`, width - 200, 50); //mostra a pontuação
  textAlign(CENTER, CENTER); //alinha o texto no centro
}
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}
function showCannonBalls(ball, index) { //modificar o conteudo
  ball.display(); //mostra a bola
  ball.animate(); //realiza a animação dela
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) { //modificar o conteudo de dentro
    if (!ball.isSink) { //se a bola não está afundando
      ball.remove(index); //remover a bola do indice
    }  }}
function showBoats() {
  if (boats.length > 0) {    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(        width,        height - 100,        170,        170,        position,        boatAnimation
      );
      boats.push(boat); }    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {       x: -0.9,       y: 0     });
      boats[i].display();
      boats[i].animate();
      var collision = Matter.SAT.collides(tower.body, boats[i].body);
      if (collision.collided && !boats[i].isBroken) {
        isGameOver = true;
        gameOver();     }   } } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);  }}
function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) { //adicionar que nao está no estado de fim de jogo
    balls[balls.length - 1].shoot();
  }}

function gameOver() { //abre uma janela de confirmação
  swal(
    {
      title: `Game Over!!!`, text: "Thanks for playing!!", 
      imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png", 
      imageSize: "150x150", confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
