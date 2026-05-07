export const sketch = (p) => {

    const w = 300;
    const h = 300;

    p.setup = () => {

        const canvas = p.createCanvas(w,h);
        canvas.parent('myP5');

    }

    p.draw = () => {

        const scale = 1.375;
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

        drawFront(context,w,h,scale,pHeight,pWidth,scrHeight,scrWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY)

        drawBack(context,w,h,scale,pHeight,pWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY)

    }


    function drawFront(ctx,w,h,s,pHeight,pWidth,scrHeight,scrWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY){

        const fCameraRadii = 5*s;
        const fCameraY = 12*s;
        const pRadii = 5.5*s;
        const sRadii = 4.5*s;

        p.push();
        p.translate(w/4 - pWidth/2, h/2 - pHeight/2);

        p.strokeWeight(0.5);
        p.stroke("black");

        // phone outline

        p.fill("rgb(38, 38, 40)");
        p.rect(0,0,pWidth,pHeight,pRadii);

        // screen outline

        p.fill("rgb(20, 20, 22)");
        p.rect((pWidth/2) - (scrWidth/2),(pHeight/2) - (scrHeight/2),scrWidth,scrHeight,sRadii);

        // front camera

        p.fill("rgba(255,255,255,0.55)");
        p.circle(pWidth/2,fCameraY,fCameraRadii);

        // volume button

        p.fill("rgb(38, 38, 40)");
        p.rect(pWidth,vButtonY,bWidth,vButtonHeight,0.5);

        // power button

        p.rect(pWidth,pButtonY,bWidth,pButtonHeight,0.5);

        p.pop();

    }

    function drawBack(ctx,w,h,s,pHeight,pWidth,bWidth,pButtonHeight,pButtonY,vButtonHeight,vButtonY){

        const cBarHeight = 17*s;
        const cBarY = 17*s;
        const cBarCRadii = 6*s;
        const pRadii = 5.5*s;

        p.push();
        p.translate(3*w/4 - pWidth/2, h/2 - pHeight/2)

        p.strokeWeight(0.5);
        p.stroke("black");

        // phone outline

        p.fill("rgb(38, 38, 40)");
        p.rect(0,0,pWidth,pHeight,pRadii);

        // camera bar

        p.fill("rgb(152, 152, 155)");
        p.rect(0,cBarY,pWidth,cBarHeight,0);

        // camera bar cameras

        p.fill("rgb(100,100,100)");
        p.circle(10*s,cBarY + cBarHeight/2,cBarCRadii);

        p.circle((10+9)*s,cBarY + cBarHeight/2,cBarCRadii);

        p.fill("rgb(200,200,200)");
        p.circle(pWidth-(15*s),cBarY + cBarHeight/2,cBarCRadii);

        // volume button

        p.fill("rgb(38, 38, 40)");
        p.rect(-bWidth,vButtonY,bWidth,vButtonHeight,0.5);

        // power button

        p.rect(-bWidth,pButtonY,bWidth,pButtonHeight,0.5);

        //

        p.pop();

    }

}