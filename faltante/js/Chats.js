chat_window_sendBtn_item.addEventListener( "click", async function( ) {
	chat_window_sendBtn_item.classList.add( "hide" );

	if ( contentMenssage.value != "" ) {
		const _mensaje = encodeURI( contentMenssage.value );

		await _m._lets( `src/php/Chats.php?para=${ _activeChat }&mensaje=${ _mensaje }&usu=${ _USU }&global=${ _globalChat }&q=oAz&t=${ _THIS }` ).then(
				( ) => {
					contentMenssage.value = "";
					contentMenssage.focus( );

					chat_window_sendBtn_item.classList.remove( "hide" );
				}
			);
	}
});

function dinamic( json, _time ) {
	if( !_m.empty( json ) )
		json.forEach( ( e ) => {
			if( !_m.empty( e.mensaje ) )
				e.mensaje = decodeURI( e.mensaje );

			if( _adse.indexOf( e.adse ) === -1 && e.adse.length > 0 )
				_adse.push( e.adse );

			if ( _o.addOperator( e, _THIS ) )
			{
				createElementChats( e );
				const _dom = listaChats.querySelector( `li.${ e.idu }` );

				_o.setSpan( e.idu, _dom.querySelector( `span.${ e.idu }-list__text-info-counter` ) );
				_o.setSpanLastText( e.idu, _dom.querySelector( `span.${ e.idu }-list__last-message` ) );
				_o.setSpanTime( e.idu, _dom.querySelector( `span.${ e.idu }-list__text-info-time` ) );
				_o.setSpanName( e.idu, _dom.querySelector( `span.${ e.idu }` ) );
				_o.setLiDOM( e.idu, _dom );
			}

			if( !_m.empty( e.mensaje ) )
				_o.setSpanLastTextInner( e.idu, e.mensaje );
			
			if( _globalChat != e.idu ){
				_o.getCount( e.idu );

				if( !_m.empty( e.marca ) )
					_o.setSpanTimeInner( e.idu, e.marca.substring( 9 ) );
			}

			_time = !_m.empty( e.hora ) ? e.hora : _time;
		});

	return _time;
}

function getConvers( _dq, _t ){
	_o.setView( _globalChat, true );
	_globalChat = _dq;
	_activeChat = _t;
	chat_window_messages.innerHTML = "";
}

function createElementChats( e ) {
	let li = document.createElement( "li" );
	li.classList.add( "chat-list__item", "button", "hover-item", "chat-list__item__new-messages", e.idu );
	li.setAttribute( "data-idu", e.idu );
	li.setAttribute( "data-toform", ( e.de == _THIS ? e.para : e.de ) );
	li.innerHTML = `<img class="chat-list__img" src="${ e.png != "NA" ? "src/php/Class/files/" + e.png : "src/assets/user.jpg" }">
					<div class="chat-list__text-content">
						<div class="chat-list__text-content__header">
							<span class="chat-list__name ${ e.idu }">${ e.nombre }</span>
							<span class="chat-list__text-info-time ${ e.idu }-list__text-info-time">${ ( _m.empty( e.marca ) ? "" : e.marca.substring( 9 ) ) }</span>
						</div>
						<div class="chat-list__text-info">
							<span class="chat-list__last-message ${ e.idu }-list__last-message">${ ( _m.empty( e.mensaje ) ? "" : e.mensaje ) }</span>
							<span class="chat-list__text-info-counter ${ e.idu }-list__text-info-counter hide"></span>
						</div>
					</div>`;

	listaChats.appendChild( li );
}





