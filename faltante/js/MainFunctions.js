let getInfoBID = setTimeout( async function obtenerInformacionBase( _time = '', _turn = 1, timeUpdate = '' ) {
	_m._lets( `src/php/GetInformationBase.php?
					 t=${ encodeURI( _THIS ) }
					&sw=${ encodeURI( _SW ) }
					&_time=${ encodeURI( _time ) }
					&idu=${ encodeURI( _IDU ) }
					&timeUpdate=${ encodeURI( timeUpdate ) }` )
		.then( async json => {
			clearTimeout( getInfoBID );

			generalJson.datosOriginales = json;
			_time = dinamic( json.chats, _time );

			if( _globalChat.length != 0 ) {
				if( _o.getView( _globalChat ) )
				{
					_o.setCount( _globalChat );
					_o.setView( _globalChat, false );
					chat_window_messages.innerHTML = _o.getOperator( _globalChat ).join( '' );
					chat_window_messages.parentNode.scrollTop = chat_window_messages.parentNode.scrollHeight;
				}
			}

			crearCollectors( true, generalJson.datosOriginales );
			update_dinamic_filter( );

			if( _NV === "E" && Object.keys( json ).length > 0 ) {
				if( _m.empty( $mainReport ) ) {
					d.querySelector( ".generarreport" ).click( );
					d.querySelector( ".hamburguer-menu" ).click( );
				}
				else {
					const JData = generalJson.reporte_online.collectors[ 0 ],
						  prefijo = JData.abrev_moneda.data + '. ';

					iden__estimado_a_cobrar_clon.textContent = format_number( JData.estimado_a_cobrar.data, 1, prefijo );
					iden__clientes_con_pagos_clon.textContent = `${ JData.total_clientes_cobrados.data } cliente(s) visitado(s) de ${ JData.total_clientes.data }`;
					iden__total_cobrado_clon.textContent = format_number( JData.total_cobrado.data, 1, prefijo );
					iden__cobrado_en_efectivo_clon.textContent = format_number( JData.cobrado_en_efectivo.data, 1, prefijo );
					iden__cobrado_en_transferencia_clon.textContent = format_number( JData.cobrado_en_transferencia.data, 1, prefijo );
					iden__total_prestado_clon.textContent = format_number( JData.total_prestado.data, 0, prefijo );
					iden__total_microcredito_clon.textContent = format_number( JData.total_microcredito.data, 1, prefijo );
					iden__cuentas_nuevas_clon.textContent = format_number( JData.cuentas_nuevas.data, 0 );
					iden__cuentas_terminadas_clon.textContent = format_number( JData.cuentas_terminadas.data, 0 );
					iden__caja_anterior_clon.textContent = format_number( JData.caja_anterior.data, 1, prefijo );
					iden__caja_actual_clon.textContent = format_number( JData.caja_actual.data, 1, prefijo );
					iden__efectivo_dia_clon.textContent = format_number( JData.efectivo_dia.data, 1, prefijo );
					iden__total_gastos_clon.textContent = format_number( JData.gastos.data, 1, prefijo );
					iden__base_dia_clon.textContent = format_number( JData.base_dia.data, 0, prefijo );
				}
			}

			_rawRequest = generalJson.datosOriginales.startup;
			if( !_m.empty( _rawRequest ) && Object.keys( _rawRequest ).length > 0 ) {
				reloj.textContent = _rawRequest.now;
				_NOW = _rawRequest.now.split( " " )[ 0 ];
				datetime_available = _rawRequest.datetime_available;
				timeUpdate = _rawRequest.timeUpdate;

				if(
					!parseInt( _rawRequest.ol ) ||
					parseInt( _rawRequest.dc )
				)
				{
					notifyWindows( false, 'Sistema de Seguridad', "Será Desconectado del Sistema para cargar una Nueva Actualización. Espere 5seg o haga click en Aceptar", 5000, d.querySelector( ".closeMain" ) );
					return;
				}
				else if( _rawRequest.details != '' )
				{
					notifyWindows( false, 'Sistema de Seguridad', _rawRequest.details + ". Espere 5seg o haga click en Aceptar", 5000, d.querySelector( ".closeMain" ) );
					return;
				}
				else if( _rawRequest.oc === 'C' )
				{
					notifyWindows( false, 'Sistema Cerrado', "Sistema Cerrado por Mantenimiento Diario, Hora de Apertura: 12:30am. Espere 5seg o haga click en Aceptar", 5000, d.querySelector( ".closeMain" ) );
					return;
				}

				if( _turn >= 2 ) {
					_turn = 0;

					if( !_m.empty( typeof iden__numero_cuota ) )
						await calcularFecha( iden__numero_cuotas.dataset.select );
				}

				_turn += 1;

				/*if( _m.detectDevTool( ) ) {
					alert( "OPERACION ILEGAL. SERÁ EXPULSADO DE LA SESION." );
					//d.querySelector( ".closeMain" ).click( );
				}*/

				if(
					fotoperfil.getAttribute( "src" ) != ( "src/php/Class/files/" + _rawRequest.png ) &&
					_rawRequest.png != "NA"
				)
					fotoperfil.setAttribute( "src", "src/php/Class/files/" + _rawRequest.png );
			}

			getInfoBID = setTimeout( obtenerInformacionBase, 500, _time, _turn, timeUpdate );
		} );
}, 300 );

function dinamic_filter({ _vac = '', JData = [ ], evitar_filter = false, _selector = '', _name_base = '', _filtro_adicional = '' }) {
	if( !evitar_filter ) {
		generalJson[ _selector ] = [ ]
		let sacados = [ ];

		JData = generalJson[ _name_base ].collectors.filter( e => {
			let encontrado = true;

			if( ( e.vac.hasOwnProperty( "data" ) ? e.vac.data : e.vac ) === _vac ) {
				if( _filtro_adicional.length > 0 ) {
					_filtro_adicional.split( ';' ).every( x => {
						x = x.split( ',' );

						if( x[ 0 ] === "gcl_dda" ) {
							if( x[ 1 ] === "<" )
								encontrado = e[ x[ 0 ] ].data < 0;

							else
								encontrado = e[ x[ 0 ] ].data > 0;
						}
						else {
							encontrado = e[ x[ 0 ] ].data == x[ 1 ];

							if( x[ 0 ] === "visitado" && encontrado ){
								if( sacados.indexOf( e.nombre_completo.data ) > -1 )
									encontrado = false
								else
									sacados.push( e.nombre_completo.data );
							}
						}

						return encontrado;
					});
				}

				if( encontrado )
					return e;
			}
		});
	}

	create_basic_struct_dinamic( JData, _selector );
	generalJson[ _selector ].collectors = JData;
	resetearCollectors( _selector );
}

function update_dinamic_filter( ) {
	let _selector = "", _base = "", _filtro_adicional = "", $aux;

	if( generalJson.hasOwnProperty( "clientes_filtrado" ) ) {
		_selector = "clientes_filtrado";
		_base = "clientes";

		if( previo.hasOwnProperty( "clientes_filtrado" ) )
			return;

		$aux = generalJson.UltimoClick( );

		if( !_m.empty( $aux ) ) {
			if( $aux.classList.contains( "blanca" ) )
				_filtro_adicional = "rendimiento,100";

			else if( $aux.classList.contains( "negra" ) )
				_filtro_adicional = "rendimiento,0";

			else if( $aux.classList.contains( "advanced" ) )
				_filtro_adicional = "gcl_dda,<";

			let _vp = generalJson.UltimaSeccion( ).dataset.vp;

			if( !_m.empty( _vp ) ) _filtro_adicional += "vp," + _vp
		}
	}
	else if( generalJson.hasOwnProperty( "showvisitados" ) || generalJson.hasOwnProperty( "showpendientes" ) ) {
		_selector = generalJson.hasOwnProperty( "showvisitados" ) ? "showvisitados" : "showpendientes";
		_base = "rutas";
		_filtro_adicional = "visitado," + ( generalJson.hasOwnProperty( "showvisitados" ) ? 1 : 0 );
	}

	if( _selector.length > 0 ) {
		let _vac = generalJson[ _selector ].collectors[ 0 ];

		if( !_m.empty( _vac ) ) {
			_vac = _vac.vac.data
			let sacados = [ ];

			const JData = generalJson[ _base ].collectors.filter( e => {
				let encontrado = true;

				if( e.vac.data === _vac ) {
					if( _filtro_adicional.length > 0 ) {
						_filtro_adicional.split( ";" ).every( x => {
							x = x.split( ',' );

							if( x[ 0 ] === "gcl_dda" ) {
								if( x[ 1 ] === "<" )
									encontrado = e[ x[ 0 ] ].data < 0;

								else
									encontrado = e[ x[ 0 ] ].data > 0;
							}
							else {
								if( x[ 0 ] === "vp" ) {
									if( x[ 1 ] === "vigentes" )
										encontrado = e.prestamos_vigentes.data > 0;
									else
										encontrado = e.prestamos_pagados.data > 0;
								}
								else
									encontrado = e[ x[ 0 ] ].data == x[ 1 ];

								if( x[ 0 ] === "visitado" ){
									if( sacados.indexOf( e.cedula.data ) > -1 )
										encontrado = false
									else
										sacados.push( e.cedula.data );
								}
							}

							return encontrado;
						});
					}

					if( encontrado )
						return e;
				}
			});

			const _length = JData.length;
			generalJson[ _selector ].registros = _length;
			generalJson[ _selector ].collectors = JData;
			generalJson[ _selector ].currentItemsShowed = _length > 25 ? 25 : _length;
			generalJson[ _selector ].amoutPerpage = _length > 25 ? 25 : _length;
			sortByKey( generalJson[ _selector ].collectors, "nombre_completo" );
		}
	}
}

