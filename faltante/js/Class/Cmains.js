class _manifiest {

	constructor( ) {
		this._Lat = 0;
		this._Lon = 0;
		this.updatePos = null;

		this.offset = 40;

		this.canvasWidth = 100 - this.offset;
		this.canvasHeight = 150 - this.offset;

		this.getLocation( );
	}
	
	getAll( ) {
		this._Lat = this.empty( this._Lat ) ? 0 : this._Lat;
		this._Lon = this.empty( this._Lon ) ? 0 : this._Lon;

		return Object.freeze( [
			this._Lat,
			this._Lon
		] );
	}

	_lets( url, js = null ) {
		return new Promise(
			async ( resolver, reject ) => {

				let data = '';
				let result, json;

				if( !this.empty( js ) )
					data = JSON.stringify( js );

				try {
					result = await fetch( url, {
													method: "POST",
													headers: {
														'Content-Type': 'application/json'
													},
													body: data
												} );

					json = await result.json( );
					resolver( json );
				}
				catch ( e ) {
					if( e.message !== "Unexpected end of JSON input" )
						console.log( e.message );

					resolver( [ ] );
				}
			}
		)
	}

	getLocation( ) {
		let options = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 300000
		};

		if ( navigator.geolocation )
			navigator.geolocation.watchPosition(
				async x => {
					this._Lat = x.coords.latitude;
					this._Lon = x.coords.longitude;

					if( !this.empty( typeof _NV ) && _NV === "E" )
						if( this._Lat != 0 && this._Lon != 0 ) {
							if( !this.empty( this.updatePos ) )
								clearTimeout( this.updatePos );

							this.updatePos = setTimeout( ( ) => {
								let arraySave = { };
								arraySave.switch = "update-marker-online";
								arraySave.latitud = this._Lat;
								arraySave.longitud = this._Lon;
								arraySave.this = _THIS;

								this._lets( `src/php/SetInformationBase.php`, arraySave ).then( ( ) => { this.updatePos = null; } );
							}, 100 );
						}
				}
				,
				( e )=> {
					switch( e.code ) {
						case e.PERMISSION_DENIED:
							notifyWindows( false, 'Funcionamiento del Sistema', "Debe activar la Geolocalización en su Dispositivo para que el sistema pueda funcionar correctamente. Espere 30seg o haga click en Aceptar", 30000 );
							//console.log( "El usuario denegó la solicitud de geolocalización." )

						break;
						case e.POSITION_UNAVAILABLE:
							shownotificationMessage( false, "La información de ubicación no está disponible." );
							//console.log( "La información de ubicación no está disponible." )

						break;
						case e.TIMEOUT:
							console.log( "Se agotó el tiempo de espera de la solicitud para obtener la ubicación del usuario." )

						break;
						case e.UNKNOWN_ERROR:
							console.log( "Un error desconocido ocurrió." )

						break;
					}
				}
				,
				options
			);

		else
			console.log( "La geolocalización no es compatible con este navegador." );

	}

	detectDevTool( ) {
		const time = 10;
		const start = performance.now( );
		debugger;
		const end = performance.now( );
		if ( end - start > time )
			return true;

		return false;
	}

	empty( e ) {
		switch ( e ) {
			case null:
			case undefined:
			case "null":
			case "undefined":
				return true;
	
			default:
				return false;
	
		}
	}

	gotaGoogleMaps( img, principal, unico = null ) {
		let nombreIMG = '', svg = '';

		if( principal ) {
			nombreIMG = "gotaGoogleMaps";
			svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 95.02 134.25">
						<defs>
							<style>
								.cls-1{
									fill:none;
									stroke:#2ac294;
									stroke-miterlimit:10;
								}
								.cls-2{
									fill:url(#Degradado_sin_nombre_88);
								}
								.cls-3{
									clip-path:url(#clip-path);
								}
							</style>
							<linearGradient id="Degradado_sin_nombre_88" x1="2.43" y1="26.84" x2="101.54" y2="97.97" gradientUnits="userSpaceOnUse">
								<stop offset="0" stop-color="#4fa3ff"/>
								<stop offset="0.25" stop-color="#4ea2fd"/>
								<stop offset="0.4" stop-color="#4c9cf5"/>
								<stop offset="0.51" stop-color="#4994e7"/>
								<stop offset="0.61" stop-color="#4388d3"/>
								<stop offset="0.7" stop-color="#3c78ba"/>
								<stop offset="0.78" stop-color="#34649b"/>
								<stop offset="0.86" stop-color="#2a4d75"/>
								<stop offset="0.93" stop-color="#1f324b"/>
								<stop offset="1" stop-color="#12141c"/>
								<stop offset="1" stop-color="#111218"/>
							</linearGradient>
							<clipPath id="clip-path" transform="translate(0 4.25)">
								<circle class="cls-1" cx="47.51" cy="46.5" r="43.5"/>
							</clipPath>
						</defs>
						<g id="Capa_2" data-name="Capa 2">
							<g id="Capa_2-2" data-name="Capa 2">
								<path class="cls-2" d="M86,19C72.44.62,50.16,0,48,0,46,0,23,.13,9,19A47.55,47.55,0,0,0,0,48C.29,58.71,4.34,66.48,20,90c7.11,10.66,16.49,24.32,28,40A400.76,400.76,0,0,0,77,90C93.29,64.35,95,55.22,95,48A47.89,47.89,0,0,0,86,19Z" transform="translate(0 4.25)"/>
								<g class="cls-3">
									<image width="600" height="600" transform="translate(2.72) scale(0.15)" xlink:href="${ img }"/>
								</g>
								<circle class="cls-1" cx="47.51" cy="50.75" r="43.5"/>
							</g>
						</g>
					</svg>`;
		}
		else {
			nombreIMG = "myposition";
			svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 95.02 134.25">
						<defs>
							<style>
								.cls-1{
									fill:none;
									stroke:#10fc9c;
									stroke-miterlimit:10;
								}
								.cls-2{
									fill:url(#Degradado_sin_nombre_131);
								}
								.cls-3{
									clip-path:url(#clip-path);
								}
							</style>
							<linearGradient id="Degradado_sin_nombre_131" x1="2.43" y1="26.84" x2="101.54" y2="97.97" gradientUnits="userSpaceOnUse">
								<stop offset="0" stop-color="#ff7d15"/>
								<stop offset="0.26" stop-color="#fd7c15"/>
								<stop offset="0.41" stop-color="#f57814"/>
								<stop offset="0.52" stop-color="#e77113"/>
								<stop offset="0.62" stop-color="#d36711"/>
								<stop offset="0.71" stop-color="#ba5a0e"/>
								<stop offset="0.8" stop-color="#9b4a0b"/>
								<stop offset="0.88" stop-color="#753707"/>
								<stop offset="0.95" stop-color="#4c2103"/>
								<stop offset="1" stop-color="#2a1000"/>
							</linearGradient>
							<clipPath id="clip-path" transform="translate(0 4.25)">
								<circle class="cls-1" cx="47.51" cy="46.5" r="43.5"/>
							</clipPath>
						</defs>
						<g id="Capa_2" data-name="Capa 2">
							<g id="Capa_2-2" data-name="Capa 2">
								<path class="cls-2" d="M86,19C72.44.62,50.16,0,48,0,46,0,23,.13,9,19A47.55,47.55,0,0,0,0,48C.29,58.71,4.34,66.48,20,90c7.11,10.66,16.49,24.32,28,40A400.76,400.76,0,0,0,77,90C93.29,64.35,95,55.22,95,48A47.89,47.89,0,0,0,86,19Z" transform="translate(0 4.25)"/>
								<g class="cls-3">
									<image width="600" height="600" transform="translate(2.72) scale(0.15)" xlink:href="${ img }"/>
								</g>
								<circle class="cls-1" cx="47.51" cy="50.75" r="43.5"/>
							</g>
						</g>
					</svg>`;
		}

		let canvas = document.createElement( 'canvas' );
		canvas.width = this.canvasWidth + this.offset;
		canvas.height = this.canvasHeight + this.offset;

		let ctx = canvas.getContext( '2d' );

		fabric.loadSVGFromString( svg, function( objects, options ) {
			let obj = fabric.util.groupSVGElements( objects, options );
			let scaleFactor = Math.min( canvas.width / obj.width, canvas.height / obj.height );
			obj.scale( scaleFactor );

			let offsetX = ( canvas.width - obj.getScaledWidth( ) ) / 2;
			let offsetY = ( canvas.height - obj.getScaledHeight( ) ) / 2;
			obj.set({ left: offsetX, top: offsetY });
			obj.render( ctx );

			canvas.toBlob( function( blob ) {
				uploader({ file: ( new File( [ blob ], 'gota.png', { type: 'image/png' }) ), origen: nombreIMG, unico: unico });
			}, 'image/png' );
		});

		return 
	}
}