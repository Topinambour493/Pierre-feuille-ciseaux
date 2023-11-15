const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
imgs = []
nb_elements=30

function createImage(src, pos_actual, vector, radius){
    let newImage = new Image();
    newImage.src = src
    return {image: newImage, pos_actual: pos_actual, vector: vector, radius:radius}
}
function drawObject(object){
        context.drawImage(object.image, object.pos_actual.x, object.pos_actual.y, object.radius, object.radius);

}
function move(object){
    object.pos_actual.x +=  object.vector.x
    object.pos_actual.y +=  object.vector.y

    if ((object.pos_actual.y > window.innerHeight - object.radius) || (object.pos_actual.y < 0 )){
        object.vector.y *= -1
    }
    if ((object.pos_actual.x > window.innerWidth - object.radius) || (object.pos_actual.x < 0 )) {
        object.vector.x *= -1
    }

    drawObject(object)
}

function getCenter(object){
    return {
        x: (object.radius/2) + object.pos_actual.x,
        y: (object.radius/2) + object.pos_actual.y
    }

}

function collision(object1, object2){
    center_object1 = getCenter(object1)
    center_object2 = getCenter(object2)
    let dx = center_object1.x - center_object2.x;
    let dy = center_object1.y - center_object2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < object1.radius){
        return true
    } return false
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function generator(nb_elements){
    imagesSrc = ["/images/pierre.png", "/images/feuille.png", "/images/ciseaux.png"]
    vectorPossibility = [-1, 1]
    for (let i = 0; i < nb_elements; i++) {
        src = imagesSrc[getRandomInt(3)]
        radius = 80;

        do {
            pos_actual = {
                x: getRandomInt(window.innerWidth - radius),
                y: getRandomInt(window.innerHeight - radius)
            }

            vector = {
                x: vectorPossibility[getRandomInt(2)],
                y: vectorPossibility[getRandomInt(2)]
            }
            img = createImage(src, pos_actual, vector, radius)
        } while (manage_collision(img) > 0);
        imgs.push(img);
    }
}

function change_src_images(object1, object2){
    src_object1 = object1.image.src.split("/")[object1.image.src.split("/").length-1]
    src_object2 = object2.image.src.split("/")[object2.image.src.split("/").length-1]
    if (src_object1 == "feuille.png"){
        if (src_object2 == "pierre.png")
            object2.image.src = "/images/feuille.png"
        else if (src_object2 == "ciseaux.png")
            object1.image.src = "/images/ciseaux.png"
    } else if (src_object1 == "pierre.png"){
        if (src_object2 == "feuille.png")
            object1.image.src = "/images/feuille.png"
        else if (src_object2 == "ciseaux.png")
            object2.image.src = "/images/pierre.png"
    } else if (src_object1 == "ciseaux.png"){
        if (src_object2 == "pierre.png")
            object1.image.src = "/images/pierre.png"
        else if (src_object2 == "feuille.png")
            object2.image.src = "/images/ciseaux.png"
    }
}
function manage_collision(index_object) {
    nb_collisions = 0;
    object = imgs[index_object]
    for (let i = index_object+1; i < imgs.length ; i++){
        if (collision(object, imgs[i]) && object){
            [object.vector, imgs[i].vector] = [imgs[i].vector, object.vector]
            change_src_images(object, imgs[i])
            nb_collisions += 1
        }
    }
    return nb_collisions
}


generator(nb_elements)
setInterval(function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let i = 0; i < imgs.length ; i++){
        manage_collision(i);
        move(imgs[i])
    }
}, 1)

