function Show_Table({ _title = '', _option = undefined }) {
	let headerANDstruct = [ ],
		rows,
		_nameJson = '';

	switch( _option ) {
		case "showadmin":				if( _nameJson.length == 0 ) _nameJson = "administradores";
		case "showsecre":				if( _nameJson.length == 0 ) _nameJson = "secretarios";
		case "showsuper":				if( _nameJson.length == 0 ) _nameJson = "supervisores";
		case "showcobra":
		case "showsupervisar":			if( _nameJson.length == 0 ) _nameJson = "cobradores";

		case "clientes_filtrado":
		case "assignpresta":			if( _nameJson.length == 0 ) _nameJson = "clientes_filtrado";

		case "generarreport":
		case "showreport":				if( _nameJson.length == 0 ) _nameJson = "cobradores";

			rows = generalJson[ _nameJson ].registros;

			if( rows == 0 ) {
                Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
            }

			resetearCollectors( _nameJson );
			sortByKey( generalJson[ _nameJson ].collectors, "nombre_completo" );
			headerANDstruct[ "header" ] = [ '#', '', "Nombre", "Teléfono", "", "", "", "", "", "", "", "" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"minimap",
																	"gallery",
																	"update",
																	"delete",
																	"expand"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithIcon": {
																		datacol: "telefono",
																		class: "telefono",
																		icono: listenerPhone ? "phone.svg" : '',
																		twocols: listenerPhone
																	}
											},
											{ }, // dinamyc  4 => "Clientes"
											{ }, // dinamyc  5 => "Préstamos Vigentes"
											{ }, // dinamyc  6 => "Préstamos Pagados"
											{ }, // dinamyc  7 => "Límite Préstamo"
											{ }, // dinamyc  8 => "Capital Ruta"
											{ }, // dinamyc  9 => "Base Del Día"
											{
												"ColumnTextWithIconAndModal": {
																				datacol: "assignpresta",
																				class: "assignpresta",
																				modalClass: "modal-span-btn",
																				icono: "plus2.svg",
																				twocols: false
																			}
											},
											{ }  // dinamyc 11 => "Habilitar Calendario"
										];

			/* **** P R I V I L E G I O S **************** */
				if( _nameJson === "cobradores"
				 || _nameJson === "clientes_filtrado"
				 || _option === "assignpresta"
				 || _option === "generarreport"
				 || _option === "showreport" ) {

					headerANDstruct[ "header" ][ 5 ] = "Préstamos Vigentes";
					headerANDstruct[ "header" ][ 6 ] = "Préstamos Pagados";

					if( _option !== "showsupervisar" )
						headerANDstruct[ "header" ][ 7 ] = "Límite Préstamo";
					else
						headerANDstruct[ "header" ][ 7 ] = "Supervisar";

					headerANDstruct[ "header" ][ 10 ] = "Asignar Prestamo";

					if( _option === "generarreport"
					 || _option === "showreport" ) {
						headerANDstruct[ "header" ][ 4 ] = "Generar Reporte";
						headerANDstruct[ "header" ].splice( 5, 7 );
					}
					else {
						if( _nameJson === "cobradores" ) {
							headerANDstruct[ "header" ][ 4 ] = "Clientes";

							if( _option !== "showsupervisar" ) {
								headerANDstruct[ "header" ][ 8 ] = "Capital Ruta";
								headerANDstruct[ "header" ][ 9 ] = "Inyección Base";
							}

							headerANDstruct[ "header" ][ 11 ] = "Habilitar Calendario";

							if( _NV === "D" )
								headerANDstruct[ "header" ].splice( 11, 1 );

							headerANDstruct[ "header" ].splice( 10, 1 );

							if( _option === "showsupervisar" )
								headerANDstruct[ "header" ].splice( 8, 2 );
						}
						else {
							headerANDstruct[ "header" ].splice( 11, 1 );

							if( _NV !== "E" || generalJson.UltimoClick( ).classList.contains( "negra" ) )
								headerANDstruct[ "header" ].splice( 10, 1 );

							headerANDstruct[ "header" ].splice( 8, 2 );
							headerANDstruct[ "header" ].splice( 4, 1 );
						}
					}
				}
				else 
					headerANDstruct[ "header" ].splice( 4, 8 );

			/* **** F I N   P R I V I L E G I O S ******** */

			/* **** P R I V I L E G I O S **************** */
				if( _nameJson !== "clientes_filtrado" ) {
					if( _NV === "C" || _NV === "D" )
						headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 2, 2 );
				}
				else if( _NV !== "E" )
						headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 2, 2 );

				if( _nameJson === "cobradores"
				 || _nameJson === "clientes_filtrado"
				 || _option === "assignpresta"
				 || _option === "generarreport"
				 || _option === "showreport" ) {

					if( _option === "generarreport"
					 || _option === "showreport" ) {
						headerANDstruct[ "struct" ][ 4 ] = {
																"ColumnTextWithIconAndModal": {
																								datacol: _option,
																								class: _option,
																								modalClass: "modal-span-btn",
																								icono: "lupa.svg",
																								twocols: false
																							}
															};

						headerANDstruct[ "struct" ].splice( 5, 7 );
					}
					else {
						if( _option !== "showsupervisar" ) {
							if( _NV === "B" || _NV === "C" ) {
								headerANDstruct[ "struct" ][ 7 ] = {
																		"ColumnTextWithIconAndModal": {
																									datacol: "limite_prestamo",
																									class: "limite_prestamo formatear",
																									modalClass: "modal-span-btn",
																									formatDigits: "data-digits='0'",
																									icono: "update.svg",
																									twocols: true
																								}
																	};
							}
							else {
								headerANDstruct[ "struct" ][ 7 ] = {
																		"ColumnTextWithoutIcon": {
																									datacol: "limite_prestamo",
																									class: "limite_prestamo formatear",
																									formatDigits: "data-digits='0'"
																								}
																	}
							}

							if( _NV === "B" ) {
								headerANDstruct[ "struct" ][ 8 ] = {
																		"ColumnTextWithIconAndModal": {
																									datacol: "capital",
																									class: "capital formatear",
																									modalClass: "modal-span-btn",
																									formatDigits: "data-digits='1'",
																									icono: "update.svg",
																									twocols: true
																								}
																	};
							}
							else {
								headerANDstruct[ "struct" ][ 8 ] = {
																		"ColumnTextWithoutIcon": {
																									datacol: "capital",
																									class: "capital formatear",
																									formatDigits: "data-digits='1'"
																								}
																	}
							}

							if( _NV === "B" || _NV === "C" ) {
								headerANDstruct[ "struct" ][ 9 ] = {
																		"ColumnTextWithIconAndModal": {
																									datacol: "base_dia",
																									class: "base_dia formatear",
																									modalClass: "modal-span-btn",
																									formatDigits: "data-digits='0'",
																									icono: "update.svg",
																									twocols: true
																								}
																	};
							}
							else {
								headerANDstruct[ "struct" ][ 9 ] = {
																		"ColumnTextWithoutIcon": {
																									datacol: "base_dia",
																									class: "base_dia formatear",
																									formatDigits: "data-digits='0'"
																								}
																	}
							}
						}
						else
							headerANDstruct[ "struct" ][ 7 ] = {
																	"ColumnTextWithIconAndModal": {
																								datacol: _option,
																								class: _option,
																								modalClass: "modal-span-btn",
																								icono: "lupa.svg",
																								twocols: false
																							}
																};

						headerANDstruct[ "struct" ][ 5 ] = {
																"ColumnTextWithIconAndModal": {
																								datacol: "prestamos_vigentes",
																								class: "prestamos_vigentes formatear",
																								modalClass: "modal-span-btn",
																								formatDigits: "data-digits='0'",
																								icono: ( _option === "assignpresta" ? "plus2" : "lupa" ) + ".svg",
																								twocols: true
																							}
															};

						headerANDstruct[ "struct" ][ 6 ] = {
																"ColumnTextWithIconAndModal": {
																								datacol: "prestamos_pagados",
																								class: "prestamos_pagados formatear",
																								modalClass: "modal-span-btn",
																								formatDigits: "data-digits='0'",
																								icono: "lupa.svg",
																								twocols: true
																							}
															};

						if( _nameJson === "cobradores" ) {
							headerANDstruct[ "struct" ][ 4 ] = {
																	"ColumnTextWithIconAndModal": {
																									datacol: "clientes",
																									class: "clientes formatear",
																									modalClass: "modal-span-btn",
																									formatDigits: "data-digits='0'",
																									icono: "lupa.svg",
																									twocols: true
																								}
																};

							headerANDstruct[ "struct" ][ 11 ] = {
																	"SpanHeaderSelectOption": {
																								headerList: "¿Cuantos?",
																								datacol: "datetime_available",
																								class: "datetime_available",
																								selectOption: [
																												{ text: "0" }, { text: "1" },
																												{ text: "2" }, { text: "3" },
																												{ text: "4" }, { text: "5" },
																												{ text: "10" }, { text: "25" },
																												{ text: "50" }, { text: "100" }
																											],
																								twocols: false
																							}
																};

							if( _NV === "D" )
								headerANDstruct[ "struct" ].splice( 11, 1 );

							headerANDstruct[ "struct" ].splice( 10, 1 );
						}
						else {
							headerANDstruct[ "struct" ].splice( 11, 1 );

							if( _NV !== "E" || generalJson.UltimoClick( ).classList.contains( "negra" ) )
								headerANDstruct[ "struct" ].splice( 10, 1 );

							headerANDstruct[ "struct" ].splice( 8, 2 );
							headerANDstruct[ "struct" ].splice( 4, 1 );
						}
					}
				}
				else
					headerANDstruct[ "struct" ].splice( 4, 8 );

			switch( _option ) {
				case "showadmin":
				case "showsecre":
				case "showsuper":
				case "showcobra":
					headerANDstruct[ "header" ].push( "Bloquear" );
					headerANDstruct[ "struct" ].push({
														"ColumnTextWithIcon": {
																				datacol: "detalle_bloqueo",
																				class: "detalle_bloqueo",
																				icono: "lock.svg",
																				twocols: true
																			}
													});

				break;
			}

			/* **** F I N   P R I V I L E G I O S ******** */

			headerANDstruct[ "struct_hide" ] = [
													{
														li: "Cédula de Identidad:",
														class: "cedula formatear",
														formatDigits: "data-digits='0'"
													},
													{
														li: "Correo Electrónico:",
														class: "correo"
													},
													{
														li: "Dirección de Habitación:",
														class: "direccion"
													},
													{
														li: "Región Horaria:",
														class: "region_horaria"
													}
												];

			if( _nameJson == "clientes_filtrado" )
				headerANDstruct[ "struct_hide" ].push(
														{
															li: "Negocio / Local:",
															class: "negocio"
														}
													);

			if( _nameJson === "administradores" )
				headerANDstruct[ "struct_hide" ].push(
														{
															li: "Secretarios Registrados:",
															class: "secretarios formatear",
															formatDigits: "data-digits='0'"
														},
														{
															li: "Supervisores Registrados:",
															class: "supervisores formatear",
															formatDigits: "data-digits='0'"
														},
														{
															li: "Cobradores Registrados:",
															class: "cobradores formatear",
															formatDigits: "data-digits='0'"
														},
														{
															li: "Clientes Registrados:",
															class: "clientes formatear",
															formatDigits: "data-digits='0'"
														}
													);

			if( _nameJson === "cobradores" )
				headerANDstruct[ "struct_hide" ].push(
														{
															li: "Moneda de Trabajo: ",
															class: "moneda"
														},
														{
															li: "Intereses Permitidos: ",
															class: "interes formatear",
															formatDigits: "data-digits='0'"
														},
														{
															li: "Cuotas Permitidas: ",
															class: "numero_cuotas"
														}
													);

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: true,
										_struct_hide: headerANDstruct.struct_hide,
										_link: _nameJson // NAME INDEX ARRAY OBJECT
									});
		break;