function sectionTarget( $e, eleccion ) {
	let _title = "";

	generalJson.secuenciasClicks.push( $e );
	generalJson.secuenciasEleccion.push( eleccion );
	generalJson.contenedorLI_Menu = $e.tagName === "LI" ? $e.parentNode.parentNode : $e;

	switch( eleccion ) {
		/* ************************************************************************************************************ */
		/* ************* P A N E L  A D M I N I S T R A D O R ********************************************************* */
		/* ************************************************************************************************************ */

		case "showadmin": Show_Table({ _title: "Listado de Administradores", _option: eleccion }); break;
		case "newadmin": FormDinamic({ _link: _THIS, _title: "Crear Nuevo Administrador", _option: eleccion }); break;
		case "useradmin": Show_Table({ _title: "Listado de Administradores", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  S E C R E T A R I O *************************************************************** */
		/* ************************************************************************************************************ */

		case "showsecre": Show_Table({ _title: "Listado de Secretarios", _option: eleccion }); break;
		case "newsecre": FormDinamic({ _link: _VMA, _title: "Crear Nuevo Secretario", _option: eleccion }); break;
		case "usersecre": Show_Table({ _title: "Listado de Secretarios", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  S U P E R V I S O R *************************************************************** */
		/* ************************************************************************************************************ */

		case "showsuper": Show_Table({ _title: "Listado de Supervisores", _option: eleccion }); break;
		case "newsuper": FormDinamic({ _link: _VMA, _title: "Crear Nuevo Supervisor", _option: eleccion }); break;
		case "usersuper": Show_Table({ _title: "Listado de Supervisores", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  C O B R A D O R ******************************************************************* */
		/* ************************************************************************************************************ */

		case "showcobra": Show_Table({ _title: "Listado de Cobradores", _option: eleccion }); break;
		case "newcobra": FormDinamic({ _link: _VMA, _title: "Crear Nuevo Cobrador", _option: eleccion }); break;
		case "usercobra": Show_Table({ _title: "Listado de Cobradores", _option: eleccion }); break;
		case "showsupervisar": Show_Table({ _title: "Listado de Cobradores", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  C L I E N T E S ******************************************************************* */
		/* ************************************************************************************************************ */

		case "newclien": FormDinamic({ _link: _VMA, _title: "Crear Nuevo Cliente", _option: eleccion }); break;

		/* ----------- HASTA AQUI NO SE NECESITA NINGUN TIPO DE FILTRO DEBIDO QUE NO HABRA MULTIRELACION -------------- */
		/* ------------------------------------------------------------------------------------------------------------ */

		case "showclien":
			eleccion = "clientes_filtrado";
			generalJson.EliminarUltimaEleccion( );
			generalJson.secuenciasEleccion.push( eleccion );
			let filtro = "";

			if( generalJson.UltimoClick( ).classList.contains( "blanca" ) )
				filtro = "rendimiento,100";
			else
				filtro = "rendimiento,0";

			dinamic_filter({
					_vac: _VAC,
					_selector: eleccion,
					_name_base: "clientes",
					_filtro_adicional: filtro
				});

			Show_Table({ _title: "Listado de Clientes", _option: eleccion });
		break;

		case "advanced":
			eleccion = "clientes_filtrado";
			generalJson.EliminarUltimaEleccion( );
			generalJson.secuenciasEleccion.push( eleccion );

			dinamic_filter({
					_vac: _VAC,
					_selector: eleccion,
					_name_base: "clientes",
					_filtro_adicional: "gcl_dda,<"
				});

			Show_Table({ _title: "Listado de Clientes", _option: eleccion });
		break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  R U T A S ************************************************************************* */
		/* ************************************************************************************************************ */

		case "showvisitados":		if( _title.length == 0 ) _title = "Listado de Clientes Visitados";
		case "showpendientes":		if( _title.length == 0 ) _title = "Listado de Clientes Pendientes";
			if( _NV === "E" ) {
				dinamic_filter({
						_vac: _VAC,
						_selector: eleccion,
						_name_base: "rutas",
						_filtro_adicional: "visitado," + ( eleccion === "showvisitados" ? 1 : 0 )
					});

				Show_Table({ _title: _title, _option: eleccion });
			}

			else {
				eleccion = "showcobra";
				Show_Table({ _title: "Listado de Cobradores", _option: eleccion });
			}
		break;
		case "enrutamiento": Show_Table({ _title: "Enrutar Clientes", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  M O N E D A S ********************************************************************* */
		/* ************************************************************************************************************ */

		case "showmoney": Show_Table({ _title: "Listado de Monedas", _option: eleccion }); break;
		case "newmoney": FormDinamic({ _title: "Crear Nueva Moneda", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  R E P O R T E S ******************************************************************* */
		/* ************************************************************************************************************ */

		case "generarreport":		if( _title.length == 0 ) _title = "Reporte Dia";
		case "showreport":			if( _title.length == 0 ) _title = "Reporte Semanal";
			if( _NV === "E" )
				FormDinamic({ _link: _VAC, _title: _title, _option: eleccion });

			else
				Show_Table({ _title: "Listado de Cobradores", _option: eleccion });
		break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  M O N E D A S ********************************************************************* */
		/* ************************************************************************************************************ */

		case "creditospendientes": Show_Table({ _title: "Aumentos Solicitados", _option: eleccion }); break;

		/* ************************************************************************************************************ */
		/* ************* P A N E L  M A P A *************************************************************************** */
		/* ************************************************************************************************************ */

		case "mapa":
			onlyMapFollowing.classList.remove( "hide" );
			let clientes = generalJson.clientes.collectors,
				cobradores = _NV === "E" ? [ ] : generalJson.cobradores.collectors;

            $modal = document.querySelector( `.modal.minimap` );
            $modal.classList.toggle( 'showModal' );
            $otherModal = $modal;
		break;
	}

	d.querySelector( ".hamburguer-menu" ).click( );
}

function crearMarker_online({ turn, gota, ul_cobradores, ul_clientes, co_cl = '' }) {
	turn.marker =
		new google.maps.Marker({
			position:  new google.maps.LatLng( turn.latitud, turn.longitud ),
			icon: {
				url: `src/php/Class/files/${ ( gota === "propia" ? "myposition" : "gotaGoogleMaps" ) }_${ turn.unico }.png?x=${ ( _UNI + Math.floor( Math.random( ) * 100 ) + 1 ) }`,
				size: new google.maps.Size( _m.canvasWidth, _m.canvasHeight ),
				origin: new google.maps.Point( 0, 0 ),
				anchor: new google.maps.Point( Math.trunc( _m.canvasWidth / 2 ), _m.canvasHeight ),
				scaledSize: new google.maps.Size( _m.canvasWidth, _m.canvasHeight )
			},
			id: turn.unico,
			data: turn.nombre_completo,
			map: $objectMapa,
			visible: false,
			draggable: false,
			animation: google.maps.Animation[( gota === "propia" ? "BOUNCE" : "DROP" )],
			zIndex: ( gota === "propia" ? 0 : zIndex++ )
		});

	if( !turn.main )
		turn.marker
			.addListener( 'click' , function( ){
				$infowindow.setContent(
					`<div class="infoBotton" onclick="irAGoogleMaps( '${ this.id }' )">Ir hacia ${ this.data }</div>` + 
					(
						( _NV !== "E" && generalJson.UltimaEleccion( ) === "clientes_filtrado" )
							? ''
							:
								`
									<div class="infoBotton" onclick="habilitarMovimiento( '${ this.id }' )">Actualizar Dirección</div>
									<div class="infoBotton" onclick="habilitarMovimiento( '${ this.id }', 1 )">Asignar la Actual</div>
								`
					)
				);

				$infowindow.open({
					anchor: this,
					$objectMapa
				});
			});

	turn.marker
		.addListener( 'dragend' , function( ){
			dragend_Marker( this );
		});
 
	if( co_cl === "co" || ( _NV === "E" && gota === "propia" ) )
		ul_cobradores.innerHTML +=
			`<li
				class="select-nav__option select-nav__option-item"
				data-select="${ turn.vac }"
				data-val="${ turn.unico }">
					${ turn.nombre_completo }
			</li>`;

	else if( co_cl === "cl" )
		ul_clientes.innerHTML +=
			`<li
				class="select-nav__option select-nav__option-item"
				data-select="${ turn.vac }"
				data-val="${ turn.unico }">
					${ turn.nombre_completo }
			</li>`;

}

async function validarIncremento( _this, paso = undefined ) {
	let arraySave = { }, moneda;

	if( paso !== null ) {
		if( _NV === "E" ) {
			moneda = generalJson.cobrador.collectors[ 0 ].abrev_moneda.data;
			notifyWindows( false, 'Aumento Crediticio', 'Indique el monto deseado para Solicitar su Aumento Crediticio', 5000 );
		}
		else {
			moneda = generalJson.creditospendientes.collectors[ 0 ].abrev_moneda.data;
			notifyWindows( false, 'Aumento Crediticio', 'Indique el monto para ajustar el Límite Actual del Crédito', 5000 );
		}

		moneda = `${ moneda }. `;
		$otherModal = d.querySelector( ".lock-user" );
		btnOkCode.closest( "div.modal-form__inputs" ).previousElementSibling.textContent = "Ajustar Crédito A:";

		const $input = $otherModal.querySelector( "input" );
		$input.setAttribute( "type", "text" );
		$input.setAttribute( "min", "0" );
		$input.setAttribute( "maxlength", ( 14 + moneda.length ) );
		$input.setAttribute( "onfocus", "_focus( this )" );
		$input.setAttribute( "onkeyup", `_onkey( this, 0, 0, '${ moneda }' )` );
		$input.setAttribute( "onchange", `_onkey( this, 0, 0, '${ moneda }' )` );
		$input.value = _this.closest( "tr" )?.querySelector( "span.limite_prestamo" )?.textContent ?? `${ moneda } 0`;
        btnOkCode.onclick = function( ){ validarIncremento( _this, null ); };

		$otherModal.classList.add( "showModal" );
		$input.focus( );
	}
	else {
		const _peticion = btnOkCode.parentNode.previousElementSibling.value;
		const _s = save_number( _peticion, 1 );

		if( _s == 0 ) {
			shownotificationMessage( false, "Monto Incorrecta. Verifique e Intente de nuevo" );
			$otherModal.querySelector( "input" ).focus( );
			return;
		}

		if( generalJson.UltimaEleccion( ) === "creditospendientes" ) {
			let JData = dataJsonSegunClick({ _nameJson: 'creditospendientes', $element: _this.closest( "tr" ) });
			arraySave.unico = JData.idp.data;
			arraySave.monto = _s;
			arraySave.switch = "ajusteCredito";

			if( (
					( parseFloat( _s ) * ( ( parseFloat( JData.interes.data ) / 100 ) + 1 ) )
						/
					JData.numero_cuotas.data
				) % 1 !== 0
			) {
				shownotificationMessage( false, "El monto ajustado genera cuotas con decimales, use montos precisos" );
				$otherModal.querySelector( "input" ).focus( );
				return;
			}

			await _m._lets( `src/php/SetInformationBase.php`, arraySave )
					.then( ( ) => {
						shownotificationMessage( true, `Ajuste de Aumento Previo fué Exitoso` );
						setTimeout( loadCollectors, 1000, 0 ); 
					} );
		}
		else {
			if( generalJson.UltimaSeccion( )?.dataset.link === "prestamos" ) {
				iden__monto_prestado.value = _peticion;
				iden__monto_prestado.setAttribute( "disabled", true );
				iden__monto_prestado.classList.add( "atencion" );
				await calcularFecha( calcularPrestamo( ) );
			}

			increaseCredit({ $target: _this, _peticion: _peticion });
		}

		btnOkCode.onclick = null;
		hideModal( $otherModal );
	}
}

async function increaseCredit({ $target, jsonCobra = null, _limitNow = '', _peticion = '' }){
	let JData, arraySave = { }

	if( _NV === "E" && generalJson.UltimaSeccion( )?.dataset.link === "prestamos" ) {
		JData = generalJson.clientes.collectors.filter( e => { return e.unico.data === iden__btnGuardar.dataset.unico })[ 0 ];

		iden__btnGuardar.textContent = "Guardar. Status: Aumento Crediticio";
		iden__btnGuardar.setAttribute( "data-status", "aumento-crediticio" );
	}
	else if( generalJson.UltimaEleccion( ) !== "creditospendientes" )
		JData = dataJsonSegunClick({ _nameJson: 'clientes_filtrado', $element: $target.closest( "tr" ) });
	else
		JData = dataJsonSegunClick({ _nameJson: 'creditospendientes', $element: $target.closest( "tr" ) });

	arraySave.fromCobra = 1;
	arraySave.idp = -1;
	arraySave.vcc = '';
	arraySave.monto = 0;

	if( _NV === "E" )
		return;

	else if( generalJson.UltimaEleccion( ) !== "creditospendientes" ) {
		arraySave.fromCobra = 0;
		arraySave.para = jsonCobra.unico.data;
		arraySave.this = _THIS;
		arraySave.usu = _USU;
		arraySave.mensaje = `Ajuste Crediticio para <b>${ JData.nombre_completo.data }</b> con Cédula de Identidad <b>${ format_number( JData.cedula.data, 0 ) }</b>, Límite actual <b>${ _limitNow }</b>`;
	}
	else {
		arraySave.fromCobra = 0;
		arraySave.para = JData.idc.data;
		arraySave.this = _THIS;
		arraySave.usu = _USU;
		arraySave.idp = JData.idp.data;
		arraySave.vcc = JData.vcc.data;
		arraySave.monto = JData.monto_prestado.data;
		arraySave.mensaje = `Aumento Crediticio Efectuado para <b>${ JData.nombre_completo_cliente.data }</b> con Cédula de Identidad <b>${ format_number( JData.cedula.data, 0 ) }</b>, Límite actual <b>${ format_number( JData.monto_prestado.data, 0, `${ JData.abrev_moneda.data }. ` ) }</b>`;
	}

	arraySave.mensaje = encodeURI( arraySave.mensaje );
	arraySave.switch = "sendChat";

	await _m._lets( `src/php/SetInformationBase.php`, arraySave )
			.then( ( ) => {
				shownotificationMessage( true, `Información enviada con Éxito` );

				if( arraySave.idp !== -1 )
					setTimeout( loadCollectors, 1000, 0 );
			} );
}

async function envioSMS( idp, _body_sms, _body_whatsapp, es_sms = true ){
	await _m._lets( `src/php/GetInformationLoan.php?t=-&sw=sms&idp=${ idp }` )
			.then(
				json => {
					shownotificationMessage( true, `Efectuando Envío SMS con la Información Correspondiente` );
					sendsms.setAttribute( "href", ( es_sms ? _body_sms : _body_whatsapp ) + encodeURI( json[ 0 ].sms.replace( "<b>", ( es_sms ? "" : "*" )  ).replace( "</b>", ( es_sms ? "" : "*" )  ) ) );
					sendsms.click( );
				}
			);
}

async function bloquearAcceso( _this, paso = undefined ) {
	if( paso !== null ){
		notifyWindows( false, 'Sistema de Seguridad', 'Al Introducir la Clave estará bloqueando/desbloqueando el Acceso para el ENTE indicado, verifique y asegurese de ser la operación que desea realizar', 5000 );
		$otherModal = d.querySelector( ".lock-user" );
		$otherModal.classList.add( "showModal" );
		$otherModal.querySelector( "input" ).value = '';
        btnOkCode.onclick = function( ){ bloquearAcceso( _this, null ); };
	}
	else {
		const _s = btnOkCode.parentNode.previousElementSibling.value,
			  tr = _this.closest( "tr" ).dataset;

		if( _s.length == 0 ) {
			shownotificationMessage( false, "Clave Incorrecta. Verifique e Intente de nuevo" );
			$otherModal.querySelector( "input" ).focus( );
			return;
		}

		await _m._lets( `src/php/ShootFunctions.php?sw=verify&pass=${ _s }&usu=${ _IDU }&link=${ tr.unico }&tb=${ _this.dataset.tb }&idp=${ tr.vma }` )
					.then(
						json => {
							if( json )
							{
								btnOkCode.onclick = null;
								shownotificationMessage( true, "Acceso cambiado de Status con Éxito" );
								hideModal( $otherModal );
								setTimeout( loadCollectors, 1000, 0 );
							}
							else {
								shownotificationMessage( false, "La Contraseña es Incorrecta" );
								$otherModal.querySelector( "input" ).focus( );
							}
						}
					);
	}
}

var $firstClick = null;
async function marcarVisita( $this, firstClick = true ) {
	if( firstClick ) {
		$firstClick = $this.previousElementSibling.querySelector( "span" );

		if( $firstClick.textContent === "¿Visitado?" ) {
			shownotificationMessage( false, "Debe seleccionar una opción Válida primero" );
			$firstClick = null;
			return;
		}

		const all_span = $this.closest( "tr" ).querySelectorAll( "td > div > span" );

		_eventual.classList.remove( "hide" );
		notifyWindows( false, '¡¡¡ ATENCIÓN !!!', `¿Esta seguro de fijar su respuesta para -${ all_span[ 1 ].textContent.toUpperCase( ) + " " + all_span[ 2 ].textContent.toUpperCase( ) }- como -${ $firstClick.textContent }-?` );
	}
	else {
		_eventual.classList.add( "hide" );

		let arraySave = {
				detail: $firstClick.textContent,
				switch: "detail-router",
				this: $firstClick.closest( "tr" ).dataset.idp,
				vac: $firstClick.closest( "tr" ).dataset.vac,
				vcc: $firstClick.closest( "tr" ).dataset.vcc
		};

		await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            shownotificationMessage( true, "Observación registrada con éxito" );
							setTimeout( loadCollectors, 1000, 0 );
                        }
                    );
	}
}

const calcularDistanciaEntreDosCoordenadas = ({ from_lat, from_lng, to_lat, to_lng }) => {
    // Convertir todas las coordenadas a radianes
    from_lat = gradosARadianes( from_lat );
    from_lng = gradosARadianes( from_lng );
    to_lat = gradosARadianes( to_lat );
    to_lng = gradosARadianes( to_lng );

    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = ( to_lng - from_lng );
    let diferenciaEntreLatitudes = ( to_lat - from_lat );
    let a = Math.pow(
				Math.sin(
					diferenciaEntreLatitudes / 2.0
				)
				, 2 ) +
				Math.cos( from_lat ) *
				Math.cos( to_lat ) *
				Math.pow(
					Math.sin(
						diferenciaEntreLongitudes / 2.0 
					)
				, 2
			);
    let c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    return parseFloat( RADIO_TIERRA_EN_KILOMETROS * c );
};

const gradosARadianes = grados => {
    return grados * Math.PI / 180;
};

function dragend_Marker( $this ){
	if( !_m.empty( setT_Marker ) )
		clearTimeout( setT_Marker );

	let lat = $this.getPosition( ).lat( ),
		lng = $this.getPosition( ).lng( );

	shownotificationMessage( true, "La Posición fué actualizada con Éxito. Puede cambiarla de ser necesario" );

	if( !_m.empty( typeof iden__direccion ) )
		iden__direccion.nextElementSibling.dataset.latlng = lat + "/" + lng;

	setT_Marker = setTimeout( ( ) => {
		changePosition({ lat: parseFloat( lat ), lng: parseFloat( lng ), id: $this.id });
		/*geocodeLatLng({ lat: parseFloat( lat ),
						lng: parseFloat( lng )
					}, !_m.empty( typeof iden__direccion ) ? iden__direccion : null, $this.id );*/
	}, 2000 );
}

function changePosition({ lat, lng, id }){
	let arraySave = {
						latitud: lat,
						longitud: lng,
						switch: "marker-" + generalJson.contenedorLI_Menu.dataset.link.substring( 0, 2 ),
						this: id
						//address: address
				};

	_m._lets( `src/php/SetInformationBase.php`, arraySave ).then( ( ) => { } );
}

function calculateAndDisplayRoute( directionsService, directionsRenderer, you, my, mk = null ) {
	directionsService
		.route({
			origin: my,
			destination: you,
			travelMode: google.maps.TravelMode.DRIVING,
		})
		.then( response => {
			directionsRenderer.setDirections( response );
		})
		.catch( e => {
			if( mk !== null ) {
				mk.marker
				.setIcon(
					new google.maps.MarkerImage(
								"src/php/Class/files/default.png",
								new google.maps.Size( _m.canvasWidth, _m.canvasHeight ),
								new google.maps.Point( 0, 0 ),
								new google.maps.Point( Math.trunc( _m.canvasWidth / 2 ), _m.canvasHeight ),
								new google.maps.Size( _m.canvasWidth, _m.canvasHeight )
					)
				);

				$objectMapa.setCenter( you );
			}

			window.alert( "Directions request failed due to " + e )
		} );
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


async function searchID( target, _this ) {
    let inputStr;

    if( target.tagName === "INPUT" ) {
        inputStr = target.value.trim( );

		if( target.getAttribute( "id" ) === "iden__cedula" )
			inputStr = save_number( inputStr, 0 );
	}

    else if( target.tagName === "SPAN" )
        inputStr = target.textContent;

    if( inputStr.toString( ).trim( ).length === 0 ){
        shownotificationMessage( false, "No es posible realizar la Busqueda. Intente de Nuevo" )
        return;
    }

    shownotificationMessage( true, "Espere mientras se Procesa la Información" );
    _this.classList.add( "hide" );

    let eleccion = generalJson.UltimaEleccion( );

    switch( eleccion ){
		case "assign-user-admin":
		case "assign-user-secre":
		case "assign-user-super":
		case "assign-user-cobra":
            eleccion = "us";
        break;

        default: eleccion = generalJson.contenedorLI_Menu.dataset.link.substring( 0, 2 ); break;
	}
 
    const section = generalJson.UltimaSeccion( );
    let json = await _blocView___info( inputStr, eleccion, section.querySelector( "#iden__btnGuardar" ), 1 );

	if( eleccion == "us" )
		if( !iden__contrasena.closest( "li" ).classList.contains( "hide" ) )
			iden__contrasena.focus( );

    section.querySelectorAll( '[id*="iden__"]:not( input[id*="checkbox"], span[id="iden__btnGuardar"] )' ).forEach( ( elem, index ) => {
        let classIden = elem.getAttribute( "id" ).split( "iden__" )[ 1 ], li, _ext = '';

        if( Object.keys( json ).length > 3 ) {

            if( index == 0 && !iden__nombre.closest( "li" ).classList.contains( "hide" ) ){
				if( generalJson.contenedorLI_Menu.dataset.link === "clientes" &&
					generalJson.clientes.collectors.filter( e => { return e.cedula.data == iden__cedula.value }).length == 0 )
					notifyWindows( false, '¡¡¡ ATENCIÓN !!! Cliente Pre-Registrado', "Este cliente se encuentra previamente registrado y/o vinculado con otro cobrador, quedará bajo su completa responsabilidad el continuar con la vinculación de este cliente en su cartera. Espere 10seg o de click en Aceptar para cerra la ventana", 10000 );

				//else
				//    notifyWindows( false, '¡¡¡ ATENCIÓN !!! Multi-Nivel', "Este " + generalJson.contenedorLI_Menu.dataset.link.replace( "res", "r" ).replace( "ios", "io" ) + " se encuentra previamente registrado y/o vinculado con otro ente, quedará bajo su completa responsabilidad el continuar con esta vinculación. Espere 10seg o de click en Aceptar para cerra la ventana", 10000 );
            }

            switch( elem.tagName ){
                case "INPUT":
                    if( classIden === "direccion" )
                        elem.nextElementSibling.setAttribute( "data-latlng", json.latitud + "/" + json.longitud );

                    elem.value = json[ classIden ];
    
                break;
                case "SPAN":
                    switch( classIden ){
                        case "zona_horaria":
							if( _ext.length === 0 ) _ext = `li[data-select="${ json.zona_select }"]`;
						case "moneda":
							if( _ext.length === 0 ) _ext = `li[data-val="${ json.idm }"]`;
						case "interes":
							if( _ext.length === 0 ) _ext = `li[data-val="${ json.interes }"]`;
						case "rendimiento":
							if( _ext.length === 0 ) _ext = `li[data-val="${ json.rendimiento }"]`;

                            li = elem.parentNode.nextElementSibling.querySelector( _ext );
                            elem.textContent = li.textContent;
                            elem.dataset.select = li.dataset.select;
                            elem.dataset.val = li.dataset.val;

                        break;
                        case "numero_cuotas":
							let _split = json.numero_cuotas.split( ';' );
							li = elem.parentNode.nextElementSibling;

							_split.forEach( _sp => {
								li.querySelector( `li[data-val="${ _sp }"] label` ).click( );
							});

                        break;
                    }

                break;
            }

			switch( elem.tagName ) {
				case "SPAN":
					if( elem.classList.contains( "formatear" ) )
						elem.textContent = format_number( elem.textContent, elem.dataset.digits );

				break;
				case "INPUT":
					if( elem.classList.contains( "formatear" ) )
						elem.value = format_number( elem.value, elem.dataset.digits );

				break;
			}
        }
    });

    _this.classList.remove( "hide" );
}

async function _blocView___info( istr, ref, link, q ) {
	return await _m._lets( `src/php/GetDataInformation.php?t=${ _THIS }&sw=${ ref }&search=${ encodeURI( istr ) }&inputs=${ q }` )
				.then(
					json => {
						if( q ) {
							const section = generalJson.UltimaSeccion( );
							let negativo = true,
								eleccion = generalJson.UltimaEleccion( );

							if( json.existe && json.vinculado ) {
								switch( eleccion ) {
									case "update-admin":
									case "update-secre":
									case "update-super":
									case "update-cobra":
									case "update-clien":

										negativo = false;
										if( json.unico === generalJson.UltimoClick( ).closest( 'tr' ).dataset.unico ) {
											shownotificationMessage( false, "Confirme los Datos para continuar" );
											section.querySelectorAll( ".hide" ).forEach( e => { e.classList.add( "grid" ); e.classList.remove( "hide" ); });
										}
										else
											negativo = true;

									break;
								}

								if( negativo ) {
									section.querySelectorAll( ".grid" ).forEach( e => { e.classList.add( "hide" ); e.classList.remove( "grid" ); });
									shownotificationMessage( false, "Ya existe una vinculación previa" );
									json = null;
								}
								else {
									setAttributes(
										link,
										{
											"data-unico": json.unico,
											"data-lastlink": json.unico,
											"data-cedula": istr
										}
									);
								}
							}
							else {
								if( json.existe ) {
									shownotificationMessage( false, "Ya existe un Registro Previo. Confirme los Datos para continuar" );
									setAttributes(
										link,
										{
											"data-lastlink": json.unico
										}
									);
								}
								else {
									shownotificationMessage( true, "Información disponible para Guardar" );
									section.querySelector( "#iden__rendimiento" )?.closest( "div.select-nav-container.form-grid-nav-container" ).classList.remove( "pointer" );
								}

								section.querySelectorAll( ".hide" ).forEach( e => { e.classList.add( "grid" ); e.classList.remove( "hide" ); });

								switch( eleccion ) {
									case "newadmin":
									case "newsecre":
									case "newsuper":
									case "newcobra":
									case "newclien":

									case "update-admin":
									case "update-secre":
									case "update-super":
									case "update-cobra":
									case "update-clien":

										setAttributes(
											link,
											{
												"data-cedula": istr,
												"data-vma": _VMA,
												"data-vac": _VAC
											}
										);

									break;
/* ************************************************************************************************************** */

									case "assign-user-admin":
									case "assign-user-secre":
									case "assign-user-super":
									case "assign-user-cobra":

										link.setAttribute( "data-usuario", istr );
									break;
								}
							}
						}

						return _m.empty( json ) ? [ ] : json;
					}
				);
}
/*
function geocodeLatLng( latlng, inputs, id ) {
	directionsGeocoder
	  .geocode({ location: latlng })
	  .then( response => {
		if ( response.results[ 0 ] )
			if( !_m.empty( inputs ) ) {
				//inputs.value = response.results[ 0 ].formatted_address;
			}

			if( id.length > 0 )
				changePosition({ lat: latlng.lat, lng: latlng.lng, id: id }); //, address: response.results[ 0 ].formatted_address });
	  })
	  .catch( e => { } );
}
*/
function irAGoogleMaps( pos ) {
	const params = _m.getAll( );
	const section = generalJson.UltimaSeccion( );
	let JData_cobra;

	if( pos === "togo"  ) {
		const unico_cobra = onlyMapFollowing.querySelector( ".ul_cobradores" ).previousElementSibling.querySelector( "span" ).dataset.val;
		const unico_clien = onlyMapFollowing.querySelector( ".ul_clientes" ).previousElementSibling.querySelector( "span" ).dataset.val;

		if( _m.empty( unico_cobra ) ) {
			shownotificationMessage( false, "Debe indicar un cobrador" );
			return;
		}
		else if( _m.empty( unico_clien ) ) {
			shownotificationMessage( false, "Debe indicar un cliente" );
			return;
		}

		if( _NV !== "E" )
			JData_cobra = generalJson.cobradores.collectors.filter( e => { return e.unico.data === unico_cobra })[ 0 ];
		else
			JData_cobra = {
				latitud: { data: params[ 0 ] },
				longitud: { data: params[ 1 ] }
			};

		const JData_clien = generalJson.clientes.collectors.filter( e => { return e.unico.data === unico_clien })[ 0 ];

		sendsms.setAttribute( "href", `https://www.google.com/maps/dir/?api=1&origin=${ JData_cobra.latitud.data },${ JData_cobra.longitud.data }&destination=${ JData_clien.latitud.data },${ JData_clien.longitud.data }&travelmode=driving` );
		sendsms.click( );
	}
	else if( pos === "generar"  ) {
		const unico_cobra = onlyMapFollowing.querySelector( ".ul_cobradores" ).previousElementSibling.querySelector( "span" ).dataset.val;
		const unico_clien = onlyMapFollowing.querySelector( ".ul_clientes" ).previousElementSibling.querySelector( "span" ).dataset.val;

		if( _m.empty( unico_cobra ) ) {
			shownotificationMessage( false, "Debe indicar un cobrador" );
			return;
		}
		else if( _m.empty( unico_clien ) ) {
			shownotificationMessage( false, "Debe indicar un cliente" );
			return;
		}

		//changeVisibility( false );
		markersGoogle[ unico_clien ].marker.setVisible( true );
		markersGoogle[ unico_clien ].marker.setAnimation( google.maps.Animation.DROP );

		markersGoogle[ unico_cobra ].marker.setVisible( true );
		markersGoogle[ unico_cobra ].marker.setAnimation( google.maps.Animation.BOUNCE );

		calculateAndDisplayRoute(
			directionsService,
			directionsRenderer,
			markersGoogle[ unico_clien ].marker.getPosition( ),
			markersGoogle[ unico_cobra ].marker.getPosition( )
		);
	}
	else {
		sendsms.setAttribute( "href", `https://www.google.com/maps/dir/?api=1&origin=${ params[ 0 ] },${ params[ 1 ] }&destination=${ markersGoogle[ pos ].latitud },${ markersGoogle[ pos ].longitud }&travelmode=driving` );
		sendsms.click( );
	}
}

function habilitarMovimiento( _name, _here = 0 ){
	$infowindow.close( );

	if( !_here ) {
		notifyWindows( true, 'Habilitado para Cambio de Ubicación', "Ahora podra cambiar la ubicación a la nueva Posición. Tenga presente en ser preciso en este proceso.", 5000 );
		markersGoogle[ _name ].marker.setDraggable( true );
	}
	else {
		const params = _m.getAll( );
		markersGoogle[ _name ].marker
					.setPosition(
						new google.maps
							.LatLng(
								params[ 0 ],
								params[ 1 ]
							)
					);

		dragend_Marker( markersGoogle[ _name ].marker );
	}

	$objectMapa.setZoom( 22 );
	$objectMapa.setCenter( markersGoogle[ _name ].marker.getPosition( ) );
}

async function enrutar( $target, pos, idc, vac ) {
	$target.closest( "tr" ).classList.add( "hide" );
	$target.closest( "tr" ).nextElementSibling.classList.add( "hide" );

	let arraySave = { };
	arraySave.this = idc;
	arraySave.vac = vac;
	arraySave.pos = pos;
	arraySave.switch = "enrrutar";

	await _m._lets( `src/php/SetInformationBase.php`, arraySave )
			.then( ( ) => { setTimeout( loadCollectors, 1000, 0 ); } );
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

async function changePass( _this, paso = undefined ){
	if( paso !== null ){
		btnOkCode.closest( "div.modal-form__inputs" ).previousElementSibling.textContent = "Indique Contraseña Nueva:";
		notifyWindows( false, 'Sistema de Seguridad', 'Indique una nueva contraseña que pueda recordar posteriormente', 5000 );
		$otherModal = d.querySelector( ".lock-user" );
		$otherModal.classList.add( "showModal" );
		$otherModal.querySelector( "input" ).value = '';
        btnOkCode.onclick = function( ){ changePass( _this, null ); };
	}
	else {
		const _s = btnOkCode.parentNode.previousElementSibling.value;
		if( _s.length == 0 || _s.length < 5 ) {
			shownotificationMessage( false, "Clave no Válida. Verifique, recuerde que debe contener mas de 5 caracteres" );
			$otherModal.querySelector( "input" ).focus( );
			return;
		}

		await _m._lets( `src/php/ShootFunctions.php?sw=change&pass=${ _s }&usu=${ _IDU }` )
					.then(
						json => {
							btnOkCode.onclick = null;
							shownotificationMessage( true, "Contraseña Cambiada. Petición Procesada" );
							hideModal( $otherModal );
						}
					);
	}
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

async function deleteInfo( _this, paso = undefined ){
	if( paso !== null ){
		switch( _this.dataset.tb ) {
			case "total_gastos":
			case "total_base_dia":
			case "total_capital":
				const ym = _NOW.split( "-" ).reverse( ).join( "-" ),
					  _date = _this.closest( "tr" ).dataset.date.split( "-" ).reverse( ).join( "-" ),
					  tope_semana = procesarDias( ym, equivalente( procesarDias( ym, 0 ).getDay( ) ) ),
					  es_menor = procesarDias( _date, 0 ).getTime( ) < tope_semana.getTime( );

				if( es_menor ) {
					shownotificationMessage( false, "No puede borrar un registro fuera de la semana en curso" );
					return;
				}

			break;
		}

		notifyWindows( false, 'Sistema de Seguridad', 'Debe ingresar la Clave de Seguridad para proceder con su Solicitud. Tenga presente que eliminar alguna entidad de la red eliminará consigo todo lo que esté vinculado a este.', 5000 );
		$otherModal = d.querySelector( ".lock-user" );
		$otherModal.classList.add( "showModal" );
		$otherModal.querySelector( "input" ).value = '';
        btnOkCode.onclick = function( ){ deleteInfo( _this, null ); };
	}
	else {
		const tr = _this.closest( "tr" ).dataset,
			  _s = btnOkCode.parentNode.previousElementSibling.value;
		let JData;

		if( _s.length == 0 ) {
			shownotificationMessage( false, "Clave Incorrecta. Verifique e Intente de nuevo" );
			$otherModal.querySelector( "input" ).focus( );
			return;
		}

		await _m._lets( `src/php/ShootFunctions.php?sw=verify&pass=${ _s }&usu=${ _IDU }&link=${ tr.unico }&tb=${ _this.dataset.tb }&idp=${ ( tr.idp ) }` )
					.then(
						async json => {
							if( json )
							{
								btnOkCode.onclick = null;
								shownotificationMessage( true, "Contraseña Correcta. Petición Procesada" );
								hideModal( $otherModal );

								switch( _this.dataset.tb ) {
									case "usuarios":
											cargarUsuarios( ).then( jsonLoan => {
												if( jsonLoan.length == 0 ) {
													Delete_Sections( true, true );
													eventClickNoData( '' );
													return;
												}
											});

									break;
									case "cobradores":
									case "clientes":
										onlyMapFollowing.querySelector( `li[data-val="${ tr.unico }"]` ).remove( );
									break;
									case "total_cuotas":
									case "total_abonos":
										Delete_Sections( true, true );

										let $_ta = generalJson.UltimoClick( );
										Delete_Sections( true, true );
										$_ta.click( );

									break;
									case "total_gastos":
									case "total_base_dia":
									case "total_capital":
										const $datetime = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_dia" ),
											  $datetime_from = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_from" ),
											  $datetime_to = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_to" ),
											  _t_ = generalJson[ "reporte" + ( _NV !== "E" ? "" : "_clon" ) ].collectors[ 0 ],
											  _n_ = _m.empty( $datetime ) ? _NOW.split( "-" ).reverse( ).join( "-" ) : $datetime.value;

										JData = await functionLoan({
											_t: _t_.vac.hasOwnProperty( "data" ) ? _t_.vac.data : _t_.vac,
											_sw: _this.dataset.tb,
											_f: _m.empty( $datetime_from ) ? `${ _n_ }/${ _n_ }` : ( $datetime_from.value + "/" + $datetime_to.value )
										});
				
										crearCollectors( false, JData, _this.dataset.tb );

										if( generalJson[ _this.dataset.tb ].collectors.length == 0 ) {
											setTimeout( ( ) => {
												Delete_Sections( true, true );
												let click_last = generalJson.UltimoClick( );

												if( !_m.empty( click_last ) ) {
													Delete_Sections( true, true );
													click_last.click( );
												}
											}, 1000, 0 );
											return;
										}

									break;
									case "prestamos":
										let $_pr_ = generalJson.UltimoClick( );
										Delete_Sections( true, true );

										$_pr_.click( );

									break;
									case "prestamos_temporales":
										JData = dataJsonSegunClick({ _nameJson: 'creditospendientes', $element: tr.unico }),
										arraySave = { };

										arraySave.fromCobra = 0;
										arraySave.para = JData.idc.data;
										arraySave.this = _THIS;
										arraySave.usu = _USU;
										arraySave.idp = -1;
										arraySave.vcc = '';
										arraySave.monto = 0;
										arraySave.mensaje = `Aumento Crediticio Rechazado para <b>${ JData.nombre_completo_cliente.data }</b> con Cédula de Identidad <b>${ format_number( JData.cedula.data, 0 ) }</b>`;
										arraySave.switch = "sendChat";

										_m._lets( `src/php/SetInformationBase.php`, arraySave ).then( ( ) => { } );

									break;
								}

								setTimeout( loadCollectors, 1000, 0 );
							}
							else {
								shownotificationMessage( false, "La Contraseña es Incorrecta" );
								$otherModal.querySelector( "input" ).focus( );
							}
						}
					);
	}
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

async function multiCreditos({ vcc, idc }){
	return await _m._lets( `src/php/ShootFunctions.php?sw=vccidc&vcc=${ vcc }&idc=${ idc }` )
					.then(
						json => {
							if( json > 0 )
								notifyWindows( false, '¡¡¡ ATENCIÓN MULTICRÉDITOS !!!', `Este Cliente mantiene ${ json } crédito(s) vigente(s) con otro cobrador actualmente. Continuar con esta operación implica responsabilizarse por un Cliente Multi-Créditos. Espere 10seg o de click en Aceptar para cerra esta ventana`, 10000 );
						}
					);
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function markers({ _nameJson, gota, ul_cobradores, ul_clientes, co_cl = '' }) {
	if( !load_Ini ) return;
	const params = _m.getAll( );

	if( _nameJson.length === 0 ){
		if( _m.empty( markersGoogle[ _THIS ] ) ) {
			markersGoogle[ _THIS ] =
				{
					marker: null,
					unico: _THIS,
					vac: _VAC,
					nombre_completo: _NAME,
					latitud: params[ 0 ],
					longitud: params[ 1 ],
					distancia: 0,
					main: true
				};

			crearMarker_online({
				turn: markersGoogle[ _THIS ],
				gota: gota,
				co_cl: co_cl
			});
		}

		reloading({ latitud: params[ 0 ], longitud: params[ 1 ], unico: _THIS });
		return;
	}

	generalJson[ _nameJson ].collectors.forEach( e => {
		if( _m.empty( markersGoogle[ e.unico.data ] ) ) {
			markersGoogle[ e.unico.data ] =
				{
					marker: null,
					unico: e.unico.data,
					vac: ( ( _NV === "A" || ( _NV === "B" && ( e.delete.tb === "supervisores" || e.delete.tb === "secretarios" ) ) ) ? "-_" : e.vac.data ),
					nombre_completo: e.nombre_completo.data,
					latitud: e.latitud.data,
					longitud: e.longitud.data,
					distancia: ( gota !== "propia" ?
									calcularDistanciaEntreDosCoordenadas({
										from_lat: params[ 0 ],
										from_lng: params[ 1 ],
										to_lat: e.latitud.data,
										to_lng: e.longitud.data
									}) :
									0
							   ),
					main: ( gota === "propia" )
				};

			crearMarker_online({
				turn: markersGoogle[ e.unico.data ],
				gota: gota,
				ul_cobradores: ul_cobradores,
				ul_clientes: ul_clientes,
				co_cl: co_cl
			});
		}

		reloading({ latitud: e.latitud.data, longitud: e.longitud.data, unico: e.unico.data });
	});

	function reloading( e ) {
		if( e.latitud != markersGoogle[ e.unico ].marker.getPosition( ).lat( ) ||
			e.longitud !== markersGoogle[ e.unico ].marker.getPosition( ).lng( ) ) {

			if( !markersGoogle[ e.unico ].marker.getDraggable( ) ) {
				markersGoogle[ e.unico ].latitud = e.latitud;
				markersGoogle[ e.unico ].longitud = e.longitud;

				markersGoogle[ e.unico ].marker
					.setPosition(
						new google.maps
							.LatLng(
								e.latitud,
								e.longitud
							)
					);

				if( !markersGoogle[ e.unico ].main )
					markersGoogle[ e.unico ].distancia =
							calcularDistanciaEntreDosCoordenadas({
								from_lat: params[ 0 ],
								from_lng: params[ 1 ],
								to_lat: e.latitud,
								to_lng: e.longitud
							});
			}
		}
	}
}

function crearCollectors( datosOriginales, _dataJson, _nameJson = '' ) {
	let _length;
	const ul_cobradores = onlyMapFollowing.querySelector( "ul.ul_cobradores" ),
		  ul_clientes = onlyMapFollowing.querySelector( "ul.ul_clientes" );

	if( _NV !== "E" ) {
		markers({
			_nameJson: '',
			gota: 'propia',
			co_cl: ''
		});
	}

	if( datosOriginales ) {
		for( let _name in _dataJson ) {
			switch( _name ) {
				case "administradores":
					if( _m.empty( generalJson.administradores ) )
						generalJson.administradores = structJson_generalJson( ) ;

					_dataJson.administradores.forEach( e => {
						const indx = generalJson.administradores.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vma.data === e.vma });

						if( indx < 0 )
							generalJson.administradores.collectors.push( process_Administradores( e ) );
						else
							generalJson.administradores.collectors[ indx ] = process_Administradores( e );
					});

					function process_Administradores( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },
							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: `${ e.nombre } ${ e.apellido }`, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							region_horaria: { data: returnZonaHorarias( )[ e.zona_select ].text, show: true, text: true },

							secretarios: { data: e.secretarios, show: true, text: true },
							supervisores: { data: e.supervisores, show: true, text: true },
							cobradores: { data: e.cobradores, show: true, text: true },
							clientes: { data: e.clientes, show: true, text: true },

							bloqueado: { data: e.bloqueado, show: false, text: false },
							detalle_bloqueo: { data: e.detalle_bloqueo, tb: "global_administradores", show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },
							update: { tb: "administradores", show: true, text: false },
							delete: { tb: "administradores", show: true, text: false },

							assign: { show: true, text: false },
							list: { show: true, text: false },

							vma: { data: e.vma, show: false, text: false }
						};
					}

					_length = generalJson.administradores.collectors.length;
					generalJson.administradores.registros = _length;
					generalJson.administradores.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.administradores.amoutPerpage = _length > 25 ? 25 : _length;

					markers({
						_nameJson: _name,
						gota: '',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: ''
					});

				break;
/* ***************************************************************************************************************** */

				case "secretarios":
					if( _m.empty( generalJson.secretarios ) )
						generalJson.secretarios = structJson_generalJson( ) ;

					_dataJson.secretarios.forEach( e => {
						const indx = generalJson.secretarios.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vma.data === e.vma });

						if( indx < 0 )
							generalJson.secretarios.collectors.push( process_Secretarios( e ) );
						else
							generalJson.secretarios.collectors[ indx ] = process_Secretarios( e );
					});

					function process_Secretarios( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },
							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: `${ e.nombre } ${ e.apellido }`, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							region_horaria: { data: returnZonaHorarias( )[ e.zona_select ].text, show: true, text: true },

							bloqueado: { data: e.bloqueado, show: false, text: false },
							detalle_bloqueo: { data: e.detalle_bloqueo, tb: "global_secretarios", show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },
							update: { tb: "secretarios", show: true, text: false },
							delete: { tb: "secretarios", show: true, text: false },

							assign: { show: true, text: false },
							list: { show: true, text: false },

							vma: { data: e.vma, show: false, text: false }
						};
					}

					_length = generalJson.secretarios.collectors.length;
					generalJson.secretarios.registros = _length;
					generalJson.secretarios.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.secretarios.amoutPerpage = _length > 25 ? 25 : _length;

					markers({
						_nameJson: _name,
						gota: '',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: ''
					});

				break;
/* ***************************************************************************************************************** */

				case "supervisores":
					if( _m.empty( generalJson.supervisores ) )
						generalJson.supervisores = structJson_generalJson( ) ;

					_dataJson.supervisores.forEach( e => {
						const indx = generalJson.supervisores.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vma.data === e.vma });

						if( indx < 0 )
							generalJson.supervisores.collectors.push( process_Supervisores( e ) );
						else
							generalJson.supervisores.collectors[ indx ] = process_Supervisores( e );
					});

					function process_Supervisores( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },
							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: `${ e.nombre } ${ e.apellido }`, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							region_horaria: { data: returnZonaHorarias( )[ e.zona_select ].text, show: true, text: true },

							bloqueado: { data: e.bloqueado, show: false, text: false },
							detalle_bloqueo: { data: e.detalle_bloqueo, tb: "global_supervisores", show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },

							update: { tb: "supervisores", show: true, text: false },
							delete: { tb: "supervisores", show: true, text: false },

							assign: { show: true, text: false },
							list: { show: true, text: false },

							vma: { data: e.vma, show: false, text: false }
						};
					}

					_length = generalJson.supervisores.collectors.length;
					generalJson.supervisores.registros = _length;
					generalJson.supervisores.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.supervisores.amoutPerpage = _length > 25 ? 25 : _length;

					markers({
						_nameJson: _name,
						gota: '',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: ''
					});

				break;
/* ***************************************************************************************************************** */

				case "cobradores":
					if( _m.empty( generalJson.cobradores ) )
						generalJson.cobradores = structJson_generalJson( ) ;

					_dataJson.cobradores.forEach( e => {
						const indx = generalJson.cobradores.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vac.data === e.vac });

						if( indx < 0 )
							generalJson.cobradores.collectors.push( process_Cobradores( e ) );
						else
							generalJson.cobradores.collectors[ indx ] = process_Cobradores( e );
					});

					function process_Cobradores( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },

							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: `${ e.nombre } ${ e.apellido }`, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							region_horaria: { data: returnZonaHorarias( )[ e.zona_select ].text, show: true, text: true },

							idm: { data: e.idm, show: false, text: false },
							moneda: { data: e.moneda, show: true, text: true },
							numero_cuotas: { data: e.numero_cuotas, show: true, text: true },
							interes: { data: e.interes, show: true, text: true },
							abrev_moneda: { data: e.abreviatura, show: false, text: false },
							microcredito: { data: parseFloat( e.microcredito ), show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },
							update: { tb: "cobradores", show: true, text: false },
							delete: { tb: "cobradores", show: true, text: false },
							generarreport: { show: true, text: false },
							showreport: { show: true, text: false },
							showsupervisar: { show: true, text: false },

							assign: { show: true, text: false },
							list: { show: true, text: false },

							vma: { data: e.vma, show: false, text: false },
							vac: { data: e.vac, show: false, text: false },
							clientes: { data: e.clientes, show: true, text: true },

							bloqueado: { data: e.bloqueado, show: false, text: false },
							detalle_bloqueo: { data: e.detalle_bloqueo, tb: "global_cobradores", show: true, text: true },

							limite_prestamo: { data: parseFloat( e.limite_prestamo ), tb: "global_monedas", show: true, text: true },
							base_dia: { data: parseFloat( e.base_dia ), tb: "reportes_cobradores_online", show: true, text: true },
							capital: { data: parseFloat( e.capital ), tb: "reportes_cobradores_online", show: true, text: true },
							prestamos_vigentes: { data: e.prestamos_vigentes, tb: "prestamos", show: true, text: true },
							prestamos_pagados: { data: e.prestamos_pagados, tb: "prestamos", show: true, text: true },
							datetime_available: { data: parseFloat( e.datetime_available ), show: true, text: true }
						};
					}

					_length = generalJson.cobradores.collectors.length;
					generalJson.cobradores.registros = _length;
					generalJson.cobradores.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.cobradores.amoutPerpage = _length > 25 ? 25 : _length;

					markers({
						_nameJson: _name,
						gota: '',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: 'co'
					});

				break;
/* ***************************************************************************************************************** */

				case "clientes":
					if( _m.empty( generalJson.clientes ) )
						generalJson.clientes = structJson_generalJson( ) ;

					let change = false;

					_dataJson.clientes.forEach( e => {
						change = true;
						const indx = generalJson.clientes.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vac.data === e.vac });

						if( indx < 0 )
							generalJson.clientes.collectors.push( process_Clientes( e ) );
						else
							generalJson.clientes.collectors[ indx ] = process_Clientes( e );
					});

					if( change ) {
						sortByKey( generalJson.clientes.collectors, "orden" );

						if( _NV === "E" ) {
							let listW = 0, listB = 0, listA = 0;
							generalJson.clientes.collectors.forEach( e => { listW += e.rendimiento.data == 100 ? 1 : 0; listB += e.rendimiento.data == 0 ? 1 : 0; listA += e.gcl_dda.data < 0 ? 1 : 0; } );
							listWhite.innerHTML = listW;
							listBlack.innerHTML = listB;
							listAdvanced.innerHTML = listA;

							if( listW == 0 ) listWhite.classList.add( "hide" ); else listWhite.classList.remove( "hide" );
							if( listB == 0 ) listBlack.classList.add( "hide" ); else listBlack.classList.remove( "hide" );
							if( listA == 0 ) listAdvanced.classList.add( "hide" ); else listAdvanced.classList.remove( "hide" );
						}
					}

					function process_Clientes( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },
							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: `${ e.nombre } ${ e.apellido }`, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							negocio: { data: e.negocio, show: true, text: true },
							rendimiento: { data: e.rendimiento, show: false, text: false },
							region_horaria: { data: returnZonaHorarias( )[ e.zona_select ].text, show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },
							update: { tb: "clientes", show: true, text: false },
							delete: { tb: "clientes", show: true, text: false },
							posicionar: { data: e.unico, show: true, text: false },

							assign: { show: true, text: false },
							list: { show: true, text: false },

							vma: { data: e.vma, show: false, text: false },
							vac: { data: e.vac, show: false, text: false },
							vcc: { data: e.vcc, show: false, text: false },
							orden: { data: e.orden, show: false, text: false },

							idc: { data: e.idc, show: false, text: false },
							assignpresta: { data: e.prestamos_vigentes, tb: "prestamos", show: true, text: false },
							prestamos_vigentes: { data: e.prestamos_vigentes, tb: "prestamos", show: true, text: true },
							prestamos_pagados: { data: e.prestamos_pagados, tb: "prestamos", show: true, text: true },
							gcl_dda: { data: e.gcl_dda, show: false, text: false },
							limite_prestamo: { data: parseFloat( e.limite_prestamo ), tb: "global_clientes", show: true, text: true },
							abrev_moneda: { data: e.abreviatura, show: false, text: false },
							idm: { data: e.idm, show: false, text: false },

							suma_prestamos: { data: parseFloat( e?.suma_prestamos ?? 0 ), show: false, text: false }
						};
					}

					_length = generalJson.clientes.collectors.length;
					generalJson.clientes.registros = _length;
					generalJson.clientes.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.clientes.amoutPerpage = _length > 25 ? 25 : _length;

					markers({
						_nameJson: _name,
						gota: '',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: 'cl'
					});

				break;
