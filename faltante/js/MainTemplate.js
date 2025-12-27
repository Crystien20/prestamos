document.addEventListener( 'DOMContentLoaded', ( ) => {
    loadNumbers( );
    clickHandler( );
    startMenuMobile( );
    dashboard( );
    switchTheme( );

    if( navigator.userAgent.match( /Android/i ) ||
        navigator.userAgent.match( /webOS/i ) ||
        navigator.userAgent.match( /iPhone/i ) ||
        navigator.userAgent.match( /iPad/i ) ||
        navigator.userAgent.match( /iPod/i ) ||
        navigator.userAgent.match( /BlackBerry/i ) ||
        navigator.userAgent.match( /Windows Phone/i ) ) {
            listenerPhone = true;
    }

    document.addEventListener( "resize", ( ) => { window_resize( ); });

    document.addEventListener( "keyup", e => {
        if( e.target.matches( ".table-nav__search" ) )
            keyup_search( e.target, generalJson.UltimaSeccion( ).dataset.link );

        if( event.keyCode === 27 ) {
            if( !_m.empty( $otherModal ) ) {
                if( !d.querySelector( ".notify-windows" ).classList.contains( "showModal" ) )
                    hideModal( $otherModal );
            }

            else
                Delete_Sections( );

            if( d.querySelector( "div.chat" ).classList.contains( "translateElement" ) )
                d.querySelector( "div.chat" ).classList.remove( "translateElement" );
        }
    });

    document.addEventListener( "wheel", function( event ){
        if( document.activeElement.type === "number" )
            document.activeElement.blur( );
    });
});

function window_resize( ) {
    d.querySelectorAll( "section.modal.modal-details div.modal__main-content.Tabla__Container > div" ).forEach( tcd => {
        if( tcd.closest( "section.modal.modal-details" ).dataset.form === "N" ) {
            let mainContent = tcd.parentNode;
            let style = mainContent.currentStyle || window.getComputedStyle( mainContent );
            let _controles = tcd.querySelector( ".table-controls" ).offsetHeight;
            let ajustar = getScreen( )[ 1 ] - _controles - parseInt( style.paddingTop );
        
            tcd.querySelector( ".table-container" )
                .style
                .setProperty(
                    'height',
                    `${ ajustar }px`,
                    'important'
                );
        }
    })
}

function getScreen( ){
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName( 'body' )[ 0 ],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    return [ x, y ];
}

function iniMap( ) {
    const _g = _m.getAll( );

    contentMap.style.width = "100%";
    contentMap.style.height = "100%";

    let optionMap = {
            maxZoom: 22,
            minZoom: 2,
            zoom: 12,
            styles: [
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00ff73"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#bff3de"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#65d1fc"
                        }
                    ]
                }
            ],
            center: new google.maps.LatLng( _g[ 0 ], _g[ 1 ] ),
            zoomControl: false,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,
            scrollwheel: true
        };

    $objectMapa = new google.maps.Map( contentMap, optionMap );
    d.oncontextmenu = function( ){ return false }

	directionsService = new google.maps.DirectionsService( );
    var rendererOptions = {
        map: $objectMapa,
        suppressMarkers: true
    }

	directionsRenderer = new google.maps.DirectionsRenderer( rendererOptions );
    directionsGeocoder = new google.maps.Geocoder( );

    $infowindow = new google.maps.InfoWindow({
        content: '',
        ariaLabel: '',
    });

	load_Ini = true;
}

function startMenuMobile( ){
    mainMenuTabs( );
    menuMobile( );
}

function mainMenuTabs( ){
    const $mainTabs = d.querySelectorAll( '.menu-nav__item-anchor' );
    $mainTabs.forEach( tab => {
        tab.addEventListener( 'click', ( ) => {
            if ( tab.nextElementSibling ){
                tab.nextElementSibling.classList.toggle( 'showItemnav' );
                $arrow = tab.querySelector( '.arrow-down' );
                tab.classList.toggle( 'item-open' );
                $arrow.classList.toggle( 'arrow-down-open' );
            }
        })
    })
}

