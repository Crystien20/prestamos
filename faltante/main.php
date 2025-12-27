<?php
	session_start();
	if ( !isset( $_SERVER[ 'HTTPS' ] ) || $_SERVER[ 'HTTPS' ] != 'on' ) {
		header( "Location: https://brksoftware.com/main.php" );
		exit( );
	}

    if( !isset( $_SESSION[ "Tranfer" ] ) ) {
        header( "Location: index.html" );
        exit();
    }

	$ini = date( "His" );
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="google" content="notranslate" />

    <link rel="stylesheet" href="src/css/main.css?again=<?php echo $ini; ?>">
    <link rel="stylesheet" href="src/css/extras.css?again=<?php echo $ini; ?>">
    <link rel="stylesheet" href="src/css/styleSplash.css?again=<?php echo $ini; ?>">
    <!--
        PARA EL CODIGO DE AREA, FALTA ENCAPSULARLO MEJOR Y OBTENER EL CODIGO DE AREA GENERADO POR EL PLUGIN
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
    -->
    <title>BRK SOFTWARE</title>
</head>
<body translate="no">
    <main class="main-section">
        <div class="main-loader">
            <div class="e-loadholder">
                <div class="m-loader">
                    <div class="e-text"></div>
                </div>
            </div>
        </div>

        <div class="toolbar-notifications">
            <div id="message-approve" class="toolbar-notifications__text-container"><p class="notify__text-content"></p><span class="palomita">&#10003;</span> </div>
            <div id="message-error" class="toolbar-notifications__text-container"><p class="notify__text-content"></p><span class="palomita"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg></span> </div>
        </div>

        <div class="light-layout"></div>
        <div id="insercion" style="position: absolute; left: -1000px; z-index: -1"></div>

        <section class="modal notifications">
            <div class="scroll-container">
                <div class="modal__controls">
                    <div class="modal__close-btn -out button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
                <div> <h2></h2> </div>
                <div class="modal__main-content"> </div>
            </div>
        </section>

        <section class="modal modal-transparent lock-user">
            <div class="scroll-container">
                <div class="modal__controls">
                    <div class="modal__close-btn -out button dark__close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
              <div class="modal__main-content modal-form-content">
                <div class="modal-form"> 
                    <h2 class="modal-form__title">Introduce el Código</h2>
                    <div class="modal-form__inputs">
                        <input type="password" class="modal-form__input form-grid__item-input">
                        <div class="generic-btn modal-form__button">
                            <span id="btnOkCode" class="generic-btn__text">Aceptar</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </section>

        <section class="modal gallery">
            <div class="scroll-container">
                <div class="modal__controls">
                    <div class="modal__close-btn -out button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
                <div class="modal__main-content">
                    <div class="modal__title">
                        <h2 class="modal__title-text">Galería</h2>
                    </div>
                    <section class="modal-gallery__main">
                        <div class="gallery__picture-Btn">
                            <label class="gallery__picture__label" for="files">
                                <img class="gallery__picture__label-img" src="src/assets/gallery.svg" alt="">
                                <span class="gallery__picture__label-text">Subir Imagen</span>
                            </label>
                            <input class="gallery__picture__input" type="file" id="files" name="files" accept=".png, .jpg, .jpeg">
                        </div>
                        <div class="modal-gallery-pictures">
                            <ul class="modal-gallery-pictures__list"> </ul>
                        </div>
                        <div class="modal-gallery-main-picture">
                            <div class="modal-gallery-main-picture-content"></div>
                            <div class="modal__btn">
                                <span class="modal__btn-content modal-gallery__saveBtn">Marcar como Principal</span>
                            </div>
                        </div>
                        <template id="template-gallery-user-picture">
                            <li class="modal-gallery-pictures__item button">
                                <span class="modal-gallery-selected-picture hide">
                                    <span class="modal-gallery-checkBtn">
                                        <svg class="modal-gallery-checkBtn-ico" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z"/></svg>
                                    </span>
                                </span>
                                <span class="delete-item-Btn"><span class="crossBtn">+</span></span>
                                <img src="" alt="" class="modal-gallery-pictures__item-img">
                            </li>
                        </template>
                    </section>
                </div>
            </div>
        </section>

        <section class="modal minimap">
            <div class="scroll-container">
                <div class="modal__controls">
                    <div class="modal__close-btn -out button dark__close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
                <div>
                    <!-- SELECTORES DE BUSQUEDA -->
                    <div class="form-grid__container hide" id="onlyMapFollowing">
                        <form class="form-grid" action="">
                            <ul class="form-grid__items">
                                <li class="form-grid__item">
                                    <div class="form-grid__item-col">
                                        <span class="form-grid__item-header">Cobradores</span>
                                    </div>
                                    <div class="form-grid__item-col">
                                        <div class="select-nav-container form-grid-nav-container">
                                            <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current">
                                                <span class="select-nav__pagination__number select-nav__main-item">Lista de Cobradores</span>
                                                <span class="select-nav__icon">
                                                <span class="arrow-down">
                                                    <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g>
                                                    </svg>
                                                </span>
                                                </span>
                                            </div>
                                            <ul class="select-nav pagination__numbers-list select-nav-list navfull-screen ul_cobradores">
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li class="form-grid__item">
                                    <div class="form-grid__item-col">
                                        <span class="form-grid__item-header">Clientes</span>
                                    </div>
                                    <div class="form-grid__item-col">
                                        <div class="select-nav-container form-grid-nav-container">
                                            <div class="select-nav__option select-nav__main select_current-selection button pagination__numbers-current">
                                                <span class="select-nav__pagination__number select-nav__main-item">Lista de Clientes</span>
                                                <span class="select-nav__icon">
                                                <span class="arrow-down">
                                                    <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g>
                                                    </svg>
                                                </span>
                                                </span>
                                            </div>
                                            <ul class="select-nav pagination__numbers-list select-nav-list navfull-screen ul_clientes">
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li class="form-grid__item form-grid__item-singlerow">
                                    <div class="generic-btn">
                                        <span class="generic-btn__text" onclick="irAGoogleMaps( 'generar' )">Visualizar Ruta</span>
                                    </div>
                                </li>
                                <li class="form-grid__item form-grid__item-singlerow">
                                    <div class="generic-btn">
                                        <span class="generic-btn__text" onclick="irAGoogleMaps( 'togo' )">Ir a Google Maps para Seguimiento</span>
                                    </div>
                                </li>
                            </ul>
                        </form>
                    </div>
                    <!-- SELECTORES DE BUSQUEDA -->
                </div>
                <div class="modal__main-content" id="contentMap">
                </div>
            </div>
        </section>

        <section class="modal lock-user">
            <div class="scroll-container">
                <div class="modal__controls">
                    <div class="modal__close-btn -out button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
                <div> <h2></h2></div>
                <div class="modal__main-content">
                </div>
            </div>
        </section>

        <section class="modal modal-transparent notify-windows">
            <div class="scroll-container">
                <div class="modal__controls hide" id="_eventual">
                    <div class="modal__close-btn -out button dark__close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>
                    </div>
                </div>
            <div class="modal__main-content modal-form-content">
                <div class="modal-form"> 
                    <h2 class="modal-form__title"></h2>
                    <div class="modal-form__inputs">
                        <p class="modal-notifywindows__text"></p>
                        <div class="generic-btn modal-form__button">
                            <span class="generic-btn__text modal-form__closeBtn button">Aceptar</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>

        <div class="chat">
            <div class="title-section">
                <h2 class="title-section__text">Mensajes</h2>
                <div class="closeBtn button hover-item">
                    <span class="closeBtn__line left-line"></span>
                    <span class="closeBtn__line right-line"></span>
                </div>
            </div>

            <ul class="chat-list" id="listaChats">
            </ul>

            <div class="chat-window">
                <div class="chat-window__header">
                    <span class="chat-window__title" id="chat_window_title"></span>
                    <div class="backBtn button hover-item">
                        <span class="backBtn__item"><svg class="backBtn__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(90 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg></span>
                    </div>
                </div>
                <div class="chat-window__body">
                    <div class="light-layout"></div>
                    <ul class="chat-window__messages" id="chat_window_messages">
                    </ul>
                </div>
                <div class="chat-window__message">
                    <div class="chat-window__message-content">
                        <textarea class="chat-window__input-message" name="" id="contentMenssage" cols="26" rows="2" placeholder="Escribe tu mensaje..."></textarea>
                    </div>
                    <div class="chat-window-sendBtn">
                        <button id="chat_window_sendBtn_item" class="button chat-window-sendBtn__item" value="Send"><svg class="backBtn__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m17.71 11.29l-5-5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-5 5a1 1 0 0 0 1.42 1.42L11 9.41V17a1 1 0 0 0 2 0V9.41l3.29 3.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"/></svg></button>
                    </div>
                </div>
            </div>
        </div>


        <div class="container">
            <div class="hamburguer-menu hover-item">
                <span class="hamburguer-menu__line line-one"></span>
                <span class="hamburguer-menu__line line-two"></span>
                <span class="hamburguer-menu__line line-three"></span>
            </div>
            <section class="menu">
                <div class="light-layout"></div>
                <div class="menu-backdrop"></div>
                <nav class="menu-nav">
                    <div class="menu-nav__logo">
                        <img class="menu-nav__logo-img" src="src/assets/logo.svg" alt="">
                    </div>
                    <ul class="menu-nav__list">
                        <li class="menu-nav__item hide">
                            <span class="menu-nav__item-anchor button dashboardBtn">
                                <span class="menu-nav__item-content">
                                </span>
                            </span>
                        </li>