/* ***************************************************************************************************************** */

				case "monedas":
					_length = _dataJson.monedas.length;

					if( _m.empty( generalJson.monedas ) )
						generalJson.monedas = structJson_generalJson( ) ;

					generalJson.monedas.registros = _length;
					generalJson.monedas.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.monedas.amoutPerpage = _length > 25 ? 25 : _length;

					generalJson.monedas.collectors =
						_dataJson.monedas.map( e => {
							return {
										unico: { data: e.unico, show: false, text: false },
										nombre: { data: e.nombre, show: true, text: true },
										abrev_moneda: { data: e.abreviatura, show: true, text: true },
										valor_cambiario: { data: parseFloat( e.valor_cambiario ), show: true, text: true },
								}
						});

				break;
/* ***************************************************************************************************************** */

				case "cobrador":
					if( _m.empty( generalJson.cobrador ) )
						generalJson.cobrador = { collectors: [ ] };

					generalJson.cobrador.collectors =
						_dataJson.cobrador.map( e => {
							return {
										unico: { data: e.unico },
										vac: { data: _VAC },
										nombre_completo: { data: e.nombre_completo },
										latitud: { data: e.latitud },
										longitud: { data: e.longitud },

										idm: { data: e.idm },
										moneda: { data: e.moneda },
										abrev_moneda: { data: e.abreviatura },
										valor_cambiario: { data: parseFloat( e.valor_cambiario ) },
										numero_cuotas: { data: e.numero_cuotas },
										interes: { data: parseFloat( e.interes ) },
										limite_prestamo: { data: parseFloat( e.limite_prestamo ) },
										microcredito: { data: parseFloat( e.microcredito ) },
										datetime_available: { data: parseFloat( e.datetime_available ) }
								}
						});

					markers({
						_nameJson: _name,
						gota: 'propia',
						ul_cobradores: ul_cobradores,
						ul_clientes: ul_clientes,
						co_cl: ''
					});
				break;