function menuMobile( ){
    const $hamburguerBtn = d.querySelector( '.hamburguer-menu' ),
          $menu = d.querySelector( '.menu' ),
          $lineOne = d.querySelector( '.line-one' ),
          $lineTwo = d.querySelector( '.line-two' ),
          $lineThree = d.querySelector( '.line-three' );


    $hamburguerBtn.addEventListener( 'click', ( )=>{
        $menu.classList.toggle( 'showMenu' );
        $lineOne.classList.toggle( 'line-one-closed' );
        $lineTwo.classList.toggle( 'line-two-closed' );
        $lineThree.classList.toggle( 'line-three-closed' );
        $hamburguerBtn.classList.toggle( 'hamburguer-open' );
        d.querySelector( 'body' ).classList.toggle( 'block-scroll' );
    })
}
function clickHandler( ){
    let target = null;

    document.addEventListener( 'click', event => {
        if ( freezeClic ) {
            event.stopPropagation( );
            event.preventDefault( );
            return;
        }

        target = event.target;
		const lastClass = target.classList[ target.classList.length - 1 ];

        if( target.getAttribute( "id" )?.indexOf( "iden__total_gastos" ) > -1 ) {
            modalHandler( target, "total_gastos" );
            return;
        }

        if( target.getAttribute( "id" )?.indexOf( "iden__base_dia" ) > -1 ) {
            modalHandler( target, "total_base_dia" );
            return;
        }

        if( target.getAttribute( "id" )?.indexOf( "iden__capital" ) > -1 ) {
            modalHandler( target, "total_capital" );
            return;
        }

        if( target.classList.contains( "nombre_completo" ) ) {
            let click = target.closest( "tr" ).querySelector( "td[data-col='prestamos_vigentes'] img" );

		   	if( !_m.empty( click ) && !click.classList.contains( "visibilidad" ) )
		   		click.click( );

            return;
        }

        switch ( true ){
            case target.matches( '.click_logo' ):
                location.reload( );
            break;
            case target.matches( '.abrirSolicitudes' ):
                d.querySelector( "li.blocView__show.creditospendientes" ).click( );
            break;
            case target.matches( '.modal-span-btn' ):
                modalHandler( target );
            break;
            case target.matches( '.table__icon.delete' ):
                deleteInfo( target );
            break;
            case target.matches( '.table__icon.lock' ):
                bloquearAcceso( target );
            break;
            case target.matches( '.table__icon.check' ):
                target.classList.add( "visibilidad" );
                increaseCredit({ $target: target, jsonCobra: 'N/A' })
            break;
            case target.matches( '.changePass' ):
                changePass( target );
            break;
            case target.matches( '.increase_credit' ):
                if( _NV === "E" || generalJson.UltimaEleccion( ) === "creditospendientes" )
                    validarIncremento( target );
                else
                    increaseCredit({ $target: target });
            break;
            case target.matches( '.enrutar' ):
                let dataset = target.closest( "tr" ).dataset;
                enrutar( target, 0, dataset.unico, dataset.vac );
            break;
            case target.matches( '.posicionar' ):
                const $ul = target.nextElementSibling;
				target = target.closest( "tr" ).dataset;

                $ul.innerHTML = 
                    generalJson.clientes.collectors.reduce(
                        ( _arrNew, _row, index ) => {
                            if( _row.unico.data !== target.unico )
                                _arrNew.push( `<li
                                                    class="select-nav__option select-nav__option-item"
                                                    data-val="${ _row.orden.data }"
                                                    data-select="${ _row.orden.data }">
                                                        <pre>${ ( index < 9 ? "    " : ( index < 99 ? "  " : "" ) ) }</pre>
                                                        ${ index + 1 }.- ${ _row.nombre_completo.data }
                                                </li>` );

                            return _arrNew;
                        }
                        , []
                    ).join( "" );

                $ul.classList.toggle( 'showElement' );
            break;
            /* ************************************************************ */
            /* ************************************************************ */
            case target.matches( '.dashboardBtn' ):
                dashboard( );
                break;
            case target.matches( '.chatBtn' ): 
                openChat( );
                break;
            case target.matches( '.closeBtn' ):
                showHidewindow( target );
                break;
            case target.matches( '.backBtn' ):
                showHidewindow( target );
                break;
            case target.matches( '.chat-list__item' ):
                openChatWindows( target );

                break;
            case target.matches( '.block-view' ):
                swapViewTable( target );
                break;
            case target.matches( '.pagination__numbers-current' ):
                showSelector( target );
                break;
            case target.matches( '.moreinfo__btn' ):
                showHiddenRow( target );
                break;
            case target.matches( '.table__current-page' ):
                showSelector( target );
                break;
            case target.matches( '.table__page-item' ):
                selectTablepage( target );
                hideSelector( target.parentNode );
                break;
            case target.matches( '.backwardPage' ):
                backwardPagetable( );
                break;
            case target.matches( '.forwardPage' ):
                forwardPagetable( );
                break;
            case target.matches( '.modal__close-btn.-out' ):
                hideModal( target.closest( "section" ) );
            break;
            case target.matches( '.modal__close-btn' ):
                Delete_Sections( );
            break;
            case target.matches( '.modal-form__closeBtn' ):
                hideModal( target.closest( "section" ) );

                if( !_m.empty( $firstClick ) )
                    marcarVisita( null, false );
            break;
            case target.matches( '.pagination__numbers-item' ):
                tableItemsPage( target );
                hideSelector( target.parentNode );
                break;

            case target.matches( '.modal-gallery-pictures__item' ):
                selectGalleryImg( target );

                break;
            case target.matches( '.modal-gallery__saveBtn' ):
                savePicture( );

                break;
            case target.matches( '.select-nav__option-item' ):
                selectNavItem( target );
                hideSelector( target.parentNode );

                break;
            case target.matches( '.checkbox-label' ):
                selectCheck( target );

                break;
            case target.matches( '.delete-item-Btn' ):
                deleteGalleryImg( target );

            break;
            case target.matches( '.formDinamic-Triggers-Btn' ):
				if( target.getAttribute( "ID" ) === "iden__btnSwitch" )
				{
					let nextW = generalJson.UltimoClick( ),
						dsCol = nextW.closest( "td" ).dataset.col;
					Delete_Sections( false, true, true );

					switch( dsCol ) {
						case "cuotas_pagadas":
							nextW.closest( "tr" ).querySelector( "td[data-col=abonos_realizados] img" ).click( );

							break;
						case "abonos_realizados":
							nextW.closest( "tr" ).querySelector( "td[data-col=cuotas_pagadas] img" ).click( );

							break;
					}
				}
				else
                	processFormDinamic( target );

            break;
            case target.matches( '.searchID' ):
                searchID( target.previousElementSibling, target );

            break;
            case target.matches( '.closeMain' ):
                target.classList.add( "hide" );
                _m._lets( `src/php/Login.php?q=oAz` ).then( ( ) => {
                    location.href = "index.html";
                } );
            break;
            case target.matches( '.menu-user-settings' ):
                openUserMenu( target );

            break;
            case target.matches( '.switch-theme' ):
                switchTheme( );

            break;
            case target.matches( '.telefono_call' ):
                if( listenerPhone ) {
                    if( target.dataset.numero === '' ){
                        shownotificationMessage( false, "No hay un número válido para ejecutar esta acción" )
                        return;
                    }
                    shownotificationMessage( true, `Efectuando Llamada al Número: ${ target.dataset.numero }` )
                    location.href = `tel:${ target.dataset.numero }`;
                }
            break;
            case target.matches( '.sms' ):
            case target.matches( '.whatsapp' ):
				let prestamo, cliente;

				if(
					generalJson.UltimaEleccion( ) === "showpendientes" ||
					generalJson.UltimaEleccion( ) === "showvisitados"
				  )
					{
						cliente = generalJson.clientes.collectors.filter( e =>{ return ( e.unico.data == target.closest( "tr" ).dataset.unico ) })[ 0 ];
						sendsms.setAttribute( "href", `https://wa.me/${ cliente.telefono.data }` );
						sendsms.click( );
						return;
					}

                prestamo = generalJson.prestamos.collectors[ 0 ];
                cliente = generalJson.clientes.collectors.filter( e =>{ return ( e.vcc.data == prestamo.vcc.data ) })[ 0 ];

                if( cliente.prestamos_vigentes.data == 0 ) {
                    shownotificationMessage( false, "No posee préstamos vigentes" )
                    return;
                }
                if( cliente.telefono.data === '' ){
                    shownotificationMessage( false, "No hay un número válido para ejecutar esta acción" )
                    return;
                }

                envioSMS(
                    prestamo.idp.data,
                    `sms:${ cliente.telefono.data }?body=`,
                    `https://wa.me/${ cliente.telefono.data }?text=`,
                    target.matches( '.sms' )
                );
            break;
            case target.matches( '.navfull-screen' ):
                closeChecknav( target );
                break;
            case target.matches( '.table__icon.guiame' ):
                irAGoogleMaps( target.closest( "tr" ).dataset.unico );
            break;

			/* ************************************************************ */
			/* ************************************************************ */
			case target.matches( ".blocView__show" ):
				sectionTarget( target, lastClass );
			break;
			case target.matches( ".blocView__new" ):
				sectionTarget( target, lastClass );
			break;
			case target.matches( ".blocView__advanced" ):
				sectionTarget( target, lastClass );
			break;

			/* ************************************************************ */
			/* ************************************************************ */

			case target.matches( ".blocView__createUser" ):
				sectionTarget( target, lastClass );
			break;
			case target.matches( ".blocView__createMoney" ):
				sectionTarget( target, lastClass );
			break;
			case target.matches( ".blocView__assignprest" ):
				sectionTarget( target, lastClass );
			break;

			/* ************************************************************ */
			/* ************************************************************ */
            default: break;
        }
    }, true );
}

