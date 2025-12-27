function createLIforms( $switch, $param ){
    let $li = '';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $param.unico = _m.empty( $param.unico ) ? 0 : $param.unico;
    $param.spanText = _m.empty( $param.spanText ) ? '' : $param.spanText;
    $param.spanHeader = _m.empty( $param.spanHeader ) ? '' : $param.spanHeader;
    $param.placeHolder = _m.empty( $param.placeHolder ) ? '' : $param.placeHolder;
    $param.maxLength = _m.empty( $param.maxLength ) ? 0 : $param.maxLength;
    $param.identificador = _m.empty( $param.identificador ) ? '' : $param.identificador;
    $param.type = _m.empty( $param.type ) ? "text" : $param.type;
    $param.svg = _m.empty( $param.svg ) ? '' : $param.svg;
    $param.classSpecial = _m.empty( $param.classSpecial ) ? '' : $param.classSpecial;
    $param.add_attributos_inputs = _m.empty( $param.add_attributos_inputs ) ? '' : $param.add_attributos_inputs;
    $param.add_attributos_img = _m.empty( $param.add_attributos_img ) ? '' : $param.add_attributos_img;
    $param.modalClass = _m.empty( $param.modalClass ) ? '' : $param.modalClass;
    $param.valueInput = _m.empty( $param.valueInput ) ? '' : $param.valueInput;
    $param.latlng = _m.empty( $param.latlng ) ? '' : $param.latlng;
    $param.links = _m.empty( $param.links ) ? '' : $param.links;
    $param.classHiden = _m.empty( $param.classHiden ) ? '' : $param.classHiden;
    $param.headerList = _m.empty( $param.headerList ) ? '' : $param.headerList;
    $param.selectOption = _m.empty( $param.selectOption ) ? [ ] : $param.selectOption;
    $param.classFormats = _m.empty( $param.classFormats ) ? '' : $param.classFormats;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

    switch( $switch ) {
        case "SpanHeaderInputWithIcon":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col form-grid__item-twocol">
                            <input ${ $param.add_attributos_inputs } maxlength="${ $param.maxLength }" id="${ $param.identificador }" type="${ $param.type }" class="form-grid__item-input ${ $param.classFormats }" placeholder="${ $param.placeHolder }" value="${ $param.valueInput }">
                            <img ${ $param.add_attributos_img } class="form-grid__item-ico ${ $param.classSpecial }" src="src/assets/${ $param.svg }" alt="">
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderInput":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <input ${ $param.add_attributos_inputs } maxlength="${ $param.maxLength }" id="${ $param.identificador }" type="${ $param.type }" class="form-grid__item-input ${ $param.classFormats }" placeholder="${ $param.placeHolder }" value="${ $param.valueInput }">
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderSpanText":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <span id="${ $param.identificador }" class="form-grid-item__text ${ $param.classSpecial }">${ $param.spanText }</span>
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderTextArea":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <div class="form-grid__item-col">
                                <textarea id="${ $param.identificador }" class="form-grid__item-input from-grid__textarea" placeholder="Agrega una descripcion..." name="" id=""></textarea>
                            </div>
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderInputWithIconAndModal":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col form-grid__item-twocol">
                            <input ${ $param.add_attributos_inputs } maxlength="${ $param.maxLength }" id="${ $param.identificador }" type="${ $param.type }" class="form-grid__item-input ${ $param.classFormats }" placeholder="${ $param.placeHolder }" value="${ $param.valueInput }">
                            <img ${ $param.add_attributos_img } class="form-grid__item-ico ${ $param.modalClass }" data-latlng="${ $param.latlng }" src="src/assets/${ $param.svg }" alt="">
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderSelectOption":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <div class="form-grid__item-col">
                                <div class="select-nav-container form-grid-nav-container">
                                    <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current">
                                        <span id="${ $param.identificador }" class="select-nav__pagination__number select-nav__main-item" data-val="" data-select="" data-default="${ $param.headerList }">${ $param.headerList }</span>
                                        <span class="select-nav__icon">
                                            <span class="arrow-down">
                                                <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg>
                                            </span>
                                        </span>
                                    </div>
                                    <ul class="select-nav pagination__numbers-list select-nav-list navfull-screen">
                                        ${
                                            $param.selectOption.reduce(
                                                ( _arrNew, _row, index ) => {
                                                    _arrNew.push( `<li
                                                                        class="select-nav__option select-nav__option-item"
                                                                        data-select="${ _row.text !== "Personalizado" ? index : "custom" }"
                                                                        data-val="${ _row.data }">
                                                                            ${ _row.text }
                                                                    </li>` );
                                                    return _arrNew;
                                                }
                                                , [ ]
                                            ).join( '' )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderSelectOptionWithCheckBox":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <div class="form-grid__item-col">
                                <div class="select-nav-container form-grid-nav-container">
                                    <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current">
                                        <span id="${ $param.identificador }" class="select-nav__pagination__number select-nav__main-item" data-select="" data-default="${ $param.headerList }">${ $param.headerList }</span>
                                        <span class="select-nav__icon">
                                            <span class="arrow-down">
                                                <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg>
                                            </span>
                                        </span>
                                    </div>
                                    <ul class="select-nav pagination__numbers-list select-nav-list navfull-screen fullscreen-check">
                                        ${
                                            $param.selectOption.reduce(
                                                ( _arrNew, _row, index ) => {
                                                    _arrNew.push( `<li
                                                                        class="select-nav__option select-nav__option-item"
                                                                        data-val="${ _row.data }"
                                                                        data-select="${ index }">

                                                                        <input class="form-grid__item-checkbox" id="checkbox_${ $param.identificador }_${ index }" type="checkbox">
                                                                        <label class="checkbox-label button" for="checkbox_${ $param.identificador }_${ index }">
                                                                            <span class="square-checkbox form-grid__item-checkbox-radius">
                                                                                <span class="square-checkbox__checked">
                                                                                    <img class="square-checkbox__ico" src="src/assets/check.svg" alt="">
                                                                                </span>
                                                                            </span>
                                                                            <span class="checkLabel__text">${ _row.text }</span>
                                                                        </label>

                                                                    </li>` );
                                                        return _arrNew;
                                                    }
                                                    , [ ]
                                                ).join( "" )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderSpanTextWithIconAndModal":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col form-grid__item-twocol">
                            <span id="${ $param.identificador }" class="form-grid-item__text">${ $param.spanText }</span>
                            <img class="form-grid__item-ico ${ $param.modalClass }" data-selector="${ $param.selector }" src="src/assets/${ $param.svg }" alt="">
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderDateTime":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <div class="form-grid__item-col">
                                <input id="${ $param.identificador }" class="form-grid__item-input" type="date">
                            </div>
                        </div>
                    </li>`;

            return $li;

        case "OnlyButton":
            $li = `<li class="form-grid__item form-grid__item-singlerow ${ $param.classHiden }">
                        <div class="generic-btn">
                            <span ${ $param.add_attributos_inputs } id="${ $param.identificador }" class="generic-btn__text formDinamic-Triggers-Btn" data-links="${ $param.links }">${ $param.spanText }</span>
                        </div>
                    </li>`;

        return $li;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        case "OnlyDateTime":
            $li = `<li class="form-grid__item form-grid__item-singlerow ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <div class="form-grid__item-col">
                                <input id="${ $param.identificador }" class="form-grid__item-input" type="datetime-local">
                            </div>
                        </div>
                    </li>`;

        return $li;

        case "SpanHeaderSpanTextWithIcon":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col form-grid__item-twocol">
                            <span id="${ $param.identificador }" class="form-grid-item__text">${ $param.spanText }</span>
                            <img class="form-grid__item-ico" src="src/assets/${ $param.svg }" alt="">
                        </div>
                    </li>`;

            return $li;

        case "SpanHeaderCheckBox":
            $li = `<li class="form-grid__item ${ $param.classHiden }">
                        <div class="form-grid__item-col">
                            <span class="form-grid__item-header">${ $param.spanHeader }</span>
                        </div>
                        <div class="form-grid__item-col">
                            <input id="${ $param.identificador }" class="form-grid__item-checkbox" type="checkbox">
                            <label class="checkbox-label button" for="${ $param.identificador }">
                                <span class="square-checkbox form-grid__item-checkbox-radius">
                                    <span class="square-checkbox__checked">
                                        <img class="square-checkbox__ico" src="src/assets/${ $param.svg }" alt="">
                                    </span>
                                </span>
                            </label>
                        </div>
                    </li>`;

            return $li;
    }
}