/* ***************************************************************************************************************** */

				case "rutas":
					if( _m.empty( generalJson.rutas ) )
						generalJson.rutas = structJson_generalJson( ) ;

					_dataJson.rutas.forEach( e => {
						const indx = generalJson.rutas.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vac.data === e.vac && FI.idp.data === e.idp });

						if( indx < 0 )
							generalJson.rutas.collectors.push( process_Rutas( e ) );
						else
							generalJson.rutas.collectors[ indx ] = process_Rutas( e );
					});

					function process_Rutas( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },
							array_gallery: { data: returnArrayImagen( e.galeria ), show: false, text: false },

							cedula: { data: e.cedula, show: true, text: true },
							nombre_completo: { data: e.name, show: true, text: true },
							telefono: { data: e.telefono, show: true, text: true },
							correo: { data: e.correo, show: true, text: true },
							direccion: { data: e.direccion, show: true, text: true },
							negocio: { data: e.negocio, show: true, text: true },
							prestamos_vigentes: { data: e.prestamos_vigentes, tb: "prestamos", show: true, text: true },
							prestamos_pagados: { data: e.prestamos_pagados, tb: "prestamos", show: true, text: true },

							minimap: { show: true, text: false },
							gallery: { show: true, text: false },
							guiame: { show: true, text: false },
							check: { tb: "prestamos_dia_de_visita", show: true, text: false },

							vac: { data: e.vac, show: false, text: false },
							vcc: { data: e.vcc, show: false, text: false },

							idp: { data: e.idp, show: false, text: false },
							observaciones: { data: e.observaciones, show: true, text: true },
							visitado: { data: e.visitado, show: true, text: true },
							hora: { data: e.hora, show: true, text: true },

							distancia: { data: e.unico, show: true, text: true }
						};
					}

					_length = generalJson.rutas.collectors.length;
					generalJson.rutas.registros = _length;
					generalJson.rutas.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.rutas.amoutPerpage = _length > 25 ? 25 : _length;
				break;