function closeChecknav( target ){
    target.classList.toggle( 'showElement' );
}

function switchTheme( ){
    let $body = d.querySelector( 'body' );
    let picker = event.target.querySelector( '.theme__picker' );

    picker.classList.toggle( 'theme__picker-slide' );
    $body.classList.toggle( 'light-theme' );

}

function openUserMenu( target ){
    let $userStettingsmenu = d.querySelector( '.menu-user__settings-nav' );
    target.classList.toggle( 'item-open' );
    $userStettingsmenu.classList.toggle( 'showUsermenu' );
}

function selectCheck( target ){
    let $checked = target.querySelector( '.square-checkbox__ico' );
    $checked.classList.toggle( 'showElement' );
}

async function selectNavItem( target ){
    let $main_nav_item =  target.parentNode.parentNode.querySelector( '.select-nav__main-item' );

    if ( target.parentNode.classList.contains( 'fullscreen-check' ) ){
        return;
    } else {
        $main_nav_item.textContent = target.textContent;
    }

    $main_nav_item.dataset.select = target.dataset.select;
    $main_nav_item.dataset.val = target.dataset.val;

	if( target.parentNode.classList.contains( "ul_cobradores" ) ) {
		filter_selector( );
		return;
	}

    if( $main_nav_item.getAttribute( "id" ) === "iden__metodo_pago" )
        return;

    if( $main_nav_item.getAttribute( "id" ) === "iden__intervalos" ) {
        await setDateLoan( iden__numero_cuotas );
        return;
    }

    if( ( !_m.empty( typeof iden__numero_cuotas ) || !_m.empty( typeof iden__interes ) ) &&
            generalJson.contenedorLI_Menu.dataset.link != "cobradores" ) {
		let inc = iden__numero_cuotas.parentNode.nextElementSibling;

		if( $main_nav_item.getAttribute( "id" ) === "iden__interes" ) {
			if( $main_nav_item.dataset.val == 0 )
				inc = inc.querySelector( "li[data-select='custom']" );
			else
				inc = inc.querySelector( "li[data-select='0']" );

			iden__numero_cuotas.dataset.select = inc.dataset.select;
			iden__numero_cuotas.dataset.val = inc.dataset.val;
			iden__numero_cuotas.textContent = inc.textContent;
		}

        await setDateLoan( target );
    }
    else if( generalJson.UltimaEleccion( ) === "enrutamiento" ) {
        let dataset = target.closest( "tr" ).dataset;
        enrutar( target, $main_nav_item.dataset.select == 999999999 ? 0 : $main_nav_item.dataset.select, dataset.unico, dataset.vac );
    }
    else if(
                generalJson.UltimaEleccion( ) === "showcobra" &&
                _NV !== "D" &&
                _NV !== "E"
            ) {
        const JData = dataJsonSegunClick({ _nameJson: 'cobradores', $element: target.closest( "tr" ) });

        await _m._lets( `src/php/ShootFunctions.php?t=${ JData.vac.data }&sw=calendario&z=${ target.textContent }` )
                .then( ( ) => { shownotificationMessage( true, "Cambio efectuado con Éxito" ); } );
    }
}

