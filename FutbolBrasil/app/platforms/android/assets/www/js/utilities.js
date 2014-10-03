var _lastClicked = 0;

function _fGetCurrentTimeMillis() {
	return new Date().getTime();
}

function _fPreventDefault(e){
	try{e.preventDefault();}catch(ex){}
	try{e.stopPropagation();}catch(ex){}
	try{e.stopImmediatePropagation();}catch(ex){}	
	if(_lastClicked != 0 &&  _fGetCurrentTimeMillis() - _lastClicked  < 500){
		return true;
	}else{
		_lastClicked = _fGetCurrentTimeMillis();
		return false;
	}
};