/* ************************************************************************************************************** */

		case "useradmin":		if( _nameJson.length == 0 ) _nameJson = "administradores";
		case "usersecre":		if( _nameJson.length == 0 ) _nameJson = "secretarios";
		case "usersuper":		if( _nameJson.length == 0 ) _nameJson = "supervisores";
		case "usercobra":		if( _nameJson.length == 0 ) _nameJson = "cobradores";

			rows = generalJson[ _nameJson ].registros;

			if( rows == 0 ) {
                Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
            }

			resetearCollectors( _nameJson );
			headerANDstruct[ "header" ] = [ '#', '', "Cédula", "Nombre", "Crear Usuario", "Listar Usuarios" ];

			/* **** P R I V I L E G I O S **************** */
				if( _NV === "C" || _NV === "D" )
					headerANDstruct[ "header" ].splice( 3, 1 );
			/* **** F I N   P R I V I L E G I O S ******** */

			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"gallery"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithIconAndModal": {
																				datacol: "assign",
																				class: "assign",
																				icono: "plus.svg",
																				modalClass: "modal-span-btn",
																				twocols: false
																			}
											},
											{
												"ColumnTextWithIconAndModal": {
																				datacol: "list",
																				class: "list",
																				icono: "lupa.svg",
																				modalClass: "modal-span-btn",
																				twocols: false
																			}
											}
										];

			/* **** P R I V I L E G I O S **************** */
				if( _NV === "C" || _NV === "D" )
					headerANDstruct[ "struct" ].splice( 4, 1 );
			/* **** F I N   P R I V I L E G I O S ******** */

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: _nameJson
									});

		break;