async function modalHandler( $target, _selec = null ) {
    let $modal,
        _selector = _m.empty( _selec ) ? $target.dataset.selector : _selec,
        _eleccion = generalJson.UltimaEleccion( ),
        _opts = null,
        _nm = "",
        JData;

    const _property = generalJson.UltimaSeccion( )?.dataset.link;

    switch ( _selector ) {
        case "minimap":
        case "gallery":
			if( !_m.empty( $target.closest( "tr" ) ) )
            	generalJson.secuenciasClicks.push( $target );

			else if( !_m.empty( generalJson.UltimoClick( ).closest( "tr" ) ) )
            	generalJson.secuenciasClicks.push( generalJson.UltimoClick( ) );

            if( _selector === "minimap" )
                loadInfoMaps( $target );

            else
                loadUserpictures( );

            $modal = document.querySelector( `.modal.${ $target.dataset.selector }` );
            $modal.classList.toggle( 'showModal' );
            $otherModal = $modal;

        break;
/* ************************************************************************************************************** */

        case "clientes":
            let _ax = generalJson.UltimaEleccion( );
            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );

            if( _ax === "showcobra" ) {
                _selector = "clientes_filtrado";
                dinamic_filter({
                    _vac: $target.closest( "tr" ).dataset.vac,
                    _selector: _selector,
                    _name_base: "clientes"
                });

                Show_Table({ _title: "Listado de Clientes", _option: _selector });
            }
            else {
                if( _ax === "showvisitados" || _ax === "showpendientes" ) {
                    dinamic_filter({
						_vac: $target.closest( "tr" ).dataset.vac,
						_selector: _ax,
						_name_base: "rutas",
						_filtro_adicional: "visitado," + ( _ax === "showvisitados" ? 1 : 0 )
					});

				    Show_Table({
                        _title: ( _ax === "showvisitados" ?
                                        "Listado de Clientes Visitados" :
                                        "Listado de Clientes Pendientes" ),
                        _option: _ax
                    });
                }
            }

        break;
/* ************************************************************************************************************** */

        case "assignpresta":

            generalJson.secuenciasClicks.push( $target );
			generalJson.secuenciasEleccion.push( _selector );
            infoClient_afterFilter( $target.closest( "tr" ).dataset.unico, true, "unico" );

		break;
/* ************************************************************************************************************** */

        case "prestamos_vigentes":      if( _m.empty( _opts ) ) _opts = "vigentes";
        case "prestamos_pagados":       if( _m.empty( _opts ) ) _opts = "pagados";

            generalJson.secuenciasClicks.push( $target );
            _nm = $target.closest( 'tr' ).querySelector( '.nombre_completo' ).textContent;

            if( _eleccion === "assignpresta" && _opts !== "pagados" ) {
                generalJson.secuenciasEleccion.push( _eleccion );
                infoClient_afterFilter( $target.closest( "tr" ).dataset.unico, true, "unico" );
            }
            else {
                if( _eleccion === "clientes_filtrado" ||
                    _eleccion === "clientes" ||
                    _NV === "E" ) {

                    _selector = `show-prestamos-${ _opts }`;
                    generalJson.secuenciasEleccion.push( _selector );

                    cargarPrestamos({
						[ _opts ]: true,
						filtrar: false
					}).then( jsonLoan => {
                        if( jsonLoan.length == 0 ) {
                            Delete_Sections( true, false );
                            eventClickNoData( '' );
                            return;
                        }

                        Show_Table({ _title: "Préstamos de: " + _nm, _option: _selector });
                    });
                }
                else {
                    _selector = "clientes_filtrado";
                    generalJson.secuenciasEleccion.push( _selector );

                    cargarPrestamos({ [ _opts ]: true }).then( jsonLoan => {
                        if( jsonLoan.length == 0 ) {
                            Delete_Sections( true, false );
                            eventClickNoData( '' );
                            return;
                        }

                        dinamic_filter({ JData: jsonLoan, evitar_filter: true, _selector: _selector });
                        Show_Table({ _title: "Préstamos - Clientes de: " + _nm, _option: _selector });
						generalJson.UltimaSeccion( ).setAttribute( "data-vp", _opts );
                    });
                }
            }

        break;
/* ************************************************************************************************************** */

        case "update":
            generalJson.secuenciasClicks.push( $target );

            switch( _eleccion ) {
                case "showadmin":           if( _m.empty( _opts ) ) _opts = [ "admin", "Administrador", '' ];
                case "showsecre":           if( _m.empty( _opts ) ) _opts = [ "secre", "Secretario", '' ];
                case "showsuper":           if( _m.empty( _opts ) ) _opts = [ "super", "Supervisor", '' ];
                case "showcobra":           if( _m.empty( _opts ) ) _opts = [ "cobra", "Cobrador", "vma;vac" ];
                case "clientes_filtrado":
                case "assignpresta":        if( _m.empty( _opts ) ) _opts = [ "clien", "Cliente", "vma;vac;vcc" ];

                    generalJson.secuenciasEleccion.push( "update-" + _opts[ 0 ] );
                    FormDinamic({ _link: _THIS, _title: "Edición de Información " + _opts[ 1 ], _option: "update-" + _opts[ 0 ], _extends_button: _opts[ 2 ] });
                break;
/* ************************************************************************************************************** */

                case "list-user-admin":     if( _m.empty( _opts ) ) _opts = [ "admin" ];
                case "list-user-secre":     if( _m.empty( _opts ) ) _opts = [ "secre" ];
                case "list-user-super":     if( _m.empty( _opts ) ) _opts = [ "super" ];
                case "list-user-cobra":     if( _m.empty( _opts ) ) _opts = [ "cobra" ];

                    generalJson.secuenciasEleccion.push( "assign-user-" + _opts[ 0 ] );
                    FormDinamic({ _link: $target.closest( "tr" ).dataset.unico, _title: "Edición de Usuario", _option: "assign-user-" + _opts[ 0 ] });
                break;
            }
        break;
/* ************************************************************************************************************** */

        case "assign":
        case "list":
            generalJson.secuenciasClicks.push( $target );

            switch( _eleccion ) {
                case "useradmin":   if( _m.empty( _opts ) ) _opts = [ "admin", "Administrador", "Administradores" ];
                case "usersecre":   if( _m.empty( _opts ) ) _opts = [ "secre", "Secretario", "Secretarios" ];
                case "usersuper":   if( _m.empty( _opts ) ) _opts = [ "super", "Supervisor", "Supervisores" ];
                case "usercobra":   if( _m.empty( _opts ) ) _opts = [ "cobra", "Cobrador", "Cobradores" ];

                    switch( _selector ) {
                        case "assign":
                            generalJson.secuenciasEleccion.push( "assign-user-" + _opts[ 0 ] );
                            FormDinamic({ _link: $target.closest( "tr" ).dataset.unico, _title: "Asignación de Usuario " + _opts[ 1 ], _option: "assign-user-" + _opts[ 0 ] });
                        break;
                    /* ************************************************************************************************************** */

                        case "list":
                            generalJson.secuenciasEleccion.push( "list-user-" + _opts[ 0 ] );
                            Show_Table({ _title: "Listado de Usuarios " + _opts[ 2 ], _option: "list-user-" + _opts[ 0 ] });
                        break;
                    }
                break;
            }
        break;
/* ************************************************************************************************************** */

        case "dias_de_atraso":      if( _nm.length == 0 ) _nm = "Dias de Atraso";

            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );
            detalles_prestamos( dataJsonSegunClick({ _nameJson: 'prestamos', $element: $target.closest( "tr" ), $default: 'idp' }), _selector, 1, _nm );

        break;
/* ************************************************************************************************************** */

        case "cuotas_pagadas":      if( _nm.length == 0 ) _nm = "Registrar Cuota(s)";
        case "abonos_realizados":   if( _nm.length == 0 ) _nm = "Registrar Abono";

            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );
			JData = dataJsonSegunClick({ _nameJson: 'prestamos', $element: $target.closest( "tr" ), $default: 'idp' });
            FormDinamic({ _link: JData, _title: `${ JData.name.data }: ${ _nm }`, _option: _selector, _extends_button: "vcc;abrev_moneda" });

        break;
/* ************************************************************************************************************** */

        case "total_cuotas":        if( _nm.length == 0 ) _nm = "Total Cuotas";
        case "total_abonos":        if( _nm.length == 0 ) _nm = "Total Abonos";

            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );
            detalles_prestamos( dataJsonSegunClick({ _nameJson: 'prestamos', $element: $target.closest( "tr" ), $default: 'idp' }), _selector, 1, _nm );

        break;
/* ************************************************************************************************************** */

        case "base_dia":			if( _nm.length == 0 ) _nm = "Base Del Día";
        case "capital":				if( _nm.length == 0 ) _nm = "Capital Ruta";
        case "limite_prestamo":     if( _nm.length == 0 ) _nm = "Ajustar Límite de Préstamo";
            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );
	
            if( $target.dataset.tb === "global_clientes" )
                JData = dataJsonSegunClick({ _nameJson: 'clientes_filtrado' });
            else
                JData = dataJsonSegunClick({ _nameJson: 'cobradores' });
	
            FormDinamic({ _link: JData, _title: _nm, _option: _selector });

        break;
