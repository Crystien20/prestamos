function FormDinamic({ _link = undefined, _title = '', _option = undefined, _extends_button = '' }){
	let headerANDstruct = [ ],
        section,
        _nameJson = '',
        JData = [ ],
        inc,
        din,
        iin,
		_vac,
		_prefijo,
		_img;

	const params = _m.getAll( );

	switch( _option ) {
		case "newadmin":
        case "update-admin":        if( _nameJson.length == 0 ) _nameJson = "administradores";

		case "newsecre":
        case "update-secre":        if( _nameJson.length == 0 ) _nameJson = "secretarios";

        case "newsuper":
        case "update-super":        if( _nameJson.length == 0 ) _nameJson = "supervisores";

        case "newcobra":
        case "update-cobra":        if( _nameJson.length == 0 ) _nameJson = "cobradores";

        case "newclien":
        case "update-clien":        if( _nameJson.length == 0 ) _nameJson = "clientes_filtrado";

            headerANDstruct.push(
                                    {
                                        switch: "SpanHeaderInputWithIcon",
                                        param: {
                                                    spanHeader: "Cédula de Identidad / Pasaporte",
                                                    placeHolder: "Cédula de Identidad / Pasaporte",
                                                    maxLength: 12,
                                                    identificador: "iden__cedula",
                                                    svg: "lupa.svg",
                                                    classSpecial: "searchID",
                                                    add_attributos_inputs: return_add_attributes( "cedula" ) + " data-digits='0'",
                                                    classFormats: "formatear"
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Indique el Nombre",
                                                    placeHolder: "Nombre",
                                                    maxLength: 30,
                                                    identificador: "iden__nombre",
                                                    classHiden: "hide",
                                                    add_attributos_inputs: return_add_attributes( "nombre" )
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Indique el Apellido",
                                                    placeHolder: "Apellido",
                                                    maxLength: 30,
                                                    identificador: "iden__apellido",
                                                    classHiden: "hide",
                                                    add_attributos_inputs: return_add_attributes( "apellido" )
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Teléfono de Contacto",
                                                    placeHolder: "000 0 000 0000000",
                                                    maxLength: 20,
                                                    identificador: "iden__telefono",
                                                    classHiden: "hide",
                                                    add_attributos_inputs: return_add_attributes( "telefono" )
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Correo Electrónico",
                                                    placeHolder: "ejemplo@brksystem.com",
                                                    maxLength: 100,
                                                    identificador: "iden__correo",
                                                    classHiden: "hide"
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Negocio",
                                                    placeHolder: "Local A-1",
                                                    maxLength: 100,
                                                    identificador: "iden__negocio",
                                                    classHiden: "hide"
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderInputWithIconAndModal",
                                        param: {
                                                    spanHeader: "Dirección de Habitación",
                                                    placeHolder: "ej.: 5ta Ave NY",
                                                    maxLength: 200,
                                                    identificador: "iden__direccion",
                                                    svg: "minimap.svg",
                                                    modalClass: "modal-span-btn minimap",
                                                    latlng: params[ 0 ] + "/" + params[ 1 ],
                                                    classHiden: "hide",
                                                    add_attributos_img: "data-selector='minimap'"
                                                }
                                    },
                                    {
                                        switch: "SpanHeaderSelectOption",
                                        param: {
                                                    spanHeader: "Indique Zona Horaria",
                                                    headerList: "Listado de Zonas Horarias",
                                                    identificador: "iden__zona_horaria",
                                                    selectOption: returnZonaHorarias( ),
                                                    classHiden: "hide"
                                                }
                                    }
                                );

			/* ******************************************************************************** */
			/* ******************************************************************************** */

			if( _nameJson === "cobradores" ) {
				headerANDstruct.push(
										{
											switch: "SpanHeaderSelectOption",
											param: {
														spanHeader: "Moneda de Trabajo",
														headerList: "Lista Monedas",
														identificador: "iden__moneda",
														selectOption: returnMonedas( ),
														classHiden: "hide"
													}
										},
										{
											switch: "SpanHeaderSelectOptionWithCheckBox",
											param: {
														spanHeader: "Intereses Permitidos",
														headerList: "Intereses",
														identificador: "iden__interes",
														selectOption: [
																			{ data: 5, text: "Interes 5%" },
																			{ data: 10, text: "Interes 10%" },
																			{ data: 15, text: "Interes 15%" },
																			{ data: 20, text: "Interes 20%" },
																			{ data: 25, text: "Interes 25%" },
																			{ data: 30, text: "Interes 30%" },
																			{ data: 35, text: "Interes 35%" },
																			{ data: 40, text: "Interes 40%" },
																			{ data: 45, text: "Interes 45%" },
																			{ data: 50, text: "Interes 50%" }
																	],
														classHiden: "hide"
													}
										},
										{
											switch: "SpanHeaderSelectOptionWithCheckBox",
											param: {
														spanHeader: "Cuotas Permitidas",
														headerList: "Cuotas",
														identificador: "iden__numero_cuotas",
														selectOption: [
																			{ data: 1, text: "1 Cuotas" },
																			{ data: 2, text: "2 Cuotas" },
																			{ data: 3, text: "3 Cuotas" },
																			{ data: 4, text: "4 Cuotas" },
																			{ data: 5, text: "5 Cuotas" },
																			{ data: 6, text: "6 Cuotas" },
																			{ data: 7, text: "7 Cuotas" },
																			{ data: 8, text: "8 Cuotas" },
																			{ data: 9, text: "9 Cuotas" },
																			{ data: 10, text: "10 Cuotas" },
																			{ data: 11, text: "11 Cuotas" },
																			{ data: 12, text: "12 Cuotas" },
																			{ data: 13, text: "13 Cuotas" },
																			{ data: 14, text: "14 Cuotas" },
																			{ data: 15, text: "15 Cuotas" },
																			{ data: 16, text: "16 Cuotas" },
																			{ data: 17, text: "17 Cuotas" },
																			{ data: 18, text: "18 Cuotas" },
																			{ data: 19, text: "19 Cuotas" },
																			{ data: 20, text: "20 Cuotas" },
																			{ data: 21, text: "21 Cuotas" },
																			{ data: 22, text: "22 Cuotas" },
																			{ data: 23, text: "23 Cuotas" },
																			{ data: 24, text: "24 Cuotas" },
																			{ data: 25, text: "25 Cuotas" },
																			{ data: 30, text: "30 Cuotas" },
																			{ data: 60, text: "60 Cuotas" },
																			{ data: 90, text: "90 Cuotas" },
																			{ data: 100, text: "100 Cuotas" },
																			{ data: 200, text: "200 Cuotas" },
																	],
														classHiden: "hide"
													}
										},
										{
											switch: "SpanHeaderInput",
											param: {
														spanHeader: "Límite De Préstamo",
														placeHolder: "0",
														maxLength: 12,
														identificador: "iden__limite_prestamo",
                                                        valueInput: "0",
                                                        add_attributos_inputs: return_add_attributes( "limite_prestamo" ) + " data-digits='0'",
														classHiden: "hide",
                                                        classFormats: "formatear"
													}
										},
										{
											switch: "SpanHeaderInput",
											param: {
														spanHeader: "Micro-Crédito C/100",
														placeHolder: "0,00",
														maxLength: 12,
														identificador: "iden__microcredito",
                                                        valueInput: "0,00",
                                                        add_attributos_inputs: return_add_attributes( "microcredito" ) + " data-digits='1'",
														classHiden: "hide",
                                                        classFormats: "formatear"
													}
										}
									);
			}

			if( _nameJson === "clientes_filtrado" ) {
                headerANDstruct.push(
                                        {
                                            switch: "SpanHeaderSelectOption",
                                            param: {
                                                        spanHeader: "Reputación como Pagador",
                                                        headerList: "Indique Status",
                                                        identificador: "iden__rendimiento",
                                                        selectOption: ( "Lista Blanca-100;Lista Negra-0" )
                                                                        .toString( )
                                                                        .split( ";" )
                                                                        .reduce( ( _addNew, _row ) => {
                                                                            _row = _row.split( "-" );
                                                                            _addNew.push({ data: _row[ 1 ], text: _row[ 0 ] });
                                                                            return _addNew;
                                                                        }, [ ]
                                                                    ),
                                                        classHiden: "hide pointer"
                                                    }
                                        }
                                    );
            }

			/* ******************************************************************************** */
			/* ******************************************************************************** */

            headerANDstruct.push(
                                    {
                                        switch: "OnlyButton",
                                        param: {
                                                    identificador: "iden__btnGuardar",
                                                    spanText: "Registrar Datos",
                                                    links: _link,
                                                    classHiden: "hide",
                                                    add_attributos_inputs: _extends_button
                                                }
                                    }
                                );

            if( _option !== "newclien" && _option !== "update-clien" )
                headerANDstruct.splice( 5, 1 );

            $focus = "#iden__cedula";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct, _link: _nameJson });

            if( _option.split( "-" )[ 0 ] !== "update" )
                autoSelect_zonaHoraria( );

            else {
                JData = dataJsonSegunClick({ _nameJson: _nameJson });
                iden__cedula.value = JData.cedula.data;
                iden__cedula.nextElementSibling.click( );

                _extends_button.split( ';' ).forEach( _sp => {
                    if( _sp !== '' )
                        iden__btnGuardar.setAttribute( `data-${ _sp }`, JData[ _sp ].data );
                });
            }

			if( !_m.empty( typeof iden__rendimiento ) ) {
				iden__rendimiento.dataset.select = 0;
				iden__rendimiento.dataset.val = 100;
				iden__rendimiento.textContent = "Lista Blanca";
			}

            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );

        break;
