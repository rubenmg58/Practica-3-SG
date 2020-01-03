class Ball extends THREE.Object3D{
	constructor(material){
		super();

		this.material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: material}),
			.8, // low friction
			.8 // high restitution
		);

		this.ball = null;


		this.ball = new Physijs.SphereMesh(new THREE.SphereGeometry(10,32,32), this.material);
		
		this.add(this.ball);
	}
}