/* ***************************************************************************************************************** */

				case "reporte_online":
					if( _m.empty( generalJson.reporte_online ) )
						generalJson.reporte_online = { collectors: [ ] };

					_dataJson.reporte_online.forEach( e => {
						const indx = generalJson.reporte_online.collectors.findIndex( FI =>{ return FI.unico === e.unico && FI.vac.data === e.vac });

						if( indx < 0 )
							generalJson.reporte_online.collectors.push( process_Reporte_OnLine( e ) );
						else
							generalJson.reporte_online.collectors[ indx ] = process_Reporte_OnLine( e );
					});

					function process_Reporte_OnLine( e ){
						return {
							vma: { data: e.vma },
							vac: { data: e.vac },
							unico: e.unico,

							nombre_completo: { data: e.name },
							fecha: e.fecha,

							estimado_a_cobrar: { data: parseFloat( e.estimado_a_cobrar ) },
							cobrado_en_efectivo: { data: parseFloat( e.cobrado_en_efectivo ) },
							cobrado_en_transferencia: { data: parseFloat( e.cobrado_en_transferencia ) },
							total_cobrado: { data: parseFloat( e.total_cobrado ) },
							total_interes: { data: parseFloat( e.total_interes ) },
							total_prestado: { data: parseFloat( e.total_prestado ) },
							total_microcredito: { data: parseFloat( e.total_microcredito ) },
							cuentas_nuevas: { data: parseFloat( e.cuentas_nuevas ) },
							cuentas_terminadas: { data: parseFloat( e.cuentas_terminadas ) },
							caja_anterior: { data: parseFloat( e.caja_anterior ) },
							caja_actual: { data: parseFloat( e.caja_actual ) },
							efectivo_dia: { data: parseFloat( e.efectivo_dia ) },
							suma_cartera: { data: parseFloat( e.suma_cartera ) },
							gastos: { data: parseFloat( e.gastos ) },
							base_dia: { data: parseFloat( e.base_dia ) },
							capital: { data: parseFloat( e.capital ) },
							total_clientes: { data: parseFloat( e.total_clientes ) },
							total_clientes_cobrados: { data: parseFloat( e.total_clientes_cobrados ) },
							abrev_moneda: { data: e.abrev_moneda }
						};
					}
				break;
