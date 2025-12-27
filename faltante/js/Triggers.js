function listar({ Titulo,
                  filas,
                  cabecerasTabla,
                  estructuraTemplate,
                  filaOculta,
                  estructuraRowHiden,
                  link
                }) {

    Create_Sections({ link: link });
	const section = generalJson.UltimaSeccion( );

    section.querySelector( "div.Tabla__Container" )
        .innerHTML =
            `<div>
                <div class="table-controls">
                    <ul class="table-nav-container">
                        <li class="table-nav__item"> ${ Titulo }
                            <span class="table__currentItems"></span> de
                            <span class="table__maxItems"></span>
                        </li>
                        <li class="table-nav__item button block-view">
                            <div class="block-view-item">
                                <span class="block-view-block"></span>
                                <span class="block-view-block"></span>
                                <span class="block-view-block"></span>
                                <span class="block-view-block"></span>
                            </div>
                        </li>
                        <li class="table-nav__item">
                            <div class="table-nav__arrows">
                            <div class="table-nav__arrow backwardPage button">
                                    <span class="table-nav__left-arrow">«</span>
                                </div>
                                <div class="select-nav-container">
                                    <div class="select-nav__option select-nav__main select_current-selection table__current-page"></div>
                                    <ul class="select-nav table__pages">
                                        ${ createListPageTableDinamic( filas ) }
                                    </ul>
                                </div>
                                <div class="table-nav__arrow forwardPage button">
                                    <span class="table-nav__right-arrow">»</span>
                                </div>
                            </div>
                        </li>
                        <li class="table-nav__item select-nav__main">
                            <div class="select-nav-container">
                                <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current">
                                    <span class="select-nav__pagination__number">25</span>
                                    <span class="senect-nav__icon">
                                        <span class="arrow-down">
                                            <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg>
                                        </span>
                                    </span>
                                </div>
                                <ul class="select-nav pagination__numbers-list">
                                    <li class="select-nav__option pagination__numbers-item">25</li>
                                    <li class="select-nav__option pagination__numbers-item">50</li>
                                    <li class="select-nav__option pagination__numbers-item">100</li>
                                </ul>
                            </div>
                        </li>
                        <li class="table-nav__item search">
                            <input class="table-nav__search" placeholder = "Buscar..." type="text" onfocus="this.removeAttribute( 'readonly' );" readonly>
                        </li>
                    </ul>
                </div>
                <div class="table-container">
                    <table>
                        <thead class="table-header">
                            <tr class="table__row table-header__row">
                                ${ createThTableDinamic( cabecerasTabla ) }
                            </tr>
                        </thead>
                        <tbody class="table-body table_body__collectors">
                        </tbody>
                    </table>
                </div>
                ${ completeTable( estructuraTemplate, filaOculta, estructuraRowHiden, estructuraTemplate.length ) }
                </div>
            `;
}

function createListPageTableDinamic( _rows ) {
    let _li = '';

    for( let conteo = 1; conteo <= Math.trunc( _rows / 25 ); conteo++ ) {
        _li += `<li class="select-nav__option table__page-item">${ conteo }</li>`;
    }
    
    return _li;
}

function createThTableDinamic( _headers ) {
    let _th = '';

    _headers.forEach( _text => {
        _th += `<th class="table-header__item">${ _text }</th>`;
    } );

    return _th;
}

function completeTable( _structTemplate, _rowHide, _structTemplateRowHiden, _colspan ) {
    let _table = `<template>
                    <tr class="table__row table-body__row" data-index-number="">
                        ${ templateRowsDinamic( _structTemplate ) }
                    </tr>

                    ${ templateRowsHidenDinamic( _rowHide ? _structTemplateRowHiden : { Titulo: '', Contenido: [ ] }, _colspan ) }
                  </template>`;

    return _table;
}

