
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends Physijs.Scene {

  constructor(renderer){
    super({fixedTimeStep: 1 / 120 });

    Physijs.scripts.worker = "../libs/physijs_worker.js";
  	Physijs.scripts.ammo = "ammo.js";
  	this.player1 = null;
  	this.paused = true;
    this.moveSpeed= 1.25;
    this.music = null;
    this.ambientSound = null;

    this.puntuacionP1 = 0;
    this.puntuacionP2 = 0;
    this.tiempo = 95;
    this.previousTime = new Date().getTime();
  	this.keystate = {};

    // Attributes
  	this.setGravity(new THREE.Vector3( 0, -300, 0 ));

    this.ambientLight = null;
    this.camera = null;
    this.ground = null;
    this.renderer = renderer;
    this.ball = null;
    this.goalLeft = null;
    this.goalRight = null

    this.createLights();
    this.createCamera(renderer);
    this.createModel();
    this.createMusic();
    this.createAmbientSound();
    this.player1 = this.createPlayer();
    this.player2 = this.createPlayer();
    this.player1.position.x = -70;
    this.player2.position.x = 70;
    this.goalLeft = this.createGoal();
    this.goalLeft.position.x = -310;
    this.goalRight = this.createGoal();
    this.goalRight.position.x = 310;
    this.add(this.goalLeft);
    this.add(this.goalRight);
    this.add(this.player1);
    this.add(this.player2);
    this.player1.mass = 10;
    this.player2.mass = 10;
  }

  createCamera(renderer){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 25, 150);
    var look = new THREE.Vector3 (0,25,0);
    this.camera.lookAt(look);
    this.add(this.camera);
  }

  createLights(){
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.add (this.ambientLight);
  }

  createMusic(){
    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // create a global audio source
    var sound = new THREE.Audio( this.listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/Music.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 0.5 );
      sound.play();
    });

    this.music = sound;
  }

  GoalSound(){
    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // create a global audio source
    var sound = new THREE.Audio( this.listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/Goal.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( false );
      sound.setVolume( 1 );
      sound.play();
    });
  }

  AlertSound(){
    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // create a global audio source
    var sound = new THREE.Audio( this.listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/Alert.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( false );
      sound.setVolume( 1 );
      sound.play();
    });
  }

  WinSound(){
    this.ambientSound.pause();
    this.music.pause();

    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // create a global audio source
    var sound = new THREE.Audio( this.listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/Win.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( false );
      sound.setVolume( 1 );
      sound.play();
    });

  }

  createAmbientSound(){
    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // create a global audio source
    var sound = new THREE.Audio( this.listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/Ambient.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 1 );
      sound.play();
    });

    this.ambientSound = sound;
  }

  /// It creates the geometric model: crane and ground
  /**
   * @return The model
   */
  createModel(){
    var model = new THREE.Object3D();
    var loader = new THREE.TextureLoader();

  	var material = Physijs.createMaterial(
  		new THREE.MeshLambertMaterial({ map: loader.load( 'imgs/balon.jpg' ) }),
  		.1, // high friction
  		1 // low restitution
  	);

    var textura = loader.load ("imgs/balon.jpg");

    this.ball = new Physijs.SphereMesh(new THREE.SphereGeometry(10,32,32), material, 1);
  	this.ball.position.y = 100;
  	this.add(this.ball);

    var textura = loader.load ("imgs/grass.jpg");

  	material = Physijs.createMaterial(
  		new THREE.MeshLambertMaterial({ map: textura }),
  		.5, // high friction
  		1 // low restitution
  	);

    this.ground = new Physijs.BoxMesh (
      new THREE.BoxGeometry (2*350, 0.2, 2*200, 1, 1, 1),
      material, 0);

    this.add (this.ground);

    textura = loader.load ("imgs/crowd.jpg");
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(4,4);
    var crowd = new THREE.Mesh (
      new THREE.BoxGeometry (4*350, 0.2, 4*200, 1, 1, 1),
      new THREE.MeshPhongMaterial ({map: textura}));

    crowd.rotateX(THREE.Math.degToRad(90));
    crowd.translateY(-200);
    this.add(crowd);

    textura = loader.load ("imgs/external-grass.jpg");
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(4,4);

    var outsideFloor = new THREE.Mesh (
      new THREE.BoxGeometry (4*350, 0.2, 4*200, 1, 1, 1),
      new THREE.MeshPhongMaterial ({map: textura}));

    outsideFloor.translateY(-0.5);
    this.add(outsideFloor);

    material = Physijs.createMaterial(
      0x000000,
      1, // high friction
      0 // low restitution
    );

    var barrierL = new Physijs.BoxMesh(new THREE.BoxGeometry (50, 80, 200, 1, 1, 1), material, 0);
    barrierL.translateX(-360);
    this.add(barrierL);

    var barrierR = new Physijs.BoxMesh(new THREE.BoxGeometry (50, 80, 200, 1, 1, 1), material, 0);
    barrierR.translateX(360);
    this.add(barrierR);
  }

  animate(controls){
      if(this.tiempo < 90 && this.tiempo > 1){
        this.paused = false;
      }

      this.currentTime = new Date().getTime();
      var delta = this.currentTime - this.previousTime;
      this.previousTime = this.currentTime;
      this.tiempo-=delta/1000;

      if(this.paused){
        return;
      }

      setMessage("MARCADOR: " + this.puntuacionP1 + " - " + this.puntuacionP2 + "\nTIEMPO: " + Math.trunc(this.tiempo));

      //Comprobaciones porteria
      if(this.ball.position.x < -310 && this.ball.position.y < 50){
        this.puntuacionP2+=2;
        this.SaqueCentral();
        this.GoalSound();
      }

      else if(this.ball.position.x < -310 && this.ball.position.y > 50){
        this.SaqueP1();
      }

      if(this.ball.position.x > 310 && this.ball.position.y < 50){
        this.puntuacionP1++;
        this.SaqueCentral();
        this.GoalSound();
      }

      else if(this.ball.position.x > 310 && this.ball.position.y > 50){
        this.SaqueP2();
      }

      //Comprobar tiempo
      if(this.tiempo <= 0){
        if(this.puntuacionP1 == this.puntuacionP2){
          this.tiempo+=30;
          this.AlertSound();
        }

        else{
          this.paused = true;
          this.WinSound();
          if(this.puntuacionP1 > this.puntuacionP2){
            setMessage("El jugador 1 ha ganado: " + this.puntuacionP1 + " - " + this.puntuacionP2 + " Recarga la pagina para volver a jugar");
          }
          else{
             setMessage("El jugador 2 ha ganado: " + this.puntuacionP1 + " - " + this.puntuacionP2 + " Recarga la pagina para volver a jugar");
          }
        }
      }

  		if(!this.paused){
        this.camera.position.x = this.ball.position.x;

		    if (this.keystate[65]){
		        this.moveLeftP1();
		    }

		    if (this.keystate[68]){
		        this.moveRightP1();
		    }

		    if (this.keystate[87]){
		        this.JumpP1();
		    }

        if (this.keystate[37]){
            this.moveLeftP2();
        }

        if (this.keystate[39]){
            this.moveRightP2();
        }

        if (this.keystate[38]){
            this.JumpP2();
        }

		    if(this.player1.position.y < 11){
		    	this.P1jumping = false;
		    }

        if(this.player2.position.y < 11){
          this.P2jumping = false;
        }

	  		this.player1.position.z = 0;
	  		this.player1.rotation.z = 0;
	  		this.player1.rotation.x = 0;
        this.player1.__dirtyRotation = true;
        this.player1.__dirtyPosition = true;

	  		this.player2.position.z = 0;
	  		this.player2.rotation.z = 0;
	  		this.player2.rotation.x = 0;
        this.player2.__dirtyRotation = true;
        this.player2.__dirtyPosition = true;

	  		this.ball.position.z = 0;
        this.ball.rotation.x = 0;
        this.ball.rotation.y = 0;
	  		this.ball.__dirtyPosition = true;
        this.ball.__dirtyRotation = true;

        var velocity = this.ball.getLinearVelocity();

        this.ball.setLinearVelocity(new THREE.Vector3(velocity.x*0.991,velocity.y,velocity.z));
        this.simulate(undefined, 1/60);
		}
	}

	createPlayer(){
		var model = new THREE.Object3D();
	  var loader = new THREE.TextureLoader();
	  var textura = loader.load ("imgs/grass.jpg");

		var head = new THREE.Mesh(new THREE.SphereGeometry(5,32,32));
		head.position.y = 9;
		model.add(head);

		var material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial(0xffffff),
			1, // high friction
			.5 // low restitution
		);

		var body = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 32));

		var merge = new THREE.Geometry();
		var mid = new THREE.CylinderGeometry(3, 3, 8, 32);
		var top = new THREE.SphereGeometry(5,32,32);

    var matrix = new THREE.Matrix4();
    matrix.makeTranslation(0, 5, 0);
    top.applyMatrix(matrix);

		var bot = new THREE.CylinderGeometry(.1,8,10,32,32);
		var matrix = new THREE.Matrix4();
    matrix.makeTranslation(0, -5, 0);
    bot.applyMatrix(matrix);

		merge.merge(top);
		merge.merge(bot);
		merge.merge(mid);

		body.position.y = -1;
		model.add(body);
		model.position.y = -4;
		material.visible = false;
		var fisicas = new Physijs.ConvexMesh(merge, material, 0);
		fisicas.add(model);
		fisicas.position.y = 10;

		fisicas.translateX(0);
		return fisicas;
	}

  createGoal(){
    var model = new THREE.Object3D();
    var material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial(0xffffff),
      1, // high friction
      .9 // low restitution
    );

    var top = new THREE.Mesh(new THREE.CylinderGeometry(2,2,100,32),  new THREE.MeshLambertMaterial(0xffffff));
    top.rotateX(THREE.Math.degToRad(90));
    top.position.y = 50;
    var left = new THREE.Mesh(new THREE.CylinderGeometry(2,2,50,32),  new THREE.MeshLambertMaterial(0xffffff))
    left.position.y = 25;
    left.position.z = 50;
    var right = new THREE.Mesh(new THREE.CylinderGeometry(2,2,50,32),  new THREE.MeshLambertMaterial(0xffffff))
    right.position.y = 25;
    right.position.z = -50;

    var col = new THREE.CylinderGeometry(2,2,100,32);
    col.rotateX(THREE.Math.degToRad(90));

    model.add(top);
    model.add(left);
    model.add(right);

    material.visible = false;
    var fisicas = new Physijs.CylinderMesh(col, material, 0);
    model.translateY(-50);
    fisicas.translateY(50);
    fisicas.add(model);
    return fisicas;
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera(){
    return this.camera;
  }

  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect(anAspectRatio){
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  moveLeftP1(){
  	this.player1.translateX(-this.moveSpeed);
  }

  moveRightP1(){
  	this.player1.translateX(this.moveSpeed);
  }

  JumpP1(){
  	if(!this.P1jumping){
      this.player1.setLinearVelocity(new THREE.Vector3(0,0,0));
  		this.player1.mass = 10;
  		this.player1.applyCentralImpulse(new THREE.Vector3(0,1250,0));
  		this.P1jumping = true;
  	}
  }

  moveLeftP2(){
    this.player2.translateX(-this.moveSpeed);
  }

  moveRightP2(){
    this.player2.translateX(this.moveSpeed);
  }

  JumpP2(){
    if(!this.P2jumping){
      this.player2.setLinearVelocity(new THREE.Vector3(0,0,0));
      this.player2.mass = 10;
      this.player2.applyCentralImpulse(new THREE.Vector3(0,500,0));
      this.P2jumping = true;
    }
  }

  SaqueCentral(){
    this.player1.position.x = -70;
    this.player1.position.y = 10.5;
    this.player2.position.x = 70;
    this.player2.position.y = 10.5;
    this.ball.position.x = 0;
    this.ball.position.y = 80;
    this.ball.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.player1.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.player2.setLinearVelocity(new THREE.Vector3(0,0,0));
  }

  SaqueP1(){
    this.player1.position.x = -300;
    this.player1.position.y = 10.5;
    this.player2.position.x = 0;
    this.player2.position.y = 10.5;
    this.ball.position.x = -285;
    this.ball.position.y = 50;
    this.ball.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.ball.setAngularVelocity(new THREE.Vector3(0,0,0));
    this.player1.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.player2.setLinearVelocity(new THREE.Vector3(0,0,0));
  }

  SaqueP2(){
    this.player1.position.x = 0;
    this.player1.position.y = 10.5;
    this.player2.position.x = 300;
    this.player2.position.y = 10.5;
    this.ball.position.x = 285;
    this.ball.position.y = 50;
    this.ball.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.ball.setAngularVelocity(new THREE.Vector3(0,0,0));
    this.player1.setLinearVelocity(new THREE.Vector3(0,0,0));
    this.player2.setLinearVelocity(new THREE.Vector3(0,0,0));
  }
}