/* ************************************************************************************************************** */

		case "assign-user-admin":
        case "assign-user-secre":
        case "assign-user-super":
        case "assign-user-cobra":

			const $lastClick = generalJson.UltimoClick( );
			let showusuario = {
								switch: "SpanHeaderInputWithIcon",
								param: {
											spanHeader: "Usuario",
											placeHolder: "Usuario",
											maxLength: 30,
											identificador: "iden__usuario",
											svg: "lupa.svg",
											classSpecial: "searchID"
										}
							},
				showpass = {
								switch: "SpanHeaderInput",
								param: {
											spanHeader: "Contraseña",
											placeHolder: "Contraseña",
											maxLength: 20,
											identificador: "iden__contrasena",
											type: "password",
											classHiden: "hide"
										}
							},
				spanText = "Crear",
				_hide = "hide";

			/* ******************************************************************************** */
			/* ******************************************************************************** */

			if( $lastClick.dataset.selector === "update" ) {
				spanText = "Modificar";
				_hide = '';
				showpass.param.classHiden = _hide;

				showusuario.param.valueInput = dataJsonSegunClick({ _nameJson: 'usuarios' }).usuario.data;
                _extends_button = `data-usuario='${ showusuario.param.valueInput }'`;
                $focus = "#iden__contrasena";
			}

			/* ******************************************************************************** */
			/* ******************************************************************************** */

			headerANDstruct.push(
									showusuario,
									showpass,
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: spanText,
													links: _link,
													classHiden: _hide,
                                                    add_attributos_inputs: _extends_button
												}
									}
								);

            $focus = "#iden__usuario";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct });
            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );
		break;
/* ************************************************************************************************************** */

		case "newmoney":
			headerANDstruct.push(
									{
										switch: "SpanHeaderInput",
										param: {
													spanHeader: "Definir Moneda",
													placeHolder: "Nombre",
													maxLength: 100,
													identificador: "iden__moneda",
                                                    add_attributos_inputs: return_add_attributes( "nombre_moneda" )
												}
									},
									{
										switch: "SpanHeaderInput",
										param: {
													spanHeader: "Abreviatura",
													placeHolder: "Simbología",
													maxLength: 4,
													identificador: "iden__simbolo",
                                                    add_attributos_inputs: return_add_attributes( "abrev_moneda" )
												}
									},
									{
										switch: "SpanHeaderInput",
										param: {
													spanHeader: "Valor Cambiario vs Dolar",
													placeHolder: "0",
													maxLength: 10,
                                                    valueInput: "0",
													identificador: "iden__valor_cambiario",
                                                    add_attributos_inputs: return_add_attributes( "moneda" ) + " data-digits='1'",
                                                    classFormats: "formatear"
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Guardar Moneda"
												}
									}
								);

			$focus = "#iden__moneda";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct });
            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );
		break;
/* ************************************************************************************************************** */

        case "assignpresta":
            _nameJson = "prestamos";
			JData = generalJson.cobrador.collectors[ 0 ];
			_prefijo = JData.abrev_moneda.data;

			headerANDstruct.push(
									{
										switch: "SpanHeaderInputWithIcon",
										param: {
													spanHeader: "Monto a Prestar",
													placeHolder: `${ _prefijo }. 0`,
													valueInput: `${ _prefijo }. 0`,
													maxLength: ( 14 + _prefijo.length ),
													identificador: "iden__monto_prestado",
                                                    add_attributos_inputs: return_add_attributes( "prestamo", `${ _prefijo }. ` ) + " data-digits='0'",
                                                    classFormats: "formatear",
                                                    svg: "hand-card.svg",
                                                    classSpecial: "increase_credit"
												}
									},
									{
										switch: "SpanHeaderSelectOption",
										param: {
													spanHeader: "Intereses al",
													headerList: "Lista Intereses",
													identificador: "iden__interes",
													selectOption: ordenarConPrioridad( JData.interes.data.toString( ).split( ";" ) ).reduce( ( _addNew, _row ) => {  _addNew.push({ data: _row, text: _row == 0 ? "Sin Intereses" : `${ _row }% Interes` }); return _addNew; }, [ ] )
												}
									},
									{
										switch: "SpanHeaderSelectOption",
										param: {
													spanHeader: "Número de Cuotas",
													headerList: "Lista Cuotas",
													identificador: "iden__numero_cuotas",
													selectOption: ( JData.numero_cuotas.data + ";0" ).toString( ).split( ";" ).reduce( ( _addNew, _row ) => {  _addNew.push({ data: _row, text: _row == 0 ? "Personalizado" : `${ _row } Cuota(s)` }); return _addNew; }, [ ] )
												}
									},
									{
										switch: "SpanHeaderSelectOption",
										param: {
													spanHeader: "Intervalo de Tiempo",
													headerList: "Intervalos",
													identificador: "iden__intervalo_de_tiempo",
													selectOption: ( "Diario (1)-1;Semanal (7)-7;Quincenal (15)-15;Mensual (28)-28" )
                                                                    .toString( )
                                                                    .split( ";" )
                                                                    .reduce( ( _addNew, _row ) => {
                                                                        _row = _row.split( "-" );
                                                                        _addNew.push({ data: _row[ 1 ], text: _row[ 0 ] });
                                                                        return _addNew;
                                                                    }, [ ]
                                                                )
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Total A Cobrar",
													spanText: `${ _prefijo }. 0,00`,
													identificador: "iden__total_a_cobrar"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Entregar - Micro-Crédito",
													spanText: `${ _prefijo }. 0,00`,
													identificador: "iden__microcredito",
													classSpecial: "atencion"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Monto Cuota",
													spanText: `${ _prefijo }. 0,00`,
													identificador: "iden__monto_diario"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Fecha Inicio",
													spanText: "Fecha Inicio Automatizada",
													identificador: "iden__fecha_inicio"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Siguiente Visita",
													spanText: "Siguiente Visita Automatizada",
													identificador: "iden__siguiente_visita"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Fecha Límite",
													spanText: "Fecha Límite Automatizada",
													identificador: "iden__fecha_limite"
												}
									},
									{
										switch: "SpanHeaderTextArea",
										param: {
													spanHeader: "Observaciones",
													identificador: "iden__observaciones"
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Asignar Préstamo",
													links: _link,
                                                    add_attributos_inputs: `data-dda='0'`
												}
									}
								);

            if( datetime_available > 0 ) {
                headerANDstruct[ 7 ] = {
                                            switch: "SpanHeaderDateTime",
                                            param: {
                                                        spanHeader: "Fecha Inicio",
                                                        identificador: "iden__fecha_inicio"
                                                    }
                                        }
            }

			$focus = "#iden__monto_prestado";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct, _link: _nameJson });
            JData = infoClient_afterFilter( _link, false, "unico" );

            _extends_button.split( ';' ).forEach( _sp => {
                if( _sp !== '' )
                    iden__btnGuardar.setAttribute( `data-${ _sp }`, JData[ _sp ].data );
            });

            inc = iden__numero_cuotas.parentNode.nextElementSibling.querySelector( `li[data-select="0"]` );
            iden__numero_cuotas.dataset.select = 0;
            iden__numero_cuotas.dataset.val = inc.dataset.val;
            iden__numero_cuotas.textContent = inc.textContent;
			iden__numero_cuotas.parentNode.nextElementSibling.querySelector( "li[data-select='custom']" ).classList.add( "pointer" );

            din = iden__intervalo_de_tiempo.parentNode.nextElementSibling.querySelector( `li[data-select="0"]` );
            iden__intervalo_de_tiempo.dataset.select = 0;
            iden__intervalo_de_tiempo.dataset.val = din.dataset.val;
            iden__intervalo_de_tiempo.textContent = din.textContent;

            iin = iden__interes.parentNode.nextElementSibling.querySelector( `li[data-select="0"]` );
            iden__interes.dataset.select = 0;
            iden__interes.dataset.val = iin.dataset.val;
            iden__interes.textContent = iin.textContent;

            if( iden__fecha_inicio.tagName === "SPAN" )
                iden__fecha_inicio.textContent = getDate_Format_Name( _rawRequest.now.split( ' ' )[ 0 ] );

            else {
                iden__fecha_inicio.value = _rawRequest.now.split( ' ' )[ 0 ].split( '-' ).reverse( ).join( "-" );
                section.querySelector( "#iden__fecha_inicio" ).addEventListener( "change", async ( ) => {
                    iden__fecha_inicio.setAttribute( "data-change", iden__fecha_inicio.value.toString( ).split( "-" ).reverse( ).join( "-" ) );

                    if( iden__fecha_inicio.dataset.now !== iden__fecha_inicio.dataset.change )
                        iden__fecha_inicio.classList.add( "atencion" );
                    else
                        iden__fecha_inicio.classList.remove( "atencion" );

                    await calcularFecha( iden__numero_cuotas.dataset.val );
                });
            }

            iden__fecha_inicio.setAttribute( "data-now", _rawRequest.now.split( ' ' )[ 0 ] );
            iden__fecha_inicio.setAttribute( "data-change", _rawRequest.now.split( ' ' )[ 0 ] );

            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );

        break;
