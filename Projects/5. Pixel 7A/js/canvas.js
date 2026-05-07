export function drawCanvas(){

    const scale = 2.75;
    const pHeight = 152*scale; // phone height
    const pWidth = 72.9*scale;
    const aspectRatio = 2.085;
    const scrHeight = 141.3*scale; // screen height
    const scrWidth = 63.6*scale;
    const bWidth = 3*scale;
    const pButtonHeight = 14*scale;
    const pButtonY = 40*scale;
    const vButtonHeight = 26*scale;
    const vButtonY = 70*scale;

    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    drawFront(context,w,h,scale,pHeight,pWidth,scrHeight,scrWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY)

    drawBack(context,w,h,scale,pHeight,pWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY)

}

function drawFront(ctx,w,h,s,pHeight,pWidth,scrHeight,scrWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY){

    const fCameraRadii = 2.5*s;
    const fCameraY = 12*s;
    const pRadii = 5.5*s;
    const sRadii = 4.5*s;

    ctx.save();
    ctx.translate(w/4 - pWidth/2, h/2 - pHeight/2);

    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";

    // phone outline

    ctx.fillStyle = "rgb(38, 38, 40)";
    ctx.beginPath();
    ctx.roundRect(0,0,pWidth,pHeight,pRadii);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // screen outline

    ctx.fillStyle = "rgb(20, 20, 22)"
    ctx.beginPath();
    ctx.roundRect((pWidth/2) - (scrWidth/2),(pHeight/2) - (scrHeight/2),scrWidth,scrHeight,sRadii);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // front camera

    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.beginPath();
    ctx.arc(pWidth/2,fCameraY,fCameraRadii,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // volume button

    ctx.fillStyle = "rgb(38, 38, 40)";
    ctx.beginPath();
    ctx.roundRect(pWidth,vButtonY,bWidth,vButtonHeight,1);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // power button

    ctx.beginPath();
    ctx.roundRect(pWidth,pButtonY,bWidth,pButtonHeight,1);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.restore();

}

function drawBack(ctx,w,h,s,pHeight,pWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY){

    const cBarHeight = 17*s;
    const cBarY = 17*s;
    const cBarCRadii = 3*s;
    const pRadii = 5.5*s;

    ctx.save();
    ctx.translate(3*w/4 - pWidth/2, h/2 - pHeight/2)

    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";

    // phone outline

    ctx.fillStyle = "rgb(38, 38, 40)";
    ctx.beginPath();
    ctx.roundRect(0,0,pWidth,pHeight,pRadii);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // camera bar

    ctx.fillStyle = "rgb(152, 152, 155)";
    ctx.beginPath();
    ctx.roundRect(0,cBarY,pWidth,cBarHeight,0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // camera bar cameras

    ctx.fillStyle = "rgb(100,100,100)";
    ctx.beginPath();
    ctx.arc(10*s,cBarY + cBarHeight/2,cBarCRadii,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((10+9)*s,cBarY + cBarHeight/2,cBarCRadii,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgb(200,200,200)";
    ctx.beginPath();
    ctx.arc(pWidth-(15*s),cBarY + cBarHeight/2,cBarCRadii,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // volume button

    ctx.fillStyle = "rgb(38, 38, 40)";
    ctx.beginPath();
    ctx.roundRect(-bWidth,vButtonY,bWidth,vButtonHeight,1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // power button

    ctx.beginPath();
    ctx.roundRect(-bWidth,pButtonY,bWidth,pButtonHeight,1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //

    ctx.restore();

}