/* ************************************************************************************************************** */

        case "total_cobrado":           	if( _nm.length == 0 ) _nm = "Total Cobrado";
        case "cobrado_en_efectivo":         if( _nm.length == 0 ) _nm = "Cobrado en Efectivo";
        case "cobrado_en_transferencia":    if( _nm.length == 0 ) _nm = "Cobrado en Transferencia";
        case "total_prestado":           	if( _nm.length == 0 ) _nm = "Total Prestado";
        case "cuentas_nuevas":           	if( _nm.length == 0 ) _nm = "Cuentas Nuevas";
        case "cuentas_terminadas":          if( _nm.length == 0 ) _nm = "Cuentas Terminadas";
        case "total_gastos":				if( _nm.length == 0 ) _nm = "Total Gastos";
        case "total_base_dia":				if( _nm.length == 0 ) _nm = "Total Base Del Día";
        case "total_capital":				if( _nm.length == 0 ) _nm = "Total Capital Ruta";
            generalJson.secuenciasEleccion.push( _selector );
            generalJson.secuenciasClicks.push( $target );
			const $datetime = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_dia" ),
				  $datetime_from = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_from" ),
				  $datetime_to = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_to" ),
				  _t_ = generalJson[ _property ].collectors[ 0 ],
				  _n_ = _m.empty( $datetime ) ? _NOW.split( "-" ).reverse( ).join( "-" ) : $datetime.value;

            JData = await functionLoan({
								_t: _t_.vac.hasOwnProperty( "data" ) ? _t_.vac.data : _t_.vac,
								_sw: _selector,
								_f: _m.empty( $datetime_from ) ? `${ _n_ }/${ _n_ }` : ( $datetime_from.value + "/" + $datetime_to.value )
							});

            crearCollectors( false, JData, _selector );
            Show_Table({ _title: _nm, _option: _selector });

        break;
/* ************************************************************************************************************** */

        case "gastos":     if( _nm.length == 0 ) _nm = "Indicar Gastos Efectuados";

			const $rd = generalJson.UltimaSeccion( ).querySelector( "#iden__reporte_dia" );
			if( !_m.empty( $rd ) && $rd.value !== $rd.dataset.hoy ){
				shownotificationMessage( false, "Los gastos solo se puede generar en el día en curso" );
				return;
			}

            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );
            FormDinamic({ _link: generalJson[ _property ].collectors[ 0 ], _title: _nm, _option: _selector });

        break;
/* ************************************************************************************************************** */

        case "showsupervisar":     if( _nm.length == 0 ) _nm = "Movimientos Online del Cobrador";

			_selector = "movimientos_online_filter";
            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );

			dinamic_filter({
							_vac: $target.closest( "tr" ).dataset.vac,
							_selector: _selector,
							_name_base: "movimientos_online"
						});
			Show_Table({ _title: _nm, _option: _selector });

        break;
/* ************************************************************************************************************** */

        default:
            generalJson.secuenciasClicks.push( $target );
            generalJson.secuenciasEleccion.push( _selector );

            switch( _eleccion ) {
                case "generarreport":		if( _nm.length == 0 ) _nm = "Reporte Dia";
                case "showreport":			if( _nm.length == 0 ) _nm = "Reporte Semanal";
                    FormDinamic({ _link: dataJsonSegunClick({ _nameJson: 'cobradores' }), _title: _nm, _option: _eleccion });
                break;
            }
        break;
    }
}

function hideModal( $modal ) {
    $modal.classList.toggle( 'showModal' );

    if( $modal.classList.contains( "notify-windows" ) ) {
        _eventual.classList.add( "hide" );

        if( !_m.empty( $otherModal ) )
		    $otherModal.querySelector( "input" )?.focus( );

        return;
    }

    else if( $modal.classList.contains( "lock-user" ) ){
        btnOkCode.onclick = null;
        $firstClick = null;

		btnOkCode.closest( "div.modal-form__inputs" ).previousElementSibling.textContent = "Introduce el Código";
		$otherModal.querySelector( "input" ).setAttribute( "type", "password" );
		$otherModal.querySelector( "input" ).removeAttribute( "min" );
		$otherModal.querySelector( "input" ).removeAttribute( "maxlength" );
		$otherModal.querySelector( "input" ).removeAttribute( "onfocus" );
		$otherModal.querySelector( "input" ).removeAttribute( "onkeyup" );
		$otherModal.querySelector( "input" ).removeAttribute( "onchange" );
        $otherModal = null;

        return;
    }

    else if( $modal.classList.contains( "minimap" ) ) {
        changeVisibility( false, "" );

		if( !_m.empty( generalJson.UltimoClick( ).closest( "tr" ) ) )
			generalJson.EliminarUltimoClick( );

        if( generalJson.UltimaEleccion( ) === "mapa" )
            Delete_Sections( true, false );

		if( !_m.empty( $myposition ) )
			$myposition.setMap( null );

        $myposition = null;
        $otherModal = null;
        $infowindow.close( );

        onlyMapFollowing.classList.add( "hide" );
		directionsRenderer.setDirections({ routes: [ ] });
    }
    else if( $modal.classList.contains( "gallery" ) ) {
		generalJson.EliminarUltimoClick( );
        $otherModal = null;
    }
}

function openChat( ){
    const $chat = d.querySelector( '.chat' );
    $chat.classList.toggle( 'translateElement' );
}

function openChatWindows( $this ) {
    const $chatwindow = d.querySelector( '.chat-window' );

    getConvers(
        $this.dataset.idu,
        $this.dataset.toform
    );

    chat_window_title.textContent = _o.getName( _globalChat );
    chat_window_messages.parentNode.scrollTop = chat_window_messages.parentNode.scrollHeight;

    _m._lets( `src/php/Chats.php?global=${ _globalChat }&q=oOz&t=${ _THIS }` ).then( ( ) => { } );
    $chatwindow.classList.toggle( 'translateElement' );
}

function showHidewindow( target ){
    const $mainWindow = target.parentNode.parentNode;
    $mainWindow.classList.toggle( 'translateElement' );

    if( $mainWindow.classList.contains( "chat-window" ) ) {
        _o.setView( _globalChat, true );
        _globalChat = '';
    }
}