/* ************************************************************************************************************** */

		case "cuotas_pagadas":
            if( _nameJson.length == 0 ) _nameJson = "prestamos_cuotas";
		case "abonos_realizados":
            if( _nameJson.length == 0 ) _nameJson = "prestamos_abonos";

			let definePagar = { }, _classHiden = "";
            JData = _link;
			_prefijo = JData.abrev_moneda.data;

			/* ******************************************************************************** */
			/* ******************************************************************************** */
			if( _option === "abonos_realizados" ) {
				definePagar = {
								switch: "SpanHeaderInput",
								param: {
											spanHeader: "Monto a Pagar",
											placeHolder: `${ _prefijo }. 0,00`,
											valueInput: `${ _prefijo }. 0,00`,
                                            maxLength: ( 14 + _prefijo.length ),
											identificador: "iden__monto_pagar",
                                            add_attributos_inputs: return_add_attributes( "abonos", `${ _prefijo }. ` ) + " data-digits='1'",
                                            classFormats: "atencion formatear"
										}
							};

				_classHiden = "hide";
				$focus = "#iden__monto_pagar";
			}
			/* ******************************************************************************** */
			/* ******************************************************************************** */
			else {
				definePagar = {
								switch: "SpanHeaderSpanText",
								param: {
											spanHeader: "Monto a Pagar",
											spanText: `${ _prefijo }. 0`,
											identificador: "iden__monto_pagar",
											classSpecial: "atencion"
										}
							}

				_classHiden = "";
				$focus = "#iden__numero_cuotas";
			}
			/* ******************************************************************************** */
			/* ******************************************************************************** */

			headerANDstruct.push(
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnSwitch",
													spanText: "Cambiar Pantalla Cuotas / Abonos"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Deuda Actual",
                                                    spanText: `${ _prefijo }. 0`,
													identificador: "iden__deuda_actual"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Monto Cuota Actual",
                                                    spanText: `${ _prefijo }. 0,00`,
													identificador: "iden__monto_diario"
												}
									},
									{
										switch: "SpanHeaderSelectOption",
										param: {
													spanHeader: "Número de Cuotas",
													headerList: "Listado de Cuotas Posibles",
													identificador: "iden__numero_cuotas",
													selectOption: [ ],
													classHiden: _classHiden
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Intervalo de Días",
                                                    spanText: `Cuota Cada ${ JData.intervalo_de_tiempo.data } Día(s)`,
													identificador: "iden__intervalo_de_tiempo"
												}
									},
									definePagar,
									{
										switch: "SpanHeaderSelectOption",
										param: {
													spanHeader: "Forma de Pago",
													headerList: "Seleccione Metodo",
													identificador: "iden__metodo_pago",
													selectOption: ( "Efectivo;Transferencia" )
                                                                    .toString( )
                                                                    .split( ";" )
                                                                    .reduce( ( _addNew, _row ) => {
                                                                        _addNew.push({ data: _row, text: _row });
                                                                        return _addNew;
                                                                    }, [ ]
                                                                )
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Siguiente Visita",
													spanText: "Siguiente Visita Automatizada",
													identificador: "iden__siguiente_visita",
													classHiden: _classHiden
												}
									},
									{
										switch: "SpanHeaderTextArea",
										param: {
													spanHeader: "Observaciones",
													identificador: "iden__observaciones"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Deuda Posterior",
													spanText: "Monto Reflejado Automáticamente",
													identificador: "iden__deuda_posterior"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Cuotas Restantes",
													spanText: "0 Cuotas",
													identificador: "iden__cuotas_restantes",
													classHiden: _classHiden
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Cuota Posterior",
													spanText: "Monto Reflejado Automaticamente",
													identificador: "iden__monto_diario_posterior",
													classHiden: ( _classHiden.length === 0 ? "hide" : "" )
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Cargar Pago",
													links: JData.idp.data,
                                                    add_attributos_inputs: `data-nextDay='${ JData.siguiente_visita.data }' data-dda='${ JData.dias_de_atraso.data }'`
												}
									}
								);

            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct, _link: _nameJson });
            _extends_button.split( ';' ).forEach( _sp => {
                if( _sp !== '' )
                    iden__btnGuardar.setAttribute( `data-${ _sp }`, JData[ _sp ].data );
            });

            let cuotasRest = parseInt( JData.total_a_cobrar.data / JData.monto_diario.data );

            if( cuotasRest == 0 && _nameJson == "prestamos_cuotas" ) {
                Delete_Sections( true, true );
				eventClickNoData( 'No puede agregar mas Cuotas' );
				return;
            }

            iden__monto_pagar.setAttribute( "data-queue", cuotasRest );

            iden__deuda_actual.textContent = format_number( JData.total_a_cobrar.data, 1, `${ _prefijo }.` );
            iden__monto_diario.textContent = format_number( JData.monto_diario.data, 1, `${ _prefijo }.` );

            iden__intervalo_de_tiempo.setAttribute( "data-val", JData.intervalo_de_tiempo.data );
            iden__metodo_pago.dataset.select = 0;
            iden__metodo_pago.dataset.val = 1;
            iden__metodo_pago.textContent = "Efectivo";

            if( _classHiden.length === 0 ) {
                let numerocuotas = iden__numero_cuotas.parentNode.nextElementSibling;

                for( let x = 1; x <= cuotasRest && x <= 200; x++ ) {
                    numerocuotas.innerHTML += `<li class="select-nav__option select-nav__option-item" data-select="${ x - 1 }" data-val="${ x }">Cancelar ${ x } Cuota(s)</li>`;
                }

                iden__numero_cuotas.dataset.select = 0;
                iden__numero_cuotas.dataset.val = 1;
                iden__numero_cuotas.textContent = "Cancelar 1 Cuota(s)";
                iden__cuotas_restantes.textContent = cuotasRest + " Cuotas";
                iden__monto_pagar.textContent = iden__monto_diario.textContent;

                selectNavItem( iden__numero_cuotas );
            }
			else {
				iden__numero_cuotas.dataset.val = 0;
			}

            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );

            if( _option === "abonos_realizados" )
                $focus.setSelectionRange( $focus.value.length, $focus.value.length );

            $focus.focus( );
		break;