/* ************************************************************************************************************** */

		case "list-user-admin":
		case "list-user-secre":
		case "list-user-super":
		case "list-user-cobra":

			cargarUsuarios( ).then( jsonLoan => {
				rows = jsonLoan.length;

				if( rows == 0 ) {
					Delete_Sections( true, false );
					eventClickNoData( '' );
					return;
				}

				resetearCollectors( "usuarios" );
				headerANDstruct[ "header" ] = [ '#', '', "Usuario", "Contraseña" ];
				headerANDstruct[ "struct" ] = [
												{
													"ColumnTextWithoutIcon": {
																				datacol: "indice",
																				class: "indice formatear",
																				formatDigits: "data-digits='0'"
																			}
												},
												{
													"ColumnOnlyIcon": [
																		"update",
																		"delete"
																	]
												},
												{
													"ColumnTextWithoutIcon": {
																				datacol: "usuario",
																				class: "usuario"
																			}
												},
												{
													"ColumnTextWithoutIcon": {
																				datacol: "contrasena",
																				class: "contrasena"
																			}
												}
											];

				/* **** P R I V I L E G I O S **************** */
					if( _NV === "C" || _NV === "D" )
						headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 1, 1 );
				/* **** F I N   P R I V I L E G I O S ******** */

				procesar_listarCollectors({
											_title: _title,
											_rows: rows,
											_header: headerANDstruct.header,
											_struct: headerANDstruct.struct,
											_row_hide: false,
											_link: "usuarios"
										});
			});
		break;
/* ************************************************************************************************************** */

		case "showmoney":
			rows = generalJson.monedas.length;

			if( rows == 0 ) {
				Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
			}

			resetearCollectors( "monedas" );
			headerANDstruct[ "header" ] = [ '#', "Nombre", "Abreviatura", "Valor Cambiario vs Dolar ($)" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre",
																			class: "nombre"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "abrev_moneda",
																			class: "abrev_moneda"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "valor_cambiario",
																			class: "valor_cambiario formatear",
																			formatDigits: "data-digits='1'"
																		}
											}
										];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: "monedas"
									});

		break;
