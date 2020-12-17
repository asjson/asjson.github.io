var EventDispatcher = (function () {
    function EventDispatcher() {
    }
	
	EventDispatcher.addEventListener = function ( type, listener ) {
	    if ( this._listeners === undefined ) this._listeners = {};
	    var listeners = this._listeners;
	    if ( listeners[ type ] === undefined ) {
	        listeners[ type ] = [];
	    }
	    if ( listeners[ type ].indexOf( listener ) === - 1 ) {
	        listeners[ type ].push( listener );
	    }
	},
	
	EventDispatcher.hasEventListener= function ( type, listener ) {
	    if ( this._listeners === undefined ) return false;
	    var listeners = this._listeners;
	    return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
	},
	
	EventDispatcher.removeEventListener= function ( type, listener ) {
	    if ( this._listeners === undefined ) return;
	    var listeners = this._listeners;
	    var listenerArray = listeners[ type ];
	    if ( listenerArray !== undefined ) {
	        var index = listenerArray.indexOf( listener );
	        if ( index !== - 1 ) {//若该类事件的数组中存在，则删除该监听器
	            listenerArray.splice( index, 1 );
	        }
	    }
	},
	
	EventDispatcher.removeEventListenerByType= function ( type ) {
	    if ( this._listeners === undefined ) return;
	    var listeners = this._listeners;
	    var listenerArray = listeners[ type ];
	    if ( listenerArray !== undefined ) {
			delete listeners[type];
	    }
	},
	
	EventDispatcher.dispatchEvent= function ( event ) {//调用某类事件
	    if ( this._listeners === undefined ) return;
	    var listeners = this._listeners;
	    var listenerArray = listeners[ event.type ];
	    if ( listenerArray !== undefined ) {
	        event.target = this;
	        var array = listenerArray.slice( 0 );//创建复制一个新数组
	        for ( var i = 0, l = array.length; i < l; i ++ ) {
	            array[ i ].call( this, event );
	        }
	    }
	}
	
	return EventDispatcher;
}());