/* ************************************************************************************************************** */

		case "base_dia":
		case "capital":
            JData = _link;
			_prefijo = JData.abrev_moneda.data;

			headerANDstruct.push(
									{
										switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Monto a Inyectar",
                                                    placeHolder: `${ _prefijo }. 0,00`,
                                                    valueInput: `${ _prefijo }. 0,00`,
                                                    maxLength: ( 14 + _prefijo.length ),
                                                    identificador: "iden__monto_inyectar",
                                                    add_attributos_inputs: `${ return_add_attributes( _option, `${ _prefijo }. ` ) } data-digits='1' data-limit='${ JData.capital.data }' data-switch='${ _option }'`,
                                                    classFormats: "formatear"
                                                }
									},
									{
										switch: "SpanHeaderTextArea",
										param: {
													spanHeader: "Observaciones",
													identificador: "iden__observaciones"
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Cargar Base",
													links: JData.vac.data
												}
									}
								);

			$focus = "#iden__monto_inyectar";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct });
            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );
		break;
/* ************************************************************************************************************** */

		case "limite_prestamo":
            JData = _link;
			_prefijo = JData.abrev_moneda.data;

			headerANDstruct.push(
									{
										switch: "SpanHeaderInput",
                                        param: {
                                                    spanHeader: "Límite a Establecer",
                                                    placeHolder: `${ _prefijo }. 0`,
                                                    valueInput: `${ format_number( JData.limite_prestamo.data, 0, `${ _prefijo }. ` ) }`,
                                                    maxLength: ( 14 + _prefijo.length ),
                                                    identificador: "iden__limite_prestamo",
                                                    add_attributos_inputs: return_add_attributes( "limite_prestamo", `${ _prefijo }. ` ) + " data-digits='0'",
                                                    classFormats: "formatear"
                                                }
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Ajustar Límite de Préstamo",
													links: JData.vac.data,
                                                    add_attributos_inputs: `data-tb="${ JData.limite_prestamo.tb }" data-vcc="${ JData.hasOwnProperty( "vcc" ) ? JData.vcc.data : "N/A" }"`
												}
									}
								);

			$focus = "#iden__limite_prestamo";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct });
            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );
		break;
