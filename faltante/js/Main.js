const _m = new _manifiest( );

send.addEventListener( "click", function( ) {
	shownotificationMessage( true, "Espere... Conectando a Nuestra Base de Datos" )
	send.classList.add( "visibilidad" );

	_m._lets( `src/php/Login.php?u=${ encodeURI( user.value ) }&p=${ encodeURI( passw.value ) }&q=aOz` ).then(
			json => {
				let accediendo = false;

				if( json[ 1 ] == "" )
					shownotificationMessage( false, json[ 0 ] )

				else if( json[ 0 ] == "" )
					shownotificationMessage( false, json[ 1 ] )

				else {
					accediendo = true;
					shownotificationMessage( true, "Bienvenido" )
					location.reload();
				}

				if( !accediendo )
					send.classList.remove( "visibilidad" );
			}
		);
});

user.addEventListener( "keypress", e => {
	if ( event.keyCode == 13 )
		passw.focus( );
});

passw.addEventListener( "keypress", e => {
	if ( event.keyCode == 13 )
		send.click( );
});

window.addEventListener( "load", function() {
	setTimeout( ( )=> {

		user.value = "";
		passw.value = "";
		user.focus( );

	}, 500 );
});
/*
let Alertas = setTimeout( function _alert( ){
	if( _m.detectDevTool( ) ) {
		alert( "OPERACION ILEGAL. SERÁ EXPULSADO DE LA SESION." );
		location.reload();
	}
	else
		Alertas = setInterval( _alert, 100 );
}, 10 );*/