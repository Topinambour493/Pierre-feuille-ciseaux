const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
imgs = []

function createImage(src, pos_actual, vector, size){
    let newImage = new Image();
    newImage.src = src
    imgs.push({image: newImage, pos_actual: pos_actual, vector: vector, size:size})
}
function drawObject(object){
        context.drawImage(object.image, object.pos_actual.x, object.pos_actual.y, object.size.width, object.size.height);
}
function move(object){
    let pos3_x, pos3_y
    object.pos_actual.x +=  object.vector.x
    object.pos_actual.y +=  object.vector.y

    if ((object.pos_actual.y > window.innerHeight - object.size.height) || (object.pos_actual.y < 0 )){
        object.vector.y *= -1
    }
    if ((object.pos_actual.x > window.innerWidth - object.size.width) || (object.pos_actual.x < 0 )) {
        object.vector.x *= -1
    }

    drawObject(object)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function generator(nb_elements){
    imagesSrc = ["/images/pierre.png", "/images/feuille.jpg", "/images/ciseaux.png"]
    vectorPossibility = [-1, 1]
    for (let i = 0; i < nb_elements; i++) {
        src = imagesSrc[getRandomInt(3)]
        size = {width: 100, height: 80}
        pos_actual = {
            x: getRandomInt(window.innerWidth - size.width),
            y: getRandomInt(window.innerHeight - size.height)
        }
        vector = {
            x: vectorPossibility[getRandomInt(2)],
            y: vectorPossibility[getRandomInt(2)]
        }
        createImage(src, pos_actual, vector, size)
    }
}


generator(1000)
setInterval(function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    imgs.forEach((img) => move(img))
}, 1)