/* ************************************************************************************************************** */

        case "generarreport":
            if( _nameJson.length == 0 ) _nameJson = "reporte_online";
            let _property = "reporte" + ( _m.empty( $mainReport ) && _NV === "E" ? "_clon" : "" );

			_vac = ( _NV === "E" ) ? _link : _link.vac.data;

            dinamic_filter({
                _vac: _vac,
                _selector: _property,
                _name_base: _nameJson
            });

            JData = generalJson[ _property ].collectors[ 0 ];
			_prefijo = JData.abrev_moneda.data;

			/* ******************************************************************************** */
			/* ******************************************************************************** */
			if( _NV === "B" || _NV === "C" || _NV === "E" ) {
				elementGastos = {
									switch: "SpanHeaderSpanTextWithIconAndModal",
									param: {
												spanHeader: "Gastos",
												spanText: format_number( JData.gastos.data, 1, `${ _prefijo }. ` ),
												identificador: "iden__total_gastos",
                                                selector: "gastos",
												svg: "plus2.svg",
												modalClass: "modal-span-btn"
											}
								};
			}
			/* ******************************************************************************** */
			/* ******************************************************************************** */
			else {
				elementGastos = {
									switch: "SpanHeaderSpanText",
									param: {
												spanHeader: "Gastos",
												spanText: format_number( JData.gastos.data, 1, `${ _prefijo }. ` ),
												identificador: "iden__total_gastos"
											}
								};
			}

			headerANDstruct.push(
									{
										switch: "SpanHeaderDateTime",
										param: {
													spanHeader: "Reporte del Día",
													identificador: "iden__reporte_dia"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Estimado a Cobrar",
													spanText: format_number( JData.estimado_a_cobrar.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__estimado_a_cobrar"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Clientes con Pagos",
													spanText: `${ JData.total_clientes_cobrados.data } cliente(s) visitado(s) de ${ JData.total_clientes.data }`,
													identificador: "iden__clientes_con_pagos"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cobrado en Efectivo",
													spanText: format_number( JData.cobrado_en_efectivo.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__cobrado_en_efectivo",
                                                    selector: "cobrado_en_efectivo",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cobrado en Transferencia",
													spanText: format_number( JData.cobrado_en_transferencia.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__cobrado_en_transferencia",
                                                    selector: "cobrado_en_transferencia",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Total Cobrado",
													spanText: format_number( JData.total_cobrado.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_cobrado",
                                                    selector: "total_cobrado",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Ganancia en Intereses",
													spanText: format_number( JData.total_interes.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_interes"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Total Prestado",
													spanText: format_number( JData.total_prestado.data, 0, `${ _prefijo }. ` ),
													identificador: "iden__total_prestado",
                                                    selector: "total_prestado",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Micro-Crédito C/100",
                                                    spanText: format_number( JData.total_microcredito.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_microcredito"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cuentas Nuevas",
													spanText: format_number( JData.cuentas_nuevas.data, 0 ),
													identificador: "iden__cuentas_nuevas",
                                                    selector: "cuentas_nuevas",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cuentas Terminadas",
													spanText: format_number( JData.cuentas_terminadas.data, 0 ),
													identificador: "iden__cuentas_terminadas",
                                                    selector: "cuentas_terminadas",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Caja Anterior",
													spanText: format_number( JData.caja_anterior.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__caja_anterior"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Caja Actual",
                                                    spanText: format_number( JData.caja_actual.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__caja_actual"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Total Haber",
                                                    spanText: format_number( JData.efectivo_dia.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__efectivo_dia"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Suma Cartera",
                                                    spanText: format_number( JData.suma_cartera.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__suma_cartera"
												}
									},
									elementGastos,
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Base Del Día",
                                                    spanText: format_number( JData.base_dia.data, 0, `${ _prefijo }. ` ),
													identificador: "iden__base_dia"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Capital Ruta",
                                                    spanText: format_number( JData.capital.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__capital"
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGenerar",
													spanText: "Liquidar Todo"
												}
									}
								);

            if( _NV !== "B" && _NV !== "C" ) {
                headerANDstruct.splice( 17, 1 );
                headerANDstruct.splice( 14, 1 );
                headerANDstruct.splice( 6, 1 );
			}

            // if( _NV === "E" )
                headerANDstruct.pop( );

            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct, _link: "reporte" });

			_img = document.createElement( "IMG" );
			_img.src = "src/assets/excel.png";
			_img.setAttribute( "onclick", `_download( this )` );
			section.querySelector( "div.modal__title" ).appendChild( _img );

            if( _m.empty( $mainReport ) && _NV === "E" ) {
                $mainReport = document.importNode( section, true );
                $mainReport.classList.remove( "modal" );
                cleanContent( $main_view );
                Delete_Sections( true, true );

                $main_view.appendChild( $mainReport );
                $mainReport.querySelector( ".modal__controls" ).remove( );
                $mainReport.querySelector( ".modal__main-content" ).style
                            .setProperty(
                                'padding-top',
                                `35px`,
                                'important'
                            );

                $mainReport.querySelectorAll( `[id*="iden__"]` ).forEach( e => { e.setAttribute( "id", e.getAttribute( "id" ) + "_clon" ) });
                $mainReport.querySelector( "#iden__reporte_dia_clon" ).closest( "li" ).remove( );
				$mainReport.querySelector( ".modal__title-text" ).textContent = "Reporte On-Line";
                $mainReport.classList.add( "showModal" );
                generalJson.secuenciasClicks.push( null );
                generalJson.secuenciasEleccion.push( "liquidacion" );
                generalJson.sectionsDinamyc.push( $mainReport );
                generalJson.UltimaSeccion( ).dataset.link = "reporte_clon"
            }
            else {
				section.querySelector( "#iden__reporte_dia" ).value = _NOW.split( "-" ).reverse( ).join( "-" );
				section.querySelector( "#iden__reporte_dia" ).setAttribute( "data-hoy", _NOW.split( "-" ).reverse( ).join( "-" ) );
				section.querySelector( "#iden__reporte_dia" ).setAttribute( "onchange", "autoClickDate( );" );

				section.querySelector( "#iden__caja_actual" ).setAttribute( "data-vac", _vac );
				section.querySelector( "#iden__caja_actual" ).setAttribute( "data-abrev_moneda", _prefijo );
                section.classList.add( "showModal" );
			}

		break;
/* ************************************************************************************************************** */

        case "showreport":
            if( _nameJson.length == 0 ) _nameJson = "reporte_semanal";
            _vac = ( _NV === "E" ) ? _link : _link.vac.data;

            dinamic_filter({
                _vac: _vac,
                _selector: "reporte",
                _name_base: _nameJson
            });

            JData = sumatoria_semanal( generalJson.reporte.collectors );
			_prefijo = JData.abrev_moneda.data;

			headerANDstruct.push(
									{
										switch: "SpanHeaderDateTime",
										param: {
													spanHeader: "Fecha Desde",
													identificador: "iden__reporte_from"
												}
									},
									{
										switch: "SpanHeaderDateTime",
										param: {
													spanHeader: "Fecha Hasta",
													identificador: "iden__reporte_to"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cobrado en Efectivo",
													spanText: format_number( JData.cobrado_en_efectivo.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__cobrado_en_efectivo",
                                                    selector: "cobrado_en_efectivo",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cobrado en Transferencia",
													spanText: format_number( JData.cobrado_en_transferencia.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__cobrado_en_transferencia",
                                                    selector: "cobrado_en_transferencia",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Total Cobrado",
													spanText: format_number( JData.total_cobrado.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_cobrado",
                                                    selector: "total_cobrado",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Ganancia en Intereses",
													spanText: format_number( JData.total_interes.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_interes"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Total Prestado",
													spanText: format_number( JData.total_prestado.data, 0, `${ _prefijo }. ` ),
													identificador: "iden__total_prestado",
                                                    selector: "total_prestado",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Micro-Crédito C/100",
                                                    spanText: format_number( JData.total_microcredito.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__total_microcredito"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cuentas Nuevas",
													spanText: format_number( JData.cuentas_nuevas.data, 0 ),
													identificador: "iden__cuentas_nuevas",
                                                    selector: "cuentas_nuevas",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanTextWithIconAndModal",
										param: {
													spanHeader: "Cuentas Terminadas",
													spanText: format_number( JData.cuentas_terminadas.data, 0 ),
													identificador: "iden__cuentas_terminadas",
                                                    selector: "cuentas_terminadas",
													svg: "lupa.svg",
													modalClass: "modal-span-btn"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Caja Anterior",
                                                    spanText: format_number( JData.caja_anterior.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__caja_anterior"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Caja Actual",
                                                    spanText: format_number( JData.caja_actual.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__caja_actual"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Suma Cartera",
                                                    spanText: format_number( JData.suma_cartera.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__suma_cartera"
												}
									},
									{
                                        switch: "SpanHeaderSpanText",
                                        param: {
                                                    spanHeader: "Gastos",
                                                    spanText: format_number( JData.gastos.data, 1, `${ _prefijo }. ` ),
                                                    identificador: "iden__total_gastos"
                                                }
                                    },
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Base Del Día",
                                                    spanText: format_number( JData.base_dia.data, 0, `${ _prefijo }. ` ),
													identificador: "iden__base_dia"
												}
									},
									{
										switch: "SpanHeaderSpanText",
										param: {
													spanHeader: "Capital Ruta",
                                                    spanText: format_number( JData.capital.data, 1, `${ _prefijo }. ` ),
													identificador: "iden__capital"
												}
									}
								);

            if( _NV !== "B" && _NV !== "C" ) {
                headerANDstruct.splice( 15, 1 );
                headerANDstruct.splice( 12, 1 );
                headerANDstruct.splice( 5, 1 );
			}

			const ym = _NOW.split( "-" ).reverse( ).join( "-" );
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct, _link: "reporte" });
			section.querySelector( "#iden__reporte_from" ).value = dateToYMD( procesarDias( ym, equivalente( procesarDias( ym, 0 ).getDay( ) ) ) );
			section.querySelector( "#iden__reporte_from" ).setAttribute( "onchange", "autoClickDate( );" );

			section.querySelector( "#iden__reporte_to" ).value = ym;
			section.querySelector( "#iden__reporte_to" ).setAttribute( "onchange", "autoClickDate( );" );

			section.querySelector( "#iden__caja_actual" ).setAttribute( "data-vac", _vac );
			section.querySelector( "#iden__caja_actual" ).setAttribute( "data-abrev_moneda", _prefijo );

			_img = document.createElement( "IMG" );
			_img.src = "src/assets/excel.png";
			_img.setAttribute( "onclick", `_download( this )` );
			section.querySelector( "div.modal__title" ).appendChild( _img );

            section.classList.add( "showModal" );
		break;
/* ************************************************************************************************************** */

		case "gastos":
            if( _m.empty( generalJson.cobrador ) )
                JData = _link;
            else
                JData = generalJson.cobrador.collectors[ 0 ];

			_prefijo = JData.abrev_moneda.data;
			headerANDstruct.push(
									{
										switch: "SpanHeaderInput",
										param: {
													spanHeader: "Monto del Gasto",
													placeHolder: `${ _prefijo }. 0,00`,
													valueInput: `${ _prefijo }. 0,00`,
													maxLength: ( 14 + _prefijo.length + 2 ),
													identificador: "iden__monto_gastos",
                                                    add_attributos_inputs: return_add_attributes( "gastos", `${ _prefijo }. ` ) + " data-digits='1'",
                                                    classFormats: "formatear"
												}
									},
									{
										switch: "SpanHeaderTextArea",
										param: {
													spanHeader: "observaciones",
													identificador: "iden__observaciones"
												}
									},
									{
										switch: "OnlyButton",
										param: {
													identificador: "iden__btnGuardar",
													spanText: "Cargar Gasto",
													links: _link.vac.data
												}
									}
								);

			$focus = "#iden__monto_gastos";
            section = create_formDinamic({ _title: _title, headerANDstruct: headerANDstruct });
            section.classList.add( "showModal" );
            $focus = section.querySelector( $focus );
            $focus.setSelectionRange( $focus.value.length, $focus.value.length );
            $focus.focus( );
		break;
    }
}

function create_formDinamic({ _title, headerANDstruct, _link = '' }) {
    Create_Sections({ printForm: true, link: _link });
	const section = generalJson.UltimaSeccion( );
    let $HTML = '';

	section.querySelector( "h2.modal__title-text" ).textContent = _title;
	headerANDstruct.forEach( _new => {
		$HTML += createLIforms( _new.switch, _new.param );
	});

	const FormCustom = section.querySelector( "ul.FormCustom__Container" );
	FormCustom.innerHTML = $HTML;
    return section;
}

function autoSelect_zonaHoraria( ) {
    const izh = iden__zona_horaria.parentNode.nextElementSibling.querySelector( `li[data-select="${ _SZH }"]` );
    iden__zona_horaria.dataset.select = _SZH;
    iden__zona_horaria.dataset.val = izh.dataset.val;
    iden__zona_horaria.textContent = izh.textContent;
}

async function processFormDinamic( target ){
    let arraySave = { },
        latlng,
        codes,
        _opts = null,
        eleccion = generalJson.UltimaEleccion( );

    shownotificationMessage( true, "Espere mientras se Procesa la Información" );
    target.classList.add( "hide" );
    arraySave.insert = -1;
    arraySave.crearUsuario = 0;

    switch( eleccion ) {
        case "newadmin":
            if( _m.empty( _opts ) ) _opts = [ "admin", "Administrador" ];
        case "newsecre":
            if( _m.empty( _opts ) ) _opts = [ "secre", "Secretario" ];
        case "newsuper":
            if( _m.empty( _opts ) ) _opts = [ "super", "Supervisor" ];
        case "newcobra":
            if( _m.empty( _opts ) ) _opts = [ "cobra", "Cobrador" ];
        case "newclien":
            if( _m.empty( _opts ) ) _opts = [ "clien", "Cliente" ];

            if( arraySave.insert == -1 ) {
                arraySave.insert = 1;

                if( eleccion !== "newclien" )
                    arraySave.crearUsuario = 1;
            }
        case "update-admin":
        case "update-secre":
        case "update-super":
        case "update-cobra":
        case "update-clien":
            if( arraySave.insert == -1 )
                arraySave.insert = 0;

            codes = target.dataset.links;

            ///// STANDARD
                arraySave.vma = '';
                arraySave.vac = '';
                arraySave.vcc = '';
            ///// STANDARD

            if( iden__cedula.value.trim( ) === '' ) {
                shownotificationMessage( false, "Debe indicar una Cédula Válida" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__btnGuardar.dataset.cedula !== save_number( iden__cedula.value, 0 ).toString( ) ) {
                shownotificationMessage( false, "Ha modificado la Cédula. Vuelva a verificar Disponibilidad dando Click en la Lupa" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__nombre.value.trim( ) === '' ) {
                shownotificationMessage( false, "Debe indicar un Nombre Válido" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__apellido.value.trim( ) === '' ) {
                shownotificationMessage( false, "Debe indicar un Apellido Válido" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__zona_horaria.dataset.select === '' ) {
                shownotificationMessage( false, "Debe indicar una Zona Horaria Válida" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__correo.value.trim( ) !== '' && !comprobar_email( iden__correo.value.trim( ) ) ) {
                shownotificationMessage( false, "Formato del Correo Inválido. Ej. ejemplo@test.com" )
                target.classList.remove( "hide" );
                return;
            }
            if( eleccion === "newclien" || eleccion === "update-clien" ) {
                arraySave.negocio = primeraLetraMayuscula( iden__negocio.value.trim( ) );

                if( iden__rendimiento.dataset.val === '' ) {
                    shownotificationMessage( false, "Debe indicar el Status del Cliente" )
                    target.classList.remove( "hide" );
                    return;
                }

                arraySave.rendimiento = iden__rendimiento.dataset.val;
            }
            if( eleccion === "newcobra" || eleccion === "update-cobra" ) {
                let lp = save_number( iden__limite_prestamo.value, 1 );
                let mc = save_number( iden__microcredito.value, 1 );

                if( lp === 0 ) {
                    shownotificationMessage( false, "Debe suministrar un Límite de Préstamo Válido" )
                    target.classList.remove( "hide" );
                    return;
                }

                if( iden__moneda.dataset.select === '' ) {
                    shownotificationMessage( false, "Debe indicar una Moneda de Trabajo Válida" )
                    target.classList.remove( "hide" );
                    return;
                }

                arraySave.interes = '';
                iden__interes.parentNode.nextElementSibling.querySelectorAll( ".showElement" ).forEach( e => {
                    arraySave.interes += ( arraySave.interes.length === 0 ? '' : ";" ) + e.closest( "li" ).dataset.val;
                });

                if( arraySave.interes === '' ) {
                    shownotificationMessage( false, "Debe seleccionar en la Lista los Números de Cuotas Válidos" )
                    target.classList.remove( "hide" );
                    return;
                }

                arraySave.numero_cuotas = '';
                iden__numero_cuotas.parentNode.nextElementSibling.querySelectorAll( ".showElement" ).forEach( e => {
                    arraySave.numero_cuotas += ( arraySave.numero_cuotas.length === 0 ? '' : ";" ) + e.closest( "li" ).dataset.val;
                });

                if( arraySave.numero_cuotas === '' ) {
                    shownotificationMessage( false, "Debe seleccionar en la Lista los Números de Cuotas Válidos" )
                    target.classList.remove( "hide" );
                    return;
                }

                arraySave.limite_prestamo = lp;
                arraySave.microcredito = mc;
                arraySave.moneda = iden__moneda.dataset.val;
            }

            if( iden__btnGuardar.hasAttribute( "data-vma" ) )
                arraySave.vma = iden__btnGuardar.dataset.vma;

            if( iden__btnGuardar.hasAttribute( "data-vac" ) )
                arraySave.vac = iden__btnGuardar.dataset.vac;

            if( iden__btnGuardar.hasAttribute( "data-vcc" ) )
                arraySave.vcc = iden__btnGuardar.dataset.vcc;

            arraySave.cedula = save_number( iden__cedula.value, 0 );
            arraySave.nombre = primeraLetraMayuscula( iden__nombre.value.trim( ) );
            arraySave.apellido = primeraLetraMayuscula( iden__apellido.value.trim( ) );
            arraySave.telefono = iden__telefono.value.trim( );
            arraySave.correo = iden__correo.value.trim( );
            arraySave.direccion = primeraLetraMayuscula( iden__direccion.value.trim( ) );
            arraySave.zona_horaria = iden__zona_horaria.dataset.val;
            arraySave.zona_select = iden__zona_horaria.dataset.select;

            latlng = iden__direccion.nextElementSibling.dataset.latlng.split( "/" );
            arraySave.latitud = latlng[ 0 ];
            arraySave.longitud = latlng[ 1 ];

            arraySave.lastlink = !_m.empty( target.dataset.lastlink ) ? target.dataset.lastlink : '';
            arraySave.this = codes;
            arraySave.switch = generalJson.contenedorLI_Menu.dataset.link.substring( 0, 2 );

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        json => {
                            if( !json.existe ) {
                                if( arraySave.insert ) {
                                    _m.gotaGoogleMaps( "src/assets/user.jpg", true, json.unico );
                                    _m.gotaGoogleMaps( "src/assets/user.jpg", false, json.unico );
                                }
                                freezeClic = true;

                                setTimeout( ( ) => {
                                    Delete_Sections( );

                                    if( eleccion === "newclien" ) {
                                        generalJson.secuenciasClicks.push( null );
                                        generalJson.secuenciasEleccion.push( "assignpresta" );
                                        infoClient_afterFilter( json.unico, true, "unico" );

                                        if( arraySave.rendimiento == 0 )
                                            shownotificationMessage( false, "El cliente fue tachado en Lista Negra. Debe tener presente que generar un préstamo implicará un riesgo" );
                                    }
                                    else {
                                        if( arraySave.insert ) {
                                            freezeClic = false;

                                            if( arraySave.crearUsuario ) {
                                                const $temp = d.createElement( 'div' );
                                                $temp.setAttribute( "data-unico", json.unico );
                                                $temp.setAttribute( "data-selector", "assign" );
                                                $temp.setAttribute( "data-tb", "usuarios" );

                                                generalJson.secuenciasClicks.push( $temp );
                                                generalJson.secuenciasEleccion.push( "assign-user-" + _opts[ 0 ] );
                                                FormDinamic({ _link: $temp.dataset.unico, _title: `${ arraySave.nombre } ${ arraySave.apellido }: Asignación de Usuario ${ _opts[ 1 ] }`, _option: "assign-user-" + _opts[ 0 ] });

                                                iden__usuario.value = arraySave.nombre.replace( /\ /g, '' );
                                                iden__usuario.nextElementSibling.click( );
                                            }

                                            else
                                                generalJson.contenedorLI_Menu.querySelector( ".blocView__show" ).click( );
                                        }
                                        else
                                            loadCollectors( 0 );
                                    }

                                    freezeClic = false;
                                }, 1000 );

                                shownotificationMessage( true, arraySave.nombre + " " + arraySave.apellido + " fué registrado con éxito. Espere 3seg actualizará" );
                            }
                            else
                                shownotificationMessage( false, "No es Posible realizar el Registro. Hubo un Error con las Vinculaciones" );
                        }
                    );
        break;
/* ************************************************************************************************************** */

		case "assign-user-admin":
        case "assign-user-secre":
        case "assign-user-super":
        case "assign-user-cobra":
            const $lastClick = generalJson.UltimoClick( );

            arraySave.this = !_m.empty( $lastClick.closest( 'tr' ) )
									? $lastClick.closest( 'tr' ).dataset.unico
									: $lastClick.dataset.unico;
            arraySave.switch = "us";

            if( $lastClick.dataset.selector === "update" )
                arraySave.switch = "us-update";

            if( iden__btnGuardar.dataset.usuario !== iden__usuario.value ) {
                shownotificationMessage( false, "Ha modificado el Usuario. Vuelva a verificar Disponibilidad dando Click en la Lupa" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__contrasena.value.trim( ) === '' || iden__contrasena.value.length < 5 ) {
                shownotificationMessage( false, "Debe indicar un Contraseña Válido y mayor a 5 Dígitos" )
                target.classList.remove( "hide" );
                return;
            }

            arraySave.usuario = iden__usuario.value;
            arraySave.contrasena = iden__contrasena.value;
            arraySave.ref = generalJson.contenedorLI_Menu.dataset.link.substring( 0, 2 );

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                            ( ) => {
                                shownotificationMessage( true, arraySave.usuario + " fué registrado con éxito. Espere 3seg actualizará" );
                                Delete_Sections( );

                                if( arraySave.switch == "us-update" ) {
                                    cargarUsuarios( ).then( ( ) => {
                                        setTimeout( loadCollectors, 300, 0 );
                                    });
                                }
                            }
		            );
        break;
/* ************************************************************************************************************** */

		case "newmoney":
            if( iden__moneda.value.trim( ) === '' ) {
                shownotificationMessage( false, "No ha definido un Nombre Válido para la Nueva Moneda" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__simbolo.value.trim( ) === '' ) {
                shownotificationMessage( false, "Debe indicar un Símbolo o Abreviatura Válida" )
                target.classList.remove( "hide" );
                return;
            }
            if( iden__valor_cambiario.value.trim( ) === '' ) {
                shownotificationMessage( false, "Especifique el valor Cambiario referente al Dolar ($)" )
                target.classList.remove( "hide" );
                return;
            }
            if( !generalJson.monedas.collectors.every( e => {  if( e.nombre.data.toUpperCase( ) === iden__moneda.value.trim( ).toUpperCase( ) ) return false; return true; } ) ) {
                shownotificationMessage( false, "Nombre de la Moneda ya existe" )
                target.classList.remove( "hide" );
                return;
            }

            arraySave.moneda = primeraLetraMayuscula( iden__moneda.value.trim( ) );
            arraySave.simbolo = iden__simbolo.value.trim( );
            arraySave.valor_cambiario = save_number( iden__valor_cambiario.value, 1 );

            arraySave.this = "NA";
            arraySave.switch = "mo";

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                            ( ) => {
                                shownotificationMessage( true, `Moneda ${ arraySave.moneda } ( ${ arraySave.simbolo } ) fué registrada con éxito. Espere 3seg actualizará` );
                                Delete_Sections( );

                                setTimeout( ( ) => {
                                    generalJson.contenedorLI_Menu.querySelector( ".blocView__show" ).click( );
                                }, 1000 );
                            }
		            );

        break;
/* ************************************************************************************************************** */

        case "assignpresta":
            let mp = save_number( iden__monto_prestado.value, 1 );
            arraySave.status = iden__btnGuardar.dataset.status ?? "-";

            if( mp == 0 ) {
                shownotificationMessage( false, "El monto indicado no es Válido" )
                target.classList.remove( "hide" );
                return;
            }

			if ( ( now_sumcredits + mp ) > now_limitcredit && arraySave.status == "-" ) {
				shownotificationMessage( false, "El monto a prestar supera el límite establecido, debe solicitar un aumento de crédito" )
				target.classList.remove( "hide" );
                return;
			}

			if ( save_number( iden__monto_diario.textContent, 1 ) % 1 != 0 ) {
				shownotificationMessage( false, "El monto prestado genera cuotas con decimales, use montos precisos" )
                //target.classList.remove( "hide" );
				iden__monto_diario.classList.add( "atencion" );
                //return;
			}

            if( iden__btnGuardar.hasAttribute( "data-vma" ) )
                arraySave.vma = iden__btnGuardar.dataset.vma;

            if( iden__btnGuardar.hasAttribute( "data-vac" ) )
                arraySave.vac = iden__btnGuardar.dataset.vac;

            if( iden__btnGuardar.hasAttribute( "data-vcc" ) )
                arraySave.vcc = iden__btnGuardar.dataset.vcc;

            if( iden__btnGuardar.hasAttribute( "data-unico" ) )
                arraySave.this = iden__btnGuardar.dataset.unico;

            if( iden__btnGuardar.hasAttribute( "data-idm" ) )
                arraySave.idm = iden__btnGuardar.dataset.idm;

            latlng = _m.getAll( );
            arraySave.latitud = latlng[ 0 ];
            arraySave.longitud = latlng[ 1 ];

            arraySave.monto_prestado = mp;
            arraySave.observaciones = iden__observaciones.value;
            arraySave.numero_cuotas = save_number( iden__numero_cuotas.dataset.val, 1 );
            arraySave.interes = save_number( iden__interes.dataset.val, 1 );
            arraySave.fecha_inicio = iden__fecha_inicio.dataset.change.split( "-" ).reverse( ).join( "-" );
            arraySave.fecha_distinta = iden__fecha_inicio.classList.contains( "atencion" );
            arraySave.intervalo_de_tiempo = save_number( iden__intervalo_de_tiempo.dataset.val, 1 );
            arraySave.vac = _VAC;
            arraySave.switch = "pr";
            datetime_available = datetime_available - ( arraySave.fecha_distinta ? 1 : 0 );

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        async ( ) => {
                            const JData = generalJson.clientes.collectors.filter( e => { return e.unico.data === iden__btnGuardar.dataset.unico })[ 0 ];
                            const mensaje = `Solicito Ajuste Crediticio de <b>${ iden__monto_prestado.value }</b> para <b>${ JData.nombre_completo.data }</b> con Cédula de Identidad <b>${ format_number( JData.cedula.data, 0 ) }</b>, su Límite actual es de <b>${ format_number( JData.limite_prestamo.data, 0, `${ JData.abrev_moneda.data }. ` ) }</b> por favor, notifiqueme de ser sí o no el cambio solicitado `;
                            const class_atencion = iden__monto_prestado.classList.contains( "atencion" );

                            shownotificationMessage( true, 'Préstamo cargado en Sistema Exitósamente' );
                            Delete_Sections( );

                            if( generalJson.sectionsDinamyc.length > 1 )
								execute_search( );
							else {
								setTimeout( ( ) => {
									cargarPrestamos({
											"vigentes": true,
											filtrar: false,
											vac_vcc: [{ vac: JData.vac.data, vcc: JData.vcc.data }]
									}).then( jsonLoan => {
										Show_Table({ _title: "Préstamos de: " + JData.nombre_completo.data, _option: 'show-prestamos-vigentes' });
									});
								}, 1000 );
							}

                            if( class_atencion ) {
                                arraySave = {
                                    fromCobra: 1,
                                    idp: -1,
                                    para: _adse.join( '*' ),
                                    this: _THIS,
                                    usu: _USU,
                                    mensaje: encodeURI( mensaje ),
                                    vcc: '',
                                    monto: 0
                                };

                                if( _AD_CALL.length > 0 ) {
                                    sendsms.setAttribute( "href", `https://wa.me/${ _AD_CALL }?text=${ arraySave.mensaje }`);
                                    sendsms.click( );
                                }

                                arraySave.mensaje += `<a class="abrirSolicitudes">ver</a>`;
                                arraySave.switch = "sendChat";
                            
                                await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                                        .then( ( ) => {
                                            shownotificationMessage( true, `Información enviada con Éxito` );
                            
                                            if( arraySave.idp !== -1 )
                                                setTimeout( loadCollectors, 1000, 0 );
                                        } );
                            }
                        }
                    );

        break;
/* ************************************************************************************************************** */

        case "cuotas_pagadas":
        case "abonos_realizados":
			latlng = _m.getAll( );
            arraySave.latitud = latlng[ 0 ];
            arraySave.longitud = latlng[ 1 ];

            if( iden__monto_pagar.tagName == "INPUT" )
                arraySave.monto_pagar = save_number( iden__monto_pagar.value, 1 );
            else
                arraySave.monto_pagar = save_number( iden__monto_pagar.textContent, 1 );

            if( arraySave.monto_pagar == 0 ) {
                shownotificationMessage( false, "El monto a pagar no es Válido" )
                target.classList.remove( "hide" );
                return;
            }

            if( iden__metodo_pago.dataset.val == "" ) {
                shownotificationMessage( false, "Debe indicar el Método de Pago a realizar" )
                target.classList.remove( "hide" );
                return;
            }

            arraySave.numero_cuotas = save_number( iden__numero_cuotas.dataset.val, 1 );
            arraySave.monto_diario = save_number( iden__monto_diario.textContent, 1 );
            arraySave.metodo_pago = iden__metodo_pago.dataset.val;
            arraySave.observaciones = iden__observaciones.value;
            arraySave.monto_diario_posterior = save_number( iden__monto_diario_posterior.textContent, 1 );
            arraySave.deuda_posterior = save_number( iden__deuda_posterior.textContent, 1 );

            arraySave.this = target.dataset.links;
            arraySave.switch = eleccion;

			const JData = generalJson.prestamos.collectors.filter(
				e => {
					return  e.vcc.data === iden__btnGuardar.dataset.vcc &&
							e.idp.data === iden__btnGuardar.dataset.links
				})[ 0 ];
			JData.total_a_cobrar.data -= arraySave.monto_pagar;

            arraySave.vac = JData.vac.data;
            arraySave.vcc = JData.vcc.data;

			await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            shownotificationMessage( true, 'Pago registrado con Éxito' );
							const $_ta = generalJson.UltimoClick( ).closest( "tr" ).dataset;
							Delete_Sections( );

							setTimeout( ( ) => {
								cargarPrestamos({
										"vigentes": true,
										filtrar: false,
										vac_vcc: [{ vac: $_ta.vac, vcc: $_ta.vcc }]
								}).then( jsonLoan => {
									if( jsonLoan.length == 0 )
										Delete_Sections( );

									if( generalJson.UltimaSeccion( ).dataset.form === "N" )
										loadCollectors( 0 );
								});
							}, 1000 );
                        }
                    );
        break;
/* ************************************************************************************************************** */

        case "base_dia":
        case "capital":
            arraySave.monto_inyectar = save_number( iden__monto_inyectar.value, 1 )

            if( arraySave.monto_inyectar == 0 ) {
                shownotificationMessage( false, "El monto de Capital/Base no es Válido" )
                target.classList.remove( "hide" );
                return;
            }

			arraySave.diario = ( eleccion === "capital" ? 0 : 1 );
            arraySave.observaciones = iden__observaciones.value;
            arraySave.this = target.dataset.links;
            arraySave.switch = "in";

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            shownotificationMessage( true, 'Capital/Base agregada con Éxito' );
                            Delete_Sections( );
                            setTimeout( loadCollectors, 1000, 0 );
                        }
                    );
        break;
/* ************************************************************************************************************** */

        case "limite_prestamo":
            arraySave.limite_prestamo = save_number( iden__limite_prestamo.value, 1 );

            if( arraySave.limite_prestamo == 0 ) {
                shownotificationMessage( false, "El Límite indicado no es Válido" )
                target.classList.remove( "hide" );
                return;
            }

            arraySave.this = target.dataset.links;
            arraySave.vcc = target.dataset.vcc;
            arraySave.tb = target.dataset.tb;
            arraySave.switch = "lp";

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            let $uc_clien = generalJson.UltimoClick( ), _limitNow = iden__limite_prestamo.value;

                            shownotificationMessage( true, 'Límite ajustado con Éxito' );
                            if( arraySave.tb !== "global_monedas" )
								dataJsonSegunClick({ _nameJson: 'clientes_filtrado', $element: $uc_clien.closest( 'tr' ) })
									.limite_prestamo.data = arraySave.limite_prestamo;

                            Delete_Sections( );
                            setTimeout( loadCollectors, 500, 0 );

                            if( generalJson.UltimaEleccion( ) === "clientes_filtrado"
                             || generalJson.UltimaEleccion( ) === "clientes" )
                                increaseCredit({
                                    $target: $uc_clien,
                                    jsonCobra: dataJsonSegunClick({ _nameJson: 'cobradores' }),
                                    _limitNow: _limitNow
                                });
                        }
                    );
        break;
/* ************************************************************************************************************** */

        case "gastos":
            arraySave.monto_gastos = save_number( iden__monto_gastos.value, 1 );

            if( arraySave.monto_gastos == 0 ) {
                shownotificationMessage( false, "El monto indicado no es Válido" )
                target.classList.remove( "hide" );
                return;
            }

            arraySave.observaciones = iden__observaciones.value;

            arraySave.this = target.dataset.links;
            arraySave.switch = "out";

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            shownotificationMessage( false, 'Procesando Información' );

                            setTimeout( ( )=> {
                                shownotificationMessage( true, 'Gasto agregado con Éxito' );
                                Delete_Sections( );
                                const uc = generalJson.UltimoClick( );
                                Delete_Sections( );
                                uc?.click( );
                            }, 1000 );
                        }
                    );

        break;
/* ************************************************************************************************************** */

        case "liquidacion":
        case "generarreport":
            arraySave.this = _VAC;
            arraySave.switch = "liquidar";

            await _m._lets( `src/php/SetInformationBase.php`, arraySave )
                    .then(
                        ( ) => {
                            shownotificationMessage( false, 'Liquidación Procesada' );
                        }
                    );

        break;
    }
}