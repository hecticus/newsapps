	
	var  _aDay = new Array("Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado", "Domingo");
	
	var _jPhase = [
		{name:'Grupo A', bgcolor:'#64C2BC'},
		{name:'Grupo B', bgcolor:'#64C2BC'},
		{name:'Grupo C', bgcolor:'#64C2BC'},
		{name:'Grupo D', bgcolor:'#64C2BC'},
		{name:'Grupo E', bgcolor:'#64C2BC'},
		{name:'Grupo F', bgcolor:'#64C2BC'},
		{name:'Grupo G', bgcolor:'#64C2BC'},
		{name:'Grupo H', bgcolor:'#64C2BC'},
		{name:'Octavos', bgcolor:'#EB008C'},
		{name:'Cuartos', bgcolor:'#5F207F'},
		{name:'Semifinales', bgcolor:'#ED2A24'},
		{name:'3er Lugar', bgcolor:'#037677'},
		{name:'Final', bgcolor:'#F9A11A'}
	];

	var _jPhaseL = [
		{name:'Grupos', bgcolor:'#64C2BC'},		
		{name:'Octavos', bgcolor:'#EB008C'},
		{name:'Cuartos', bgcolor:'#5F207F'},
		{name:'Semifinales', bgcolor:'#ED2A24'},
		{name:'3er Lugar', bgcolor:'#037677'},
		{name:'Final', bgcolor:'#F9A11A'}
	];

	var _jCountry = [
		'Alemania','Argelia','Argentina','Australia','Bosnia','Brasil','B&eacute;lgica',
		'Camer&uacute;n', 'Chile', 'Colombia', 'Corea del Sur', 'Costa Rica', 'Costa de Marfil',
		'Croacia', 'Ecuador', 'Espa&ntilde;a', 'Estados Unidos', 'Francia', 'Ghana', 'Grecia',
		'Holanda', 'Honduras', 'Inglaterra', 'Ir&aacute;n', 'Italia', 'Jap&oacute;n', 'M&eacute;xico', 'Nigeria',
		'Portugal', 'Rusia', 'Suiza', 'Uruguay'
	];
	
	
	var _jStadiums = [
		{url: 'xml/stadiums/wc2014-direct-sites-172-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/stadiums/wc2014-direct-sites-173-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-1969-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-29022-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/stadiums/wc2014-direct-sites-29023-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-29024-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/stadiums/wc2014-direct-sites-29026-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-29027-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/stadiums/wc2014-direct-sites-4499-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-4500-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/stadiums/wc2014-direct-sites-4501-es.xml', title : false, image : false, xml : false, datacontent : false}, 
		{url: 'xml/stadiums/wc2014-direct-sites-4502-es.xml', title : false, image : false, xml : false, datacontent : false}
	];
		
	var _jPlayers = [	
			{url: 'xml/players/wc2014-bio-7001-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-11186-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-15350-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-16558-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-17338-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},		
			{url: 'xml/players/wc2014-bio-17353-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20225-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20228-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20239-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20246-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20599-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20917-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},		
			{url: 'xml/players/wc2014-bio-20924-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20990-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-20996-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-41249-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-41314-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-41880-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-41920-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},		
			{url: 'xml/players/wc2014-bio-42175-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-42279-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-42290-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-42296-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-42297-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-42622-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},		
			{url: 'xml/players/wc2014-bio-42699-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-43033-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-43106-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-43170-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},
			{url: 'xml/players/wc2014-bio-43400-es.xml', id:0, title : false, image : false, xml : false, datacontent : false},	
			{url: 'xml/players/wc2014-bio-43467-es.xml', id:0, title : false, image : false, xml : false, datacontent : false}
		];
		
	
	var _jHistory = [
		{url: 'xml/history/wc2014-histo-1930-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1934-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1938-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1950-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1954-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1958-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1962-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1966-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1970-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1974-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1978-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1982-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1986-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1990-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1994-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-1998-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-2002-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-2006-resume-es.xml', title : false, image : false, xml : false, datacontent : false},
		{url: 'xml/history/wc2014-histo-2010-resume-es.xml', title : false, image : false, xml : false, datacontent : false}
	];
            
	var _jTeams = [
		{fiche: 'xml/teams/wc2014-team-2128-fiche-es.xml', gene:'xml/teams/wc2014-team-2128-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},	
		{fiche: 'xml/teams/wc2014-team-2067-fiche-es.xml', gene:'xml/teams/wc2014-team-2067-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}}, 		
		{fiche: 'xml/teams/wc2014-team-2071-fiche-es.xml', gene:'xml/teams/wc2014-team-2071-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2075-fiche-es.xml', gene:'xml/teams/wc2014-team-2075-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2081-fiche-es.xml', gene:'xml/teams/wc2014-team-2081-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2085-fiche-es.xml', gene:'xml/teams/wc2014-team-2085-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2090-fiche-es.xml', gene:'xml/teams/wc2014-team-2090-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2100-fiche-es.xml', gene:'xml/teams/wc2014-team-2100-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2102-fiche-es.xml', gene:'xml/teams/wc2014-team-2102-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2103-fiche-es.xml', gene:'xml/teams/wc2014-team-2103-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2105-fiche-es.xml', gene:'xml/teams/wc2014-team-2105-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2106-fiche-es.xml', gene:'xml/teams/wc2014-team-2106-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2157-fiche-es.xml', gene:'xml/teams/wc2014-team-2157-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2107-fiche-es.xml', gene:'xml/teams/wc2014-team-2107-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2114-fiche-es.xml', gene:'xml/teams/wc2014-team-2114-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2117-fiche-es.xml', gene:'xml/teams/wc2014-team-2117-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2303-fiche-es.xml', gene:'xml/teams/wc2014-team-2303-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2122-fiche-es.xml', gene:'xml/teams/wc2014-team-2122-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},		
		{fiche: 'xml/teams/wc2014-team-2129-fiche-es.xml', gene:'xml/teams/wc2014-team-2129-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2130-fiche-es.xml', gene:'xml/teams/wc2014-team-2130-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2240-fiche-es.xml', gene:'xml/teams/wc2014-team-2240-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2138-fiche-es.xml', gene:'xml/teams/wc2014-team-2138-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2143-fiche-es.xml', gene:'xml/teams/wc2014-team-2143-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2149-fiche-es.xml', gene:'xml/teams/wc2014-team-2149-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2153-fiche-es.xml', gene:'xml/teams/wc2014-team-2153-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},		
		{fiche: 'xml/teams/wc2014-team-2175-fiche-es.xml', gene:'xml/teams/wc2014-team-2175-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2187-fiche-es.xml', gene:'xml/teams/wc2014-team-2187-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2189-fiche-es.xml', gene:'xml/teams/wc2014-team-2189-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2201-fiche-es.xml', gene:'xml/teams/wc2014-team-2201-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2207-fiche-es.xml', gene:'xml/teams/wc2014-team-2207-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2220-fiche-es.xml', gene:'xml/teams/wc2014-team-2220-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}},
		{fiche: 'xml/teams/wc2014-team-2239-fiche-es.xml', gene:'xml/teams/wc2014-team-2239-gene-es.xml', id:0, title : false, image : false, xml : {fiche : false, gene: false}, datacontent : {fiche : false, gene: false}}
		
		
	];




	var _jAfpTeamsIds={"teams":[{"id_tvmax":"1","name":"Alemania","shortname":"GER","flag":"gm-lgflag.png","ext_id":"1500"},
                          {"id_tvmax":"2","name":"Argelia","shortname":"ALG","flag":"ag-lgflag.png","ext_id":"3041"},
                          {"id_tvmax":"3","name":"Argentina","shortname":"ARG","flag":"ar-lgflag.png","ext_id":"3029"},
                          {"id_tvmax":"4","name":"Australia","shortname":"AUS","flag":"as-lgflag.png","ext_id":"3059"},
                          {"id_tvmax":"5","name":"B&eacute;lgica","shortname":"BEL","flag":"be-lgflag.png","ext_id":"3004"},
                          {"id_tvmax":"6","name":"Bosnia y Hna.","shortname":"BIH","flag":"bk-lgflag.png","ext_id":"3100"},
                          {"id_tvmax":"7","name":"Brasil","shortname":"BRA","flag":"br-lgflag.png","ext_id":"1035"},
                          {"id_tvmax":"8","name":"Camer&uacute;n","shortname":"CMR","flag":"cm-lgflag.png","ext_id":"3075"},
                          {"id_tvmax":"9","name":"Chile","shortname":"CHI","flag":"ci-lgflag.png","ext_id":"3015"},
                          {"id_tvmax":"10","name":"Colombia","shortname":"COL","flag":"co-lgflag.png","ext_id":"3037"},
                          {"id_tvmax":"11","name":"Corea del Sur","shortname":"KOR","flag":"ks-lgflag.png","ext_id":"3068"},
                          {"id_tvmax":"12","name":"Cta. de Marfil","shortname":"CIV","flag":"iv-lgflag.png","ext_id":"3038"},
                          {"id_tvmax":"13","name":"Costa Rica","shortname":"CRC","flag":"cs-lgflag.png","ext_id":"3090"},
                          {"id_tvmax":"14","name":"Croacia","shortname":"CRO","flag":"hr-lgflag.png","ext_id":"523"},
                          {"id_tvmax":"15","name":"Ecuador","shortname":"ECU","flag":"ec-lgflag.png","ext_id":"3065"},
                          {"id_tvmax":"16","name":"Espa&ntilde;a","shortname":"ESP","flag":"sp-lgflag.png","ext_id":"413"},
                          {"id_tvmax":"17","name":"Usa","shortname":"USA","flag":"us-lgflag.png","ext_id":"3019"},
                          {"id_tvmax":"18","name":"Francia","shortname":"FRA","flag":"fr-lgflag.png","ext_id":"461"},
                          {"id_tvmax":"19","name":"Ghana","shortname":"GHA","flag":"gh-lgflag.png","ext_id":"3025"},
                          {"id_tvmax":"20","name":"Grecia","shortname":"GRE","flag":"gr-lgflag.png","ext_id":"3012"},
                          {"id_tvmax":"21","name":"Honduras","shortname":"HON","flag":"ho-lgflag.png","ext_id":"3048"},
                          {"id_tvmax":"22","name":"Inglaterra","shortname":"ENG","flag":"en-lgflag.png","ext_id":"436"},
                          {"id_tvmax":"23","name":"Ir&aacute;n","shortname":"IRN","flag":"ir-lgflag.png","ext_id":"3033"},
                          {"id_tvmax":"24","name":"Italia","shortname":"ITA","flag":"it-lgflag.png","ext_id":"445"},
                          {"id_tvmax":"25","name":"Jap&oacute;n","shortname":"JPN","flag":"ja-lgflag.png","ext_id":"3062"},
                          {"id_tvmax":"26","name":"M&eacute;xico","shortname":"MEX","flag":"mx-lgflag.png","ext_id":"3010"},
                          {"id_tvmax":"27","name":"Nigeria","shortname":"NGA","flag":"ni-lgflag.png","ext_id":"3084"},
                          {"id_tvmax":"28","name":"Pa&iacute;ses Bajos","shortname":"NED","flag":"nl-lgflag.png","ext_id":"411"},
                          {"id_tvmax":"29","name":"Portugal","shortname":"POR","flag":"po-lgflag.png","ext_id":"450"},
                          {"id_tvmax":"30","name":"Rusia","shortname":"RUS","flag":"rs-lgflag.png","ext_id":"1063"},
                          {"id_tvmax":"31","name":"Suiza","shortname":"SUI","flag":"sz-lgflag.png","ext_id":"408"},
                          {"id_tvmax":"32","name":"Uruguay","shortname":"URU","flag":"uy-lgflag.png","ext_id":"3024"}]};








































