import GLC from '../GLController';

let r = 0;
const render = () => {
    GLC.clear(1.0, 0.0, 1.0);
    r = r + 0.001;
    window.requestAnimationFrame(render);
}

export default (id) => {
    const canvas = document.getElementById(id);

    if(!canvas) {
        return;
    }

    const gl = canvas.getContext('webgl');

    if(!gl) {
        return;
    }

    GLC.init(gl);
    window.requestAnimationFrame(render);
}