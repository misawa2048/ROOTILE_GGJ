let tileImgArr=[
    "emptygnd.png", // カラ
    "nekko1.png", // 十
    "nekko2.png", // 」「
    "nekko3.png", // |
    "nekko4.png", // L
];
let flowerImgArr=[
    "emptysky.png", // カラ
    "1himawarai.png", // ひまわり
    "2daisy.png", // デイジー
    "3tulip.png", // チューリップ
    "4tile.png", // すみれ
];
let itemImgArr=[
    "slide.png","kaiten.png",
]
let rotStrArr=['cRot0','cRot90','cRot180','cRot270',];

g_selectedTileEle=null;

_onload = function(){
    // ダブルタップ禁止
    createBaseTable('iGameBoardContainer',4,4);
    createUserTable('iUserContainer',4);

    createUserItems(0,[0,0,1,1],[1,1,2]);
    createUserItems(1,[0,0,1,1],[1,2,4]);
    createUserItems(2,[0,0,1,1],[2,2,3]);
    createUserItems(3,[0,0,1,1],[3,4,4]);

    setFlowerTile(0,4);
    //setFlowerTile(1,2);
    setFlowerTile(2,3);
    setFlowerTile(3,1);

    setRootTile(0,0,2,0); //_x,_y,_tileId,_rotId
    setRootTile(1,0,2,0); //_x,_y,_tileId,_rotId
    setRootTile(2,0,3,0); //_x,_y,_tileId,_rotId
    setRootTile(3,0,4,0); //_x,_y,_tileId,_rotId

    setRootTile(0,1,3,1); //_x,_y,_tileId,_rotId
    setRootTile(1,1,1,1); //_x,_y,_tileId,_rotId
    setRootTile(2,1,4,3); //_x,_y,_tileId,_rotId
    setRootTile(3,1,3,3); //_x,_y,_tileId,_rotId

    setRootTile(0,2,2,1); //_x,_y,_tileId,_rotId
    setRootTile(1,2,4,1); //_x,_y,_tileId,_rotId
    setRootTile(2,2,1,0); //_x,_y,_tileId,_rotId
    setRootTile(3,2,4,1); //_x,_y,_tileId,_rotId
    
    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
}

//--------------------------------------
// テーブル作成
//--------------------------------------
createBaseTable = function(_tgtDivId, _colNum, _rowNum){
    let elem = document.getElementById(_tgtDivId);
    let tbElem = document.createElement("table");
    elem.innerHTML="";
    elem.appendChild(tbElem);

    for(var y=0;y<_rowNum;++y){
        let trElem = document.createElement("tr");
        for(var x=0;x<_colNum;++x){
            let tdElem = document.createElement("td");
            let inImgDiv=document.createElement("div");
            inImgDiv.classList.add('cBoxOne');

            let inImgElem = document.createElement("img");
            let imgName = (y==0)?"emptysky":"emptygnd";
            inImgElem.src = `./img/${imgName}.png`;
            inImgElem.classList.add('cInImg');
            inImgElem.id=`iTile${x}${y}`;
            inImgDiv.appendChild(inImgElem);
            tdElem.appendChild(inImgDiv);
            trElem.appendChild(tdElem);
        }
        tbElem.appendChild(trElem);
    }
}

setFlowerTile=function(_x,_flowerId){
    let imgIdStr = `iTile${_x}0`;
    document.getElementById(imgIdStr).src ="./img/"+flowerImgArr[_flowerId];
}
setRootTile=function(_x,_y,_tileId,_rotId=0){
    let imgIdStr = `iTile${_x}${_y+1}`;
    let tileEle=document.getElementById(imgIdStr);
    tileEle.src ="./img/"+tileImgArr[_tileId];
    tileEle.rotId=_rotId;
    tileEle.classList=[];
    tileEle.classList.add('cInImg');
    tileEle.classList.add(rotStrArr[tileEle.rotId]);
    tileEle.addEventListener('click', (e)=>{
        rotateRootTileByElement(tileEle);
    });
    tileEle.addEventListener('keypress', (e)=>{
        changeRootTileByEvent(e);
    });
}
rotateRootTileByElement=function(_tileEle,_acc=1){
    g_selectedTileEle=_tileEle;
    _tileEle.rotId=(_tileEle.rotId+_acc)&3;
    _tileEle.classList=[];
    _tileEle.classList.add('cInImg');
    _tileEle.classList.add(rotStrArr[_tileEle.rotId]);
}
changeRootTileByEvent=function(_e=null){
    if(g_selectedTileEle!=null){
        g_selectedTileEle.src = "./img/"+tileImgArr[0];        
    }
    console.log("keypresssed");
}

createUserTable = function(_tgtDivId, _colNum){
    let elem = document.getElementById(_tgtDivId);
    let tbElem = document.createElement("table");
    elem.innerHTML="";
    elem.appendChild(tbElem);

    let trElem = document.createElement("tr");
    for(var x=0;x<_colNum;++x){
        let tdElem = document.createElement("td");
        let inImgDiv=document.createElement("div");
        inImgDiv.id=`iUserBox${x}`;
        inImgDiv.classList.add('cUserBoxOne');
        trElem.appendChild(tdElem);
        tdElem.appendChild(inImgDiv);
    }
    tbElem.appendChild(trElem);
}

createUserItems = function(_userId,_itemIdArr,_rootIdArr){
    let divStr = `iUserBox${_userId}`;
    let userBoxDiv=document.getElementById(divStr);
    userBoxDiv.innerHTML="";
    for(var i=0;i<_itemIdArr.length;++i){
        userBoxDiv.appendChild(createChip(itemImgArr[_itemIdArr[i]]));    
    }
    for(var i=0;i<_rootIdArr.length;++i){
        userBoxDiv.appendChild(createChip(tileImgArr[_rootIdArr[i]]));    
    }
}
createChip = function(_imgName){
    let inImgDiv=document.createElement("div");
    inImgDiv.classList.add("cChipDiv");
    let inImgElem = document.createElement("img");
    inImgElem.src = "./img/"+_imgName;
    inImgElem.classList.add('cChipImg');
    inImgDiv.appendChild(inImgElem);
    return inImgDiv;    
}