function dashboard( ){
    view.innerHTML = `<div class="dashboard__container">
                            <div class="title-section">
                                <h2 class="title-section__text">Bienvenido</h2>
                                <p class="title-section__user-name"><b>${ _ENTIDAD }</b>${ _NAME }</p>
                            </div>
                            <div class="grid-dashboard">${ _DASHBOARD }</div>
                        </div>`;

    cleanContent( $main_view );
    $main_view.appendChild( view );
}

function cleanContent( $content ) {
    $content.innerHTML = ``;
}

function showSelector( target ){
    const $optionList = target.nextElementSibling;
    $optionList.classList.toggle( 'showElement' );
}
function hideSelector( target ){
    target.classList.toggle( 'showElement' );
}
function showHiddenRow( target ){
    const $row = target.parentNode.parentNode.parentNode,
          $hiddenRow = $row.nextElementSibling,
          n_row = $hiddenRow.previousElementSibling.dataset.indexNumber;

    target.closest( "tbody" ).querySelectorAll( ".showHidden-row" ).forEach(
        e => {
            if( n_row !== e.previousElementSibling.dataset.indexNumber )
                e.classList.remove( "showHidden-row" );
        }
    );

    $hiddenRow.classList.toggle( 'showHidden-row' );
}
function tableItemsPage( target ){
	const section = generalJson.UltimaSeccion( );
	let raizFiltro = generalJson[ section.dataset.link ],
        numberContent = target.parentNode.previousElementSibling.querySelector( '.select-nav__pagination__number' );

    raizFiltro.amoutPerpage = target.textContent;
    raizFiltro.maxPage = Math.ceil( raizFiltro.collectors.length / raizFiltro.amoutPerpage ); 
    numberContent.textContent = +target.textContent;
    raizFiltro.currentIndex = 0;
    raizFiltro.currentPage = 0;
    raizFiltro.currentItemsShowed = raizFiltro.amoutPerpage;

    loadAmoutpages( target, raizFiltro.maxPage );
    loadCollectors( );
}

var open = false;

function swapViewTable( target ){
    const $table = target.parentNode.parentNode.parentNode.querySelector( 'table' ),
          $tbody = $table.querySelector( '.table-body' ),
          $thead = $table.querySelector( '.table-header__row' ),
          $td = $table.querySelectorAll( '.table-data' ),
          $firstChild = $table.querySelectorAll( '.table-data:first-child' ),
          $lastChild = $table.querySelectorAll( '.table-data:last-child' );

    if ( open === false ){
        changeProperty( $td, 'block' );
        open = true;
    } else{
        changeProperty( $td, 'none' );
        open = false;
    }
    
    $thead.classList.toggle( 'thead-block' );
    $tbody.classList.toggle( 'tbody-block' );
    $firstChild.forEach( child => {
        child.classList.toggle( 'td-padding-top' );
    })
    $lastChild.forEach( child => {
        child.classList.toggle( 'td-padding-bottom' );
    })
}
function changeProperty( $td, property ){
    $td.forEach( td => {
        td.style.setProperty( '--showBefore', `${ property }`);
        td.classList.toggle( 'td-block' );
    });
}

var i = 0;

function forwardPagetable( ) {
	const section = generalJson.UltimaSeccion( );
	let raizFiltro = generalJson[ section.dataset.link ];
    raizFiltro.currentPage++;

    if( raizFiltro.currentPage < Math.trunc( raizFiltro.collectors.length / raizFiltro.amoutPerpage ) && ( raizFiltro.collectors.length % raizFiltro.amoutPerpage ) === 0 )
        loadCollectors( );
    
    else {
        if( raizFiltro.currentPage <= Math.trunc( raizFiltro.collectors.length / raizFiltro.amoutPerpage ) && ( raizFiltro.collectors.length % raizFiltro.amoutPerpage ) !== 0 )
            loadCollectors( );
        
        else if( raizFiltro.collectors.length % raizFiltro.amoutPerpage === 0 ) {
            raizFiltro.currentPage = Math.trunc( raizFiltro.collectors.length / raizFiltro.amoutPerpage ) - 1;

            return;
        }
        else if( raizFiltro.collectors.length % raizFiltro.amoutPerpage !== 0 ) {
            raizFiltro.currentPage = Math.trunc( raizFiltro.collectors.length / raizFiltro.amoutPerpage );

            return;
        }
    }
}

function backwardPagetable( ) {
	const section = generalJson.UltimaSeccion( );
	let raizFiltro = generalJson[ section.dataset.link ];
    raizFiltro.currentPage--;

    if( raizFiltro.currentPage < 0 ) {
        raizFiltro.currentPage = 0;

        return;
    }

    raizFiltro.currentIndex = raizFiltro.currentPage * raizFiltro.amoutPerpage;
    loadCollectors( );
}

function selectTablepage( target ) {
	const section = generalJson.UltimaSeccion( );
	let raizFiltro = generalJson[ section.dataset.link ]
    raizFiltro.currentPage = +target.textContent - 1;
    
    raizFiltro.currentIndex = raizFiltro.currentPage * raizFiltro.amoutPerpage;
    loadCollectors( );
}

function loadAmoutpages( target, _maxPage ){
    const $currentPage = target.parentNode.parentNode.parentNode.parentNode.querySelector( '.table__current-page' ).nextElementSibling;
    cleanContent( $currentPage );

    for( i = 1; i <= _maxPage; i++ ) {
        let newItem = document.createElement( 'li' );
        newItem.classList.add( 'select-nav__option', 'table__page-item' );
        newItem.textContent = i;
        $currentPage.appendChild( newItem );
    }
}

