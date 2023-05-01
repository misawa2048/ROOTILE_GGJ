const tileImgArr=[
    "emptygnd.png", // カラ
    "nekko1.png", // 十
    "nekko2.png", // 」「
    "nekko3.png", // |
    "nekko4.png", // L
];
const flowerImgArr=[
    "tile_bud.png", // カラ
    "1himawarai.png", // ひまわり
    "2daisy.png", // デイジー
    "3tulip.png", // チューリップ
    "4tile.png", // すみれ
];
const tileIdArr=[1,1,2,2,2,3,3,3,4,4,4,4]; // 十x2,  」「x3,  |x3,  Lx4
let itemImgArr=[
    "slide.png","kaiten.png",
]
let rotStrArr=['cRot0','cRot90','cRot180','cRot270',];

g_selectedTileEle=null;
g_selectedUserEle=null;
g_selectedTileRot=0;
g_elemArr=[]; //[y][x]
g_userElemArr=[]; //[userId]
g_rootChipArr=[]; // 3x4=12
//--------------------------------------
// パラメータ取得
//--------------------------------------
const getVarsFromParams = function(){
    var params = location.search.substring(1).split('&');
    var vars = {}; 
    for(var i = 0; i < params.length; i++) {
        var keySearch = params[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = params[i].slice(0, keySearch);
        var val = params[i].slice(params[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    } 
    return vars; 
}

//--------------------------------------
// 配列シャッフル
//--------------------------------------
const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}