<?php
	function creador( $wh, $class_add ) {
		$svg = '';
		$texto = '';

        $listar = isset( $class_add[ "listar" ] );
        $supervisar = isset( $class_add[ "supervisar" ] );
        $lista_blanca = isset( $class_add[ "lista_blanca" ] );
        $lista_negra = isset( $class_add[ "lista_negra" ] );
		$advanced = isset( $class_add[ "advanced" ] );
        $agregar = isset( $class_add[ "agregar" ] );
        $usuario = isset( $class_add[ "usuario" ] );
        $modificar = isset( $class_add[ "modificar" ] );
        $eliminar = isset( $class_add[ "eliminar" ] );
        $privilegios = isset( $class_add[ "privilegios" ] );
        $cuentas = isset( $class_add[ "cuentas" ] );
        $asignar = isset( $class_add[ "asignar" ] );
        $cuotas = isset( $class_add[ "cuotas" ] );
        $abonos = isset( $class_add[ "abonos" ] );
        $visitadas = isset( $class_add[ "visitadas" ] );
        $pendientes = isset( $class_add[ "pendientes" ] );
        $monedas = isset( $class_add[ "monedas" ] );
        $diario = isset( $class_add[ "diario" ] );
        $semanal = isset( $class_add[ "semanal" ] );
        $mapa = isset( $class_add[ "mapa" ] );
        $aumentoCredito = isset( $class_add[ "aumentoCredito" ] );
        $enrutar = isset( $class_add[ "enrutar" ] );

		switch( $wh ){
			case "ad":
				$svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path fill="currentColor" d="M2048 1792h-227q48 53 73 118t26 138h-128q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100h-128q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100H512q0-52 14-102t39-93t63-80t83-61q-34-35-52-81t-19-95q0-69 34-127t94-93v-292q0-30 13-57t38-45q-55-73-135-113t-172-41q-80 0-149 30t-122 82t-83 123t-30 149H0q0-73 20-141t57-129t91-108t118-81q-75-54-116-135t-42-174q0-79 30-149t82-122t122-83T512 0q79 0 149 30t122 82t83 123t30 149q0 93-41 174T738 694q68 34 123 85t94 117h357q31 0 54-9t43-24t41-31t46-31t58-23t78-10h288q27 0 50 10t40 27t28 41t10 50v896zM512 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 53 20 99t55 82t81 55t100 20zm384 1024q27 0 50-10t40-27t28-41t10-50q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50q0 27 10 50t27 40t41 28t50 10zm640 0q27 0 50-10t40-27t28-41t10-50q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50q0 27 10 50t27 40t41 28t50 10zm384-512h-288q-45 0-78-9t-58-24t-45-31t-41-31t-44-23t-54-10H896v256q53 0 99 20t82 55t55 81t20 100q0 49-18 95t-53 81q83 46 135 124q52-78 135-124q-34-35-52-81t-19-95q0-53 20-99t55-82t81-55t100-20q53 0 99 20t82 55t55 81t20 100q0 34-9 66t-27 62h164v-512zm0-256h-288q-23 0-41 5t-34 13t-31 20t-32 26q16 14 31 25t32 20t34 14t41 5h288V896z"/></svg>';
				$texto = 'Administradores';

				break;
			case "se":
				$svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M15 14h.01M9 6h6m-6 4h6"/></g></svg>';
				$texto = 'Secretarios';

				break;
			case "su":
				$svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1152 512H896V256h128v128h128v128zm512 1032q42 11 77 35t60 57t40 73t15 83q0 53-20 99t-55 82t-81 55t-100 20q-53 0-99-20t-82-55t-55-81t-20-100q0-43 14-83t39-73t61-57t78-35v-264h-512v264q42 11 77 35t60 57t40 73t15 83q0 53-20 99t-55 82t-81 55t-100 20q-53 0-99-20t-82-55t-55-81t-20-100q0-43 14-83t39-73t61-57t78-35v-264H384v264q42 11 77 35t60 57t40 73t15 83q0 53-20 99t-55 82t-81 55t-100 20q-53 0-99-20t-82-55t-55-81t-20-100q0-43 14-83t39-73t61-57t78-35v-392h640V891q-83-11-153-50t-122-99t-80-135t-29-159q0-93 35-174t96-143t142-96T960 0q93 0 174 35t143 96t96 142t35 175q0 83-29 158t-80 135t-121 99t-154 51v261h640v392zM640 448q0 66 25 124t68 102t102 69t125 25q66 0 124-25t101-68t69-102t26-125q0-66-25-124t-69-101t-102-69t-124-26q-66 0-124 25t-102 69t-69 102t-25 124zM448 1792q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50q0 27 10 50t27 40t41 28t50 10q27 0 50-10t40-27t28-41t10-50zm640 0q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50q0 27 10 50t27 40t41 28t50 10q27 0 50-10t40-27t28-41t10-50zm512 128q27 0 50-10t40-27t28-41t10-50q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50q0 27 10 50t27 40t41 28t50 10z"/></svg>';
				$texto = 'Supervisores';

				break;
			case "co":
				$svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5V3M5.5 8.5c0 .75.67 1 1.5 1s1.5 0 1.5-1c0-1.5-3-1.5-3-3c0-1 .67-1 1.5-1s1.5.38 1.5 1M7 9.5V11"/><circle cx="7" cy="7" r="6.5"/></g></svg>';
				$texto = 'Cobradores';

				break;
			case "cl":
				$svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M15 14s1 0 1-1s-1-4-5-4s-5 3-5 4s1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276c.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0a3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4c0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904c.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724c.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0a3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"/></svg>';
				$texto = 'Clientes';

				break;
            case "rt":
                $svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M11 6L6 42M37 6l4.964 35.955M24 6v6m0 23v7m0-22v7"/></svg>';
                $texto = 'Rutas';

                break;
            case "mo":
                $svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16 13c-2.761 0-5-1.12-5-2.5S13.239 8 16 8s5 1.12 5 2.5s-2.239 2.5-5 2.5Zm-5 1.5c0 1.38 2.239 2.5 5 2.5s5-1.12 5-2.5m-18-5C3 10.88 5.239 12 8 12c1.126 0 2.165-.186 3-.5M3 13c0 1.38 2.239 2.5 5 2.5c1.126 0 2.164-.186 3-.5"/><path d="M3 5.5v11C3 17.88 5.239 19 8 19c1.126 0 2.164-.186 3-.5m2-10v-3m-2 5v8c0 1.38 2.239 2.5 5 2.5s5-1.12 5-2.5v-8"/><path d="M8 8C5.239 8 3 6.88 3 5.5S5.239 3 8 3s5 1.12 5 2.5S10.761 8 8 8Z"/></g></svg>';
                $texto = 'Monedas';

                break;
            case "lq":
                $svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="currentColor" d="M4 15.25A6.25 6.25 0 0 1 10.25 9h27.5A6.25 6.25 0 0 1 44 15.25v17.5A6.25 6.25 0 0 1 37.75 39h-27.5A6.25 6.25 0 0 1 4 32.75v-17.5Zm6.25-3.75a3.75 3.75 0 0 0-3.75 3.75v3.25h35v-3.25a3.75 3.75 0 0 0-3.75-3.75h-27.5ZM6.5 32.75a3.75 3.75 0 0 0 3.75 3.75h27.5a3.75 3.75 0 0 0 3.75-3.75V21h-35v11.75Zm24.75-3.25a1.25 1.25 0 1 0 0 2.5h5.5a1.25 1.25 0 1 0 0-2.5h-5.5Z"/></svg>';
                $texto = 'Liquidacion';

                break;
            case "mp":
                $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100"><path fill="rgb(26, 152, 255)" d="M21 32C9.459 32 0 41.43 0 52.94c0 4.46 1.424 8.605 3.835 12.012l14.603 25.244c2.045 2.672 3.405 2.165 5.106-.14l16.106-27.41c.325-.59.58-1.216.803-1.856A20.668 20.668 0 0 0 42 52.94C42 41.43 32.544 32 21 32Zm0 9.812c6.216 0 11.16 4.931 11.16 11.129c0 6.198-4.944 11.127-11.16 11.127c-6.215 0-11.16-4.93-11.16-11.127c0-6.198 4.945-11.129 11.16-11.129zM87.75 0C81.018 0 75.5 5.501 75.5 12.216c0 2.601.83 5.019 2.237 7.006l8.519 14.726c1.193 1.558 1.986 1.262 2.978-.082l9.395-15.99c.19-.343.339-.708.468-1.082a12.05 12.05 0 0 0 .903-4.578C100 5.5 94.484 0 87.75 0Zm0 5.724c3.626 0 6.51 2.876 6.51 6.492c0 3.615-2.884 6.49-6.51 6.49c-3.625 0-6.51-2.875-6.51-6.49c0-3.616 2.885-6.492 6.51-6.492z"/><path fill="currentColor" fill-rule="evenodd" d="M88.209 37.412c-2.247.05-4.5.145-6.757.312l.348 5.532a126.32 126.32 0 0 1 6.513-.303zm-11.975.82c-3.47.431-6.97 1.045-10.43 2.032l1.303 5.361c3.144-.896 6.402-1.475 9.711-1.886zM60.623 42.12a24.52 24.52 0 0 0-3.004 1.583l-.004.005l-.006.002c-1.375.866-2.824 1.965-4.007 3.562c-.857 1.157-1.558 2.62-1.722 4.35l5.095.565c.038-.406.246-.942.62-1.446h.002v-.002c.603-.816 1.507-1.557 2.582-2.235l.004-.002a19.64 19.64 0 0 1 2.388-1.256zM58 54.655l-3.303 4.235c.783.716 1.604 1.266 2.397 1.726l.01.005l.01.006c2.632 1.497 5.346 2.342 7.862 3.144l1.446-5.318c-2.515-.802-4.886-1.576-6.918-2.73c-.582-.338-1.092-.691-1.504-1.068Zm13.335 5.294l-1.412 5.327l.668.208l.82.262c2.714.883 5.314 1.826 7.638 3.131l2.358-4.92c-2.81-1.579-5.727-2.611-8.538-3.525l-.008-.002l-.842-.269zm14.867 7.7l-3.623 3.92c.856.927 1.497 2.042 1.809 3.194l.002.006l.002.009c.372 1.345.373 2.927.082 4.525l5.024 1.072c.41-2.256.476-4.733-.198-7.178c-.587-2.162-1.707-4.04-3.098-5.548zM82.72 82.643a11.84 11.84 0 0 1-1.826 1.572h-.002c-1.8 1.266-3.888 2.22-6.106 3.04l1.654 5.244c2.426-.897 4.917-1.997 7.245-3.635l.006-.005l.003-.002a16.95 16.95 0 0 0 2.639-2.287zm-12.64 6.089c-3.213.864-6.497 1.522-9.821 2.08l.784 5.479c3.421-.575 6.856-1.262 10.27-2.18zm-14.822 2.836c-3.346.457-6.71.83-10.084 1.148l.442 5.522c3.426-.322 6.858-.701 10.285-1.17zm-15.155 1.583c-3.381.268-6.77.486-10.162.67l.256 5.536c3.425-.185 6.853-.406 10.28-.678zm-15.259.92c-2.033.095-4.071.173-6.114.245l.168 5.541a560.1 560.1 0 0 0 6.166-.246z" color="rgb(26, 152, 255)"/></svg>';
                $texto = 'Mapa Global';

                break;
            case "noti":
                $svg = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14c0-3.771 0-5.657 1.172-6.828C4.343 6 6.229 6 10 6h4c3.771 0 5.657 0 6.828 1.172C22 8.343 22 10.229 22 14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14Zm14-8c0-1.886 0-2.828-.586-3.414C14.828 2 13.886 2 12 2c-1.886 0-2.828 0-3.414.586C8 3.172 8 4.114 8 6"/><path stroke-linecap="round" d="M12 17.333c1.105 0 2-.746 2-1.666c0-.92-.895-1.667-2-1.667s-2-.746-2-1.667c0-.92.895-1.666 2-1.666m0 6.666c-1.105 0-2-.746-2-1.666m2 1.666V18m0-8v.667m0 0c1.105 0 2 .746 2 1.666"/></g></svg>';
                $texto = 'Solicitudes';

                break;
		}

		if( $listar )
            $listar = '<li class="menu-nav__item button ' . $class_add[ "listar" ] . '">Listar</li>';

		if( $supervisar )
            $supervisar = '<li class="menu-nav__item button ' . $class_add[ "supervisar" ] . '">Supervisar</li>';

        if( $lista_blanca )
            $lista_blanca = '<li class="menu-nav__item button ' . $class_add[ "lista_blanca" ] . '">Lista Blanca <span id="listWhite" class="numero"></span></li>';

        if( $lista_negra )
            $lista_negra = '<li class="menu-nav__item button ' . $class_add[ "lista_negra" ] . '">Lista Negra <span id="listBlack" class="numero"></span></li>';

        if( $advanced )
            $advanced = '<li class="menu-nav__item button ' . $class_add[ "advanced" ] . '">Adelantados <span id="listAdvanced" class="numero"></span></li>';

		if( $agregar )
			$agregar = '<li class="menu-nav__item button ' . $class_add[ "agregar" ] . '">Crear Nuevo</li>';

		if( $usuario )
			$usuario = '<li class="menu-nav__item button ' . $class_add[ "usuario" ] . '">Gestión de Usuarios</li>';

		if( $cuentas )
			$cuentas = '<li class="menu-nav__item button ' . $class_add[ "cuentas" ] . '">Ver Cuentas</li>';

		if( $asignar )
			$asignar = '<li class="menu-nav__item button ' . $class_add[ "asignar" ] . '">Asignar Préstamo</li>';

		if( $cuotas )
			$cuotas = '<li class="menu-nav__item button ' . $class_add[ "cuotas" ] . '">Cargar Cuotas</li>';

		if( $abonos )
			$abonos = '<li class="menu-nav__item button ' . $class_add[ "abonos" ] . '">Cargar Abonos</li>';

        if( $visitadas )
            $visitadas = '<li class="menu-nav__item button ' . $class_add[ "visitadas" ] . '">Clientes Visitados</li>';

        if( $pendientes )
            $pendientes = '<li class="menu-nav__item button ' . $class_add[ "pendientes" ] . '">Clientes Pendientes</li>';

        if( $monedas )
            $monedas = '<li class="menu-nav__item button ' . $class_add[ "monedas" ] . '">Crear</li>';

        if( $diario )
            $diario = '<li class="menu-nav__item button ' . $class_add[ "diario" ] . '">Reporte del Dia</li>';

        if( $semanal )
            $semanal = '<li class="menu-nav__item button ' . $class_add[ "semanal" ] . '">Reporte de la Semana</li>';

        if( $mapa )
            $mapa = '<li class="menu-nav__item button ' . $class_add[ "mapa" ] . '">Ver Mapa Global</li>';

        if( $aumentoCredito )
            $aumentoCredito = '<li class="menu-nav__item button ' . $class_add[ "aumentoCredito" ] . '">Solicitudes de Aumento Crediticio</li>';

        if( $enrutar )
            $enrutar = '<li class="menu-nav__item button ' . $class_add[ "enrutar" ] . '">Enrutar Clientes</li>';

        return "<li class='menu-nav__item' data-link='" . strtolower( $texto ) . "'>
					<span class='menu-nav__item-anchor'>
						<span class='menu-nav__item-content'>
							$svg
							<span class='menu-nav__item-text'>$texto</span>
						</span>
						<span class='arrow-down'>
							<svg class='arrow-down-svg-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'><g transform='rotate(180 512 512)'><path fill='currentColor' d='M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z'/></g></svg>
						</span>
					</span>
					<ul class='menu-nav__sublist'>
						$listar $supervisar $lista_blanca
                        $lista_negra $advanced $agregar $usuario
						$modificar $eliminar $privilegios
						$cuentas $asignar $cuotas $abonos
						$visitadas $pendientes $monedas
                        $diario $semanal $mapa $aumentoCredito
                        $enrutar
					</ul>
				</li>";
	}

    function nuevoBloque( $icono, $titulo, $texto, $class, $link ) {
        return "<div class='grid-dashboard__block'>
                    <img class='grid-dashboard__icon' src='src/assets/$icono.svg' alt=''>
                    <h3 class='grid-dashboard__title'>$titulo</h3>
                    <p class='grid-dashboard__text'>$texto</p>
                    <div class='generic-btn generic-btn__text grid-dashboard-btn $class' data-link='$link'>Ver mas</div>
                </div>";
    }

    $ObjetoActual = $_SESSION[ "Tranfer" ];
    $_this = "";
    $_sw = "";
    $modulosDashboard = "";
    $_entidad = "";

    switch( $ObjetoActual[ "nv" ] ) {
        case "A":
            $_this = $ObjetoActual[ "ma" ];
            $_sw = "ma";
            $_entidad = "Master: ";

            echo creador(
                            wh: "ad",
                            class_add: [
                                            "listar" => "blocView__show showadmin",
                                            "agregar" => "blocView__new newadmin",
                                            "usuario" => "blocView__createUser useradmin"
                                        ]
                        );

            echo creador(
                            wh: "mo",
                            class_add: [
                                            "listar" => "blocView__show showmoney",
                                            "monedas" => "blocView__show newmoney"
                                        ]
                        );

            $modulosDashboard .= nuevoBloque( "lupa", "Lista Administradores", "Acceda rápidamente a la lista de todos los administradores vinculados a su Cuenta", "blocView__show showadmin", "administradores" );
            $modulosDashboard .= nuevoBloque( "hand-card", "Lista Monedas", "Verifique con solo 1 click las monedas creadas y disponibles en el sistema", "blocView__show showmoney", "monedas" );

            break;
        case "B":
            $_this = $ObjetoActual[ "ad" ];
            $_sw = "ad";
            $_entidad = "Administrador: ";

            echo creador(
                            wh: "se",
                            class_add: [
                                            "listar" => "blocView__show showsecre",
                                            "agregar" => "blocView__new newsecre",
                                            "usuario" => "blocView__createUser usersecre"
                                        ]
                        );

            echo creador(
                            wh: "su",
                            class_add: [
                                            "listar" => "blocView__show showsuper",
                                            "agregar" => "blocView__new newsuper",
                                            "usuario" => "blocView__createUser usersuper"
                                        ]
                        );

            echo creador(
                            wh: "co",
                            class_add: [
                                            "listar" => "blocView__show showcobra",
                                            "agregar" => "blocView__new newcobra",
                                            "usuario" => "blocView__createUser usercobra"
                                        ]
                        );

            echo creador(
                            wh: "noti",
                            class_add: [
                                            "aumentoCredito" => "blocView__show creditospendientes"
                                        ]
                        );

            echo creador(
                            wh: "rt",
                            class_add: [
                                            "visitadas" => "blocView__show showvisitados",
                                            "pendientes" => "blocView__show showpendientes"
                                    ]
                        );

            echo creador(
                            wh: "lq",
                            class_add: [
                                            "diario" => "blocView__show generarreport",
                                            "semanal" => "blocView__show showreport"
                                    ]
                        );

            echo creador(
                            wh: "mp",
                            class_add: [
                                            "mapa" => "blocView__show mapa"
                                    ]
                        );

            $modulosDashboard .= nuevoBloque( "plus", "Crear Nuevo Secretario", "Cree y vincule un nuevo Secretario. Datos como Teléfono y Zona Horaria es obligatorio que sean fieles a los datos reales para garantizar el funcionamiento del sistema", "blocView__new newsecre", "secretarios" );
            $modulosDashboard .= nuevoBloque( "plus", "Crear Nuevo Supervisor", "Cree y vincule un nuevo Supervisor. Datos como Teléfono y Zona Horaria es obligatorio que sean fieles a los datos reales para garantizar el funcionamiento del sistema", "blocView__new newsuper", "supervisores" );
            $modulosDashboard .= nuevoBloque( "plus", "Crear Nuevo Cobrador", "Cree y vincule un nuevo Cobrador. Datos como Teléfono y Zona Horaria es obligatorio que sean fieles a los datos reales para garantizar el funcionamiento del sistema", "blocView__new newcobra", "cobradores" );
            //$modulosDashboard .= nuevoBloque( "user-list", "Clientes Pendientes", "Consulta la lista de los clientes pendientes por visitar el día de Hoy sin perdida de tiempo", "blocView__show showpendientes", "rutas" );
            //$modulosDashboard .= nuevoBloque( "paid-checked", "Generador de Reporte", "Nada es mas facil y rápido que sabes el movimiento del Día con solo un click, chequea los montos y/o genera la liquidación", "blocView__show generarreport", "liquidacion" );

            break;
        case "C":
            $_this = $ObjetoActual[ "se" ];
            $_sw = "se";
            $_entidad = "Secretario: ";

            echo creador(
                            wh: "su",
                            class_add: [
                                            "listar" => "blocView__show showsuper",
                                            "usuario" => "blocView__createUser usersuper"
                                        ]
                        );

            echo creador(
                            wh: "co",
                            class_add: [
                                            "listar" => "blocView__show showcobra",
                                            "usuario" => "blocView__createUser usercobra"
                                        ]
                        );

            echo creador(
                            wh: "noti",
                            class_add: [
                                            "aumentoCredito" => "blocView__show creditospendientes"
                                        ]
                        );

            echo creador(
                            wh: "rt",
                            class_add: [
                                            "visitadas" => "blocView__show showvisitados",
                                            "pendientes" => "blocView__show showpendientes"
                                    ]
                        );

            echo creador(
                            wh: "lq",
                            class_add: [
                                            "diario" => "blocView__show generarreport",
                                            "semanal" => "blocView__show showreport"
                                    ]
                        );

            echo creador(
                            wh: "mp",
                            class_add: [
                                            "mapa" => "blocView__show mapa"
                                    ]
                        );

            $modulosDashboard .= nuevoBloque( "user-list", "Listado de Supervisores", "Consultar el listado de los Supervisores registrados en Nuestro Sistema", "blocView__show showsuper", "supervisores" );
            $modulosDashboard .= nuevoBloque( "user-list", "Listado de Cobradores", "Consultar el listado de los Cobradores registrados en Nuestro Sistema", "blocView__show newcobra", "cobradores" );
            //$modulosDashboard .= nuevoBloque( "user-list", "Clientes Pendientes", "Consulta la lista de los clientes pendientes por visitar el día de Hoy sin perdida de tiempo", "blocView__show showpendientes", "rutas" );
            //$modulosDashboard .= nuevoBloque( "paid-checked", "Generador de Reporte", "Nada es mas facil y rápido que sabes el movimiento del Día con solo un click, chequea los montos y/o genera la liquidación", "blocView__show generarreport", "liquidacion" );
            
        break;
        case "D":
            $_this = $ObjetoActual[ "su" ];
            $_sw = "su";
            $_entidad = "Supervisor: ";

            echo creador(
                            wh: "co",
                            class_add: [
                                            "listar" => "blocView__show showcobra",
                                            "supervisar" => "blocView__show showsupervisar"
                                        ]
                        );

            echo creador(
                            wh: "rt",
                            class_add: [
                                            "visitadas" => "blocView__show showvisitados",
                                            "pendientes" => "blocView__show showpendientes"
                                    ]
                        );

            echo creador(
                            wh: "lq",
                            class_add: [
                                            "diario" => "blocView__show generarreport",
                                            "semanal" => "blocView__show showreport"
                                    ]
                        );

            echo creador(
                            wh: "mp",
                            class_add: [
                                            "mapa" => "blocView__show mapa"
                                    ]
                        );

            $modulosDashboard .= nuevoBloque( "user-list", "Listado de Cobradores", "Consultar el listado de los Cobradores registrados en Nuestro Sistema", "blocView__show newcobra", "cobradores" );

            break;
        case "E":
            $_this = $ObjetoActual[ "co" ];
            $_sw = "co";
            $_entidad = "Cobrador: ";

            echo creador(
                            wh: "cl",
                            class_add: [
                                            "lista_blanca" => "blocView__show blanca showclien",
                                            "lista_negra" => "blocView__show negra showclien",
                                            "agregar" => "blocView__new newclien",
                                            "advanced" => "blocView__advanced advanced"
                                        ]
                        );

            echo creador(
                            wh: "noti",
                            class_add: [
                                            "aumentoCredito" => "blocView__show creditospendientes"
                                        ]
                        );

            echo creador(
                            wh: "rt",
                            class_add: [
                                            "visitadas" => "blocView__show showvisitados",
                                            "pendientes" => "blocView__show showpendientes",
                                            "enrutar" => "blocView__show enrutamiento"
                                    ]
                        );

            echo creador(
                            wh: "lq",
                            class_add: [
                                            "diario" => "blocView__show generarreport",
                                            "semanal" => "blocView__show showreport"
                                    ]
                        );

            echo creador(
                            wh: "mp",
                            class_add: [
                                            "mapa" => "blocView__show mapa"
                                    ]
                        );

            $modulosDashboard .= nuevoBloque( "plus", "Crear Nuevo Cliente", "Cree y vincule un nuevo Cliente. Datos como Teléfono y Zona Horaria es obligatorio que sean fieles a los datos reales para garantizar el funcionamiento del sistema", "blocView__new newclien", "clientes" );
            $modulosDashboard .= nuevoBloque( "graphics", "Asignar un Nuevo Préstamo", "Por este medio también podrás ir directamente ha asignar un préstamo al cliente seleccinado de tu lista.", "blocView__assignprest assignpresta", "prestamos" );
            $modulosDashboard .= nuevoBloque( "user-list", "Clientes Pendientes", "Consulta la lista de los clientes pendientes por visitar el día de Hoy sin perdida de tiempo", "blocView__show showpendientes", "rutas" );
            $modulosDashboard .= nuevoBloque( "paid-checked", "Generador de Reporte", "Nada es mas facil y rápido que sabes el movimiento del Día con solo un click, chequea los montos y/o genera la liquidación", "blocView__show generarreport", "liquidacion" );

            break;
    }
