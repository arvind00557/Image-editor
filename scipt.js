const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const canvas = document.getElementById("editorCanvas");
const ctx = canvas.getContext("2d");
const cropBox = document.getElementById("cropBox");
const zoomSlider = document.getElementById("zoomSlider");

let img = new Image();
let zoom = 1;
let cropActive = false;
let startX, startY;

// UPLOAD IMAGE
dropZone.addEventListener("click", ()=> fileInput.click());

fileInput.addEventListener("change", e=>{
loadImage(e.target.files[0]);
});

dropZone.addEventListener("dragover", e=>{
e.preventDefault();
});

dropZone.addEventListener("drop", e=>{
e.preventDefault();
loadImage(e.dataTransfer.files[0]);
});

function loadImage(file){
const reader = new FileReader();
reader.onload = ()=>{
img.src = reader.result;
img.onload = ()=>{
canvas.width = img.width;
canvas.height = img.height;
drawImage();
dropZone.style.display="none";
};
};
reader.readAsDataURL(file);
}

function drawImage(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.save();
ctx.scale(zoom, zoom);
ctx.drawImage(img,0,0);
ctx.restore();
}

// MODE SWITCHER
function setMode(mode){
document.querySelectorAll(".panel").forEach(p=>p.style.display="none");

if(mode==="crop"){
  cropBox.style.display="block";
  cropBox.style.width="200px";
  cropBox.style.height="150px";
  cropBox.style.left="100px";
  cropBox.style.top="100px";
}

if(mode==="resize"){
  document.getElementById("resizePanel").style.display="block";
}
if(mode==="rotate"){
  document.getElementById("rotatePanel").style.display="block";
}
if(mode==="zoom"){
  document.getElementById("zoomPanel").style.display="block";
}
if(mode==="compress"){
  document.getElementById("compressPanel").style.display="block";
}
}

// RESIZE
function applyResize(){
const w = document.getElementById("rw").value;
const h = document.getElementById("rh").value;
canvas.width = w;
canvas.height = h;
ctx.drawImage(img,0,0,w,h);
}

// ROTATE
function applyRotate(angle){
canvas.width = img.height;
canvas.height = img.width;
ctx.translate(canvas.width/2, canvas.height/2);
ctx.rotate(angle * Math.PI/180);
ctx.drawImage(img, -img.width/2, -img.height/2);
}

// ZOOM
zoomSlider.addEventListener("input", ()=>{
zoom = zoomSlider.value;
drawImage();
});

// COMPRESSION
function applyCompress(){
const q = document.getElementById("quality").value;
const data = canvas.toDataURL("image/jpeg", q);
img.src = data;
img.onload = drawImage;
}

// DOWNLOAD
document.getElementById("downloadBtn").addEventListener("click", ()=>{
const link = document.createElement("a");
link.href = canvas.toDataURL();
link.download = "edited-image.png";
link.click();
});
