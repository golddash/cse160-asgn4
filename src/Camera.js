class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
        this.speed = 0.2;
    }

    forward(move = 0) {
        const forwardVector = new Vector3;
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        forwardVector.normalize();
        forwardVector.mul(this.speed + move);
        this.eye.add(forwardVector);
        this.at.add(forwardVector);
    }

    back(move = 0) {
        const backwardVector = new Vector3;
        backwardVector.set(this.eye);
        backwardVector.sub(this.at);
        backwardVector.normalize();
        backwardVector.mul(this.speed + move);
        this.at.add(backwardVector);
        this.eye.add(backwardVector);
    }

    left() {
        const forwardVector = new Vector3;
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        forwardVector.normalize();
        forwardVector.mul(this.speed);
        const sideVector = Vector3.cross(this.up, forwardVector);
        this.at.add(sideVector);
        this.eye.add(sideVector);
    }

    right() {
        const forwardVector = new Vector3;
        forwardVector.set(this.eye);
        forwardVector.sub(this.at);
        forwardVector.normalize();
        forwardVector.mul(this.speed);
        const sideVector = Vector3.cross(this.up, forwardVector);
        this.at.add(sideVector);
        this.eye.add(sideVector);
    }

    panLeft() {
        const forwardVector = new Vector3;
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        const rotationMatrix = new Matrix4();
        rotationMatrix.setIdentity();
        rotationMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const rotatedVector = rotationMatrix.multiplyVector3(forwardVector);
        this.at = rotatedVector.add(this.eye);
    }

    panRight() {
        const forwardVector = new Vector3;
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        const rotationMatrix = new Matrix4();
        rotationMatrix.setIdentity();
        rotationMatrix.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const rotatedVector = rotationMatrix.multiplyVector3(forwardVector);
        this.at = rotatedVector.add(this.eye);
    }

    rotateX(angle) {
        const forwardVector = new Vector3();
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        const rotationMatrix = new Matrix4();
        rotationMatrix.setIdentity();
        rotationMatrix.setRotate(angle, 1, 0, 0); // Rotate around the X-axis
        const rotatedVector = rotationMatrix.multiplyVector3(forwardVector);
        this.at = rotatedVector.add(this.eye);
    }

    rotateY(angle) {
        const forwardVector = new Vector3();
        forwardVector.set(this.at);
        forwardVector.sub(this.eye);
        const rotationMatrix = new Matrix4();
        rotationMatrix.setIdentity();
        rotationMatrix.setRotate(angle, 0, 1, 0); // Rotate around the Y-axis
        const rotatedVector = rotationMatrix.multiplyVector3(forwardVector);
        this.at = rotatedVector.add(this.eye);
    }
}