?>
                    </ul>
                </nav>
            </section>
            <section class="main-content">
                <div class="menu-user">
                    <ul class="menu-user__items">
                        <li class="menu-user__item menu-user-clock"><span id="reloj" class="menu-user-clock__content"></span></li>
                        <!--<li class="menu-user__item hover-item button exitSystem"><span class="notify-pointer"></span><svg class="svg-notify-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50"><path d="M 25 0 C 22.800781 0 21 1.800781 21 4 C 21 4.515625 21.101563 5.015625 21.28125 5.46875 C 15.65625 6.929688 12 11.816406 12 18 C 12 25.832031 10.078125 29.398438 8.25 31.40625 C 7.335938 32.410156 6.433594 33.019531 5.65625 33.59375 C 5.265625 33.878906 4.910156 34.164063 4.59375 34.53125 C 4.277344 34.898438 4 35.421875 4 36 C 4 37.375 4.84375 38.542969 6.03125 39.3125 C 7.21875 40.082031 8.777344 40.578125 10.65625 40.96875 C 13.09375 41.472656 16.101563 41.738281 19.40625 41.875 C 19.15625 42.539063 19 43.253906 19 44 C 19 47.300781 21.699219 50 25 50 C 28.300781 50 31 47.300781 31 44 C 31 43.25 30.847656 42.535156 30.59375 41.875 C 33.898438 41.738281 36.90625 41.472656 39.34375 40.96875 C 41.222656 40.578125 42.78125 40.082031 43.96875 39.3125 C 45.15625 38.542969 46 37.375 46 36 C 46 35.421875 45.722656 34.898438 45.40625 34.53125 C 45.089844 34.164063 44.734375 33.878906 44.34375 33.59375 C 43.566406 33.019531 42.664063 32.410156 41.75 31.40625 C 39.921875 29.398438 38 25.832031 38 18 C 38 11.820313 34.335938 6.9375 28.71875 5.46875 C 28.898438 5.015625 29 4.515625 29 4 C 29 1.800781 27.199219 0 25 0 Z M 25 2 C 26.117188 2 27 2.882813 27 4 C 27 5.117188 26.117188 6 25 6 C 23.882813 6 23 5.117188 23 4 C 23 2.882813 23.882813 2 25 2 Z M 27.34375 7.1875 C 32.675781 8.136719 36 12.257813 36 18 C 36 26.167969 38.078125 30.363281 40.25 32.75 C 41.335938 33.941406 42.433594 34.6875 43.15625 35.21875 C 43.515625 35.484375 43.785156 35.707031 43.90625 35.84375 C 44.027344 35.980469 44 35.96875 44 36 C 44 36.625 43.710938 37.082031 42.875 37.625 C 42.039063 38.167969 40.679688 38.671875 38.9375 39.03125 C 35.453125 39.753906 30.492188 40 25 40 C 19.507813 40 14.546875 39.753906 11.0625 39.03125 C 9.320313 38.671875 7.960938 38.167969 7.125 37.625 C 6.289063 37.082031 6 36.625 6 36 C 6 35.96875 5.972656 35.980469 6.09375 35.84375 C 6.214844 35.707031 6.484375 35.484375 6.84375 35.21875 C 7.566406 34.6875 8.664063 33.941406 9.75 32.75 C 11.921875 30.363281 14 26.167969 14 18 C 14 12.261719 17.328125 8.171875 22.65625 7.21875 C 23.320313 7.707031 24.121094 8 25 8 C 25.886719 8 26.679688 7.683594 27.34375 7.1875 Z M 21.5625 41.9375 C 22.683594 41.960938 23.824219 42 25 42 C 26.175781 42 27.316406 41.960938 28.4375 41.9375 C 28.792969 42.539063 29 43.25 29 44 C 29 46.222656 27.222656 48 25 48 C 22.777344 48 21 46.222656 21 44 C 21 43.242188 21.199219 42.539063 21.5625 41.9375 Z"/></svg></li>-->
						<li class="menu-user__item hover-item button exitSystem closeMain"><img src="src/assets/exit.svg" /></li>
						<li class="menu-user__item hover-item button refreshPage click_logo"><img src="src/assets/refresh.svg" /></li>
                        <li class="menu-user__item hover-item button chatBtn"><span class="notify-pointer hide"></span><svg class="svg-chat-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M1.944 16.75l1.696-2.758.287-.465-.237-.493c-.465-.951-.697-1.91-.69-3.034 0-3.866 3.134-7 7-7 3.866 0 7 3.134 7 7 0 3.866-3.134 7-7 7-1.14.007-2.112-.232-3.074-.709l-.268-.131-.296.037-4.418.552zm4.543.44c1.06.518 2.253.81 3.513.81 4.418 0 8-3.582 8-8 0-4.418-3.582-8-8-8-4.418 0-8 3.582-8 8 0 1.243.283 2.419.789 3.468l-2.117 3.44L0 18l1.272-.159 5.215-.652z" fill-rule="nonzero" fill-opacity="1" stroke="none"></path></svg></li>
                        <li class="menu-user__item menu-user-settings button hover-item">
                            <span class="menu-user__name"><?php echo $_entidad . $ObjetoActual[ "nombre" ]; ?></span>
                            <span class="arrow-down">
                                <svg class="arrow-down-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="rotate(180 512 512)"><path fill="currentColor" d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"/></g></svg>
                            </span>
                            <img id="fotoperfil" class="menu-user__img" src="src/assets/user.jpg">

                            <ul class="menu-user__settings-nav">
                                <!-- <li class="menu-user__settings-item hover-item button">Perfil</li> -->
                                <li class="menu-user__settings-item hover-item button changePass">Cambiar contraseña</li>
                                <li class="menu-user__settings-item hover-item switch-theme button">
                                    <div class="theme__btn">
                                        <img class="theme__icon" src="src/assets/sun.png" alt="">
                                        <img class="theme__icon" src="src/assets/moon.png" alt="">
                                        <div class="theme__picker"></div>
                                    </div>
                                </li>
                                <li class="menu-user__settings-item hover-item button closeMain">Cerrar Sesion</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="main-view">
     
                </div>
             
            </section>
        </div>
    </main>
    
    <a href="#" id="sendsms" target="_blank" style="position: absolute; left: -1000px; z-index: -1"></a>
    
    <script>
        const _DASHBOARD = `<?php echo $modulosDashboard; ?>`;
        const _VMA = "<?php echo $ObjetoActual[ "vma" ]; ?>";
        const _VAC = "<?php echo $ObjetoActual[ "vac" ]; ?>";
        const _NV = "<?php echo $ObjetoActual[ "nv" ]; ?>";
        const _NAME = "<?php echo $ObjetoActual[ "nombre" ]; ?>";
        const _ENTIDAD = "<?php echo $_entidad; ?>";
        const _THIS = "<?php echo $_this; ?>";
        const _SW = "<?php echo $_sw; ?>";
        const _SZH = "<?php echo $ObjetoActual[ "selectzh" ]; ?>";
        const _USU = "<?php echo $ObjetoActual[ "usu" ]; ?>";
        const _UNI = "<?php echo date( "dHis" ); ?>";
        const _IDU = "<?php echo $ObjetoActual[ "idu" ]; ?>";
        const _AD_CALL = "<?php echo $ObjetoActual[ "ad_call" ]; ?>";
        var datetime_available = "<?php echo $ObjetoActual[ "datetime_available" ]; ?>";

        reloj.textContent = "<?php echo $ObjetoActual[ "now" ]; ?>";
    </script>
    
    <script src="src/js/Splash.js?again=<?php echo $ini; ?>"></script>
    <script src="src/js/Class/Fabric.min.js"></script>
    <script src="src/js/Class/Cmains.js?again=<?php echo $ini; ?>"></script>
	<script src="src/js/Class/Operators.js?again=<?php echo $ini; ?>"></script>
	<script src="src/js/Triggers.js?again=<?php echo $ini; ?>"></script>
	<script src="src/js/TriggersForms.js?again=<?php echo $ini; ?>"></script>
	<script src="src/js/Settings.js?again=<?php echo $ini; ?>"></script>
	<script src="src/js/Chats.js?again=<?php echo $ini; ?>"></script>
    <script src="src/js/MainFunctions.js?again=<?php echo $ini; ?>"></script>
    <script src="src/js/MainTemplate.js?again=<?php echo $ini; ?>"></script>

    <script src="src/js/MainTable.js?again=<?php echo $ini; ?>"></script>
    <script src="src/js/MainFormDinamic.js?again=<?php echo $ini; ?>"></script>

    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBjHeE2KHEYvJPiDBxGH8hBVDJJpilCb-g&callback=iniMap"></script>
</body>
</html>