_onload = function(){
    // ダブルタップ禁止
    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
    var numPlayers = 4;
    let vars = getVarsFromParams();
    if(vars["numplayers"]!=undefined){numPlayers=parseInt(vars["numplayers"]);}
    prepare(numPlayers);
}

prepare = function(_playerNo=4){
    _playerNo = Math.min(4,Math.max(2,_playerNo));
    createBaseTable('iGameBoardContainer',4,4);
    createUserTable('iUserContainer',_playerNo);

    var flowerids=[0,0,0,0];
    for(var i=0;i<_playerNo;++i){
        flowerids[i]=i+1;
    }
    flowerids = shuffle(flowerids);
    for(var i=0;i<flowerids.length;++i){
        setFlowerTile(i,flowerids[i]);
    }

    var tiles = Array.from(tileIdArr);
    tiles = shuffle(tiles);
    let numPerPl = tileIdArr.length/_playerNo;
    for(var i=0;i<_playerNo;++i){
        var tileArr=[];
        for(var n=0;n<numPerPl;++n){
            tileArr.push(tiles.pop());
        }
        createUserItems(i,[0,0,1,1],tileArr);
    }
}
//--------------------------------------
// テーブル作成
//--------------------------------------
createBaseTable = function(_tgtDivId, _colNum, _rowNum){
    let elem = document.getElementById(_tgtDivId);
    let tbElem = document.createElement("table");
    elem.appendChild(tbElem);

    for(var y=0;y<_rowNum;++y){
        let trElem = document.createElement("tr");
        for(var x=0;x<_colNum;++x){
            let tdElem = document.createElement("td");
            let inImgDiv=document.createElement("div");
            inImgDiv.classList.add('cBoxOne');

            let inImgElem = document.createElement("img");
            inImgElem.id=`iTile_${x}_${y}`;
            if(y==0){ setTileByElement(inImgElem,flowerImgArr,0); }
            else{     setTileByElement(inImgElem,tileImgArr,0); }

            inImgDiv.appendChild(inImgElem);
            tdElem.appendChild(inImgDiv);
            trElem.appendChild(tdElem);
            if(y>0){
                inImgElem.addEventListener('click', (e)=>{ rotateRootTileByElement(inImgElem); });
            }
        }
        tbElem.appendChild(trElem);
    }
}

setTileByElement=function(_tileEle, _chipImgArr, _chipId, _rotId=0){
    _tileEle.chipImgArr=_chipImgArr;
    _tileEle.chipId=_chipId;
    _tileEle.rotId=_rotId;
    _tileEle.src ="./img/"+_chipImgArr[_chipId];
    _tileEle.classList=[];
    _tileEle.classList.add('cInImg');
    _tileEle.classList.add(rotStrArr[_tileEle.rotId]);
}

setFlowerTile=function(_x,_flowerId){
    let imgIdStr = `iTile_${_x}_0`;
    setTileByElement(document.getElementById(imgIdStr),flowerImgArr,_flowerId);
}

setRootTile=function(_x,_y,_tileId,_rotId=0){
    let imgIdStr = `iTile_${_x}_${_y+1}`;
    setTileByElement(document.getElementById(imgIdStr),tileImgArr,_tileId,_rotId);
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
        g_selectedTileRot = (g_selectedTileRot+1)%5;
        g_selectedTileEle.src = "./img/"+tileImgArr[g_selectedTileRot];
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
    for(var i=0;i<_rootIdArr.length;++i){
        userBoxDiv.appendChild(createChip(_userId,tileImgArr,_rootIdArr[i]));    
    }
    for(var i=0;i<_itemIdArr.length;++i){
        userBoxDiv.appendChild(createChip(_userId,itemImgArr,_itemIdArr[i]));    
    }
}
createChip = function(_userId, _chipImgArr, _chipId){
    let inImgDiv=document.createElement("div");
    inImgDiv.classList.add("cChipDiv");
    let inImgElem = document.createElement("img");
    inImgElem.userId = _userId;
    inImgElem.chipImgArr = _chipImgArr;
    inImgElem.chipId = _chipId;
    inImgElem.parentEle = inImgDiv;
    inImgElem.src = "./img/"+_chipImgArr[_chipId];
    inImgElem.classList.add('cChipImg');
    inImgElem.addEventListener('click', (e)=>{
        useChip(inImgElem);
    });
    inImgDiv.appendChild(inImgElem);
    return inImgDiv;    
}

useChip = function(_inImgElem){
    //console.log(`user${_inImgElem.userId}'s chip is ${_inImgElem.chipImgArr[_inImgElem.chipId]}`);
    if(itemImgArr.includes(_inImgElem.chipImgArr[_inImgElem.chipId])){ // isItem
        _inImgElem.style.display = "none"; // "block"
    }
    else if(g_selectedTileEle!=null){
        let id = g_selectedTileEle.id; // id=`iTile_${x}_${y}`;
        let chipImgArr =g_selectedTileEle.chipImgArr;
        let chipId=g_selectedTileEle.chipId;
        let rotId=g_selectedTileEle.rotId;
        //console.log(`sel:${id}, name:${chipImgArr[chipId]},rot=${rotId}`);
        if(tileImgArr.includes(_inImgElem.chipImgArr[_inImgElem.chipId])){ // isRoot
            if(chipImgArr[chipId]==tileImgArr[0]){ // "emptyGnd"
                let posArr= id.split('_');
                let x = parseInt(posArr[1]);
                let y = parseInt(posArr[2])-1; // yはテーブル準拠なのでROOTはy-1
                setRootTile(x,y,_inImgElem.chipId,0); //_x,_y,_tileId,_rotId
                _inImgElem.style.display = "none"; // "block"
            }
        }
    }
}

slideRoot = function(_dir){ // 0:← 1:↑ 2:→ 3:↓
    console.log(`slide:${_dir}`);
}