function loadInfoMaps( $data ) {
    let _index,
        _JData,
        _selector = generalJson.UltimaEleccion( ).toLowerCase( ),
        _nameJson = '';

    switch( _selector ) {
        case "showadmin":
        case "update-admin":                if( _nameJson.length == 0 ) _nameJson = "administradores";

        case "showsecre":
        case "update-secre":                if( _nameJson.length == 0 ) _nameJson = "secretarios";

        case "showsuper":
        case "update-super":                if( _nameJson.length == 0 ) _nameJson = "supervisores";

        case "showcobra":
        case "update-cobra":                if( _nameJson.length == 0 ) _nameJson = "cobradores";

        case "clientes":
        case "clientes_filtrado":			if( _nameJson.length == 0 && _NV !== "E" ) _nameJson = "clientes";

        case "update-clien":                if( _nameJson.length == 0 ) _nameJson = "clientes_filtrado";

        case "show-prestamos-vigentes":
        case "show-prestamos-pagados":      if( _nameJson.length == 0 ) _nameJson = "prestamos";

        case "showvisitados":
        case "showpendientes":				if( _nameJson.length == 0 && _NV !== "E" ) _nameJson = "cobradores";

        case "total_cuotas":
        case "total_abonos":
        case "creditospendientes":          if( _nameJson.length == 0 ) _nameJson = _selector;

        case "enrutamiento":                if( _nameJson.length == 0 ) _nameJson = "clientes";

            _JData = dataJsonSegunClick({ _nameJson: _nameJson });

            if(
				_selector === "total_cuotas" ||
			   	_selector === "total_abonos" ||
			   	_selector === "creditospendientes"
			) {
				$myposition = new google.maps.Marker({
					position:  new google.maps.LatLng( _JData.latitud.data, _JData.longitud.data ),
					icon: {
						url: `src/php/Class/files/default.png?x=${ ( _UNI + Math.floor( Math.random( ) * 100 ) + 1 ) }`,
						size: new google.maps.Size( _m.canvasWidth, _m.canvasHeight ),
						origin: new google.maps.Point( 0, 0 ),
						anchor: new google.maps.Point( Math.trunc( _m.canvasWidth / 2 ), _m.canvasHeight ),
						scaledSize: new google.maps.Size( _m.canvasWidth, _m.canvasHeight )
					},
					map: $objectMapa,
					visible: true
				});
			}
			else {
				const _mk = markersGoogle[ _JData.unico.data ].marker;
				_mk.setVisible( true );
				_mk.setAnimation( google.maps.Animation.DROP );

				markersGoogle[ _THIS ].marker.setVisible( true );
				markersGoogle[ _THIS ].marker.setAnimation( google.maps.Animation.BOUNCE );

				if(
					markersGoogle[ _THIS ].marker.getPosition( ).lat( ) != _mk.getPosition( ).lat( ) &&
					markersGoogle[ _THIS ].marker.getPosition( ).lng( ) != _mk.getPosition( ).lng( )
				)
					calculateAndDisplayRoute( directionsService, directionsRenderer, _mk.getPosition( ), markersGoogle[ _THIS ].marker.getPosition( ), markersGoogle[ _JData.unico.data ] );
			}

			centerBoundMap( );

        break;
/* ************************************************************************************************************* */

        case "newadmin":
        case "newsecre":
        case "newsuper":
        case "newcobra":
        case "newclien":
            let latlng = $data.dataset.latlng.split( "/" );
            let latitud = latlng[ 0 ];
            let longitud = latlng[ 1 ];

            if( latitud == 0 || longitud == 0 ) {
                latlng = _m.getAll( );
                latitud = latlng[ 0 ];
                longitud = latlng[ 1 ];
            }

			changeVisibility( false, "" );
            $myposition = new google.maps.Marker({
                position:  new google.maps.LatLng( latitud, longitud ),
                icon: {
                    url: "src/php/Class/files/default.png",
                    size: new google.maps.Size( _m.canvasWidth, _m.canvasHeight ),
                    origin: new google.maps.Point( 0, 0 ),
                    anchor: new google.maps.Point( Math.trunc( _m.canvasWidth / 2 ), _m.canvasHeight ),
                    scaledSize: new google.maps.Size( _m.canvasWidth, _m.canvasHeight )
                },
                map: $objectMapa,
                visible: true,
                draggable: true
            });

            $myposition.addListener( 'dragend' , function( ){
                let lat = this.getPosition( ).lat( ),
                    lng = this.getPosition( ).lng( );

                $data.dataset.latlng = lat + "/" + lng;
            });

            $objectMapa.setZoom( 18 );
            $objectMapa.setCenter( $myposition.getPosition( ) );
        break;
    }
}

const uploader = ({ file, origen = "Gallery", unico = null }) => {
    const section = generalJson.UltimaSeccion( );
    let totalImg,
        _json,
		_JData = _m.empty( unico ) ? dataJsonSegunClick({ _nameJson: section.dataset.link }) : '';

    unico = _m.empty( unico ) ? _JData.unico.data : unico;

    if( origen === "Gallery" ) {
        totalImg = Object.keys( _JData.array_gallery.data ).length;

        if( totalImg > 4 ) {
            shownotificationMessage( false, "Alcanzó el límite de imagenes permitidas" );
            return;
        }
    }

    const xhr = new XMLHttpRequest( ),
    formData = new FormData( );
    formData.append( 'file' , file );

    xhr.addEventListener( "readystatechange", e => {
        if ( xhr.readyState !== 4 ) return;

        if ( xhr.status >= 200 && xhr.status < 300 ) {
            _json = JSON.parse( xhr.responseText );

            if( origen === "Gallery" ) {
                _JData.array_gallery.data.push({
                    img: `src/php/Class/files/${ _json.name }`,
                    main: 0
                });

                loadUserpictures( );
            }
        }
        else {
            let message = xhr.statusText || "Ocurrio un error";
            console.error( `Error ${ xhr.status }: ${ message }` );
        }
    });

    xhr.open( "POST", `src/php/Class/Uploader.php?unico=${ unico }&origen=${ origen }` );
    xhr.setRequestHeader( "enc-type", "multipart/form-data" );
    xhr.send( formData );
}

const progressUpload = file =>{
    const $container = d.createElement( 'div' ),
    $progress = d.createElement( 'progress' ),
    $span = d.createElement( "span" );

    $container.classList.add( 'progress__barupload-container' );
    $progress.classList.add( 'progress__barupload' );
    $progress.value = 0;
    $progress.max = 100;

    $container.insertAdjacentElement( "beforeend", $progress );
    $container.insertAdjacentElement( "beforeend", $span );
    $main.insertAdjacentElement( "beforeend", $container );

    const fileReader = new FileReader( );
    fileReader.readAsDataURL( file );

    fileReader.addEventListener( "progress", e =>{
        let progress = parseInt( e.loaded * 100 / e.total );
        $progress.value = progress;
        $span.innerHTML = `<p class="progress__textupload">${ progress }%</p>`;
    });

    fileReader.addEventListener( "loadend", e => {
        shownotificationMessage( false, "Espere un momento mientras se sube la imagen" );
        d.querySelector( ".modal__btn-content.modal-gallery__saveBtn" ).classList.add( "hide" );
        d.querySelector( ".gallery__picture__label" ).classList.add( "hide" );

        uploader({ file: file });

        setTimeout( ( ) => {
            $main.removeChild( $container );
            $files.value = '';
            d.querySelector( ".modal__btn-content.modal-gallery__saveBtn" ).classList.remove( "hide" );
            d.querySelector( ".gallery__picture__label" ).classList.remove( "hide" );
            shownotificationMessage( true, "Imagen subida con Éxito" );
        }, 3000 );
    });
}

