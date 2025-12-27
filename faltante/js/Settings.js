// *-------------------*
// *-------------------*
const d = document,
	  $main_view = d.querySelector( '.main-view' ),
	  view = document.createElement( 'div' ),
	  _o = new _operators( ),
	  _m = new _manifiest( ),
	  $main = d.querySelector( '.gallery__picture__label' ),
	  $files = d.getElementById( 'files' ),
	  weekday = {
					spanish: {
								mounth: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
								day: [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" ]
							},
					english: {
								mounth: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
								day: [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ]
							}
	  			};

var $fragment = document.createDocumentFragment( ),
	$objectMapa = null,
	$myposition = null,
	$otherModal = null,
	$mainReport = null,
	$infowindow,
	markersGoogle = [ ],
	directionsService,
	directionsRenderer,
	directionsGeocoder,
	freezeClic = false,
	listenerPhone = false,
	generalJson = {
                    secuenciasEleccion: [ ],
                    secuenciasClicks: [ ],
                    sectionsDinamyc: [ ],

                    UltimoClick: function( ) { return this.secuenciasClicks?.at( -1 ); },
                    EliminarUltimoClick: function( ) { this.secuenciasClicks.pop( ); },

                    UltimaSeccion: function( ) { return this.sectionsDinamyc?.at( -1 ); },
                    EliminarUltimaSeccion: function( ) { this.sectionsDinamyc.pop( ); },

                    UltimaEleccion: function( ) { return this.secuenciasEleccion?.at( -1 ); },
                    EliminarUltimaEleccion: function( ) { this.secuenciasEleccion.pop( ); }
                },
	timeout_searchFilter = null,
	zIndex = 1, // index markers google maps
	_activeChat = '',
	_globalChat = '',
	_NOW = '',
	_adse = [ ],
	previo = [ ],
	_rawRequest = null,
	setT_Marker = null,
	load_Ini = false,
	now_limitcredit = 0,
	now_sumcredits = 0;
// *-------------------*
// *-------------------*

async function setDateLoan( target, _pv = false ) {
	if( _m.empty( typeof iden__monto_pagar ) ) {
		await calcularFecha( calcularPrestamo( ) );
	}
	else
	{
		let valueLi = 0;

		switch( target.tagName ){
			case "LI":
			case "SPAN":
				valueLi = target.dataset.val;

			break;
			case "INPUT":
				valueLi = target.value;

			break;
		}

		let FMS = await calcularFecha( !_pv ? valueLi : 1, true ), valueMontoPagar;
		if( _m.empty( typeof iden__siguiente_visita ) )
			return;

		let dda_nc = parseInt( iden__numero_cuotas.dataset.val ) - parseInt( iden__btnGuardar.dataset.dda );

		if( dda_nc >= 0 ) {
			iden__siguiente_visita.textContent = getDate_Format_Name( FMS.FM );
			iden__siguiente_visita.classList.remove( "atencion" );
		}
		else {
			iden__siguiente_visita.textContent = target.tagName === "INPUT" ? "Actualiza al Guardar..." : "Aún Mantiene Días Atrasados";
			iden__siguiente_visita.classList.add( "atencion" );
		}

		let _prefijo = `${ iden__btnGuardar.dataset.abrev_moneda }. `;

		if( !_pv ) {
			valueMontoPagar = parseFloat( valueLi ) * save_number( iden__monto_diario.textContent, 1 );
			iden__monto_pagar.textContent = format_number( valueMontoPagar, 1, _prefijo );
		}

		else
			valueMontoPagar = save_number( iden__monto_pagar.value, 1 );

		let deudaPost = ( save_number( iden__deuda_actual.textContent, 1 ) - valueMontoPagar );
		iden__deuda_posterior.textContent = format_number( deudaPost, 1, _prefijo );

		if ( deudaPost == 0 ) {
			iden__monto_diario_posterior.textContent = _prefijo + "0";
			iden__cuotas_restantes.textContent = "0 Cuotas";
			iden__siguiente_visita.textContent = "Préstamo Finalizado";
		}
		else {
			if( _pv )
				iden__monto_diario_posterior.textContent = iden__monto_diario.textContent;

			else {
				iden__monto_diario_posterior.textContent = iden__monto_diario.textContent;
				iden__cuotas_restantes.textContent = ( parseFloat( iden__monto_pagar.dataset.queue ) - valueLi ) + " Cuotas";
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function sortByKey( array, key ) {
    return array.sort( function( a, b ) {
        let x = a[ key ].data;
		let y = b[ key ].data;
        return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
    } );
}

function eventClickNoData( titulo ){
	shownotificationMessage( false, "No hay información disponible para mostrar. " + titulo );
}

function setAttributes( element, attributes ) {
	if( !_m.empty( element ) ){
		Object.keys( attributes ).forEach( attr => {
			element.setAttribute( attr, attributes[ attr ] );
		});
	}
}

function procesarDias( fecha, dias ){
	let _fecha = new Date( fecha );
	_fecha.setDate( _fecha.getDate( ) + ( dias + 1 ) ); // +1 offset debido que new Date( X ) con getDate resta 1 dia
	return _fecha;
}

function dateToYMD( date ) {
    var d = date.getDate( );
    var m = date.getMonth( ) + 1;
    var y = date.getFullYear( );
    return '' + y + '-' + ( m <= 9 ? '0' + m : m ) + '-' + ( d <= 9 ? '0' + d : d );
}

function equivalente( dia_semana ){
    switch( dia_semana ) {
        case 0: return -6;
        case 1: return -0;
        case 2: return -1;
        case 3: return -2;
        case 4: return -3;
        case 5: return -4;
        case 6: return -5;
    }
}

function returnArrayImagen( _bd ) {
	return _bd === '' ? [ ] :
			_bd.split( ";" ).reduce(
				( _arrNew, _row, _idx ) => {
					let _r = _row.split( "," );
					_arrNew[ `${ _idx }` ] = { "img": `src/php/Class/files/${ _r[ 0 ] }`, "main": parseInt( _r[ 1 ] ) };
					return _arrNew;
				},
				[ ]
			)
}

function returnMonedas( ){
	return generalJson.monedas.collectors.reduce(
					( _arrNew, _row ) => {
						_arrNew.push( {
										data: _row.unico.data,
										text: `${ _row.nombre.data } (${ _row.abrev_moneda.data })`
									} );
						return _arrNew;
					}
				, [ ]
			);
}

function returnZonaHorarias( ){
	return [
				{ data: "-8.00", text: "(-8.00) United States" },
				{ data: "-8.00", text: "(-8.00) Mexico" },
				{ data: "-8.00", text: "(-8.00) Canada" },
				{ data: "-8.00", text: "(-8.00) Pitcairn" },
				{ data: "-7.00", text: "(-7.00) United States" },
				{ data: "-7.00", text: "(-7.00) Canada" },
				{ data: "-7.00", text: "(-7.00) Mexico" },
				{ data: "-7.00", text: "(-7.00) Canada" },
				{ data: "-7.00", text: "(-7.00) United States" },
				{ data: "-7.00", text: "(-7.00) Canada" },
				{ data: "-7.00", text: "(-7.00) Mexico" },
				{ data: "-7.00", text: "(-7.00) Canada" },
				{ data: "-7.00", text: "(-7.00) Mexico" },
				{ data: "-7.00", text: "(-7.00) United States" },
				{ data: "-7.00", text: "(-7.00) Canada" },
				{ data: "-6.00", text: "(-6.00) Mexico" },
				{ data: "-6.00", text: "(-6.00) Belize" },
				{ data: "-6.00", text: "(-6.00) United States" },
				{ data: "-6.00", text: "(-6.00) Mexico" },
				{ data: "-6.00", text: "(-6.00) Costa Rica" },
				{ data: "-6.00", text: "(-6.00) El Salvador" },
				{ data: "-6.00", text: "(-6.00) Guatemala" },
				{ data: "-6.00", text: "(-6.00) United States" },
				{ data: "-6.00", text: "(-6.00) Nicaragua" },
				{ data: "-6.00", text: "(-6.00) Mexico" },
				{ data: "-6.00", text: "(-6.00) United States" },
				{ data: "-6.00", text: "(-6.00) Mexico" },
				{ data: "-6.00", text: "(-6.00) United States" },
				{ data: "-6.00", text: "(-6.00) Mexico" },
				{ data: "-6.00", text: "(-6.00) Canada" },
				{ data: "-6.00", text: "(-6.00) Honduras" },
				{ data: "-6.00", text: "(-6.00) Canada" },
				{ data: "-6.00", text: "(-6.00) Chile" },
				{ data: "-6.00", text: "(-6.00) Ecuador" },
				{ data: "-5.00", text: "(-5.00) Canada" },
				{ data: "-5.00", text: "(-5.00) Colombia" },
				{ data: "-5.00", text: "(-5.00) Mexico" },
				{ data: "-5.00", text: "(-5.00) Cayman Islands" },
				{ data: "-5.00", text: "(-5.00) United States" },
				{ data: "-5.00", text: "(-5.00) Brazil" },
				{ data: "-5.00", text: "(-5.00) Ecuador" },
				{ data: "-5.00", text: "(-5.00) Cuba" },
				{ data: "-5.00", text: "(-5.00) United States" },
				{ data: "-5.00", text: "(-5.00) Canada" },
				{ data: "-5.00", text: "(-5.00) Jamaica" },
				{ data: "-5.00", text: "(-5.00) United States" },
				{ data: "-5.00", text: "(-5.00) Peru" },
				{ data: "-5.00", text: "(-5.00) Bahamas" },
				{ data: "-5.00", text: "(-5.00) United States" },
				{ data: "-5.00", text: "(-5.00) Panama" },
				{ data: "-5.00", text: "(-5.00) Haiti" },
				{ data: "-5.00", text: "(-5.00) Brazil" },
				{ data: "-5.00", text: "(-5.00) Canada" },
				{ data: "-4.00", text: "(-4.00) Anguilla" },
				{ data: "-4.00", text: "(-4.00) Aruba" },
				{ data: "-4.00", text: "(-4.00) Paraguay" },
				{ data: "-4.00", text: "(-4.00) Barbados" },
				{ data: "-4.00", text: "(-4.00) Canada" },
				{ data: "-4.00", text: "(-4.00) Brazil" },
				{ data: "-4.00", text: "(-4.00) Venezuela" },
				{ data: "-4.00", text: "(-4.00) Brazil" },
				{ data: "-4.00", text: "(-4.00) Curacao" },
				{ data: "-4.00", text: "(-4.00) Dominica" },
				{ data: "-4.00", text: "(-4.00) Canada" },
				{ data: "-4.00", text: "(-4.00) Grenada" },
				{ data: "-4.00", text: "(-4.00) Guadeloupe" },
				{ data: "-4.00", text: "(-4.00) Guyana" },
				{ data: "-4.00", text: "(-4.00) Canada" },
				{ data: "-4.00", text: "(-4.00) Bolivia" },
				{ data: "-4.00", text: "(-4.00) Sint Maarten" },
				{ data: "-4.00", text: "(-4.00) Brazil" },
				{ data: "-4.00", text: "(-4.00) Saint Martin" },
				{ data: "-4.00", text: "(-4.00) Martinique" },
				{ data: "-4.00", text: "(-4.00) Canada" },
				{ data: "-4.00", text: "(-4.00) Montserrat" },
				{ data: "-4.00", text: "(-4.00) Brazil" },
				{ data: "-4.00", text: "(-4.00) Trinidad and Tobago" },
				{ data: "-4.00", text: "(-4.00) Puerto Rico" },
				{ data: "-4.00", text: "(-4.00) Chile" },
				{ data: "-4.00", text: "(-4.00) Saint Lucia" },
				{ data: "-4.00", text: "(-4.00) Greenland" },
				{ data: "-4.00", text: "(-4.00) Bermuda" },
				{ data: "-3.30", text: "(-3.30) Canada" },
				{ data: "-3.00", text: "(-3.00) Brazil" },
				{ data: "-3.00", text: "(-3.00) Argentina" },
				{ data: "-3.00", text: "(-3.00) Brazil" },
				{ data: "-3.00", text: "(-3.00) French Guiana" },
				{ data: "-3.00", text: "(-3.00) Brazil" },
				{ data: "-3.00", text: "(-3.00) Uruguay" },
				{ data: "-3.00", text: "(-3.00) Greenland" },
				{ data: "-3.00", text: "(-3.00) Suriname" },
				{ data: "-3.00", text: "(-3.00) Chile" },
				{ data: "-3.00", text: "(-3.00) Brazil" },
				{ data: "-3.00", text: "(-3.00) Antarctica" },
				{ data: "-3.00", text: "(-3.00) Falkland Islands" },
				{ data: "-2.00", text: "(-2.00) Brazil" },
				{ data: "-1.00", text: "(-1.00) Greenland" },
				{ data: "-1.00", text: "(-1.00) Portugal" },
				{ data: "-1.00", text: "(-1.00) Cabo Verde" },
				{ data: "+0.00", text: "(+0.00) Ivory Coast" },
				{ data: "+0.00", text: "(+0.00) Ghana" },
				{ data: "+0.00", text: "(+0.00) Mali" },
				{ data: "+0.00", text: "(+0.00) Gambia" },
				{ data: "+0.00", text: "(+0.00) Guinea-Bissau" },
				{ data: "+0.00", text: "(+0.00) Morocco" },
				{ data: "+0.00", text: "(+0.00) Guinea" },
				{ data: "+0.00", text: "(+0.00) Senegal" },
				{ data: "+0.00", text: "(+0.00) Western Sahara" },
				{ data: "+0.00", text: "(+0.00) Sierra Leone" },
				{ data: "+0.00", text: "(+0.00) Togo" },
				{ data: "+0.00", text: "(+0.00) Liberia" },
				{ data: "+0.00", text: "(+0.00) Mauritania" },
				{ data: "+0.00", text: "(+0.00) Burkina Faso" },
				{ data: "+0.00", text: "(+0.00) Greenland" },
				{ data: "+0.00", text: "(+0.00) Antarctica" },
				{ data: "+0.00", text: "(+0.00) Spain" },
				{ data: "+0.00", text: "(+0.00) Faroe Islands" },
				{ data: "+0.00", text: "(+0.00) Portugal" },
				{ data: "+0.00", text: "(+0.00) Iceland" },
				{ data: "+0.00", text: "(+0.00) Saint Helena" },
				{ data: "+0.00", text: "(+0.00) Ireland" },
				{ data: "+0.00", text: "(+0.00) Guernsey" },
				{ data: "+0.00", text: "(+0.00) Isle of Man" },
				{ data: "+0.00", text: "(+0.00) Jersey" },
				{ data: "+0.00", text: "(+0.00) Portugal" },
				{ data: "+0.00", text: "(+0.00) United Kingdom" },
				{ data: "+1.00", text: "(+1.00) Algeria" },
				{ data: "+1.00", text: "(+1.00) Spain" },
				{ data: "+1.00", text: "(+1.00) Cameroon" },
				{ data: "+1.00", text: "(+1.00) Nigeria" },
				{ data: "+1.00", text: "(+1.00) Gabon" },
				{ data: "+1.00", text: "(+1.00) Angola" },
				{ data: "+1.00", text: "(+1.00) Equatorial Guinea" },
				{ data: "+1.00", text: "(+1.00) Chad" },
				{ data: "+1.00", text: "(+1.00) Niger" },
				{ data: "+1.00", text: "(+1.00) Benin" },
				{ data: "+1.00", text: "(+1.00) Tunisia" },
				{ data: "+1.00", text: "(+1.00) Namibia" },
				{ data: "+1.00", text: "(+1.00) Netherlands" },
				{ data: "+1.00", text: "(+1.00) Andorra" },
				{ data: "+1.00", text: "(+1.00) Serbia" },
				{ data: "+1.00", text: "(+1.00) Germany" },
				{ data: "+1.00", text: "(+1.00) Slovakia" },
				{ data: "+1.00", text: "(+1.00) Belgium" },
				{ data: "+1.00", text: "(+1.00) Hungary" },
				{ data: "+1.00", text: "(+1.00) Germany" },
				{ data: "+1.00", text: "(+1.00) Denmark" },
				{ data: "+1.00", text: "(+1.00) Gibraltar" },
				{ data: "+1.00", text: "(+1.00) Slovenia" },
				{ data: "+1.00", text: "(+1.00) Luxembourg" },
				{ data: "+1.00", text: "(+1.00) Spain" },
				{ data: "+1.00", text: "(+1.00) Malta" },
				{ data: "+1.00", text: "(+1.00) Monaco" },
				{ data: "+1.00", text: "(+1.00) Norway" },
				{ data: "+1.00", text: "(+1.00) France" },
				{ data: "+1.00", text: "(+1.00) Montenegro" },
				{ data: "+1.00", text: "(+1.00) Czechia" },
				{ data: "+1.00", text: "(+1.00) Italy" },
				{ data: "+1.00", text: "(+1.00) San Marino" },
				{ data: "+1.00", text: "(+1.00) North Macedonia" },
				{ data: "+1.00", text: "(+1.00) Sweden" },
				{ data: "+1.00", text: "(+1.00) Albania" },
				{ data: "+1.00", text: "(+1.00) Liechtenstein" },
				{ data: "+1.00", text: "(+1.00) Vatican" },
				{ data: "+1.00", text: "(+1.00) Austria" },
				{ data: "+1.00", text: "(+1.00) Poland" },
				{ data: "+1.00", text: "(+1.00) Croatia" },
				{ data: "+1.00", text: "(+1.00) Switzerland" },
				{ data: "+2.00", text: "(+2.00) Malawi" },
				{ data: "+2.00", text: "(+2.00) Burundi" },
				{ data: "+2.00", text: "(+2.00) Egypt" },
				{ data: "+2.00", text: "(+2.00) Botswana" },
				{ data: "+2.00", text: "(+2.00) Zimbabwe" },
				{ data: "+2.00", text: "(+2.00) South Africa" },
				{ data: "+2.00", text: "(+2.00) South Sudan" },
				{ data: "+2.00", text: "(+2.00) Sudan" },
				{ data: "+2.00", text: "(+2.00) Rwanda" },
				{ data: "+2.00", text: "(+2.00) Zambia" },
				{ data: "+2.00", text: "(+2.00) Mozambique" },
				{ data: "+2.00", text: "(+2.00) Lesotho" },
				{ data: "+2.00", text: "(+2.00) Eswatini" },
				{ data: "+2.00", text: "(+2.00) Libya" },
				{ data: "+2.00", text: "(+2.00) Lebanon" },
				{ data: "+2.00", text: "(+2.00) Cyprus" },
				{ data: "+2.00", text: "(+2.00) Israel" },
				{ data: "+2.00", text: "(+2.00) Cyprus" },
				{ data: "+2.00", text: "(+2.00) Greece" },
				{ data: "+2.00", text: "(+2.00) Romania" },
				{ data: "+2.00", text: "(+2.00) Moldova" },
				{ data: "+2.00", text: "(+2.00) Finland" },
				{ data: "+2.00", text: "(+2.00) Russia" },
				{ data: "+2.00", text: "(+2.00) Ukraine" },
				{ data: "+2.00", text: "(+2.00) Aland Islands" },
				{ data: "+2.00", text: "(+2.00) Latvia" },
				{ data: "+2.00", text: "(+2.00) Bulgaria" },
				{ data: "+2.00", text: "(+2.00) Estonia" },
				{ data: "+2.00", text: "(+2.00) Lithuania" },
				{ data: "+3.00", text: "(+3.00) Ethiopia" },
				{ data: "+3.00", text: "(+3.00) Eritrea" },
				{ data: "+3.00", text: "(+3.00) Tanzania" },
				{ data: "+3.00", text: "(+3.00) Djibouti" },
				{ data: "+3.00", text: "(+3.00) Uganda" },
				{ data: "+3.00", text: "(+3.00) Somalia" },
				{ data: "+3.00", text: "(+3.00) Kenya" },
				{ data: "+3.00", text: "(+3.00) Antarctica" },
				{ data: "+3.00", text: "(+3.00) Yemen" },
				{ data: "+3.00", text: "(+3.00) Jordan" },
				{ data: "+3.00", text: "(+3.00) Iraq" },
				{ data: "+3.00", text: "(+3.00) Bahrain" },
				{ data: "+3.00", text: "(+3.00) Syria" },
				{ data: "+3.00", text: "(+3.00) Kuwait" },
				{ data: "+3.00", text: "(+3.00) Qatar" },
				{ data: "+3.00", text: "(+3.00) Saudi Arabia" },
				{ data: "+3.00", text: "(+3.00) Turkey" },
				{ data: "+3.00", text: "(+3.00) Russia" },
				{ data: "+3.00", text: "(+3.00) Belarus" },
				{ data: "+3.00", text: "(+3.00) Russia" },
				{ data: "+3.00", text: "(+3.00) Ukraine" },
				{ data: "+3.00", text: "(+3.00) Russia" },
				{ data: "+3.00", text: "(+3.00) Madagascar" },
				{ data: "+3.00", text: "(+3.00) Comoros" },
				{ data: "+3.00", text: "(+3.00) Mayotte" },
				{ data: "+3.30", text: "(+3.30) Iran" },
				{ data: "+4.00", text: "(+4.00) Azerbaijan" },
				{ data: "+4.00", text: "(+4.00) Oman" },
				{ data: "+4.00", text: "(+4.00) Georgia" },
				{ data: "+4.00", text: "(+4.00) Armenia" },
				{ data: "+4.00", text: "(+4.00) Russia" },
				{ data: "+4.00", text: "(+4.00) Seychelles" },
				{ data: "+4.00", text: "(+4.00) Mauritius" },
				{ data: "+4.00", text: "(+4.00) Reunion" },
				{ data: "+4.30", text: "(+4.30) Afghanistan" },
				{ data: "+5.00", text: "(+5.00) Antarctica" },
				{ data: "+5.00", text: "(+5.00) Kazakhstan" },
				{ data: "+5.00", text: "(+5.00) Turkmenistan" },
				{ data: "+5.00", text: "(+5.00) Kazakhstan" },
				{ data: "+5.00", text: "(+5.00) Tajikistan" },
				{ data: "+5.00", text: "(+5.00) Pakistan" },
				{ data: "+5.00", text: "(+5.00) Kazakhstan" },
				{ data: "+5.00", text: "(+5.00) Uzbekistan" },
				{ data: "+5.00", text: "(+5.00) Russia" },
				{ data: "+5.00", text: "(+5.00) Maldives" },
				{ data: "+5.30", text: "(+5.30) Sri Lanka" },
				{ data: "+5.30", text: "(+5.30) India" },
				{ data: "+5.45", text: "(+5.45) Nepal" },
				{ data: "+6.00", text: "(+6.00) Antarctica" },
				{ data: "+6.00", text: "(+6.00) Kazakhstan" },
				{ data: "+6.00", text: "(+6.00) Kyrgyzstan" },
				{ data: "+6.00", text: "(+6.00) Bangladesh" },
				{ data: "+6.00", text: "(+6.00) Russia" },
				{ data: "+6.00", text: "(+6.00) Kazakhstan" },
				{ data: "+6.00", text: "(+6.00) Bhutan" },
				{ data: "+6.00", text: "(+6.00) China" },
				{ data: "+6.30", text: "(+6.30) Myanmar" },
				{ data: "+6.30", text: "(+6.30) Cocos Islands" },
				{ data: "+7.00", text: "(+7.00) Antarctica" },
				{ data: "+7.00", text: "(+7.00) Thailand" },
				{ data: "+7.00", text: "(+7.00) Russia" },
				{ data: "+7.00", text: "(+7.00) Mongolia" },
				{ data: "+7.00", text: "(+7.00) Vietnam" },
				{ data: "+7.00", text: "(+7.00) Indonesia" },
				{ data: "+7.00", text: "(+7.00) Russia" },
				{ data: "+7.00", text: "(+7.00) Cambodia" },
				{ data: "+7.00", text: "(+7.00) Indonesia" },
				{ data: "+7.00", text: "(+7.00) Russia" },
				{ data: "+7.00", text: "(+7.00) Laos" },
				{ data: "+8.00", text: "(+8.00) Russia" },
				{ data: "+8.00", text: "(+8.00) Malaysia" },
				{ data: "+8.00", text: "(+8.00) Macao" },
				{ data: "+8.00", text: "(+8.00) Indonesia" },
				{ data: "+8.00", text: "(+8.00) Philippines" },
				{ data: "+8.00", text: "(+8.00) China" },
				{ data: "+8.00", text: "(+8.00) Singapore" },
				{ data: "+8.00", text: "(+8.00) Taiwan" },
				{ data: "+8.00", text: "(+8.00) Mongolia" },
				{ data: "+8.00", text: "(+8.00) Australia" },
				{ data: "+8.45", text: "(+8.45) Australia" },
				{ data: "+9.00", text: "(+9.00) Russia" },
				{ data: "+9.00", text: "(+9.00) Timor Leste" },
				{ data: "+9.00", text: "(+9.00) Indonesia" },
				{ data: "+9.00", text: "(+9.00) Russia" },
				{ data: "+9.00", text: "(+9.00) North Korea" },
				{ data: "+9.00", text: "(+9.00) South Korea" },
				{ data: "+9.00", text: "(+9.00) Japan" },
				{ data: "+9.00", text: "(+9.00) Russia" },
				{ data: "+9.00", text: "(+9.00) Palau" }
			];
}

function primeraLetraMayuscula( str ) {
	str = str.toLowerCase( );
	return str.replace( /(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase( ) );
}

function comprobar_email( email ) {
	let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
	return regex.test( email );
}

function notifyWindows( esAprobado, title, message, timeout = 0, eventClick = null ){
	let type;
	if( esAprobado )
		type = "alertcolor-approve";
	else
		type = "alertcolor-error";

    let $notifyWindows = d.querySelector( '.notify-windows' ),
        $modal = $notifyWindows.querySelector( '.modal-form' ),
        $title = $notifyWindows.querySelector( '.modal-form__title' ),
        $text = $notifyWindows.querySelector( '.modal-notifywindows__text' );

        $notifyWindows.classList.toggle( 'showModal' );
        d.querySelector( 'body' ).classList.add( 'block-scroll' );

        $modal.classList.add( type );
        $title.textContent = title;
        $text.textContent = message;

        if ( timeout > 0 ){
            setTimeout(
				( ) => {
					if( $notifyWindows.classList.contains( 'showModal' ) ) {
						$notifyWindows.classList.toggle( 'showModal' );
						d.querySelector( 'body' ).classList.remove( 'block-scroll' );
					}

					if( !_m.empty( eventClick ) )
						eventClick.click( );
				},
				timeout
			)
        }
  
}

var countSections = 1;
function Create_Sections({ printForm = false, link = '' }){
	const section = d.createElement( "SECTION" );
	section.classList.add( "modal", "modal-details" );
	section.setAttribute( "id", `Tabla_${ countSections }` );
	section.setAttribute( "data-link", link );
	section.setAttribute( "data-form", printForm ? "S" : "N" );
	section.innerHTML = `<div class="scroll-container">
							<div class="modal__controls">
								<div class="modal__close-btn button">
									<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
								</div>
							</div>
							<div class="modal__main-content Tabla__Container">
								${
									printForm
									?	`<div class="modal__title">
											<h2 class="modal__title-text"></h2>
										</div>
										<section class="modal-clients__main">
											<div class="form-grid__container">
												<form class="form-grid" action="">
													<ul class="form-grid__items FormCustom__Container">
													</ul>
												</form>
												<div class="form-table__container">
												</div>
											</div>
										</section>`
									:	''
								}
							</div>
						 </div>`;

	insercion.insertAdjacentElement( "beforebegin", section );
	countSections += 1;
	generalJson.sectionsDinamyc.push( section );
}

function Delete_Sections( eliminiarUltimos = false, seccionCreada = true, saltar = false ){
	countSections += ( countSections == 1 || !seccionCreada ? 0 : -1 );
	const $delete = generalJson.UltimaSeccion( );
	let loadCollection_start = false;

	if( !_m.empty( $delete ) && seccionCreada ) {
		eliminiarUltimos = true;
		const _property = $delete.dataset.link;

		if( _property === "reporte_clon" )
			return;

		switch( _property ) {
			case "clientes_filtrado":
				if( generalJson.UltimaEleccion( ) !== "update-clien" )
					delete generalJson.clientes_filtrado; break;

			case "showvisitados":
			case "showpendientes":
			case "dias_de_atraso":
			case "reporte":
			case "prestamos":
			case "total_cobrado":
			case "cobrado_en_efectivo":
			case "cobrado_en_transferencia":
			case "total_prestado":
			case "total_gastos":
			case "cuentas_nuevas":
			case "cuentas_terminadas":
			case "total_base_dia":
			case "total_capital":
			case "movimientos_online_filter":

				delete generalJson[ _property ];
				if( _property === "prestamos" ) loadCollection_start = true;

			break;
		}

		if( previo.hasOwnProperty( _property ) && generalJson.UltimaEleccion( ) !== "update-clien" )
			previo_inversor( _property, true, true );

		$delete.remove( );
	}

	if( eliminiarUltimos ) {
		generalJson.EliminarUltimoClick( );
		generalJson.EliminarUltimaEleccion( );
	}

	if( seccionCreada && generalJson.sectionsDinamyc.length > 0 )
		generalJson.EliminarUltimaSeccion( );

	const _u = generalJson.UltimaEleccion( );
	if( ( _u === "show-prestamos-vigentes" || _u === "show-prestamos-pagados" ) && _NV === "E" && !saltar ) {
		loadCollectors( 0 );
		return;
	}

	if( loadCollection_start && generalJson.sectionsDinamyc.length > ( _NV === "E" ? 1 : 0 ) )
		if(
			(
				generalJson.UltimaSeccion( )?.dataset.hasOwnProperty( "link" ) &&
				generalJson.UltimaSeccion( ).dataset.link === "prestamos"
			) ||
			(
				generalJson.UltimaSeccion( )?.dataset.hasOwnProperty( "link" ) &&
				generalJson.UltimaSeccion( ).dataset.link === "clientes_filtrado"
			) ||
			(
				generalJson.UltimaSeccion( )?.dataset.hasOwnProperty( "link" ) &&
				generalJson.UltimaSeccion( ).dataset.link === "showpendientes"
			)
		  )
			execute_search( );
}
		   
function execute_search( ) {
	let $search = generalJson.UltimaSeccion( ).querySelector( ".table-nav__search" );

	if( $search.value.length > 0 ) {
		delete previo.clientes_filtrado;
		delete previo.clientes;
	}

	setTimeout( ( ) => {
		const _property = generalJson.UltimaSeccion( ).dataset.link;
		if(
			generalJson.sectionsDinamyc.length > ( _NV === "E" ? 1 : 0 ) &&
			_property !==  "prestamos"
		  ) {
			if( $search.value.length == 0 ) loadCollectors( 0 );
			else keyup_search( $search, _property );
		}
	}, 1000 );
}

function centerBoundMap( ){
	let bounds = new google.maps.LatLngBounds( );

	for( let id in markersGoogle ) {
		let $mk = markersGoogle[ id ].marker;

		if( $mk.getVisible( ) )
			bounds.extend( $mk.getPosition( ) );
	}

	if( !_m.empty( $myposition ) )
		bounds.extend( $myposition.getPosition( ) );

	$objectMapa.setCenter( bounds.getCenter( ) );
	$objectMapa.setZoom( 16 );
}

function changeVisibility( visible, _vac = "" ){
	let bounds = new google.maps.LatLngBounds( );

	for( let id in markersGoogle ) {
		if( _vac === "" || _vac === markersGoogle[ id ].vac ) {
			if( !markersGoogle[ id ].marker.getVisible( ) )
				markersGoogle[ id ].marker.setVisible( visible );

			markersGoogle[ id ].marker.setDraggable( false );
			bounds.extend( markersGoogle[ id ].marker.getPosition( ) );
		}
		else if( _vac !== "" && _vac !== markersGoogle[ id ].vac ) {
			if( markersGoogle[ id ].marker.getVisible( ) )
				markersGoogle[ id ].marker.setVisible( !visible );
		}
	}

	if( !_m.empty( $myposition ) )
		bounds.extend( $myposition.getPosition( ) );

	$objectMapa.setZoom( 4 );
	$objectMapa.setCenter( bounds.getCenter( ) );
}
											  
function ordenarConPrioridad( array ) {
	const firstElement = array.filter( elemento => elemento == 20 );
	const secondElement = array.filter( elemento => elemento == 5 );
	const otrosElementos = array.filter( elemento => elemento != 20 && elemento != 5 );

	otrosElementos.sort( ( a, b ) => a - b );
	return [ ...firstElement, ...secondElement, ...otrosElementos, 0 ];
}

function return_add_attributes( _input, _prefijo = "" ) {
	switch( _input ) {
		case "cedula":
		case "telefono":
			return `min="0" onkeyup="_onkey( this, 0, 0, '${ _prefijo }' )" onchange="_onkey( this, 0, 0, '${ _prefijo }' )"`;

		case "prestamo":
		case "base_dia":
		case "limite_prestamo":
			return `min="0" onfocus="_focus( this )" onkeyup="_onkey( this, 0, 0, '${ _prefijo }' )" onchange="_onkey( this, 0, 0, '${ _prefijo }' )"`;

		case "capital":
		case "abonos":
		case "gastos":
		case "moneda":
		case "microcredito":
			return `min="0" onfocus="_focus( this )" onkeyup="_onkey( this, 1, 0, '${ _prefijo }' )" onchange="_onkey( this, 1, 0, '${ _prefijo }' )"`;

		case "nombre":
		case "apellido":
		case "nombre_moneda":
		case "abrev_moneda":
			return `onkeyup="_onkey( this, 0, 1, '${ _prefijo }' )" onchange="_onkey( this, 0, 1, '${ _prefijo }' )"`;
	}
}

function _focus( _this ) {
	// AUN PENSADO QUE HACER AQUI JEJE
}

async function _onkey( _this, _flotante, _cadena, _prefijo = "" ) {
	let _value = "", _eleccion = generalJson.UltimaEleccion( );

	if( _cadena )
		_this.value = _this.value.replace( /[0-9\,\.\"\']+/g, '' );

	else {
		_value = _this.value.replace( /[^0-9]+/g, '' );
		_value = _value.length > 0 ? parseFloat( _value ) : 0;
	}

	if( !_cadena ) {
		if( _flotante ) {
			_value = _value === 0 ? 0 : ( _value / 100 );
			_this.value = format_number( _value, _flotante, _prefijo );
		}

		else {
			if( _this.getAttribute( "id" ) === "iden__telefono" )
				_this.value = _value !== 0 ? `+${ _value }` : '';

			else if( _this.getAttribute( "id" ) === "iden__monto_inyectar" ) {
				/*if( _this.dataset.switch === "base_dia" &&
				  	parseFloat( _this.dataset.limit ) < _value ) {
						_value = _this.dataset.limit;
						shownotificationMessage( false, `Saldo tope no disponible (Disp. ${ format_number( _this.dataset.limit, 0, _prefijo ) })` )
				}*/

				_this.value = _value !== 0 ? format_number( _value, _flotante, _prefijo ) : '';
			}

			else {
				if( _this.getAttribute( "id" ) === "iden__cedula" ) {
					_value = _this.value.replace( /[^0-9]+/g, '' );
					_value = _value.length > 0 ? _value : '';
					_this.value = format_number( _value, 0, 'cedula' );
				}

				else
					_this.value = _value !== 0 ? format_number( _value, _flotante, _prefijo ) : '';
			}
		}
	}

	event.preventDefault( );

	if( _this.getAttribute( "id" ) === "iden__monto_prestado" )
		await calcularFecha( calcularPrestamo( ) );

	else if( _eleccion === "abonos_realizados" ) {
		let montoDiario = save_number( iden__deuda_actual.textContent, 1 );
		_this.value = format_number( ( _value > montoDiario ? montoDiario : _value ), _flotante, _prefijo );
		await setDateLoan( _this, true );
	}
}

const format_number = ( number, _digitos, _prefijo = "" ) => {
	const exp = /(\d)(?=(\d{3})+(?!\d))/g;
	const rep = '$1.';
	number = number.toString( ).trim( );
	_digitos = parseInt( _digitos.toString( ) );

	if( _prefijo !== "cedula" ) {
		number = parseFloat( number.length === 0 ? '0' : number )

		if( _digitos )
			number = number.toFixed( 2 );
		else
			number = number.toString( );
	}
	else
		_prefijo = "";

	if( _prefijo === "km" ) {
		number = parseFloat( number );

		if( number < 1 ) {
			_prefijo = "Mts. ";
			number = number * 100;
			_digitos = 0;
		}
		else
			_prefijo = "Km. ";

		number = number.toString( );
	}

	let arr = number.split( '.' );
	arr[ 0 ] = arr[ 0 ].replace( exp, rep );
	if( arr[ 1 ] ) {
		arr[ 1 ] = arr[ 1 ].length == 0 ? '00' : arr[ 1 ];
		arr[ 1 ] = arr[ 1 ].length == 1 ? arr[ 1 ] + '0' : arr[ 1 ];
	}

	return _prefijo + ( _digitos ? arr.join( ',' ) : arr[ 0 ] );
}

const save_number = ( number, _digitos ) => {
	number = number ?? 0;
	number = number.toString( ).trim( ).replace( /[^0-9\,]+/g, '' ).replace( /\,/g, '.' );
	_digitos = parseInt( _digitos.toString( ) );

	if( _digitos ) {
		number = number.length === 0 ? '0' : number;
		number = parseFloat( number );
	}

	else
		number = parseFloat( number.replace( /[^0-9]+/g, '' ) );

	return number;
}

String.prototype.localeContains = function( sub ) {
	if( sub === "" ) return true;
	if( !sub || !this.length ) return false;
	sub = "" + sub;
	if( sub.length > this.length ) return false;
	let ascii = s => s.normalize( "NFKD" ).replace( /[\u0300-\u036f]/g, "" ).toLowerCase( );
	let _a = ascii( this ).includes( ascii( sub ) );
	return _a;
}

function calcularPrestamo( ) {
	const JData = generalJson.cobrador.collectors[ 0 ];
	let lp_cliente = infoClient_afterFilter( iden__btnGuardar.dataset.unico, false, "unico" ).limite_prestamo.data;
	let monto = save_number( iden__monto_prestado.value, 1 );

	if( !iden__monto_prestado.hasAttribute( "disabled" ) ) {
		monto = monto > lp_cliente ? lp_cliente : monto;
		iden__monto_prestado.value = format_number( monto, 0, `${ JData.abrev_moneda.data }. ` );
	}

	const vl = monto;
	const it = save_number( iden__interes.dataset.val, 1 );
	const ct = save_number( it > 0 ? iden__numero_cuotas.dataset.val : ( monto > 0 ? monto : 1 ), 1 );

	iden__numero_cuotas.dataset.val = ct;

	const total = vl * ( ( it / 100 ) + 1 );
	iden__total_a_cobrar.textContent = format_number( total, 1, `${ JData.abrev_moneda.data }. ` );
	iden__microcredito.textContent = format_number( it > 0 ? ( vl - ( ( vl / 100 ) * JData.microcredito.data ) ) : monto, 1, `${ JData.abrev_moneda.data }. ` );
	iden__monto_diario.textContent = format_number( total / ct, 1, `${ JData.abrev_moneda.data }. ` );
	
	if ( save_number( iden__monto_diario.textContent, 1 ) % 1 != 0 ) {
		shownotificationMessage( false, "El monto prestado genera cuotas con decimales, use montos precisos" )
		iden__monto_diario.classList.add( "atencion" );
	}
	else {
		shownotificationMessage( true, "Monto Válido" )
		iden__monto_diario.classList.remove( "atencion" );
	}

	return ct;
}

async function calcularFecha( numero_cuotas, r = false ){
	if( _m.empty( numero_cuotas ) )
		numero_cuotas = 1;

	const fecha = _m.empty( typeof iden__fecha_inicio ) ? iden__btnGuardar.dataset.nextday : iden__fecha_inicio.dataset.change;
	let dda_nc = parseInt( iden__btnGuardar.dataset.dda );
	
	if( generalJson.UltimaEleccion( ) === "assignpresta" )
		dda_nc = numero_cuotas;

	else if( dda_nc > 0 )
		dda_nc = numero_cuotas <= dda_nc ? 1 : ( ( numero_cuotas - dda_nc ) + 1 );

	else
		dda_nc = numero_cuotas;

	return await _m._lets( `src/php/ShootFunctions.php?t=${ fecha }&hoy=${ _rawRequest.now.split( " " )[ 0 ] }&intervalo=${ iden__intervalo_de_tiempo.dataset.val }&z=${ dda_nc }&sw=dateFrom` )
					.then(
						json => {
							json = json[ 0 ];

							if( !r ) {
								if( !_m.empty( typeof iden__fecha_limite ) ) {
									iden__fecha_limite.textContent = getDate_Format_Name( json.FM );
									iden__siguiente_visita.textContent = getDate_Format_Name( json.FS );
								}
							}
							else
								return json;
						}
					);
}

function getDate_Format_Name( _fecha ){
	_fecha = _fecha.split( ' ' )[ 0 ].split( '-' ).reverse( ).join( '-' );
	const d = new Date( _fecha );
	_fecha = _fecha.split( '-' );
	return `${ weekday.spanish.day[ d.getDay( ) ] }, ${ _fecha[ 2 ] } de ${ weekday.spanish.mounth[ parseInt( _fecha[ 1 ] ) - 1 ] } de ${ _fecha[ 0 ] }`;
}