/* ************************************************************************************************************** */

		case "show-prestamos-vigentes":		if( _nameJson.length == 0 ) _nameJson = "vigentes";
		case "show-prestamos-pagados":		if( _nameJson.length == 0 ) _nameJson = "pagados";
			rows = generalJson.prestamos.registros;

			headerANDstruct[ "header" ] = [ '#', "", "Préstamo De", "Cuotas Pagadas", "Abonos Realizados", "# Cuotas", "Faltante Cobrar", "Cuota", "Días de Atraso", "Total Cuotas", "Total Abonos", "Total Cancelado" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"delete",
																	"sms",
																	"whatsapp",
																	"expand"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto_prestado",
																			class: "monto_prestado formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{ }, // dinamic 3 => "Cuotas Pagadas"
											{ }, // dinamic 4 => "Abonos Realizados"
											{
												"ColumnTextWithoutIcon": {
																			datacol: "numero_cuotas",
																			class: "numero_cuotas formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "total_a_cobrar",
																			class: "total_a_cobrar formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto_diario",
																			class: "monto_diario formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{ }, // dinamic 8 => "Días de Atraso"
											{ }, // dinamic 9 => "T. Cuotas"
											{ }, // dinamic 10 => "T. Abonos"
											{
												"ColumnTextWithoutIcon": {
																			datacol: "total_cancelado",
																			class: "total_cancelado formatear",
																			formatDigits: "data-digits='1'"
																		}
											}
										];

			/* **** P R I V I L E G I O S **************** */
			headerANDstruct[ "struct" ][ 8 ] = {
													"ColumnTextWithoutIcon": {
																				datacol: "dias_de_atraso",
																				class: "dias_de_atraso formatear",
																				formatDigits: "data-digits='0'"
																			}
												};

			headerANDstruct[ "struct" ][ 3 ] = {
													"ColumnTextWithoutIcon": {
																				datacol: "cuotas_pagadas",
																				class: "cuotas_pagadas formatear",
																				formatDigits: "data-digits='0'"
																			}
												};

			headerANDstruct[ "struct" ][ 9 ] = {
													"ColumnTextWithoutIcon": {
																				datacol: "total_cuotas",
																				class: "total_cuotas formatear",
																				formatDigits: "data-digits='1'"
																			}
												};

			headerANDstruct[ "struct" ][ 4 ] = {
													"ColumnTextWithoutIcon": {
																				datacol: "abonos_realizados",
																				class: "abonos_realizados formatear",
																				formatDigits: "data-digits='0'"
																			}
												};

			headerANDstruct[ "struct" ][ 10 ] = {
													"ColumnTextWithoutIcon": {
																				datacol: "total_abonos",
																				class: "total_abonos formatear",
																				formatDigits: "data-digits='1'"
																			}
												};

			if( _NV === "B" || _NV === "C" || _NV === "E" ) {
				headerANDstruct[ "struct" ][ 8 ] = {
														"ColumnTextWithIconAndModal": {
																						datacol: "dias_de_atraso",
																						class: "dias_de_atraso formatear",
																						formatDigits: "data-digits='0'",
																						icono: "lupa.svg",
																						modalClass: "modal-span-btn",
																						twocols: true
																					}
													};

				headerANDstruct[ "struct" ][ 9 ] = {
														"ColumnTextWithIconAndModal": {
																						datacol: "total_cuotas",
																						class: "total_cuotas formatear",
																						formatDigits: "data-digits='1'",
																						icono: "lupa.svg",
																						modalClass: "modal-span-btn",
																						twocols: true
																					}
													};

				headerANDstruct[ "struct" ][ 10 ] = {
														"ColumnTextWithIconAndModal": {
																						datacol: "total_abonos",
																						class: "total_abonos formatear",
																						formatDigits: "data-digits='1'",
																						icono: "lupa.svg",
																						modalClass: "modal-span-btn",
																						twocols: true
																					}
													};
			}

			if( _NV === "D" || _NV === "E" ) {
				if( !listenerPhone )
					headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 1, 1 );

				headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 0, 1 );

				if( _nameJson === "vigentes" ) {
					headerANDstruct[ "struct" ][ 3 ] = {
															"ColumnTextWithIconAndModal": {
																							datacol: "cuotas_pagadas",
																							class: "cuotas_pagadas formatear",
																							formatDigits: "data-digits='0'",
																							icono: "plus2.svg",
																							modalClass: "modal-span-btn",
																							twocols: true
																						}
														};

					headerANDstruct[ "struct" ][ 4 ] = {
															"ColumnTextWithIconAndModal": {
																							datacol: "abonos_realizados",
																							class: "abonos_realizados formatear",
																							formatDigits: "data-digits='0'",
																							icono: "plus2.svg",
																							modalClass: "modal-span-btn",
																							twocols: true
																						}
														};
				}
			}
			else
				headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 1, 2 );

			/* **** F I N   P R I V I L E G I O S ******** */

			headerANDstruct[ "struct_hide" ] = [
													{
														li: "Moneda: ",
														class: "span_moneda"
													},
													{
														li: "Interes: ",
														class: "interes"
													},
													{
														li: "Intérvalos de Días: ",
														class: "intervalo_de_tiempo"
													},
													{
														li: "Total con Intereses: ",
														class: "total_con_interes formatear",
														formatDigits: "data-digits='0'"
													},
													{
														li: "Micro-Crédito ",
														class: "microcredito formatear",
														formatDigits: "data-digits='1'"
													},
													{
														li: "Fecha Inicio: ",
														class: "fecha_inicio formatDate"
													},
													{
														li: "Fecha Limite: ",
														class: "fecha_limite formatDate"
													},
													{
														li: "Siguiente Visita: ",
														class: "siguiente_visita formatDate"
													},
													{
														li: "Observaciones: ",
														class: "observaciones"
													}
												];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: true,
										_struct_hide: headerANDstruct.struct_hide,
										_link: "prestamos"
									});

		break;
/* ************************************************************************************************************** */

		case "dias_de_atraso":
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', "Fecha", "Observaciones" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha",
																			class: "fecha formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "observaciones",
																			class: "observaciones"
																		}
											}
										];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: _option
									});
		break;