d.addEventListener( "change", e => {
    if( e.target === $files ) {
        const files = Array.from( e.target.files );
        files.forEach( elemento => progressUpload( elemento ) )
    }
})

/*-----------------GALLERY--------------------*/

function loadUserpictures( ){
    const section = generalJson.UltimaSeccion( );
    let array_gallery = dataJsonSegunClick({ _nameJson: section.dataset.link }).array_gallery;

    let $userGallery = d.querySelector( '.modal-gallery-pictures__list' );
    let $templateG = d.querySelector( '#template-gallery-user-picture' ).content;
    let $mainPicture = d.querySelector( '.modal-gallery-main-picture-content' );
    let mainPicture = null;
    let _class = '';

    cleanContent( $userGallery );

    if ( !_m.empty( array_gallery ) ) {
        let indice = 0;

        for ( let idx in array_gallery.data ) {
            let element = $templateG.querySelector( '.modal-gallery-pictures__item-img' );
            element.setAttribute( "data-index-gallery", idx );
            element.src = array_gallery.data[ idx ].img;

            let $clone = d.importNode( $templateG, true );
            $fragment.appendChild( $clone );

            if( array_gallery.data[ idx ].main || indice === 0 ) {
                mainPicture = array_gallery.data[ idx ].img;
                _class = array_gallery.data[ idx ].main ? "flex" : '';
            }

            indice += 1;
        }
        
        $userGallery.appendChild( $fragment );
    }

    if ( _m.empty( mainPicture ) ){
        let newDiv = d.createElement( 'h3' );
        newDiv.classList.add( 'modal-gallery-main-picture-text' );
        newDiv.innerHTML = `<h3>Aún no has subido una foto</h3>`;
        cleanContent( $mainPicture );
        $mainPicture.appendChild( newDiv );
    }
    else {
        let fElement = d.querySelector( `ul.modal-gallery-pictures__list li img[src='${ mainPicture }']` );
        $mainPicture.innerHTML = `<img class="modal-gallery-main-picture-img" src="${ mainPicture }" alt="" data-index-gallery="${ fElement.dataset.indexGallery }" >`;
        
        if( _class != '' ) {
            fElement.parentNode.querySelector( ".modal-gallery-selected-picture" ).classList.remove( "hide" );
            fElement.parentNode.querySelector( ".modal-gallery-selected-picture" ).classList.add( _class );
        }

        selectGalleryImg( fElement.parentNode );
    }

}

function selectGalleryImg( target ) {
    let $main__picture = d.querySelector( '.modal-gallery-main-picture-img' );
    let newPicture = target.querySelector( 'img' );

    cleanGalleryitems( target.parentNode );

    target.classList.add( 'modal-gallery-item-active' );
    $main__picture.setAttribute( 'src', newPicture.src );
    $main__picture.setAttribute( 'data-index-gallery', newPicture.dataset.indexGallery );
};

function cleanGalleryitems( $parentNode ) {
    let items = $parentNode.querySelectorAll( '.modal-gallery-pictures__item' );
    items.forEach( item => {
        item.classList.remove( 'modal-gallery-item-active' );
    });
}

function savePicture( ){
    let $main_picture = d.querySelector( '.modal-gallery-main-picture-img' );

    if( _m.empty( $main_picture ) ) {
        shownotificationMessage( false, "No ha subido una imagen Válida" );
        return;
    }

    const section = generalJson.UltimaSeccion( );
    let _JData = dataJsonSegunClick({ _nameJson: section.dataset.link }),
        _elm = _JData.array_gallery.data;

    _m._lets( `src/php/Class/Uploader.php?name=${ _elm[ $main_picture.dataset.indexGallery ].img.split( "/" )[ 4 ] }&unico=${ _JData.unico.data }` )
        .then( ( ) => { } );

    for ( let idx in _elm ) {
        _elm[ idx ].main = 0;
    }

    let $element = d.querySelector( '.flex' );
    
    $element?.classList.remove( 'flex' );
    $element?.classList.add( 'hide' );

    $element = d.querySelector( `ul.modal-gallery-pictures__list li img[src='${ _elm[ $main_picture.dataset.indexGallery ].img }']` ).parentNode.querySelector( ".modal-gallery-selected-picture" );
    $element.classList.remove( "hide" );
    $element.classList.add( "flex" );

    _elm[ $main_picture.dataset.indexGallery ].main = 1;
    _m.gotaGoogleMaps( _elm[ $main_picture.dataset.indexGallery ].img, true );

    if( generalJson.contenedorLI_Menu.dataset.link !== "clientes" )
        _m.gotaGoogleMaps( _elm[ $main_picture.dataset.indexGallery ].img, false );

    shownotificationMessage( true, "Asignación exitosa de Imagen a predeterminado" );
    let _icon = `src/php/Class/files/gotaGoogleMaps_${ _JData.unico.data }.png?x=${ ( _UNI + Math.floor( Math.random( ) * 100 ) + 1 ) }`;
    markersGoogle[ _JData.unico.data ].marker
		.setIcon(
			new google.maps.MarkerImage(
						_icon,
						new google.maps.Size( _m.canvasWidth, _m.canvasHeight ),
						new google.maps.Point( 0, 0 ),
						new google.maps.Point( Math.trunc( _m.canvasWidth / 2 ), _m.canvasHeight ),
						new google.maps.Size( _m.canvasWidth, _m.canvasHeight )
			)
		);
}

function deleteGalleryImg( target ){
    if( target.previousElementSibling.classList.contains( "flex" ) ){
        shownotificationMessage( false, "Debe cambiar la foto predeterminada y posteriormente podrá Eliminar la desaeada" );
        return;
    }

    target.parentNode.parentNode.removeChild( target.parentNode );
    const section = generalJson.UltimaSeccion( );
    let array_gallery = dataJsonSegunClick({ _nameJson: section.dataset.link }).array_gallery.data;

    _m._lets( `src/php/Class/Uploader.php?name=${ array_gallery[ target.nextElementSibling.dataset.indexGallery ].img.replace( "src/php/Class/files/", '' ) }` )
            .then( ( ) => { } );

    shownotificationMessage( true, "Eliminación Exitosa" );
    delete array_gallery[ target.nextElementSibling.dataset.indexGallery ];
}