/* ***************************************************************************************************************** */

				case "reporte_semanal":
					if( _m.empty( generalJson.reporte_semanal ) )
						generalJson.reporte_semanal = { collectors: [ ] };

					_dataJson.reporte_semanal.forEach( e => {
						const indx = generalJson.reporte_semanal.collectors.findIndex( FI =>{ return FI.unico === e.unico && FI.vac === e.vac && FI.fecha === e.fecha });

						if( indx < 0 )
							generalJson.reporte_semanal.collectors.push( process_Reporte_Semanal( e ) );
						else
							generalJson.reporte_semanal.collectors[ indx ] = process_Reporte_Semanal( e );
					});

					function process_Reporte_Semanal( e ){
						return {
							vma: e.vma,
							vac: e.vac,
							unico: e.unico,

							nombre_completo: e.name,
							fecha: e.fecha,

							cobrado_en_efectivo: parseFloat( e.cobrado_en_efectivo ),
							cobrado_en_transferencia: parseFloat( e.cobrado_en_transferencia ),
							total_cobrado: parseFloat( e.total_cobrado ),
							total_interes: parseFloat( e.total_interes ),
							total_prestado: parseFloat( e.total_prestado ),
							total_microcredito: parseFloat( e.total_microcredito ),
							cuentas_nuevas: parseFloat( e.cuentas_nuevas ),
							cuentas_terminadas: parseFloat( e.cuentas_terminadas ),
							caja_anterior: parseFloat( e.caja_anterior ),
							caja_actual: parseFloat( e.caja_actual ),
							efectivo_dia: parseFloat( e.efectivo_dia ),
							suma_cartera: parseFloat( e.suma_cartera ),
							gastos: parseFloat( e.gastos ),
							base_dia: parseFloat( e.base_dia ),
							capital: parseFloat( e.capital ),
							abrev_moneda: e.abrev_moneda
						};
					}
				break;
/* ***************************************************************************************************************** */

				case "creditospendientes":
					if( _m.empty( generalJson.creditospendientes ) )
						generalJson.creditospendientes = structJson_generalJson( ) ;

					_dataJson.creditospendientes.forEach( e => {
						const indx = generalJson.creditospendientes.collectors.findIndex( FI =>{ return FI.unico.data === e.unico && FI.vcc.data === e.vcc });

						if( indx < 0 )
							generalJson.creditospendientes.collectors.push( process_CreditosPendientes( e ) );
						else
							generalJson.creditospendientes.collectors[ indx ] = process_CreditosPendientes( e );
					});

					function process_CreditosPendientes( e ){
						return {
							unico: { data: e.unico, show: false, text: false },
							idc: { data: e.idc, show: false, text: false },
							vcc: { data: e.vcc, show: false, text: false },
							idp: { data: e.idp, show: false, text: false },
							latitud: { data: e.latitud, show: false, text: false },
							longitud: { data: e.longitud, show: false, text: false },

							delete: { tb: "prestamos_temporales", show: true, text: false },
							update: { tb: "prestamos_temporales", show: true, text: false },

							minimap: { show: true, text: false },
							marker: { data: null, show: false, text: false },

							abrev_moneda: { data: e.abreviatura, show: false, text: false },
							observaciones: { data: e.observaciones, show: true, text: true },
							fecha_inicio: { data: e.fecha_inicio, show: true, text: true },
							fecha_limite: { data: e.fecha_limite, show: true, text: true },
							monto_diario: { data: parseFloat( e.monto_diario ), show: true, text: true },
							numero_cuotas: { data: e.numero_cuotas, show: true, text: true },
							total_con_interes: { data: parseFloat( e.total_con_interes ), show: true, text: true },
							monto_prestado: { data: parseFloat( e.monto_prestado ), show: true, text: true },
							interes: { data: e.interes, show: true, text: true },

							nombre_completo_cobrador: { data: e.nombre_completo_cobrador, show: true, text: true },
							nombre_completo_cliente: { data: e.nombre_completo_cliente, show: true, text: true },
							cedula: { data: e.cedula, show: true, text: true }
						};
					}

					_length = generalJson.creditospendientes.collectors.length;
					generalJson.creditospendientes.registros = _length;
					generalJson.creditospendientes.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.creditospendientes.amoutPerpage = _length > 25 ? 25 : _length;
				break;