/* ************************************************************************************************************** */

		case "total_cuotas":
        case "total_abonos":
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', '', "Fecha", "Monto", "Pagado En", "Sumatoria", "Observaciones", "Hora" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"minimap",
																	"delete"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha",
																			class: "fecha formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto",
																			class: "monto formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "metodo_pago",
																			class: "metodo_pago"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "sumatoria",
																			class: "sumatoria formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "observaciones",
																			class: "observaciones"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "hora",
																			class: "hora"
																		}
											}
										];

			/* **** P R I V I L E G I O S **************** */
				if( _NV === "D" || _NV === "E" )
					headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 1, 1 );
			/* **** F I N   P R I V I L E G I O S ******** */

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: _option
									});

		break;
/* ************************************************************************************************************** */
		
		case "showvisitados":		if( _nameJson.length == 0 ) _nameJson = "showvisitados";
		case "showpendientes":		if( _nameJson.length == 0 ) _nameJson = "showpendientes";
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', '', "Cédula", "Nombre", "Teléfono", "Distancia", "Observaciones", "Préstamos Vigentes", "Préstamos Pagados" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																		"minimap",
																		"gallery",
																		"guiame",
																		"whatsapp",
																		"expand"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithIcon": {
																		datacol: "telefono",
																		class: "telefono",
																		icono: listenerPhone ? "phone.svg" : '',
																		twocols: listenerPhone
																	}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "distancia",
																			class: "distancia formatear",
																			formatDigits: "data-digits='0'",
																		}
											},
											{
												"SpanHeaderSelectOption": {
																			headerList: "¿Visitado?",
																			datacol: "razon",
																			class: "razones",
																			selectOption: [
																							{ text: "No Pagó" },
																							{ text: "No Estaba" },
																							{ text: "Se Voló" }
																						]
																		}
											},
											{
												"ColumnTextWithIconAndModal": {
																				datacol: "prestamos_vigentes",
																				class: "prestamos_vigentes formatear",
																				modalClass: "modal-span-btn",
																				formatDigits: "data-digits='0'",
																				icono: ( _option === "assignpresta" ? "plus2" : "lupa" ) + ".svg",
																				twocols: true
																			}
											},
											{
												"ColumnTextWithIconAndModal": {
																				datacol: "prestamos_pagados",
																				class: "prestamos_pagados formatear",
																				modalClass: "modal-span-btn",
																				formatDigits: "data-digits='0'",
																				icono: "lupa.svg",
																				twocols: true
																			}
											}
										];

			if( _nameJson == "showvisitados" ) {
				headerANDstruct[ "struct" ][ 6 ] = {
														"ColumnTextWithoutIcon": {
																					datacol: "observaciones:",
																					class: "observaciones"
																				}
													};
			}
			else if( _NV !== "E" ) {
				headerANDstruct[ "header" ].splice( 6, 1 );
				headerANDstruct[ "struct" ].splice( 6, 1 );
			}

			headerANDstruct[ "struct_hide" ] = [
													{
														li: "Correo Electrónico:",
														class: "correo"
													},
													{
														li: "Dirección de Habitación:",
														class: "direccion"
													},
													{
														li: "Negocio / Local:",
														class: "negocio"
													},
													{
														li: "Hora de Visita:",
														class: "hora"
													}
												];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: true,
										_struct_hide: headerANDstruct.struct_hide,
										_link: _option
									});
		break;
/* ************************************************************************************************************** */

		case "total_cobrado":
		case "cobrado_en_efectivo":
		case "cobrado_en_transferencia":
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', "Cédula", "Nombre", "Cuota Pagadas", "T. Cuota Pagadas", "Abonos Realizados", "T. Abonos Realizados" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "n_cuotas_pagadas",
																			class: "n_cuotas_pagadas formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "suma_cuotas_pagadas",
																			class: "suma_cuotas_pagadas formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "n_abonos_cancelados",
																			class: "n_abonos_cancelados formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "suma_abonos_cancelados",
																			class: "suma_abonos_cancelados formatear",
																			formatDigits: "data-digits='1'"
																		}
											}
										];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_link: _option
									});
		break;
/* ************************************************************************************************************** */

		case "total_prestado":
        case "cuentas_nuevas":
        case "cuentas_terminadas":
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', "Cédula", "Nombre", "Monto Prestado", "Fecha Inicio", "Cuotas", "Intereses", "Fecha Límite" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto_prestado",
																			class: "monto_prestado formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha_inicio",
																			class: "fecha_inicio formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "numero_cuotas",
																			class: "numero_cuotas"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "interes",
																			class: "interes"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha_limite",
																			class: "fecha_limite formatDate"
																		}
											}
										];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_link: _option
									});

		break;
/* ************************************************************************************************************** */

		case "creditospendientes":				if( _nameJson.length == 0 ) _nameJson = "creditospendientes";
			rows = generalJson[ _nameJson ].registros;

			if( rows == 0 ) {
                Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
            }

			resetearCollectors( _nameJson );
			headerANDstruct[ "header" ] = [ '#', '', "Nombre Cobrador", "Cédula", "Nombre Cliente", "Aumento Solicitado", "# Cuotas", "Interes", "Fecha Límite", "Total a Pagar" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"minimap",
																	"delete",
																	"check",
																	"expand"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo_cobrador",
																			class: "nombre_completo_cobrador"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo_cliente",
																			class: "nombre_completo_cliente"
																		}
											},
											{
												"ColumnTextWithIcon": {
																		datacol: "monto_prestado",
																		class: "monto_prestado formatear",
																		formatDigits: "data-digits='0'",
																		icono: "hand-card.svg",
																		twocols: true
																	}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "numero_cuotas",
																			class: "numero_cuotas"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "interes",
																			class: "interes"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha_limite",
																			class: "fecha_limite formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "total_con_interes",
																			class: "total_con_interes formatear",
																			formatDigits: "data-digits='0'"
																		}
											}
										];

			/* **** P R I V I L E G I O S **************** */
				if( _NV === "E" )
					headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 1, 2 );
			/* **** F I N   P R I V I L E G I O S ******** */

			headerANDstruct[ "struct_hide" ] = [
													{
														li: "Fecha Inicio: ",
														class: "fecha_inicio formatDate"
													},
													{
														li: "Monto/Cuota Diaria:",
														class: "monto_diario formatear",
														formatDigits: "data-digits='1'"
													},
													{
														li: "Observaciones:",
														class: "observaciones"
													}
												];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: true,
										_struct_hide: headerANDstruct.struct_hide,
										_link: _nameJson
									});

		break;
