

function isKanji(ch) {
    return (ch >= "\u4e00" && ch <= "\u9faf") ||
	(ch >= "\u3400" && ch <= "\u4dbf");
}


function hasKanji(str){
	return Array.prototype.some.call(str, isKanji)
}


module.exports={isKanji,hasKanji}