function templateRowsDinamic( _struct ) {
    let _td = '', _nm, _dn;

    _struct.forEach( _data => {
        _nm = Object.keys( _data )[ 0 ];
        _dn = _data[ _nm ];

        switch( _nm ) {
            case "ColumnOnlyIcon":
                _td += `<td class="table__data">
                            <div class="table__icon-container">`;

                _dn.forEach( _icono => {
                    switch( _icono ) {
                        case "minimap":
                            _td += `<img class="table__icon modal-span-btn ${ _icono }" src="src/assets/minimap.svg" alt="">`;

                        break;
                        case "gallery":
                            _td += `<img class="table__icon modal-span-btn ${ _icono }" src="src/assets/gallery.svg" alt="">`;

                        break;
                        case "update":
                            _td += `<img class="table__icon modal-span-btn ${ _icono }" src="src/assets/update.svg" alt=""></img>`;

                        break;
                        case "delete":
                            _td += `<img class="table__icon ${ _icono }" src="src/assets/delete.svg" alt=""></img>`;

                        break;
                        case "guiame":
                            _td += `<img class="table__icon ${ _icono }" src="src/assets/route.svg" alt=""></img>`;

                        break;
                        case "sms":
                            _td += `<img class="table__icon ${ _icono }" src="src/assets/sms.svg" alt=""></img>`;

                        break;
                        case "whatsapp":
                            _td += `<img class="table__icon ${ _icono }" src="src/assets/whatsapp.svg" alt=""></img>`;

                        break;
                        case "check":
                            _td += `<img class="table__icon ${ _icono }" src="src/assets/check.svg" alt=""></img>`;

                        break;
                        case "expand":
                            _td += `<img class="table__icon moreinfo__btn moreinfo" src="src/assets/expand.svg" alt=""></img>`;

                        break;
                        case "up":
                            _td += `<img class="table__icon enrutar" src="src/assets/reduce.svg" alt=""></img>`;

                        break;
                    }
                } );

                _td += `    </div>
                        </td>`;

                break;
            case "ColumnTextWithoutIcon":
                _td += `<td class="table-data" data-col="${ _dn.datacol }">
                            <div class="table-data__container">
                                <span ${ _dn.formatDigits ? _dn.formatDigits : '' } class="${ _dn.class }"></span>
                            </div>
                        </td>`;

                break;
            case "ColumnTextWithIcon":
                _td += `<td class="table-data" data-col="${ _dn.datacol }">
                            <div class="table-data__container ${ !_dn.twocols ? '' : "table-data-twocols" }">
                                <span ${ _dn.formatDigits ? _dn.formatDigits : '' } class="${ _dn.class }"></span>
                                ${
                                    _dn.icono == '' ? '' :
                                    `<img class="table__icon ${ ( _dn.icono == "phone.svg" ? ( _dn.class + "_call" ) : ( _dn.icono == "hand-card.svg" ? "increase_credit" : '' ) ) }" src="src/assets/${ _dn.icono }" alt="">`
                                }
                            </div>
                        </td>`;

                break;
            case "ColumnTextWithIconAndModal":
                _td += `<td class="table-data" data-col="${ _dn.datacol }">
                            <div class="table-data__container ${ !_dn.twocols ? '' : "table-data-twocols" }">
                                <span ${ _dn.formatDigits ? _dn.formatDigits : '' } class="${ _dn.class }"></span>
                                <img class="table__icon ${ _dn.modalClass }" src="src/assets/${ _dn.icono }" alt="">
                            </div>
                        </td>`;

                break;
            case "SpanHeaderSelectOption":
                _td += `<td class="table-data" data-col="${ _dn.datacol }">
                            <div class="table-data__container ${ !_dn.twocols ? '' : "table-data-twocols" }">
                                <div class="form-grid__item-col">
                                    <div class="form-grid__item-col">
                                        <div class="select-nav-container form-grid-nav-container">
                                            <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current ${ _dn.class }">
                                                <span class="select-nav__pagination__number select-nav__main-item ${ _dn.class }" data-select="" data-default="${ _dn.headerList }">${ _dn.headerList }</span>
                                                <span class="select-nav__icon">
                                                    <span class="arrow-down">
                                                        <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg>
                                                    </span>
                                                </span>
                                            </div>
                                            <ul class="select-nav pagination__numbers-list select-nav-list navfull-screen">
                                                ${
                                                    _dn.selectOption.reduce(
                                                        ( _arrNew, _row ) => {
                                                            _arrNew.push( `<li class="select-nav__option select-nav__option-item">${ _row.text }</li>` );
                                                            return _arrNew;
                                                        }
                                                        , []
                                                    ).join( "" )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                ${
                                    _dn.datacol === "posicionar" || _dn.datacol === "datetime_available" ? "" : 
                                    `<img class="table__icon" onclick="marcarVisita( this )" src="src/assets/check.svg" alt="">`
                                }
                            </div>
                        </td>`;

                break;
        }
    });

    return _td;
}

function templateRowsHidenDinamic( _struct, _colspan ){
    let _tr;

    _tr = `<tr class="table__row table__hidden-row">
              <td class="table-data" colspan="${ _colspan }">
                <div class="table-data__container">
                    <div class="table-data-scroll__content ">
                        <p class="table__hidden-title">${ _struct.Titulo }</p>
                        <ul class="table__hidden-list">`;

    _struct.Contenido.forEach( _data => {
        _tr += `<li>
                    ${ _data.li }
                        <span ${ _data.formatDigits ? _data.formatDigits : '' } class="${ _data.class }"></span>
                </li>`;
    });

    _tr += `            </ul>
                    </div>
                </div>
                </td>
            </tr>`;

    return _tr;
}