/* ************************************************************************************************************** */

		case "enrutamiento":				if( _nameJson.length == 0 ) _nameJson = "clientes";
			rows = generalJson[ _nameJson ].registros;

			if( rows == 0 ) {
                Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
            }

			resetearCollectors( _nameJson );
			headerANDstruct[ "header" ] = [ '#', '', "Posicionar Antes de", "Cédula", "Nombre", "Negocio" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"minimap",
																	"up",
																	"expand"
																]
											},
											{
												"SpanHeaderSelectOption": {
																			headerList: "Clientes",
																			datacol: "posicionar",
																			class: "posicionar",
																			selectOption: [ ],
																			twocols: false
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "cedula",
																			class: "cedula formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "negocio",
																			class: "negocio"
																		}
											}
										];

			headerANDstruct[ "struct_hide" ] = [
													{
														li: "Dirección de Habitación: ",
														class: "direccion"
													}
												];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: true,
										_struct_hide: headerANDstruct.struct_hide,
										_link: _nameJson
									});

		break;
/* ************************************************************************************************************** */

		case "total_gastos":
        case "total_base_dia":
        case "total_capital":
			rows = generalJson[ _option ].registros;

			headerANDstruct[ "header" ] = [ '#', '', "Fecha", "Hora", "Monto", "Sumatoria", "Observaciones" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnOnlyIcon": [
																	"delete"
																]
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha",
																			class: "fecha formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "hora",
																			class: "hora"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto",
																			class: "monto formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "sumatoria",
																			class: "sumatoria formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "observaciones",
																			class: "observaciones"
																		}
											}
										];

			/* **** P R I V I L E G I O S **************** */
				if( _NV === "D" || _NV === "E" )
					headerANDstruct[ "struct" ][ 1 ].ColumnOnlyIcon.splice( 0, 1 );
			/* **** F I N   P R I V I L E G I O S ******** */

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: _option
									});

		break;
/* ************************************************************************************************************** */

		case "movimientos_online_filter":
			rows = generalJson.movimientos_online_filter.registros;

			if( rows == 0 ) {
				Delete_Sections( true, false );
				eventClickNoData( '' );
				return;
			}

			resetearCollectors( "movimientos_online_filter" );
			headerANDstruct[ "header" ] = [ '#', "Cliente", "Detalle del Movimiento", "Monto Implicado", "Deuda Posterior", "Fecha", "Hora" ];
			headerANDstruct[ "struct" ] = [
											{
												"ColumnTextWithoutIcon": {
																			datacol: "indice",
																			class: "indice formatear",
																			formatDigits: "data-digits='0'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "nombre_completo",
																			class: "nombre_completo"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "detalle",
																			class: "detalle"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "monto",
																			class: "monto formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "deuda",
																			class: "deuda formatear",
																			formatDigits: "data-digits='1'"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "fecha",
																			class: "fecha formatDate"
																		}
											},
											{
												"ColumnTextWithoutIcon": {
																			datacol: "hora",
																			class: "hora"
																		}
											}
										];

			procesar_listarCollectors({
										_title: _title,
										_rows: rows,
										_header: headerANDstruct.header,
										_struct: headerANDstruct.struct,
										_row_hide: false,
										_link: "movimientos_online_filter"
									});

		break;
	}
}

function procesar_listarCollectors({ _title, _rows, _header, _struct, _row_hide, _struct_hide, _link }) {
	listar({
				Titulo: _title,
				filas: _rows,
				cabecerasTabla: _header,
				estructuraTemplate: _struct,
				filaOculta: _row_hide,
				estructuraRowHiden: {
					Titulo: "Detalles Adicionales",
					Contenido: _struct_hide
				},
				link: _link // NAME INDEX ARRAY OBJECT
			});

	loadCollectors( );
}

function color_status( $div, dias_de_atraso ){
	$div.classList.add( "table__data-status" );

	if( dias_de_atraso <= 0 ) {
		$div.classList.add( "status-pagoaldia" );

		if( dias_de_atraso < 0 )
			$div.innerHTML = `<div class="table__data-statusSpecial"> </div>`
	}

	else if( dias_de_atraso >= 1 ) {
		let term = dias_de_atraso > 1 ? "s" : "";
		$div.classList.add( `status-cuota${ term }__atrasada${ term }` );

		if( dias_de_atraso > 1 )
			$div.innerHTML = `<div class="table__data-statusSpecial"> </div>`
	}
}

