class CannonBall {
  constructor(x, y) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
      isStatic: true
    };
    this.r = 30;
    this.speed = 0.05;
    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("./assets/cannonball.png");
    this.animation = [this.image];
    this.tower = loadImage("./assets/gray.jpg");
    this.trajectory = [];
    this.isSink = false; //valor de afundar como falso inicialmente
    World.add(world, this.body);
  }
  animate() {
    this.speed += 0.05 % 1.1; //dá a velocidade da execução da animação
  }
  remove(index) { //tipo de remoção da bola assim que afunda
    this.isSink = true; //está afundando
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 }); //velocidade do corpo zerada
    this.animation = waterSplashAnimation; //executa a animação
    this.speed = 0.05; //executar a velocidade da animação
    this.r = 150; //raio da imagem
    setTimeout(() => { //assim que o tempo acabar
      Matter.World.remove(world, this.body); //remover a bola do mundo
      balls.splice(index, 1); //remover da matriz
    }, 1000); //o tempo limite é de 1000 milissegundos, ou seja, 1 segundo
  }
  shoot() {
    var velocity = p5.Vector.fromAngle(cannon.angle);
    velocity.mult(20);
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, { x: velocity.x, y: velocity.y });
  }
  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length); //demonstra a animação com a velocidade
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, 0, this.r, this.r);
    pop();
    if (this.body.velocity.x > 0 && this.body.position.x > 300 && !this.isSink) {
      var position = [this.body.position.x, this.body.position.y];
      this.trajectory.push(position);
    }

    for (var i = 0; i < this.trajectory.length; i++) {
      image(this.image, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
    }
  }
}
