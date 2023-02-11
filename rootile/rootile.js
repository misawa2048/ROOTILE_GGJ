_onload = function(){
    // ダブルタップ禁止
    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
    var numPlayers = 4;
    let vars = getVarsFromParams();
    if(vars["numplayers"]!=undefined){numPlayers=parseInt(vars["numplayers"]);}
    prepare(numPlayers);
    if(vars["mode"]!=undefined){ setAllRoot(); }
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
    setUser(0);
}
//--------------------------------------
// テーブル作成
//--------------------------------------
createBaseTable = function(_tgtDivId, _colNum, _rowNum){
    g_elemArr=[]; //[y][x]
    let elem = document.getElementById(_tgtDivId);
    let tbElem = document.createElement("table");
    elem.appendChild(tbElem);
    for(var y=0;y<_rowNum;++y){
        var elemXArr=[];
        let trElem = document.createElement("tr");
        for(var x=0;x<_colNum;++x){
            let tdElem = document.createElement("td");
            let inImgDiv=document.createElement("div");
            inImgDiv.classList.add('cBoxOne');
            inImgDiv.classList.add('cBoxColNml');

            let inImgElem = document.createElement("img");
            elemXArr.push(inImgElem);
            inImgElem.id=`iTile_${x}_${y}`;
            inImgElem.parentDiv=inImgDiv;
            if(y==0){ setTileByElement(inImgElem,flowerImgArr,0); }
            else{     setTileByElement(inImgElem,tileImgArr,0); }

            inImgDiv.appendChild(inImgElem);
            tdElem.appendChild(inImgDiv);
            trElem.appendChild(tdElem);
            if(y>0){
                inImgElem.addEventListener('click', (e)=>{ setSelTile(inImgElem); });
            }
        }
        g_elemArr.push(elemXArr);
        tbElem.appendChild(trElem);
    }
}

setAllRoot=function(){
    var cnt=0;
    for(var y=1;y<g_elemArr.length;++y){
        for(var x=0;x<g_elemArr[y].length;++x){
            let inImgElem = g_elemArr[y][x];
            g_selectedTileEle=inImgElem;
            useChip(g_rootChipArr[cnt++]);
        }
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
    setTileByElement(g_elemArr[0][_x],flowerImgArr,_flowerId);
}
setRootTile=function(_x,_y,_tileId,_rotId=0){
    setTileByElement(g_elemArr[_y+1][_x],tileImgArr,_tileId,_rotId);
}

createUserTable = function(_tgtDivId, _colNum){
    g_userElemArr=[];
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
        inImgDiv.classList.add('cUserBoxColNml');
        trElem.appendChild(tdElem);
        tdElem.appendChild(inImgDiv);

        g_userElemArr.push(inImgDiv);
        inImgDiv.addEventListener('click', (e)=>{ setUserByElement(inImgDiv); });
    }
    tbElem.appendChild(trElem);
}

createUserItems = function(_userId,_itemIdArr,_rootIdArr){
    let divStr = `iUserBox${_userId}`;
    let userBoxDiv=document.getElementById(divStr);
    userBoxDiv.innerHTML="";
    for(var i=0;i<_rootIdArr.length;++i){
        let chipDivEle = createChip(_userId,tileImgArr,_rootIdArr[i]);
        userBoxDiv.appendChild(chipDivEle);    
        g_rootChipArr.push(chipDivEle._inImgElem);
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
    inImgDiv._inImgElem=inImgElem;
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

setSelTile = function(_tileEle){
    g_selectedTileEle=_tileEle;
    for(var y=0; y<g_elemArr.length;++y){
        for(var x=0;x<g_elemArr[y].length;++x){
            g_elemArr[y][x].parentDiv.classList=[];
            g_elemArr[y][x].parentDiv.classList.add('cBoxOne');
            if(_tileEle!=g_elemArr[y][x]){
                g_elemArr[y][x].parentDiv.classList.add('cBoxColNml');
            }else{
                g_elemArr[y][x].parentDiv.classList.add('cBoxColSel');
            }
        }
    }
}

setUser = function(_uid){
    if(g_userElemArr.length>_uid){
        setUserByElement(g_userElemArr[_uid]);    
    }
}
setUserByElement = function(_userBoxEle){
    for(var i=0;i<g_userElemArr.length;++i){
        g_userElemArr[i].classList=[];
        g_userElemArr[i].classList.add('cUserBoxOne');
        if(g_userElemArr[i]!=_userBoxEle){
            g_userElemArr[i].classList.add('cUserBoxColNml');
        }else{
            g_userElemArr[i].classList.add('cUserBoxColSel');
        }
    }
}

rotateRoot = function(_dir=0,_num=1){ // 0:clockwise 1:counterclockwise
    if(g_selectedTileEle!=null){
        for(var i=0;i<_num;++i){
            rotateRootTileByElement(g_selectedTileEle,(_dir==0)?1:3);
        }
    }
}
rotateRootTileByElement=function(_tileEle,_acc=1){
    setTileByElement(_tileEle,tileImgArr,_tileEle.chipId,(_tileEle.rotId+_acc)&3);
}

slideRoot = function(_dir,_num=1){ // 0:← 1:↑
    if(g_selectedTileEle!=null){
        let ptArr=g_selectedTileEle.id.split('_')
        let tx = parseInt(ptArr[1]);
        let ty = parseInt(ptArr[2]);
        console.log(`tgt:${tx},${ty}`);
        
        for(var i=0;i<_num;++i){
            if(_dir==0){
                let tmpChipId = g_elemArr[ty][0].chipId;
                let tmpRotId = g_elemArr[ty][0].rotId;
                setTileByElement(g_elemArr[ty][0],tileImgArr,g_elemArr[ty][1].chipId,g_elemArr[ty][1].rotId);
                setTileByElement(g_elemArr[ty][1],tileImgArr,g_elemArr[ty][2].chipId,g_elemArr[ty][2].rotId);
                setTileByElement(g_elemArr[ty][2],tileImgArr,g_elemArr[ty][3].chipId,g_elemArr[ty][3].rotId);
                setTileByElement(g_elemArr[ty][3],tileImgArr,tmpChipId,tmpRotId);
            }
            if(_dir==1){
                let tmpChipId = g_elemArr[1][tx].chipId;
                let tmpRotId = g_elemArr[1][tx].rotId;
                setTileByElement(g_elemArr[1][tx],tileImgArr,g_elemArr[2][tx].chipId,g_elemArr[2][tx].rotId);
                setTileByElement(g_elemArr[2][tx],tileImgArr,g_elemArr[3][tx].chipId,g_elemArr[3][tx].rotId);
                setTileByElement(g_elemArr[3][tx],tileImgArr,tmpChipId,tmpRotId);
            }
        }
    }
    console.log(`slide:${_dir}`);
}
