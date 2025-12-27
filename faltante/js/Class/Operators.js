class _operators {

	constructor( ) {
		this._Operator = { };
		this._Count = 0;
		this._MensajesNuevos = 0;
	}

	addOperator( e, o ) {
		let _new = false;

		this._Operator[ e.idu ] ??= {
										"show": [ ],
										"view": false,
										"count": 0,
										"span": null,
										"spanLast": null,
										"spanName": null,
										"spanTime": null,
										"liDOM": null,
										"name": e.nombre
									};

		if( this._Count < Object.keys( this._Operator ).length ) {
			_new = true;
			this._Count += 1;
		}

		if( !_m.empty( e.marca ) ) {
			let _class = ( e.de == o ? 'de' : 'para' );
			let content = "";

			if( _class == 'para' ) {
				content = `<li class="chat-window__message-received">
								<img class="chat-window__message-img" src="${ e.png != "NA" ? "src/php/Class/files/" + e.png : "src/assets/user.jpg" }">
								<span class="chat-window-message-text">
									<i>Operador: ${ this.primeraLetraMayuscula( e.usuario ) }</i>
									${ e.mensaje }
									<span class="chat-window-message-info">
										<span class="chat-window-message-time">${ e.marca }</span>
										<!--<span class="chat-window-message-check"><svg class="svg-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"/></svg></span>-->
									</span>
								</span>
							</li>`;
			}
			else {
				content = `<li class="chat-window__message-sent">
								<span class="chat-window-message-text">
									<i>Operador: ${ this.primeraLetraMayuscula( e.usuario ) }</i>
									${ e.mensaje }
									<span class="chat-window-message-info">
										<span class="chat-window-message-time">${ e.marca }</span>
										<!--<span class="chat-window-message-check"><svg class="svg-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"/></svg></span>-->
									</span>
								</span>
							</li>`;
			}

			this._Operator[ e.idu ][ "show" ].push( content );
			this._Operator[ e.idu ].view = true;
			this._Operator[ e.idu ].count += ( _class == 'de' ? 0 : ( e.leido ? 0 : 1 ) );

			if( !e.leido && _class !== 'de' ) {
				this._MensajesNuevos += 1;
				document.querySelector( ".chatBtn span.notify-pointer" ).classList.remove( "hide" );
			}

			const node = listaChats.firstElementChild;

			if( !_m.empty( node ) )
				if( e.idu !== node.dataset.idu && !_m.empty( this._Operator[ e.idu ].liDOM ) )
					listaChats.insertBefore( this._Operator[ e.idu ].liDOM, listaChats.children[ 0 ] );
		}

		return _new;
	}

	getOperator( headboard ) {
		return this._Operator[ headboard ][ "show" ];
	}

	getView( headboard ) {
		return this._Operator[ headboard ].view;
	}

	getName( headboard ) {
		return this._Operator[ headboard ].name;
	}

	setView( headboard, _bool ) {
		if( headboard.length > 0 )
			this._Operator[ headboard ].view = _bool;
	}

	setSpan( headboard, _span ) {
		this._Operator[ headboard ].span = _span;
	}

	setSpanInner( headboard, textContent = 0 ) {
		const _x = this._Operator[ headboard ].span;
		_x.classList.remove( textContent == 0 ? "show" : "hide" );
		_x.classList.add( textContent == 0 ? "hide" : "show" );
		_x.textContent = textContent == 0 ? "" : textContent;
	}

	setSpanName( headboard, _span ) {
		this._Operator[ headboard ].spanName = _span;
	}

	setSpanNameInner( headboard, textContent = "" ) {
		this._Operator[ headboard ].spanName.textContent = textContent;
	}

	setSpanTime( headboard, _span ) {
		this._Operator[ headboard ].spanTime = _span;
	}

	setSpanTimeInner( headboard, textContent = "" ) {
		this._Operator[ headboard ].spanTime.textContent = textContent;
	}

	setLiDOM( headboard, _li ) {
		this._Operator[ headboard ].liDOM = _li;
	}

	setSpanLastText( headboard, _span ) {
		this._Operator[ headboard ].spanLast = _span;
	}

	setSpanLastTextInner( headboard, textContent ) {
		this._Operator[ headboard ].spanLast.innerHTML = textContent;
	}

	getCount( headboard ) {
		this.setSpanInner( headboard, this._Operator[ headboard ].count );
	}

	setCount( headboard ) {
		if( headboard.length > 0 ) {
			this._MensajesNuevos -= this._Operator[ headboard ].count;

			if( this._MensajesNuevos == 0 )
				document.querySelector( ".chatBtn span.notify-pointer" ).classList.add( "hide" );

			this._Operator[ headboard ].count = 0;
			this.setSpanInner( headboard );
		}
	}

	primeraLetraMayuscula( str ) {
		str = str.toLowerCase( );
		return str.replace( /(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase( ) );
	}
}