/* ***************************************************************************************************************** */

				case "movimientos_online":
					if( _m.empty( generalJson.movimientos_online ) )
						generalJson.movimientos_online = structJson_generalJson( ) ;

					_dataJson.movimientos_online.forEach( e => {
						const indx = generalJson.movimientos_online.collectors.findIndex( FI =>{ return FI.unico.data === e.unico });

						if( indx < 0 ) {
							generalJson.movimientos_online.collectors.unshift( process_Movimientos( e ) );

							if( 
								generalJson.UltimaEleccion( ) === "movimientos_online_filter" &&
								generalJson.UltimoClick( ).closest( "tr" ).dataset.vac == e.vac
							) {
								generalJson.movimientos_online_filter.collectors.unshift( process_Movimientos( e ) );

								_length = generalJson.movimientos_online_filter.collectors.length;
								generalJson.movimientos_online_filter.registros = _length;
								generalJson.movimientos_online_filter.currentItemsShowed = _length > 25 ? 25 : _length;
								generalJson.movimientos_online_filter.amoutPerpage = _length > 25 ? 25 : _length;

								loadCollectors( 0 );
							}
						}
					});

					function process_Movimientos( e ){
						return {
							unico: { data: e.unico, show: false, text: false },

							nombre_completo: { data: e.name, show: true, text: true },
							vac: { data: e.vac, show: false, text: false },
							vcc: { data: e.vcc, show: false, text: false },
							idp: { data: e.idp, show: false, text: false },

							detalle: { data: e.detalle, show: true, text: true },
							monto: { data: parseFloat( e.monto ), show: true, text: true },
							deuda: { data: parseFloat( e.deuda ), show: true, text: true },
							fecha: { data: e.fecha, show: true, text: true },
							hora: { data: e.hora, show: true, text: true }
						};
					}

					_length = generalJson.movimientos_online.collectors.length;
					generalJson.movimientos_online.registros = _length;
					generalJson.movimientos_online.currentItemsShowed = _length > 25 ? 25 : _length;
					generalJson.movimientos_online.amoutPerpage = _length > 25 ? 25 : _length;

				break;
			}
		}
	}
	else {
		let sumatoria = 0;

		switch( _nameJson ) {
			case "usuarios":
				_length = _dataJson.length;

				if( _m.empty( generalJson.usuarios ) )
					generalJson.usuarios = structJson_generalJson( );

				generalJson.usuarios.registros = _length;
				generalJson.usuarios.currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson.usuarios.amoutPerpage = _length > 25 ? 25 : _length;

				generalJson.usuarios.collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									usuario: { data: e.usuario, show: true, text: true },
									contrasena: { data: "**********", show: true, text: true },

									update: { show: true, text: false },
									delete: { tb: "usuarios", show: true, text: false }
							}
					});

			break;

			case "prestamos":
				_length = _dataJson.length;

				if( _m.empty( generalJson.prestamos ) )
					generalJson.prestamos = structJson_generalJson( );

				generalJson.prestamos.registros = _length;
				generalJson.prestamos.currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson.prestamos.amoutPerpage = _length > 25 ? 25 : _length;

				generalJson.prestamos.collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									name: { data: e.name, show: false, text: false },
									idp: { data: e.idp, show: false, text: false },
									vac: { data: e.vac, show: false, text: false },
									vcc: { data: e.vcc, show: false, text: false },

									delete: { tb: "prestamos", show: true, text: false },

									interes: { data: e.interes, show: true, text: true },
									numero_cuotas: { data: e.numero_cuotas, show: true, text: true },
									intervalo_de_tiempo: { data: e.intervalo_de_tiempo, show: true, text: true },
									dias_de_atraso: { data: e.dias_de_atraso, show: true, text: true },
									cuotas_pagadas: { data: e.cuotas_pagadas, show: true, text: true },
									abonos_realizados: { data: e.abonos_realizados, show: true, text: true },

									monto_prestado: { data: parseFloat( e.monto_prestado ), show: true, text: true },
									microcredito: { data: parseFloat( e.microcredito ), show: true, text: true },
									total_con_interes: { data: parseFloat( e.total_con_interes ), show: true, text: true },
									total_a_cobrar: { data: parseFloat( e.total_a_cobrar ), show: true, text: true },
									total_cuotas: { data: parseFloat( e.total_cuotas ), show: true, text: true },
									total_abonos: { data: parseFloat( e.total_abonos ), show: true, text: true },
									total_cancelado: { data: parseFloat( e.total_cancelado ), show: true, text: true },
									monto_diario: { data: parseFloat( e.monto_diario ), show: true, text: true },

									fecha_inicio: { data: e.fecha_inicio, show: true, text: true },
									fecha_limite: { data: e.fecha_limite, show: true, text: true },
									siguiente_visita: { data: e.siguiente_visita, show: true, text: true },
									observaciones: { data: e.observaciones, show: true, text: true },
									latitud: { data: e.latitud, show: false, text: false },
									longitud: { data: e.longitud, show: false, text: false },

									nombre_moneda: { data: e.nombre, show: true, text: true },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									span_moneda: { data: `${ e.nombre } (${ e.abreviatura })`, show: true, text: true }
							}
					});
			break;

			case "total_cobrado":
			case "cobrado_en_efectivo":
			case "cobrado_en_transferencia":
				_length = _dataJson.length;

				if( _m.empty( generalJson[ _nameJson ] ) )
					generalJson[ _nameJson ] = structJson_generalJson( );

				generalJson[ _nameJson ].registros = _length;
				generalJson[ _nameJson ].currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson[ _nameJson ].amoutPerpage = _length > 25 ? 25 : _length;

				generalJson[ _nameJson ].collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									//idp: { data: e.idp, show: false, text: false },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									//latitud: { data: e.latitud, show: false, text: false },
									//longitud: { data: e.longitud, show: false, text: false },

									cedula: { data: e.cedula, show: true, text: true },
									nombre_completo: { data: e.name, show: true, text: true },
									
									suma_abonos_cancelados: { data: parseFloat( e.monto_abonos ), show: true, text: true },
									n_abonos_cancelados: { data: parseFloat( e.numero_abonos ), show: true, text: true },

									suma_cuotas_pagadas: { data: parseFloat( e.monto_cuotas ), show: true, text: true },
									n_cuotas_pagadas: { data: parseFloat( e.numero_cuotas ), show: true, text: true }
							}
					});
			break;

			case "total_prestado":
			case "cuentas_nuevas":
			case "cuentas_terminadas":
				_length = _dataJson.length;

				if( _m.empty( generalJson[ _nameJson ] ) )
					generalJson[ _nameJson ] = structJson_generalJson( );

				generalJson[ _nameJson ].registros = _length;
				generalJson[ _nameJson ].currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson[ _nameJson ].amoutPerpage = _length > 25 ? 25 : _length;

				generalJson[ _nameJson ].collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									latitud: { data: e.latitud, show: false, text: false },
									longitud: { data: e.longitud, show: false, text: false },

									cedula: { data: e.cedula, show: true, text: true },
									nombre_completo: { data: e.name, show: true, text: true },
									
									monto_prestado: { data: parseFloat( e.monto_prestado ), show: true, text: true },
									interes: { data: parseFloat( e.interes ), show: true, text: true },
									numero_cuotas: { data: parseFloat( e.numero_cuotas ), show: true, text: true },

									fecha_inicio: { data: e.fecha_inicio, show: true, text: true },
									fecha_limite: { data: e.fecha_limite, show: true, text: true }
							}
					});
			break;

			case "total_gastos":
				_length = _dataJson.length;

				if( _m.empty( generalJson.total_gastos ) )
					generalJson.total_gastos = structJson_generalJson( );

				generalJson.total_gastos.registros = _length;
				generalJson.total_gastos.currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson.total_gastos.amoutPerpage = _length > 25 ? 25 : _length;

				generalJson.total_gastos.collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									vac: { data: e.vac, show: false, text: false },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									delete: { tb: "total_gastos", show: true, text: false },

									fecha: { data: e.fecha, show: true, text: true },
									hora: { data: e.hora, show: true, text: true },
									monto: { data: parseFloat( e.monto ), show: true, text: true },
									sumatoria: { data: ( sumatoria += parseFloat( e.monto ) ), show: true, text: true },

									observaciones: { data: e.observaciones, show: true, text: true }
							}
					});
			break;

			case "total_base_dia":
				_length = _dataJson.length;

				if( _m.empty( generalJson.total_base_dia ) )
					generalJson.total_base_dia = structJson_generalJson( );

				generalJson.total_base_dia.registros = _length;
				generalJson.total_base_dia.currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson.total_base_dia.amoutPerpage = _length > 25 ? 25 : _length;

				generalJson.total_base_dia.collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									vac: { data: e.vac, show: false, text: false },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									delete: { tb: "total_base_dia", show: true, text: false },

									fecha: { data: e.fecha, show: true, text: true },
									hora: { data: e.hora, show: true, text: true },
									monto: { data: parseFloat( e.monto ), show: true, text: true },
									sumatoria: { data: ( sumatoria += parseFloat( e.monto ) ), show: true, text: true },

									observaciones: { data: e.observaciones, show: true, text: true }
							}
					});
			break;

			case "total_capital":
				_length = _dataJson.length;

				if( _m.empty( generalJson.total_capital ) )
					generalJson.total_capital = structJson_generalJson( );

				generalJson.total_capital.registros = _length;
				generalJson.total_capital.currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson.total_capital.amoutPerpage = _length > 25 ? 25 : _length;

				generalJson.total_capital.collectors =
					_dataJson.map( e => {
						return {
									unico: { data: e.unico, show: false, text: false },
									vac: { data: e.vac, show: false, text: false },
									abrev_moneda: { data: e.abreviatura, show: false, text: false },
									delete: { tb: "total_capital", show: true, text: false },

									fecha: { data: e.fecha, show: true, text: true },
									hora: { data: e.hora, show: true, text: true },
									monto: { data: parseFloat( e.monto ), show: true, text: true },
									sumatoria: { data: ( sumatoria += parseFloat( e.monto ) ), show: true, text: true },

									observaciones: { data: e.observaciones, show: true, text: true }
							}
					});
			break;
		}
	}
}

function resetearCollectors( _name ) {
	const _length = generalJson[ _name ].registros;
	generalJson[ _name ].maxPage = 0;
	generalJson[ _name ].currentPage = 0;
	generalJson[ _name ].currentIndex = 0;
	generalJson[ _name ].currentItemsShowed = _length > 25 ? 25 : _length;
	generalJson[ _name ].amoutPerpage = _length > 25 ? 25 : _length;
	generalJson[ _name ].first_row = 0;
}

function structJson_generalJson( ) {
	return {
				collectors: [ ],
				maxPage: 0,
				currentPage: 0,
				currentIndex: 0,
				currentItemsShowed: 0,
				amoutPerpage: 0,
				first_row: 0,
				registros: 0
			};
}

function create_basic_struct_dinamic( _dataJson, _nameStruct ) {
	const _length = _dataJson.length;

	if( _m.empty( generalJson[ _nameStruct ] ) )
		generalJson[ _nameStruct ] = structJson_generalJson( );

	generalJson[ _nameStruct ].registros = _length;
	generalJson[ _nameStruct ].currentItemsShowed = _length > 25 ? 25 : _length;
	generalJson[ _nameStruct ].amoutPerpage = _length > 25 ? 25 : _length;
}

async function cargarUsuarios( ) {
	let jsonLoan = await functionLoan({ _t: generalJson.UltimoClick( ).closest( "tr" ).dataset.unico, _sw: "user" });

	if( jsonLoan.length > 0 )
		crearCollectors( false, jsonLoan, "usuarios" );

	return jsonLoan;
}

async function cargarPrestamos({ vigentes = false, pagados = false, filtrar = true, vac_vcc = [ ] }) {
	let jsonLoan,
		_send = true,
		$dom = generalJson.UltimoClick( )?.closest( "tr" )?.dataset ?? vac_vcc[ 0 ];

	if ( !filtrar ) {
		jsonLoan = await functionLoan({ _t: $dom.vac, _sw: "vpr", _vcc: $dom.vcc, vigentes: ( vigentes ? 1 : 0 ) });
		_send = true;
	}
	else {
		jsonLoan = generalJson
						.clientes
						.collectors
						.filter(
							e => {
								if( e.vac.data === $dom.vac ) {
									if( vigentes && e.prestamos_vigentes.data > 0 )
										return e;

									else if( pagados && e.prestamos_pagados.data > 0 )
										return e;
								}
							}
						);

		_send = false;
	}

	if( jsonLoan.length > 0 && _send )
		crearCollectors( false, jsonLoan, "prestamos" );

	return jsonLoan;
}

function infoClient_afterFilter( _unico, assignpresta, filtro ) {
	const JData = generalJson.clientes.collectors.filter( e =>{ if( e[ filtro ].data === _unico ) return e; })[ 0 ];
	now_limitcredit = JData.limite_prestamo.data;
	now_sumcredits = JData.suma_prestamos.data;

	if( assignpresta )
		asignar_prestamo( JData );
	else
		return JData;
}

function asignar_prestamo( JData ) {
	FormDinamic({ _link: JData.unico.data, _title: `${ JData.nombre_completo.data }: Asignación de Préstamo`, _option: "assignpresta", _extends_button: "vma;vac;vcc;unico;idm" });
	multiCreditos({ vcc: JData.vcc.data, idc: JData.unico.data });
}

function dataJsonSegunClick({ _nameJson, $element = null, $default = "unico" }) {
	const last_click = typeof $element === "string" ?
		  						$element :
							(
								_m.empty( $element ) ?
									generalJson.UltimoClick( ).closest( "tr" ).dataset[ $default ] :
									$element.dataset[ $default ]
							);
	return generalJson[ _nameJson ].collectors.filter( e => { return e[ $default ].data == last_click })[ 0 ];
}

async function cargar_detalles_prestamos( JData, selector ) {
	let jsonLoan = await functionLoan({ _t: JData.unico.data, _sw: selector, _idp: JData.idp.data });
	return jsonLoan;
}

async function functionLoan({ _t, _sw, _vcc = '-', _idp = '-', _f = '-', vigentes = 1 }) {
	return await _m._lets( `src/php/GetInformationLoan.php?t=${ _t }&sw=${ _sw }&vcc=${ _vcc }&idp=${ _idp }&fecha=${ _f }&vigentes=${ vigentes }` )
					.then( json => { return json; } );
}

function autoClickDate( ){
	const $_ = generalJson.UltimaSeccion( ).querySelector( "#iden__caja_actual" );
	reporte_DS( $_.dataset.vac, $_.dataset.abrev_moneda );
}

function filter_selector( ) {
	const ul_cobradores = onlyMapFollowing.querySelector( "ul.ul_cobradores" ),
		  ul_clientes = onlyMapFollowing.querySelector( "ul.ul_clientes" ),
		  selected = ul_cobradores.previousElementSibling.querySelector( "span" ).dataset;

	ul_clientes.querySelectorAll( "li" ).forEach( e => {
		if( selected.select === e.dataset.select )
			e.classList.remove( "ocultar_li" );

		else
			e.classList.add( "ocultar_li" );
	} );

	setTimeout( ( ) => {
		changeVisibility( true, selected.select );
	}, 100 );
}