function loadCollectors( start = -1 ) {
	const section = generalJson.UltimaSeccion( );
	let raizFiltro = generalJson[ section.dataset.link ],
		_currentIndex = start < 0 ? raizFiltro.currentIndex : raizFiltro.first_row,
		_eleccion = generalJson.UltimaEleccion( );

	raizFiltro.first_row = _currentIndex;
    raizFiltro.currentItemsShowed = raizFiltro.amoutPerpage * ( raizFiltro.currentPage + 1 );

    let $template = section.querySelector( `template` ).content,
        $tbody = section.querySelector( `.table_body__collectors` ),
        $maxItems = section.querySelector( '.table__maxItems' ),
        $currentItems = section.querySelector( '.table__currentItems' ),
        $currentPage = section.querySelector( '.table__current-page' );
		$currentItems.textContent = raizFiltro.currentItemsShowed;

    $maxItems.textContent = raizFiltro.registros;

	if(
		(
			generalJson.UltimaEleccion( ) === "enrutamiento" ||
			generalJson.UltimaEleccion( ) === "movimientos_online_filter"
		) &&
		!_m.empty( $currentPage ) ) {
		section.querySelectorAll( ".table-nav-container > li:nth-child( 3 ), .table-nav-container > li:nth-child( 4 )" ).forEach( e => { e.remove() });
		raizFiltro.amoutPerpage = raizFiltro.registros;
	}
	else if( !_m.empty( $currentPage ) )
		$currentPage.textContent = ( raizFiltro.currentPage + 1 );

    cleanContent( $tbody );

	if( raizFiltro.collectors.length == 0 ) {
		if( Object.keys( previo ).length == 0 ) {
			Delete_Sections( true, true );
			eventClickNoData( '' );
		}

		return;
	}

    for( let i = 0; i < raizFiltro.amoutPerpage; i++ ) {
        if ( _currentIndex < raizFiltro.registros ) {
            $template.querySelector( 'tr' ).dataset.indexNumber = i;

			const $selector = [
				/* 00 */		$template.querySelector( 'tr div img.table__icon.delete' ),
				/* 01 */		$template.querySelector( 'tr span.prestamos_vigentes + img' ),
				/* 02 */		$template.querySelector( 'tr span.prestamos_pagados + img' ),
				/* 03 */		$template.querySelector( 'tr span.total_cuotas + img' ),
				/* 04 */		$template.querySelector( 'tr span.total_abonos + img' ),
				/* 05 */		$template.querySelector( 'tr span.dias_de_atraso + img' ),
				/* 06 */		$template.querySelector( 'tr span.clientes + img' ),
				/* 07 */		$template.querySelector( 'tr span.telefono + img' )
							];

			/* ************************************************************************************* */
			$selector.forEach( _dom => { if( !_m.empty( _dom ) ) _dom.classList.remove( "visibilidad" ); });

			for( let _data of [ raizFiltro.collectors[ _currentIndex ] ] ) {
				let len = Object.keys( _data ).length,
					$lastElement;

				/* ************************************************************************************* */

				setAttributes(
								$template.querySelector( 'tr' ),
								{
									"data-unico": _data.unico.data,
									"data-vma": _data.hasOwnProperty( 'vma' ) ? _data.vma.data : "N/A",
									"data-vac": _data.hasOwnProperty( 'vac' ) ? _data.vac.data : "N/A",
									"data-vcc": _data.hasOwnProperty( 'vcc' ) ? _data.vcc.data : "N/A",
									"data-idp": _data.hasOwnProperty( 'idp' ) ? _data.idp.data : "N/A"
								}
							);

				$template.querySelector( `.indice` ).textContent = format_number( _currentIndex + 1, 0 );
				$template.querySelectorAll( ".table-body__row td div.table__icon-container" ).forEach( e => {
					e.querySelectorAll( "div.table__data-status" ).forEach( f => {
						f.remove( );
					});
				});

				if( section.dataset.link === "clientes_filtrado" ){
					const $div = d.createElement( 'div' );
					$div.classList.add( "table__data-status" );

					if( _data.rendimiento.data == 100 ) {
						if( _data.prestamos_vigentes.data > 0 )
							color_status( $div, _data.gcl_dda.data );
						else
							$div.classList.add( "status-cliente__sin-credito" );
					}
					else {
						$div.classList.add( "status-cliente__moroso" );
						$div.innerHTML = `<div class="table__data-statusSpecial"> </div>`
					}

					$template.querySelector( `div.table__icon-container` ).appendChild( $div );
				}
				else if( section.dataset.link === "prestamos" ){
					const $div = d.createElement( 'div' );
					color_status( $div, _data.dias_de_atraso.data );
					$template.querySelector( `div.table__icon-container` ).appendChild( $div );
				}

				/* ************************************************************************************* */

				for( let _indice = 0; _indice < len; _indice++ ) {
					const _nm = Object.keys( _data )[ _indice ];
					const _dn = _data[ _nm ];

					if( _dn.show ) {
						$lastElement = $template.querySelector( `.${ _nm }` );

						if( !_m.empty( $lastElement ) ) {
							let _this_element = null, prefijo = "";

							switch( _nm ) {
								case "minimap":
								case "gallery":
								case "update":	// EN TABLA DE DATOS PRINCIPALES DEL ENTE
								case "delete":	// EN TABLA DE DATOS PRINCIPALES DEL ENTE
								case "guiame":	// EN TABLA DE DATOS PRINCIPALES DEL ENTE
									if( _m.empty( _this_element ) ) _this_element = $lastElement;

								case "check":

								case "assign":	// EN TABLA DE USUARIOS
								case "list":	// EN TABLA DE USUARIOS

								case "limite_prestamo":
								case "base_dia":
								case "capital":
									if( prefijo === '' && ( _nm === "limite_prestamo" || _nm === "base_dia" || _nm === "capital" ) ) prefijo = `${ _data.abrev_moneda.data }. `;

								case "assignpresta":
								case "prestamos_vigentes":
								case "prestamos_pagados":
								case "generarreport":
								case "showreport":
								case "showsupervisar":
								case "clientes":

								case "dias_de_atraso":
								case "cuotas_pagadas":
								case "total_cuotas":
								case "abonos_realizados":
								case "total_abonos":

								case "detalle_bloqueo":

									if( _m.empty( _this_element ) ) _this_element = $lastElement.nextElementSibling;

									if( _nm === "detalle_bloqueo" ) {
										_this_element.setAttribute( "src", "src/assets/" + ( _data.bloqueado.data ? "lock" : "unlock" ) + ".svg" );
										_this_element.classList.add( "lock" );
									}

									setAttributes(
													_this_element,
													{
														"data-selector": _nm,
														"data-tb": _dn.hasOwnProperty( 'tb' ) ? _dn.tb : "N/A"
													}
												);

								break;
								default:
									if( prefijo === '' ) {
											 if( _nm === "total_con_interes" ) prefijo = `${ _data.abrev_moneda.data }. `;
										else if( _nm === "microcredito" ) prefijo = `${ _data.abrev_moneda.data }. `;
										else if( _nm === "monto_prestado" ) prefijo = `${ _data.abrev_moneda.data }. `;
										else if( _nm === "distancia" ) {
											prefijo = `km`;
											setAttributes(
													$lastElement.closest( "tr" ).querySelector( "td[data-col='razon'] img" ),
													{
														"data-selector": _nm,
														"data-tb": _dn.hasOwnProperty( 'tb' ) ? _dn.tb : "N/A"
													}
												);
										}
									}
								break
							}

							if( _dn.text ) {
								if( _nm === "dias_de_atraso" )
									$lastElement.textContent = format_number( ( _data.dias_de_atraso.data <= 0 ? 0 : _data.dias_de_atraso.data ), 0, '' );

								else if( _nm === "datetime_available" )
									$lastElement.querySelector( "span" ).textContent = _data.datetime_available.data;

								else if( _nm === "intervalo_de_tiempo" )
									$lastElement.textContent = `Cuota Cada ${ _data.intervalo_de_tiempo.data } Día(s)`;

								else
									$lastElement.textContent = ( prefijo === "km" ? ( !load_Ini ? "Calculando... " : markersGoogle[ _data.unico.data ].distancia ) : _dn.data ) + ( _nm === "interes" ? '%' : '' );

								switch( $lastElement.tagName ) {
									case "SPAN":
										if( $lastElement.classList.contains( "formatear" ) )
											$lastElement.textContent = format_number( $lastElement.textContent, $lastElement.dataset.digits, prefijo );

										else if( $lastElement.classList.contains( "formatDate" ) ) {
											$lastElement.closest( "tr" ).setAttribute( "data-date", $lastElement.textContent );
											$lastElement.textContent = getDate_Format_Name( $lastElement.textContent );
										}
									break;
								}
							}

							if( _nm == "telefono" )
								$template.querySelector( ".telefono_call" )?.setAttribute( "data-numero", _dn.data );
						}
					}
				}

				/* ************************************************************************************* */

				if( _data.hasOwnProperty( "telefono" ) ) {
					if( _data.telefono.data.length == 0 )
						if( !_m.empty( $selector[ 7 ] ) )
							$selector[ 7 ].classList.add( "visibilidad" );
				}

				if( _data.hasOwnProperty( "prestamos_vigentes" ) ) {
					if( !_m.empty( $selector[ 0 ] )
					  /*&& _data.prestamos_vigentes.data > 0 */)
						$selector[ 0 ].classList.add( "visibilidad" );

					if( _eleccion === "clientes_filtrado"
					 || _eleccion === "clientes"
					 || _eleccion === "showcobra"
					 || _eleccion === "showvisitados"
					 || _eleccion === "showpendientes"
					 || _eleccion === "generarreport"
					 || _eleccion === "showreport" ) {

						if( _data.prestamos_vigentes.data == 0 )
							if( !_m.empty( $selector[ 1 ] ) )
								$selector[ 1 ].classList.add( "visibilidad" );
					}

					if( _data.prestamos_pagados.data == 0 ) {
						if( !_m.empty( $selector[ 2 ] ) )
							$selector[ 2 ].classList.add( "visibilidad" );
					}
				}

				if( _data.hasOwnProperty( "total_cuotas" ) )
					if( !_m.empty( $selector[ 3 ] )
					  && _data.total_cuotas.data == 0 )
						$selector[ 3 ].classList.add( "visibilidad" );

				if( _data.hasOwnProperty( "total_abonos" ) )
					if( !_m.empty( $selector[ 4 ] )
					  && _data.total_abonos.data == 0 )
						$selector[ 4 ].classList.add( "visibilidad" );

				if( _data.hasOwnProperty( "dias_de_atraso" ) )
					if( !_m.empty( $selector[ 5 ] )
					  && _data.dias_de_atraso.data <= 0 )
						$selector[ 5 ].classList.add( "visibilidad" );

				if( _data.hasOwnProperty( "clientes" ) )
					if( !_m.empty( $selector[ 6 ] )
					  && _data.clientes.data == 0 )
						$selector[ 6 ].classList.add( "visibilidad" );

				/* ************************************************************************************* */
			}

			raizFiltro.currentIndex = ++_currentIndex;
			let $clone = document.importNode( $template, true );    
			$fragment.appendChild( $clone );

			if ( raizFiltro.currentItemsShowed > raizFiltro.registros )
				$currentItems.textContent = _currentIndex;
        }
        else {
            if ( $fragment.hasChildNodes( ) )
                $tbody.appendChild( $fragment );

            else
                return;
        }
    }

    $tbody.appendChild( $fragment );
	section.classList.add( "showModal" );
	window_resize( );
}