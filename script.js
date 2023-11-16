const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


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
    return distance < object1.radius
}

function collisionSettingsRect(object){
    settingsRect = document.getElementById("settings")
    if (object.pos_actual.x < settingsRect.offsetWidth  &&  object.pos_actual.y < settingsRect.offsetHeight){
        console.log(object.pos_actual.x, object.pos_actual.y,  settingsRect.offsetWidth, settingsRect.offsetHeight)
        return true
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function collisionNewElement(object){
    for (let i = 0; i < imgs.length ; i++) {
        if (collision(object, imgs[i]) || collisionSettingsRect(object)) {
            return true
        }
    }
    return false
}

function generator(nb_elements){
    imagesSrc = ["/images/pierre.png", "/images/feuille.png", "/images/ciseaux.png"]
    vectorPossibility = [-1, 1]
    for (let i = 0; i < nb_elements; i++) {
        src = imagesSrc[getRandomInt(3)]
        radius = Math.min(window.innerWidth,window.innerHeight)/15;

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
        } while (collisionNewElement(img));
        imgs.push(img)
        addNumberSrc(img)
    }
}

function getType(object){
    return object.image.src.split("/")[object.image.src.split("/").length-1]
}
function addNumberSrc(object){
    numbers_src[getType(object)] += 1
}

function withdrawNumberSrc(object){
    numbers_src[getType(object)] -= 1
}

function change_src_image(object, url){
    withdrawNumberSrc(object)
    object.image.src = url
    addNumberSrc(object)
    updateDigramPiechart()
}

function updateDigramPiechart(){
    document.getElementById('piechart').style.backgroundImage = 'conic-gradient('
        + '#DBDBDB ' + degres("ciseaux.png").toString() + 'deg' + ', ' + "#487D1A 0 " + (degres("ciseaux.png")+degres("feuille.png")).toString() + 'deg, ' + "#D9C1AA 0" + ')';
}

function change_src_images(object1, object2){
    src_object1 = getType(object1)
    src_object2 = getType(object2)
    if (src_object1 == "feuille.png"){
        if (src_object2 == "pierre.png")
            change_src_image(object2, "/images/feuille.png")
        else if (src_object2 == "ciseaux.png")
            change_src_image(object1, "/images/ciseaux.png")
    } else if (src_object1 == "pierre.png"){
        if (src_object2 == "feuille.png")
            change_src_image(object1, "/images/feuille.png")
        else if (src_object2 == "ciseaux.png")
            change_src_image(object2, "/images/pierre.png")
    } else if (src_object1 == "ciseaux.png"){
        if (src_object2 == "pierre.png")
            change_src_image(object1, "/images/pierre.png")
        else if (src_object2 == "feuille.png")
            change_src_image(object2, "/images/ciseaux.png")
    }
}

function manage_collision(index_object) {
    object = imgs[index_object]
    for (let i = index_object+1; i < imgs.length ; i++) {
        if (collision(object, imgs[i])) {
            [object.vector, imgs[i].vector] = [imgs[i].vector, object.vector]
            change_src_images(object, imgs[i])
        }
    } if (collisionSettingsRect(object)) {
        if (object.pos_actual.x+1 == settingsRect.offsetWidth){
            object.vector.x *= -1
        } else {
            object.vector.y *= -1
        }
    }
    return false
}

function degres(type){
    return numbers_src[type]*360/nb_elements

}
function restart(){
    numbers_src = {"pierre.png": 0, "ciseaux.png": 0, "feuille.png": 0 }
    nb_elements = document.getElementById("nb_elements").value
    imgs = []
    generator(nb_elements)
    updateDigramPiechart()
    document.getElementById("nb_elements").value = nb_elements
}

imgs = []
nb_elements=document.getElementById("nb_elements").value
numbers_src = {"pierre.png": 0, "ciseaux.png": 0, "feuille.png": 0 }
generator(nb_elements)
updateDigramPiechart()
setInterval(function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let i = 0; i < imgs.length ; i++){
        manage_collision(i);
        move(imgs[i])
    } if (numbers_src["pierre.png"] == nb_elements || numbers_src["ciseaux.png"] == nb_elements ||  numbers_src["feuille.png"] == nb_elements ){
        setTimeout( restart, 250);

    }
}, 1)

document.getElementById("restart").addEventListener("click", restart);