function previo_inversor( _property = "", etapa_uno = false, etapa_dos = false ) {
	if(
		etapa_uno &&
		previo.hasOwnProperty( _property )
	) {
		if( generalJson.hasOwnProperty(  _property ) )
			generalJson
				[ _property ]
				.collectors = JSON.parse( JSON.stringify( previo[ _property ] ) );

		delete previo[ _property ];
	}

	if(
		etapa_dos &&
		generalJson.hasOwnProperty(  _property )
	  ) {
		generalJson[ _property ].first_row = 0;
		generalJson[ _property ].backup_row = 0;
		generalJson[ _property ].maxPage = 0;
		generalJson[ _property ].currentPage = 0;
		generalJson[ _property ].currentIndex = 0;

		if( !_m.empty( generalJson[ _property ] ) ) {
			const _length = generalJson[ _property ].collectors.length;

			if(
				generalJson.UltimaEleccion( ) === "enrutamiento" ||
				generalJson.UltimaEleccion( ) === "movimientos_online_filter"
			  ) {
				generalJson[ _property ].registros = _length;
				generalJson[ _property ].currentItemsShowed = _length;
				generalJson[ _property ].amoutPerpage = _length;
			}
			else {
				generalJson[ _property ].registros = _length;
				generalJson[ _property ].currentItemsShowed = _length > 25 ? 25 : _length;
				generalJson[ _property ].amoutPerpage = _length > 25 ? 25 : _length;
			}

			loadCollectors( 0 );
		}
	}
}

function keyup_search( target, _property ){
	if( !_m.empty( timeout_searchFilter ) )
		clearTimeout( timeout_searchFilter );

	if( !previo.hasOwnProperty( _property ) )
		previo[ _property ] = JSON.parse( JSON.stringify( generalJson[ _property ].collectors ) );

	timeout_searchFilter = setTimeout( function( ) {
		const inputStr = target.value.toLowerCase( ).trim( );

		if( inputStr.length == 0 )
			previo_inversor( _property, true );

		else if( previo.hasOwnProperty( _property ) ) {
			generalJson
				[ _property ]
				.collectors =
					previo
						[ _property ]
						.filter( x => {
									if( inputStr.toLowerCase( ) === "advx" ) {
										if( x.gcl_dda.data < 0 )
											return true;
									}
									else {
										for( let y in x )
											if( x[ y ].hasOwnProperty( "data" ) && ( typeof x[ y ].data === "string" || typeof x[ y ].data === "number" ) && x[ y ].data !== "" )
												if( x[ y ].data.toString( ).localeContains( inputStr ) && x[ y ].text )
													return true;
									}

									return false;
								});
		}

		previo_inversor( _property, false, true );
	}, 500 );
}

function detalles_prestamos( JData, _selector, _showTable, _title = "" ){
	cargar_detalles_prestamos( JData, _selector ).then( JData => {
		create_basic_struct_dinamic( JData, _selector );
		let sumatoria = 0;

		generalJson[ _selector ].collectors =
			( _selector === "dias_de_atraso" )
			?
				JData.map( ( e, i ) => {
					return {
								unico: { data: ( i + 1 ), show: false, text: false },
								indice: { data: ( i + 1 ), show: true, text: true },
								fecha: { data: e.fecha, show: true, text: true },
								observaciones: { data: e.observaciones, show: true, text: true }
						}
				})
			:
				JData.map( e => {
					return {
								unico: { data: e.unico, show: false, text: false },
								idp: { data: e.idp, show: false, text: false },
								vcc: { data: e.vcc, show: false, text: false },

								monto: { data: parseFloat( e.monto ), show: true, text: true },
								metodo_pago: { data: e.metodo_pago, show: true, text: true },
								sumatoria: { data: ( sumatoria += parseFloat( e.monto ) ), show: true, text: true },
								abrev_moneda: { data: e.abreviatura, show: false, text: false },
								fecha: { data: e.fecha, show: true, text: true },
								hora: { data: e.hora, show: true, text: true },
								observaciones: { data: e.observaciones, show: true, text: true },
								latitud: { data: e.latitud, show: false, text: false },
								longitud: { data: e.longitud, show: false, text: false },

								minimap: { show: true, text: false },
								delete: { tb: _selector, show: true, text: false },
								marker: { data: null, show: false, text: false }
						}
				});

		if( _showTable ) {
			Show_Table({ _title: _title, _option: _selector });
			resetearCollectors( _selector );
		}
		else
			loadCollectors( 0 );
	});
}

function sumatoria_semanal( _json ) {
	return _json.reduce(( _arrNew, _row ) => {
		_arrNew = 
			{
				vma: { data: _row.vma },
				vac: { data: _row.vac },
				unico: { data: _row.unico },
				nombre_completo: { data: _row.nombre_completo },
				abrev_moneda: { data: _row.abrev_moneda },

				cobrado_en_efectivo: { data: _arrNew.cobrado_en_efectivo.data + parseFloat( _row.cobrado_en_efectivo ) },
				cobrado_en_transferencia: { data: _arrNew.cobrado_en_transferencia.data + parseFloat( _row.cobrado_en_transferencia ) },
				total_cobrado: { data: _arrNew.total_cobrado.data + parseFloat( _row.total_cobrado ) },
				total_interes: { data: _arrNew.total_interes.data + parseFloat( _row.total_interes ) },
				total_prestado: { data: _arrNew.total_prestado.data + parseFloat( _row.total_prestado ) },
				total_microcredito: { data: _arrNew.total_microcredito.data + parseFloat( _row.total_microcredito ) },
				cuentas_nuevas: { data: _arrNew.cuentas_nuevas.data + parseFloat( _row.cuentas_nuevas ) },
				cuentas_terminadas: { data: _arrNew.cuentas_terminadas.data + parseFloat( _row.cuentas_terminadas ) },
				caja_anterior: { data: ( _arrNew.caja_anterior.data == 0 ? parseFloat( _row.caja_anterior ) : _arrNew.caja_anterior.data ) },
				caja_actual: { data: parseFloat( _row.caja_actual ) },
				suma_cartera: { data: parseFloat( _row.suma_cartera ) },
				gastos: { data: _arrNew.gastos.data + parseFloat( _row.gastos ) },
				base_dia: { data: _arrNew.base_dia.data + parseFloat( _row.base_dia ) },
				capital: { data: parseFloat( _row.capital ) },

				efectivo_dia: { data: _arrNew.efectivo_dia.data + parseFloat( _m.empty( _row.efectivo_dia ) ? 0 : _row.efectivo_dia ) },
				estimado_a_cobrar: { data: _arrNew.estimado_a_cobrar.data + parseFloat( _m.empty( _row.estimado_a_cobrar ) ? 0 : _row.estimado_a_cobrar ) },
				total_clientes: { data: _arrNew.total_clientes.data + parseFloat( _m.empty( _row.total_clientes ) ? 0 : _row.total_clientes ) },
				total_clientes_cobrados: { data: _arrNew.total_clientes_cobrados.data + parseFloat( _m.empty( _row.total_clientes_cobrados ) ? 0 : _row.total_clientes_cobrados ) }
			}
		;
		return _arrNew;
	}, {
		 vma: { data: '' },
		 vac: { data: '' },
		 unico: { data: '' },
		 nombre_completo: { nombre_completo: '' },
		 abrev_moneda: { data: '' },

		 cobrado_en_efectivo: { data: 0 },
		 cobrado_en_transferencia: { data: 0 },
		 total_cobrado: { data: 0 },
		 total_interes: { data: 0 },
		 total_prestado: { data: 0 },
		 total_microcredito: { data: 0 },
		 cuentas_nuevas: { data: 0 },
		 cuentas_terminadas: { data: 0 },
		 caja_anterior: { data: 0 },
		 caja_actual: { data: 0 },
		 suma_cartera: { data: 0 },
		 gastos: { data: 0 },
		 base_dia: { data: 0 },
		 capital: { data: 0 },

		 efectivo_dia: { data: 0 },
		 estimado_a_cobrar: { data: 0 },
		 total_clientes: { data: 0 },
		 total_clientes_cobrados: { data: 0 }
	   });
}

async function reporte_DS( _vac, prefijo ){
	prefijo = prefijo + '. ';
	let tipo_reporte = "", _fecha = "";

	switch( generalJson.UltimaEleccion( ) ){
		case "generarreport":
			tipo_reporte = "reporte_dia";
			_fecha = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_dia" ).value;

		break;
		case "showreport":
			tipo_reporte = "reporte_semanal";
			_fecha = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_from" ).value + "/" +
					 generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_to" ).value;

		break;
	}

	let JData = await functionLoan({
								_t: _vac,
								_sw: tipo_reporte,
								_f: _fecha
							});

	JData = [ sumatoria_semanal( JData ) ];
	JData.forEach( e => {
		iden__total_cobrado.textContent = format_number( e.total_cobrado.data, 1, prefijo );
		iden__cobrado_en_efectivo.textContent = format_number( e.cobrado_en_efectivo.data, 1, prefijo );
		iden__cobrado_en_transferencia.textContent = format_number( e.cobrado_en_transferencia.data, 1, prefijo );
		iden__total_prestado.textContent = format_number( e.total_prestado.data, 0, prefijo );
		iden__total_microcredito.textContent = format_number( e.total_microcredito.data, 1, prefijo );
		iden__cuentas_nuevas.textContent = format_number( e.cuentas_nuevas.data, 0 );
		iden__cuentas_terminadas.textContent = format_number( e.cuentas_terminadas.data, 0 );
		iden__caja_anterior.textContent = format_number( e.caja_anterior.data, 1, prefijo );
		iden__caja_actual.textContent = format_number( e.caja_actual.data, 1, prefijo );
		iden__total_gastos.textContent = format_number( e.gastos.data, 1, prefijo );
		iden__base_dia.textContent = format_number( e.base_dia.data, 0, prefijo );

		if( !_m.empty( typeof iden__capital ) )
			iden__capital.textContent = format_number( e.capital.data, 1, prefijo );

		if( !_m.empty( typeof iden__total_interes ) )
			iden__total_interes.textContent = format_number( e.total_interes.data, 1, prefijo );

		if( !_m.empty( typeof iden__suma_cartera ) )
			iden__suma_cartera.textContent = format_number( e.suma_cartera.data, 1, prefijo );

		switch( tipo_reporte ){
			case "reporte_dia":
				iden__estimado_a_cobrar.textContent = format_number( e.estimado_a_cobrar.data, 1, prefijo );
				iden__clientes_con_pagos.textContent = `${ e.total_clientes_cobrados.data } cliente(s) visitado(s) de ${ e.total_clientes.data }`;
				iden__efectivo_dia.textContent = format_number( e.efectivo_dia.data , 1 , prefijo );

			break;
		}
	});
}

function _download( target ){
	target.classList.add( "hide" );
	let tipo_reporte = "", _from = "", _to = "", _name = "", _vac = "", _unico = "";
	const _property = generalJson.UltimaSeccion( )?.dataset.link,
		  _t_ = generalJson[ _property ].collectors[ 0 ];

	switch( generalJson.UltimaEleccion( ) ){
		case "generarreport":
			tipo_reporte = "Diario";
			_from = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_dia" ).value;
			_to = _from;
			_unico = _t_.unico.hasOwnProperty( "data" ) ? _t_.unico.data : _t_.unico;
			_vac = _t_.vac.hasOwnProperty( "data" ) ? _t_.vac.data : _t_.vac;
			_name = _t_.nombre_completo.hasOwnProperty( "data" ) ? _t_.nombre_completo.data : _t_.nombre_completo;	

		break;
		case "showreport":
			tipo_reporte = "Semanal";
			_from = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_from" ).value;
			_to = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_to" ).value;
			_unico = _t_.unico.hasOwnProperty( "data" ) ? _t_.unico.data : _t_.unico;
			_vac = _t_.vac.hasOwnProperty( "data" ) ? _t_.vac.data : _t_.vac;
			_name = _t_.nombre_completo.hasOwnProperty( "data" ) ? _t_.nombre_completo.data : _t_.nombre_completo;

		break;
		default:
			tipo_reporte = "Diario";
			_from = _NOW.split( ' ' )[ 0 ].split( '-' ).reverse( ).join( '-' );
			_to = _from;
			_name = _NAME;
			_unico = _THIS;
			_vac = _VAC;

		break;
	}

	shownotificationMessage( true, "Descarga en Proceso, espere mientras se procesa la petición" )

	_m._lets( `src/php-excel/download_report.php?vac=${ _vac }&from=${ _from }&to=${ _to }&tipo=${ tipo_reporte }&name=${ _name }&unico=${ _unico }&nv=${ _NV }` )
		.then( _xml => {
			document.location = ( _xml.link );
			target.classList.remove( "hide" );
	} );
}












