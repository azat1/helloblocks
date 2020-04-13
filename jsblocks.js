var gamedata=[];
function InitGame(elem)
{
   gamedata.started=true;
   gamedata.colcount=16;
   gamedata.rowcount=32;
   gamedata.element=elem;
   gamedata.figure=null;
   gamedata.field=[];
   gamedata.score=0;
   gamedata.figures=[[{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:+2,y:0}],
      [{x:-1,y:0},{x:0,y:0},{x:-1,y:1},{x:0,y:1}],
      [{x:-1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}],
      [{x:-1,y:1},{x:-1,y:0},{x:0,y:0},{x:1,y:0}],
      [{x:-1,y:1},{x:0,y:1},{x:0,y:0},{x:1,y:1}]];
   gamedata.currentspeed=1000;
   gamedata.timerid=setInterval(onTimer,gamedata.currentspeed);
   document.addEventListener("keydown",onKeyDown);
   CreateCanvas();
   InitField();
   DrawField();
}

function InitField()
{
   gamedata.field.length=0;
   for (var c=0;c<gamedata.rowcount;c++)
   {
      gamedata.field.push(0);
   }
}
function CreateCanvas()
{
   gamedata.element.style.width="320px";
   gamedata.element.style.height="640px";
   gamedata.canvas= document.getElementById("idcanvas");
}

function DrawField()
{
   var ctx=gamedata.canvas.getContext('2d');
   ctx.fillStyle="#FFFFFF";
   ctx.strokeStyle="#000000";
   ctx.fillRect(0,0,320,640);
   fieldDraw(ctx);
   ctx.strokeRect(0,0,320,640);
   ctx.strokeText(gamedata.score,10,10);
}
function fieldDraw(ctx)
{
   var bs=320/gamedata.colcount;
   for (var r=0;r<gamedata.rowcount;r++)
   {
      for (var c=0;c<gamedata.colcount;c++)
      {
         if ((1<<c) & gamedata.field[r])
         {
            ctx.fillStyle="#000000";
         } else
         {
            ctx.fillStyle="#FFFFFF";
         }
         ctx.fillRect(c*bs,r*bs,bs,bs);
      }
   }
   if (gamedata.figure==null) return;
   ctx.fillStyle="#000000";
   for (var i=0;i<gamedata.figure.blocks.length;i++)
   {
      var b=gamedata.figure.blocks[i];
      ctx.fillRect((gamedata.figure.x+b.x) *bs,(gamedata.figure.y+b.y)*bs,bs,bs);
           
   }
}
function StartGame(objid,inputobj)
{
   if (gamedata.started) return;
   inputobj.blur();
   var obj=document.getElementById(objid);

   InitGame(obj);

}

function onKeyDown(e)
{
   switch (e.code)
   {
      case "ArrowUp":rotateFigure();
      break;
      case "ArrowLeft":moveLeft();
      break;
      case "ArrowRight":moveRight();
      break;
      case "Space":moveDown();
      break;
   }
}
function rotateFigure()
{
   if (!canRotate()) return;
   for (var i=0;i<gamedata.figure.blocks.length;i++)
   {
      var b=gamedata.figure.blocks[i];
      var x=b.x; 
      var y=b.y;
      b.x=-y;
      b.y=x;
   }
   DrawField();
}

function canRotate()
{
   for (var i=0;i<gamedata.figure.blocks.length;i++)
   {
      var b=gamedata.figure.blocks[i];
      if (!IsEmpty(gamedata.figure.x-b.y,gamedata.figure.y+b.x)) return false;
   }
  return true;
}

function moveLeft()
{
  moveFigure(-1,0);
}
function moveFigure(x,y)
{
   if (gamedata.figure==null) return;
   if (CheckMovable(x,y))
   {
     gamedata.figure.x+=x;
     gamedata.figure.y+=y;
     DrawField();
   }
}

function CheckMovable(x,y)
{
   for (var i=0;i<gamedata.figure.blocks.length;i++)
   {
      var b=gamedata.figure.blocks[i];
     if (!IsEmpty(gamedata.figure.x+b.x+x,gamedata.figure.y+b.y+y))
     {
        return false;
     } 
     
   }
   return true;
}

function IsEmpty(x,y)
{
   if ((x<0)||(x>=gamedata.colcount)) return false;
   if ((y>=gamedata.rowcount)) return false;
      if (gamedata.field[y]&(1<<x))
      {
         return false;
      }
   return true;   
}
function moveRight()
{
   moveFigure(1,0);
}
function moveDown()
{
   moveFigure(0,1);

}

function onTimer(e)
{
   GameCycle();
}

function GameCycle()
{
   
   if (gamedata.figure==null)
   {
      CreateFigure();
      return;
   }
   var z= gamedata.figure.y;
   moveFigure(0,1);
   if (z==gamedata.figure.y)
   {
      pushFigure();
   }
   
}

function pushFigure()
{
   for (var i=0;i<gamedata.figure.blocks.length;i++)
   {
      var b=gamedata.figure.blocks[i];
      gamedata.field[gamedata.figure.y+b.y]|=(1<<(gamedata.figure.x+b.x));
    
   }
   CheckLine();
   CreateFigure();
}
function CheckLine()
{
   var i=0;
   while (i<gamedata.field.length)
   {
      if (gamedata.field[i]==0xFFFF)
      {
         gamedata.field.splice(i,1);
         gamedata.field.unshift(0);
         gamedata.score++;
         if (gamedata.score%10==0)
         {
            clearInterval(gamedata.timerid);
            gamedata.currentspeed/=2;
            setInterval(onTimer,gamedata.currentspeed);
         }
         continue;
      }
      i++;
   }
   DrawField();
}

function CreateFigure()
{
   gamedata.figure=[];
   gamedata.figure.x=gamedata.colcount/2;
   gamedata.figure.y=2;
   var x= Math.floor( Math.random()*gamedata.figures.length);
   gamedata.figure.blocks=gamedata.figures[x];// [{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:2,y:0}
   if (!CheckMovable(0,0))
   {
      EndGame();
   }
 
}
function EndGame()
{
   clearInterval(gamedata.timerid);
}