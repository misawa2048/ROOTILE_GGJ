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
    "nekko1.png", // 十
    "nekko2.png", // 」「
    "nekko3.png", // |
    "nekko4.png", // L
]
let rotStrArr=['cRot0','cRot90','cRot180','cRot270',];

_onload = function(){
    console.log("do it");
    createBaseTable('iGameBoardContainer',4,4);
    createUserTable('iUserContainer',4);
    createUserItem();
}

g_selectedTileEle=null;

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
            inImgDiv.classList.add('cInImg');
            inImgDiv.classList.add('cBoxOne');
            tdElem.appendChild(inImgDiv);
            trElem.appendChild(tdElem);

            let inImgElem = document.createElement("img");
            inImgElem.src = "./img/emptygnd.png";
            inImgElem.classList.add('cInImg');
            inImgElem.id=`iTile${x}${y}`;
            inImgDiv.appendChild(inImgElem);
        }
        tbElem.appendChild(trElem);
    }
    setFlowerTile(0,4);
    setFlowerTile(1,2);
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
    
}

setFlowerTile=function(_x,_flowerId){
    let divIdStr = `iTile${_x}0`;
    document.getElementById(divIdStr).src ="./img/"+flowerImgArr[_flowerId];
}
setRootTile=function(_x,_y,_tileId,_rotId=0){
    let divIdStr = `iTile${_x}${_y+1}`;
    let tileEle=document.getElementById(divIdStr);
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
createUserItem=function(){
    createUserItems(0,[0,0,1,1,2,2,3]);
    createUserItems(1,[0,0,1,1,2,3,5]);
    createUserItems(2,[0,0,1,1,3,3,4]);
    createUserItems(3,[0,0,1,1,4,5,5]);
}
createUserItems = function(_userId,_itemIdArr){
    let divStr = `iUserBox${_userId}`;
    let userBoxDiv=document.getElementById(divStr);
    userBoxDiv.innerHTML="";
    for(var i=0;i<_itemIdArr.length;++i){
        let inImgDiv=document.createElement("div");
        inImgDiv.classList.add("cChipDiv");
        let inImgElem = document.createElement("img");
        inImgElem.src = "./img/"+itemImgArr[_itemIdArr[i]];
        inImgElem.classList.add('cChipImg');
        //inImgElem.id=`iTile${x}${y}`;
        inImgDiv.appendChild(inImgElem);
        userBoxDiv.appendChild(inImgDiv);    
    }
}
