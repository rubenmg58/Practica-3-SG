
/// The Ground class
/**
 * @author FVelasco
 *
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Ground extends THREE.Object3D {

  constructor (aWidth, aDeep, aMaterial, aBoxSize) {
    super();

    this.width = aWidth;
    this.deep = aDeep;

	this.material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: aMaterial }),
		.8, // high friction
		1 // low restitution
	);

    this.ground = null;

    this.ground = new Physijs.BoxMesh (
      new THREE.BoxGeometry (this.width*3.5, 0.2, this.deep/2, 1, 1, 1),
      this.material, 0);
    this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
      this.ground.rotation.y = THREE.Math.degToRad(90);
    this.ground.receiveShadow = true;
    this.ground.autoUpdateMatrix = true;
    this.add (this.ground);

  }
}
