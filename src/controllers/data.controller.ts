
import { Request, Response } from 'express'
import axios from 'axios'
import fs from 'fs';
const path = require('path');
const mindee = require("mindee");
import { createWorker } from 'tesseract.js';

import { fixAccents, fixAccentsInObject, log, returnError, returnSuccess, sleep } from '../utils/utils.ts'
import { Curp } from '../models/curpModel.js'
import { Clients } from '../models/clientsModel.js'
import moment from 'moment'
import { Webhook } from '../models/webhookModel.js'
import { Certificates } from '../models/satModel.js'
import { Rfc } from '../models/rfcModel.js'
import { Siger } from '../models/sigerModel.js'
import { ProfessionalData } from '../models/professionalModel.js'
import { RugData } from '../models/rugModel.js'
import { BlackList } from '../models/blackListModel.js'
import { Juditial } from '../models/juditialModel.js'
import { WorkHistory } from '../models/workHistory.js'
import { MindeeIdentification } from '../models/mindeeIdentificationModel.js';
import { Configurations } from '../models/configModel.js';

const URL:string   = process.env.NUFU_API_URL || ''
const token:string = process.env.NUFI_API_KEY || ''
const judicialToken:string = process.env.NUFI_API_KEY_JUDITIAL || ''
const blacklistToken:string = process.env.NUFI_API_KEY_BLACKLIST || ''

const dataJuditialOk:any = {
  "code": 204,
  "status": "success",
  "message": "Consulta exitosa",
  "data": {
      "numero_resultados": 0,
      "homonimia": "1",
      "resultados": []
  }
}
const dataJuditial:any = {"code": 200, "status": "success", "message": "Consulta exitosa", "data": {"numero_resultados": 9, "homonimia": "1", "resultados": [{"entidad": "Veracruz", "expedientes": [{"expediente": "88/2024", "actor": "/FINAGAM, Sociedad Cooperativa de Ahorro y Pr\u00e9stamo de Responsabilidad Limitada de Capital Variable", "demandado": "/Elba Garc\u00e9s Loya y Otros./Elba Garc\u00e9s Loya", "entidad": "Veracruz", "juzgado": "S\u00e9ptimo Circuito - Tuxpan - S\u00e9ptimo de Distrito", "tipo": "Concursos Mercantiles", "fuero": "Federal", "fecha": "02-04-2024", "acuerdos": [{"acuerdo": "Notif\u00edquese personalmente y c\u00famplase.", "fecha": "02-04-2024"}, {"acuerdo": "Notif\u00edquese personalmente a la parte actora", "fecha": "14-06-2024"}, {"acuerdo": "Notif\u00edquese personalmente, y por oficio a lasmencionadas dependencias.", "fecha": "19-06-2024"}, {"acuerdo": "Tuxpan de Rodr\u00edguez Cano, Veracruz, a veinticinco de junio de dos mil veinticuatro. Recepci\u00f3n. Agr\u00e9guese a los autos para que obre como corresponda el ocurso firmado por el licenciado Manuel Gerardo Ram\u00edrez Mart\u00ednez, Vocal del Registro Federal de Electores de la 05 Junta Distrital Ejecutiva del Instituto Nacional Electoral, mediante el cual, en cumplimiento a lo requerido en prove\u00eddo de dieciocho de junio del a\u00f1o en curso, informa que al realizar una b\u00fasqueda en su base de datos del Padr\u00f3n Electoral, si se localizaron los domicilios a nombre de los demandados Elba Garc\u00e9s Loya y V\u00edctor Alfonso Hern\u00e1ndez Mendoza. Con ello dese vista a la parte actora, para que manifieste lo que a su inter\u00e9s convenga. No obsta a lo anterior, el hecho de que el oficio de cuenta fuera recibido por correo electr\u00f3nico; puesto que se encuentra adminiculado con lo determinado en autos. Sirve de apoyo a lo anterior, la tesis emitida por la Segunda Sala de la Suprema Corte de Justicia de la Naci\u00f3n, visible en la p\u00e1gina 267, Tomo X, Septiembre de 1999, Novena \u00c9poca, registro 193378, del Semanario Judicial de la Federaci\u00f3n y su Gaceta, del contenido siguiente: \"RESOLUCI\u00d3N ENVIADA POR FAX (TELEFACS\u00cdMIL). PUEDE TOMARSE EN CUENTA SI S\u00d3LO CORROBORA LOS DEM\u00c1S ELEMENTOS QUE CONSTAN EN EL EXPEDIENTE.- Si en un expediente de un conflicto competencial, el prove\u00eddo por el que una Junta Local de Conciliaci\u00f3n y Arbitraje consta en un documento enviado por fax y el mismo s\u00f3lo corrobora los datos que derivan de otros medios probatorios, como la resoluci\u00f3n de la Junta Federal que tambi\u00e9n se consider\u00f3 incompetente y que orden\u00f3 enviar el asunto a la Suprema Corte para que definiera a qu\u00e9 \u00f3rgano jurisdiccional le correspond\u00eda conocer del asunto, la solicitud de la Secretar\u00eda de Acuerdos de la Sala al presidente de la Junta de que remitiera copia certificada del prove\u00eddo en el que se declar\u00f3 incompetente as\u00ed como tales medios de comprobaci\u00f3n llevan a la plena convicci\u00f3n de que el referido documento enviado por fax procede del funcionario que lo remiti\u00f3. El criterio se sustenta, adem\u00e1s por una parte en que si bien la legislaci\u00f3n procesal aplicable no contempla de manera espec\u00edfica el fax (telefacs\u00edmil) como medio probatorio, ello se debe a que cuando se emiti\u00f3 no exist\u00eda ese adelanto y, por otra, en que contribuye a salvaguardar el principio de justicia pronta que consagra el art\u00edculo 17 de la Constituci\u00f3n y que tiene especial aplicaci\u00f3n en conflictos competenciales que al plantearse suspenden la tramitaci\u00f3n del juicio respectivo\". Notif\u00edquese por lista de acuerdos a la parte actora. As\u00ed lo provey\u00f3 y firma el Juez Ricardo Mercado Oaxaca, Titular del Juzgado S\u00e9ptimo de Distrito en el Estado de Veracruz, ante el secretario Pedro Alberto Guti\u00e9rrez Guevara, quien autoriza. Doy fe. ", "fecha": "26-06-2024"}, {"acuerdo": "     Tuxpan de Rodr\u00edguez Cano, Veracruz, a dos de  julio de dos mil veinticuatro. Recepci\u00f3n. Agr\u00e9guese a los autos para que obre  como corresponda el ocurso firmado electr\u00f3nicamente por la  Apoderada Legal de Comisi\u00f3n Federal de Electricidad  (CFE), Suministrador de Servicios B\u00e1sicos, mediante el  cual, en cumplimiento a lo requerido en prove\u00eddo de  dieciocho de junio del a\u00f1o en curso, informa que al  realizar una b\u00fasqueda detallada dentro de su Sistema  Comercial (SICOM), si se localiz\u00f3 el domicilio a nombre de  la demandada... y no del codemandado... Con ello dese vista a la parte actora, para que  manifieste lo que a su inter\u00e9s convenga.  Notif\u00edquese por lista de acuerdos a la parte  actora.  As\u00ed lo provey\u00f3 y firma el Juez Ricardo Mercado  Oaxaca, Titular del Juzgado S\u00e9ptimo de Distrito en el  Estado de Veracruz, ante el secretario Pedro Alberto  Guti\u00e9rrez Guevara, quien autoriza. Doy fe.", "fecha": "03-07-2024"}, {"acuerdo": "Tuxpan de Rodr\u00edguez Cano, Veracruz, a seis de  agosto de dos mil veinticuatro. Recepci\u00f3n de oficio. Por recibido el ocurso  firmado por el Administrador Desconcentrado de  Servicios al Contribuyente, Veracruz \"1\"; mediante el  cual, en cumplimiento a lo requerido en prove\u00eddo de  dieciocho de junio del a\u00f1o en curso, informa que localiz\u00f3  los domicilios fiscales a nombre de los demandados... Con ello dese vista a la parte actora, para que  manifieste lo que a su inter\u00e9s convenga.  Notif\u00edquese por lista de acuerdos a la parte  actora.  As\u00ed lo provey\u00f3 y firma el Juez Ricardo Mercado  Oaxaca, Titular del Juzgado S\u00e9ptimo de Distrito en el  Estado de Veracruz, ante el secretario Pedro Alberto  Guti\u00e9rrez Guevara, quien autoriza. Doy fe.", "fecha": "07-08-2024"}]}, {"expediente": "00120/2023", "actor": "ELBA GARCES LOYA", "demandado": "YESSICA KARINA ZAMORA ESCUDERO Y OTRO", "entidad": "Veracruz", "juzgado": "Tuxpan - Juzgado Segundo de Primera Instancia", "tipo": "EXPEDIENTE", "fuero": "Com\u00fan", "fecha": "23-03-2023", "acuerdos": [{"acuerdo": "INICIO  . M-  111", "fecha": "23-03-2023"}]}, {"expediente": "167/2017", "actor": "/Elba Garces Loya/Elba Garces Loya.", "demandado": "/Juez Mixto Menor con sede en Tuxpan, Veracruz/Juez Mixto Menor con sede en Tuxpan, Veracruz  .", "entidad": "Veracruz", "juzgado": "S\u00e9ptimo Circuito - Xalapa - Primer Colegiado, Civil", "tipo": "Amparo Directo", "fuero": "Federal", "fecha": "06-03-2017", "acuerdos": [{"acuerdo": "AUTO: Xalapa, Veracruz, a tres de marzo de dos mil diecisiete. \n Vista la cuenta que antecede, con las constancias a que se refiere, f\u00f3rmese y reg\u00edstrese el expediente con el n\u00famero A.D. 167/2017, tanto en forma impresa como electr\u00f3nica, y ac\u00fasese recibo.  \nT\u00e9ngase por recibido el informe justificado de la autoridad responsable Juez Mixto Menor con sede en Tuxpan, Veracruz, relativo a la demanda de amparo promovida en contra de la sentencia dictada en el juicio ejecutivo mercantil 263/2015; en consecuencia, con fundamento en los art\u00edculos 107, fracci\u00f3n V, inciso c), de la Constituci\u00f3n General de la Rep\u00fablica, 33, fracci\u00f3n II, 34 y 170 de la Ley de Amparo, y 37, fracci\u00f3n I, de la Ley Org\u00e1nica del Poder Judicial de la Federaci\u00f3n, y por estar promovida en tiempo, toda vez que la sentencia reclamada se notific\u00f3 a la parte quejosa el veintitr\u00e9s de noviembre de dos mil diecis\u00e9is y la demanda de garant\u00edas fue presentada el cinco de enero de dos mil diecisiete, ante el Juzgado remitente, seg\u00fan se advierte de la certificaci\u00f3n asentada por el Secretario de acuerdos adscrito a dicho Juzgado, excluy\u00e9ndose los d\u00edas veintis\u00e9is y veintisiete de noviembre, uno, tres, cuatro, diez y once de diciembre de dos mil diecis\u00e9is, por ser inh\u00e1biles, y del quince de diciembre del a\u00f1o antes citado, al cuatro de enero del presente a\u00f1o, por haber gozado del segundo periodo vacacional la autoridad responsable, correspondiente al a\u00f1o pr\u00f3ximo pasado; SE ADMITE la demanda de amparo promovida por  Elba Garc\u00e9s Loya, en contra de la sentencia de veintitr\u00e9s de noviembre de dos mil diecis\u00e9is, dictada por el Juez Mixto Menor con sede en Tuxpan, Veracruz, en el juicio ejecutivo mercantil 263/2015. \nSin que haya lugar a tener como domicilio procesal de la parte quejosa para o\u00edr y recibir notificaciones, el que se\u00f1ala en su escrito de cuenta, ubicado en Tuxpan, Veracruz, toda vez que se encuentra fuera de la residencia de este Tribunal (fracci\u00f3n I del art\u00edculo 27 de la Ley de Amparo), por lo que con fundamento en lo dispuesto por la fracci\u00f3n III, inciso a), del referido art\u00edculo, la notificaci\u00f3n de esta determinaci\u00f3n as\u00ed como las subsecuentes a dictarse se le har\u00e1n por medio de lista que se fija en lugar visible de este \u00f3rgano colegiado. \n Por cuanto hace a los documentos consistentes en cuatro pagar\u00e9s, reg\u00edstrense en el libro de documentos con valor, que lleva este tribunal y gu\u00e1rdense en lugar seguro. \nD\u00e9se vista al Agente del Ministerio P\u00fablico de la Federaci\u00f3n adscrito la intervenci\u00f3n que le compete. \nT\u00e9ngase como tercero interesado y por emplazado a juicio a Jaime Vidal Sosa, en m\u00e9rito de las constancias que obran en este expediente, car\u00e1cter que le asiste en t\u00e9rminos del art\u00edculo 5fracci\u00f3n III, inciso b), de la Ley de Amparo, al ser contraparte de la parte quejosa en el juicio natural de donde deriva la sentencia reclamada; y en raz\u00f3n de que dicho tercero interesado, no ha comparecido al presente juicio a se\u00f1alar domicilio procesal para o\u00edr y recibir notificaciones en esta ciudad, (fracci\u00f3n I del art\u00edculo 27 de la Ley de Amparo), por lo tanto, con fundamento en lo dispuesto por la fracci\u00f3n III, inciso a) del referido art\u00edculo, la notificaci\u00f3n de esta determinaci\u00f3n as\u00ed como las subsecuentes a dictarse, se le har\u00e1 por medio de lista que se fije en lugar visible de este \u00f3rgano colegiado. \nDesde este momento, con fundamento en los art\u00edculos 278 y 279 del C\u00f3digo Federal de Procedimientos Civiles de aplicaci\u00f3n supletoria a la Ley de Amparo, conforme a su precepto 2 se autoriza a las partes de este juicio y sus autorizados designados, la expedici\u00f3n de copias certificadas del presente acuerdo, as\u00ed como de las subsecuentes actuaciones y dem\u00e1s constancias inherentes a este asunto, previa identificaci\u00f3n y firma que se otorgue en autos. \nFinalmente, para los efectos a que se refiere el art\u00edculo 181 de la citada ley, se hace del conocimiento de las partes que cuentan con el plazo de quince d\u00edas h\u00e1biles para presentar sus alegatos o en su caso promover el amparo adhesivo. \nNotif\u00edquese.  \nAs\u00ed lo acord\u00f3 y firma el magistrado Clemente Gerardo Ochoa Cant\u00fa, Presidente del Primer Tribunal Colegiado en Materia Civil del S\u00e9ptimo Circuito, ante el licenciado Carlos N\u00fa\u00f1ez Acosta, secretario de acuerdos, que autoriza y da fe.", "fecha": "06-03-2017"}, {"acuerdo": "AUTO: Xalapa, Veracruz, a veintitr\u00e9s de mayo de dos mil diecisiete.   \nVista la certificaci\u00f3n y el estado procesal que guardan los presentes autos, y toda vez que ya transcurri\u00f3 el t\u00e9rmino de quince d\u00edas a que alude el art\u00edculo 181 de la Ley de Amparo, con fundamento en el numeral 183 de la citada ley, t\u00farnese el presente expediente al magistrado Alfredo S\u00e1nchez Castel\u00e1n, para que formule proyecto de resoluci\u00f3n.   \n", "fecha": "24-05-2017"}, {"acuerdo": "NIEGA.", "fecha": "22-11-2017"}, {"acuerdo": "Con el oficio de cuenta arch\u00edvese el presente asunto como concluido.", "fecha": "23-01-2018"}]}, {"expediente": "00001/2017", "actor": "FORMADO CON DEMANDA DE AMPARO DIRECTO PROMOVIDO POR ELBA GARCES LOYA, EN RELACION AL EXPEDIENTE NUMERO 263/2015-II/FORMADO CON DEMANDA DE AMPARO DIRECTO PROMOVIDO POR   ELBA GARCES LOYA, EN RELACION AL EXPEDIENTE  NUMERO  263/2015-II", "demandado": "", "entidad": "Veracruz", "juzgado": "Tuxpan - Juzgado Mixto Menor", "tipo": "C. AMPARO", "fuero": "Com\u00fan", "fecha": "09-01-2017", "acuerdos": [{"acuerdo": "SE ORDENA EMPLAZAR A TERCERO PERJUDICADO, SE RINDE INFORME, Y SE REMITE EXPEDIENTE Y DOCUMENTO BASE DE LA ACCION", "fecha": "09-01-2017"}, {"acuerdo": "SE AGREGAN OFICIOS POR ENTERADOS QUE FUE ADMITIDA DEMANDA DE AMPARO", "fecha": "24-03-2017"}]}, {"expediente": "01485/2016", "actor": "ERNESTINA BUSTAMANTE DOMINGUEZ", "demandado": "ELBA GARCES LOYA Y OTROS", "entidad": "Veracruz", "juzgado": "Cuarta Sala Civil", "tipo": "TOCA", "fuero": "Com\u00fan", "fecha": "02-12-2016", "acuerdos": [{"acuerdo": "Expediente de origen: 549/2015. AUTO: EN C. A. DEL LIC. HECTOR MANUEL SANCHEZ PULIDO, SE AGREGA OFICIO 543 CON ANEXOS DEL SEGUNDO T. C., NUMERO 9, DEL QUE SE ADVIERTE QUE LA JUSTICIA DE LA UNI\u00d3N NO AMPARA NI PROTEGE A LA PARTE QUEJOSA, SE ACUSA EL RECIBO CORRESPONDIENTE Y SE ARCHIVA COMO ASUNTO CONCLUIDO.", "fecha": "02-12-2016"}, {"acuerdo": "Expediente de origen: 549/2015. AUTO: SE AGREGA OFICIO 166 DEL A QUO, NUMERO 23, POR EL CUAL ACUSA RECIBO A NUESTRO OFICIO 4953 DE FECHA CINCO DE DICIEMBRE DEL A\u00d1O DOS MIL DIECISEIS Y SE ARCHIVA COMO ASUNTO CONCLUIDO.", "fecha": "24-01-2017"}]}, {"expediente": "208/2016", "actor": "/Elba Garc\u00e9s Loya", "demandado": "/Juez Mixto Menor. Tuxpan, Veracruz", "entidad": "Veracruz", "juzgado": "S\u00e9ptimo Circuito - Tuxpan - Octavo de Distrito", "tipo": "Amparo Indirecto", "fuero": "Federal", "fecha": "27-05-2016", "acuerdos": [{"acuerdo": "Se desecha de plano la demanda de garant\u00edas y se tiene como domicilio para oir y recibir notificaciones el que se\u00f1ala y como autorizados para oir y recibir notificaciones e imponerse de los autos los que indican.", "fecha": "27-05-2016"}, {"acuerdo": "Notificaci\u00f3n personal a la parte quejosa por lista de acuerdos.- Se desecha de plano la demanda de garant\u00edas y se tiene como domicilio para oir y recibir notificaciones el que se\u00f1ala y como autorizados para oir y recibir notificaciones e imponerse de los autos los que indican.", "fecha": "01-06-2016"}, {"acuerdo": "Se declara que el auto por el que se desech\u00f3 la demanda de amparo, ha cusado estado. Se ordena el archivo del expediente. Se determina que el cuaderno principal es susceptible de destrucci\u00f3n.", "fecha": "17-06-2016"}]}, {"expediente": "00263/2015", "actor": "JAIME VIDAL SOSA", "demandado": "/ELBA  GARCES LOYA/, ELBA  GARCES LOYA", "entidad": "Veracruz", "juzgado": "Tuxpan - Juzgado Mixto Menor", "tipo": "EXPEDIENTE", "fuero": "Com\u00fan", "fecha": "19-11-2015", "acuerdos": [{"acuerdo": "INICIO", "fecha": "19-11-2015"}, {"acuerdo": "POR NOMBRADO ABOGADO PATRONO", "fecha": "22-01-2016"}, {"acuerdo": "POR INTERPUESTO INCIDENTE DE NULIDAD, SE ORDENA EMPLAZAR A DEMANDADO INCIDENTAL.-POR CONTESTADA DEMANDA, VISTA AL ACTOR POR TRES DIAS", "fecha": "10-02-2016"}, {"acuerdo": "POR DESAHOGADA  VISTA INCIDENTAL  EN TIEMPO Y FORMA, SE SE\u00d1ALA FECHA DE AUDIENCIA; AS\u00cd MISMO SE LE TIENE POR DESAHOGADA LA  VISTA  DE LA  CONTESTACI\u00d3N A LA DEMANDA, POR NOMBRADO DEPOSITARIO JUDICIAL", "fecha": "19-02-2016"}, {"acuerdo": "SE LLEVA A CABO AUDIENCIA INCIDENTAL, SE RECIBEN PRUEBAS", "fecha": "03-03-2016"}, {"acuerdo": "SE CONCEDEN DOS DIAS COMUNES PARA ALEGAR", "fecha": "11-04-2016"}, {"acuerdo": "POR FORMULADOS ALEGATOS DEL  DEMANDADO INCIDENTAL", "fecha": "14-04-2016"}, {"acuerdo": "SE TURNA PARA  RESOLVER INCIDENTE", "fecha": "27-04-2016"}, {"acuerdo": "SE DICTA  RESOLUCI\u00d3N INCIDENTAL", "fecha": "03-05-2016"}, {"acuerdo": "POR EXHIBIDO PLIEGO DE POSICIONES, SE ABRE JUICIO A PRUEBA POR 15 DIAS, SE SE\u00d1ALA DIA Y HORA PARA RECEPCION DE PRUEBAS", "fecha": "15-07-2016"}, {"acuerdo": "POR HECHAS MANIFESTACIONES, SE ADMITE PRUEBA PERICIAL, SE PREVIENE A LOS PERITOS NOMBRADOS PARA QUE PRESENTEB ESCRITO ACEPTANDO CARGO CONFERIDO", "fecha": "11-08-2016"}, {"acuerdo": "SE TIENE POR DESIGNADO PERITO DE LA PARTE ACTORA Y POR ACEPTADO CARGO. DEVUELVANSE DOCUMENTOS.", "fecha": "22-08-2016"}, {"acuerdo": "SE TIENE POR DESIERTA PRUEBA PERICIAL OFRECIDA POR DEMANDADO", "fecha": "26-08-2016"}, {"acuerdo": "SE LLEVA A CABO AUDIENCIA.", "fecha": "30-08-2016"}, {"acuerdo": "SE LLEVA A CABO AUDIENCIA.", "fecha": "30-08-2016"}, {"acuerdo": "SE CONCEDEN DOS DIAS COMUNES A LAS PARTES PARA ALEGAR", "fecha": "20-09-2016"}, {"acuerdo": "SE CONCEDEN DOS DIAS COMUNES A LAS PARTES PARA ALEGAR", "fecha": "20-09-2016"}, {"acuerdo": "SE CONCEDEN DOS DIAS COMUNES A LAS PARTES PARA ALEGAR", "fecha": "20-09-2016"}, {"acuerdo": "SE CONCEDEN DOS DIAS COMUNES A LAS PARTES PARA ALEGAR", "fecha": "20-09-2016"}, {"acuerdo": "POR FORMULADOS ALEGATOS DEL ACTOR", "fecha": "22-09-2016"}, {"acuerdo": "SE TIENE POR PRECLUIDO DERECHO DE LA PARTE DEMANDADA PARA FORMULAR ALEGATOS, SE TURNAN LOS AUTOS PARA DICTAR SENTENCIA.", "fecha": "04-11-2016"}, {"acuerdo": "SE DICTA SENTENCIA", "fecha": "23-11-2016"}]}, {"expediente": "01042/2013", "actor": "ELBA GARCES LOYA,", "demandado": "/,", "entidad": "Veracruz", "juzgado": "Tuxpan - Juzgado Segundo de Primera Instancia", "tipo": "EXPEDIENTE", "fuero": "Com\u00fan", "fecha": "29-08-2013", "acuerdos": [{"acuerdo": "INICIO M -II.", "fecha": "29-08-2013"}, {"acuerdo": "AUDIENCIA CELEBRADA. M-II.", "fecha": "11-09-2013"}, {"acuerdo": "SE ORDENA RATIFICAR. M-II.", "fecha": "26-09-2013"}, {"acuerdo": "RATIFICACION. M-II.", "fecha": "16-10-2013"}, {"acuerdo": "SE AGREGA OFICIO. M-II.", "fecha": "24-10-2013"}, {"acuerdo": "POR HECHAS MANIFESTACIONES,SE DA VISTA AL M.P. ADSCRITO. M-II.", "fecha": "29-10-2013"}, {"acuerdo": "SE TURNAN LOS AUTOS PARA RESOLVER. M-II.", "fecha": "08-11-2013"}, {"acuerdo": "DECLARATORIA DE HEREDEROS.", "fecha": "29-11-2013"}, {"acuerdo": "SE EXPIDEN COPIAS CERTIFICADAS. M-II.", "fecha": "25-02-2014"}, {"acuerdo": "POR ACEPTADO NOMBRAMIENTO. M-II.", "fecha": "27-02-2014"}]}, {"expediente": "00262/2011", "actor": "ELBA GARCES LOYA,", "demandado": "MIGUEL SCHULTE BUSTAMANTE,", "entidad": "Veracruz", "juzgado": "Tuxpan - Juzgado Segundo de Primera Instancia", "tipo": "EXPEDIENTE", "fuero": "Com\u00fan", "fecha": "08-03-2011", "acuerdos": [{"acuerdo": "INICIO", "fecha": "08-03-2011"}, {"acuerdo": "POR ACUSADA REBELDIA SE SE\u00d1ALA FECHA DE AUDIENCIA Y CITESE A LAS PARTES PARA QUE COMPAREZCAN EN EL DIA Y HORA SE\u00d1ALADO.", "fecha": "27-02-2012"}, {"acuerdo": "AUDIENCIA", "fecha": "18-04-2012"}]}]}]}}


const headers:Object  = {
  headers: {
    'Ocp-Apim-Subscription-Key':token
  }
}
const headers2:Object  = {
  headers: {
    'NUFI-API-KEY':token
  }
}
const headers3:Object = {
  headers: {
    'NUFI-API-KEY':judicialToken
  }
}
const headers4:Object = {
  headers: {
    'NUFI-API-KEY':blacklistToken
  }
}

const dataMinee:any = {
  givenNames: [
    {
      value: 'ERICK',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    },
    {
      value: 'FERNANDO',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    }
  ],
  surnames: [
     {
      value: 'HOLGUIN',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    },
     {
      value: 'PARDAVELL',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    }
  ],
  address:  {
    value: 'CAUREA SUR 6716 FRACC AUREA RESIDENCIAL 32659 JUAREZ,CHIH.',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  birthDate: {
    value: '1993-06-25',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  birthPlace:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  countryOfIssue:  {
    value: 'MEX',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  documentNumber:  {
    value: 'HLPRER93062524H200',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  documentType: {
    value: 'VOTER_REGISTRATION',
    reconstructed: false,
    confidence: 0
  },
  expiryDate: {
    value: '2032-03-01',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  issueDate: {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine1:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine2:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine3:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  nationality:  {
    value: 'MEX',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  personalNumber:  {
    value: 'HOPE930625HSPLRR01',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  sex:  {
    value: 'M',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  stateOfIssue:  {
    value: 'CHIH',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  }
}


export const registerCurp = async (req:any, res:Response) => {
  try {
    log(`Inicia método registerCurp: ${JSON.stringify(req.body)}`)
    const { curp } = req.body
    if (!curp) return res.status(400).json(returnError('El campo CURP es requerido'))
    
    const { client_id } = req.params
    if (!client_id) return res.status(400).json(returnError('El campo client_id es requerido'))

    const curpFromDB:any = await Curp.findOne({ where: { client_id: client_id }})
    if (curpFromDB) return res.status(200).json(returnSuccess('El CURP obtenido correctamente', {}, 1))
    
    const { data } = await axios.post(`${URL}/Curp/v1/consulta`, { 'tipo_busqueda': 'curp', curp }, headers)
    log(`[validateCurp response] Response: ${JSON.stringify(data)}`)
    const curpCreated = await Curp.create({
      client_id: client_id, 
      curp: data.data.curpdata[0].curp,
      nombres: data.data.curpdata[0].nombres || '',
      apellidos: `${data.data.curpdata[0].primerApellido} ${data.data.curpdata[0].segundoApellido}` || '',
      sexo: data.data.curpdata[0].sexo,
      claveEntidad: data.data.curpdata[0].claveEntidad,
      statusCurp: data.data.curpdata[0].statusCurp,
      entidad: data.data.curpdata[0].entidad,
      entidadRegistro: data.data.curpdata[0].datosDocProbatorio.entidadRegistro,
      claveMunicipioRegistro: data.data.curpdata[0].datosDocProbatorio.claveMunicipioRegistro,
      anioReg: data.data.curpdata[0].datosDocProbatorio.anioReg,
      claveEntidadRegistro: data.data.curpdata[0].datosDocProbatorio.claveEntidadRegistro,
      numActa: data.data.curpdata[0].datosDocProbatorio.numActa,
      libro: data.data.curpdata[0].datosDocProbatorio.libro,
      municipioRegistro: data.data.curpdata[0].datosDocProbatorio.municipioRegistro
    })
    log(`curpCreated: ${JSON.stringify(curpCreated)}`)
    if (data.data.curpdata[0]) {
      const client:any = await Clients.findByPk(client_id)
      client.name = data.data.curpdata[0].nombres.split(' ')[0]
      client.secondName = data.data.curpdata[0].nombres.split(' ')[1]
      client.lastName = data.data.curpdata[0].primerApellido
      client.secondLastName = data.data.curpdata[0].segundoApellido
      client.state = data.data.curpdata[0].entidad
      client.dob = new Date(`${data.data.curpdata[0].curp.substring(6, 8)}/${data.data.curpdata[0].curp.substring(8, 10)}/${data.data.curpdata[0].curp.substring(4, 6)}`)
      client.save()
    }
    log(`[1.1] - client after fillData: ${client_id}`)
    return res.status(201).json(returnSuccess('CURP creado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, getCurp [X]: ${error.message}`)
    return res.status(500).json(returnError(`Ocurrió un error al obtener el CURP: ${error.message}`))
  }
}


export const registerRfc = async (req:any, res:Response) => {
  try {
    log(`Inicia registerRfc ${JSON.stringify(req.body)}`)
    let { rfc } = req.body
    
    const { client_id } = req.params
    const clientFromDB:any = await Clients.findByPk(client_id)
    
    const rfcFromDB:any = await Rfc.findOne({ where: { client_id: client_id }})

    if (rfcFromDB && rfcFromDB.valid) return res.status(200).json(returnSuccess('RFC Obtenido correctamente', {}, 1))
    
    // si no se recibe el RFC se consulta con NUFI
    if (!rfc) {
      log('[1] - No se recibio RFC incia método getRFC')
      try {
        const body:object = {
          nombres: `${clientFromDB.name} ${clientFromDB.secondName}`,
          apellido_paterno: clientFromDB.lastName,
          apellido_materno: clientFromDB.secondLastName,
          fecha_nacimiento: moment(clientFromDB.dob).format('DD/MM/YYYY')
        }
        log(`[getRFC] URL: ${URL}/api/v1/calcular_rfc, body: ${JSON.stringify(body)}`)
        const { data }:any = await axios.post(`${URL}/api/v1/calcular_rfc`, body, headers)
        log(`[getRFC] Response: ${JSON.stringify(data)}`)
        
        if (data.status === 'success') {
          clientFromDB.rfc = data.data.rfc
          clientFromDB.save()
          await Rfc.create({ client_id: clientFromDB.id, rfc: data.data.rfc })
        }
      } catch (error:any) {
        log(`[X] getRFC Error [X]: ${error.message}`)
        return res.status(500).json(returnError('Ocurrió un error interno al registrar el RFC'))
      }
    }
    
    try {
      log(`[2] - se registró el RFC correctamente, inicia validateRFC: ${clientFromDB.rfc}`)
      const { data }:any = await axios.post(`${URL}/estatusrfc/valida`, {rfc: clientFromDB.rfc}, headers)
      log(`validateRFC data: ${JSON.stringify(data)}`)
      log(`validateRFC message: ${JSON.stringify(data.message)}`)
    
      rfcFromDB.message = data.message
      rfcFromDB.valid = true
      rfcFromDB.save()
    } catch (error:any) {
      log(`[X] getRfc Error al guardar el RFC [X]: ${error.message}`)
      return res.status(500).json(returnError('Ocurrió un error interno al validar el RFC'))
    }
    
    return res.status(201).json(returnSuccess('RFC registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, getRfc [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error al obtener el CURP'))
  }
}


export const registerNss = async (req:any, res:Response) => {
  log(`Inicia registerNss ${JSON.stringify(req.body)}`)
  const { curp } = req.body
  const { client_id } = req.params
  
  const nssFromDB:any = await Webhook.findOne({ where: { client_id: client_id }})
  log(`nssFromDB: ${JSON.stringify(nssFromDB)}`)
  if (nssFromDB) return res.status(200).json(returnSuccess('NSS Solicitado anteriormente', {}, 1))
  
  try {
    log(`inicia solicitud de NSS, curp: ${curp}`)
    const { data } = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}`, headers2)
    log(`Respuesta directa de consulta de NSS: ${JSON.stringify(data)}`)
    await Webhook.create({ client_id: client_id, uuid_nss: data.data.uuid })
    
    return res.status(201).json(returnSuccess('NSS registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, Error al guardar el NSS [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al validar el NSS'))
  }
}


export const registerSiger = async (req:any, res:Response) => {
  log(`Inicia registerSiger ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const sigerFromDB:any = await Siger.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(sigerFromDB)}`)
  if (sigerFromDB.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)
    const body:object = {
      'socio': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`
    }
    log(`Antes de enviar a consultar a nufi SIGER: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)
    log(`Respuesta directa de consulta de SIGER: ${JSON.stringify(responseFromApi.data)}`)

    responseFromApi.data.data.forEach(async (item:any) => {
      await Siger.create({ client_id: client_id, commerces: item })
    });
    
    return res.status(201).json(returnSuccess('SIGER registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerSiger Error al guardar los datos del SIGER [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos del SIGER'))
  }
}


export const registerProfessionalData = async (req:any, res:any) => {
  log(`Inicia registerProfessionalData ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const professionalData:any = await ProfessionalData.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(professionalData)}`)
  if (professionalData.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente 2', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre': `${clientFromDB.name} ${clientFromDB.secondName}`,
      'apellido_paterno': clientFromDB.lastName,
      'apellido_materno': clientFromDB.secondLastName
    }
    log(`Antes de enviar a consultar a nufi registerProfessionalData: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/CedulaProfesional/consultar`, body, headers)
    // const responseFromApi:any = await axios.post(`http://127.0.0.1:2700/api/v1/auth/professional`, body, headers)
    log(`Respuesta directa de consulta de CedulaProfesional: ${JSON.stringify(responseFromApi.data)}`)
    
    
    responseFromApi.data.data.forEach(async (item:any) => {
      // Validacion solicitada por Alan para evitar ingresar datos incorrectos: no introducir cedulas de profesionales menores a 15 años de la edad del candidato
      if (item.fechaRegistro > moment(clientFromDB.dob).format('YYYY') + 15) {
        await ProfessionalData.create({ client_id: client_id, data: item })
      }
    });
    return res.status(201).json(returnSuccess('Datos de profesión registrados correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerProfessionalData Error al guardar los datos de profesión [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de profesión'))
  }
}


export const deleteProfessionalDataById = async (req:any, res:any) => {
  log(`Inicia deleteProfessionalDataById ${JSON.stringify(req.body)}`)
  try {
    const professionalData:any = await ProfessionalData.findByPk(req.params.id)
    professionalData.destroy()
    return res.status(200).json(returnSuccess('Elemento eliminado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, deleteProfessionalDataById Error al eliminar el registro los datos de profesión [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al eliminar los datos de profesión'))
  }
}


export const registerRugData = async (req:any, res:any) => {
  log(`Inicia registerRugData ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const rugData:any = await RugData.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(rugData)}`)
  if (rugData.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'descripcion_de_bienes': '',
      'nombre_otorgante': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'folio_electronico_otorgante': '',
      'numero_garantia_o_asiento': '',
      'curp_otorgante': '',
      'rfc_otorgante': ''
    }
    log(`Antes de enviar a consultar a nufi rugData: ${JSON.stringify(body)}`)
    // const responseFromApi:any = await axios.post(`${URL}/rug/v3/consulta`, body, headers2)
    const responseFromApi:any = {"status":"success","code":200,"mensaje":"no se encotraron resultados","registros":0,"data":[]}
    log(`Respuesta directa de consulta de RUG: ${JSON.stringify(responseFromApi.data)}`)

    if (responseFromApi.data.length === 0) {
      console.log('caso 1', responseFromApi.data)
      await RugData.create({ client_id: client_id, data: 'No se encontraron resultados', requested: true })
      return res.status(200).json(returnSuccess('No se encontraron datos de RUG', {}, 1))
    } else {
      console.log('caso 2', responseFromApi.data)
      responseFromApi.data.data.forEach(async (item:any) => {
        await RugData.create({ client_id: client_id, data: item })
      })
      return res.status(201).json(returnSuccess('Datos de RUG registrados correctamente', {}, 1))
    }
  } catch (error:any) {
    log(`[X] data > controller, rugData Error al guardar los datos de RUG [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de RUG'))
  }
}


export const registerBlackList = async (req:any, res:any) => {
  log(`Inicia registerBlackList ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const blacklistFromDB:any = await BlackList.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(blacklistFromDB)}`)
  if (blacklistFromDB.length > 0 && blacklistFromDB.requested === false) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre_completo': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'primer_nombre': clientFromDB.name,
      'segundo_nombre': clientFromDB.secondName,
      'apellidos': `${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'fecha_nacimiento': '',
      'lugar_nacimiento': ''
    }
    
    log(`Antes de enviar a consultar a nufi blacklist: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/perfilamiento/v1/aml`, body, headers2)
    // const responseFromApi:any = {"status":"success","code":200,"mensaje":"no se encotraron resultados","registros":0,"data":[]}
    log(`Respuesta directa de consulta de blacklist: ${JSON.stringify(responseFromApi.data)}`)

    await BlackList.create({ client_id: client_id, data: responseFromApi.data })
    return res.status(201).json(returnSuccess('Datos de listas negras registrados correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerBlackList Error al guardar los datos de listas negras [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de listas negras'))
  }
}


export const registerJuditial = async (req:any, res:any) => {
  log(`Inicia registerJuditial ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const juditialFromDB:any = await Juditial.findOne({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(juditialFromDB)}`)
  if (juditialFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre': clientFromDB.name,
      'paterno': clientFromDB.lastName,
      'materno': clientFromDB.secondLastName,
      'detalle': true,
      'estado': 'nacional'
    }
    log(`Antes de enviar a consultar a nufi expedientes judiciales: ${JSON.stringify(body)}`)
    // const responseFromApi:any = await axios.post(`${URL}/antecedentes_judiciales/v2/persona_fisica_nacional`, body, headers3)
    const responseFromApi:any = dataJuditial
    log(`Respuesta directa de consulta de expedientes judiciales: ${JSON.stringify(responseFromApi.data)}`)

    if (responseFromApi.data.numero_resultados > 0) {
      const cleanedResponse = fixAccentsInObject(responseFromApi);
      console.log('cleanedResponse', cleanedResponse)
      await Juditial.create({ client_id: client_id, data: cleanedResponse })
      return res.status(201).json(returnSuccess('Datos de expedientes judiciales registrados correctamente', {}, 1))
    } else {
      await Juditial.create({ client_id: client_id, data: responseFromApi })
      return res.status(201).json(returnSuccess('Datos de expedientes judiciales registrados correctamente', {}, 1))
    }

  } catch (error:any) {
    log(`[X] data > controller, registerJuditial Error al guardar los datos de expedientes judiciales [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de  expedientes judiciales'))
  }
}


export const getNss = async (req:any, res:Response) => {
  try {
    const { client_id } = req.params

    const webhookData:any = await Webhook.findOne({
      where: { client_id: client_id },
      attributes: [
        'client_id',
        'uuid_nss',
        'uuid_historial',
        'uuid_infonavit',
        'nss_completed',
        'history_completed'
      ]
    })
    log(`webhookData: ${JSON.stringify(webhookData)}`)
    const body:object = {
      uuid_nss: webhookData.uuid_nss,
      uuid_historial: webhookData.uuid_historial || '',
    }
    log(`Antes de enviar a consultar a nufi get status: ${JSON.stringify(body)}`)
    const responseFromAPI:any = await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
    log(`[getStatus response] data ${JSON.stringify(responseFromAPI.data)}`)
    if (responseFromAPI.data.status === 'success') {
      await WorkHistory.create({ client_id: client_id, jobs: responseFromAPI.data })
      return res.status(200).json(returnSuccess('NSS obtenido correctamente', responseFromAPI.data, 1))
    } else {
      return res.status(404).json(returnError('No se encontraron datos de NSS'))
    }

  } catch (error:any) {
    log(`[X] getStatus Error [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener el NSS'))
  }
}

export const getWebhookData = (req:Request, res:Response) => {
  log(`getWebhookData ${JSON.stringify(req.body)}`)

  const webhookData = ''

  // const data = {
  //   user_id: balance.user_id,
  //   initial_balance: getCurrentBalance(balance),
  //   purchases: 0,
  //   sales: 0,
  //   transfers: 0,
  //   balance_date: new Date()
  // }
  // BalancesHistory.create(data)

  return res.status(200).json(req.body)
}


const getSATInformation = async(clientId:string, rfc:string) => {
  try {
    let certificados:object[] = []
    
    const certificatesFromDB = await Certificates.findAll({ where: { client_id: clientId }})
    if (certificatesFromDB.length > 0) return certificatesFromDB
    
    log(`[getSATInformation] URL: ${URL}/certificadosat/v1/consultar/consultar, rfc: ${rfc}`)
    const { data }:any = await axios.post(`${URL}/certificadosat/v1/consultar/consultar`, {rfc}, headers2)
    for (let certificado of data.data.certificados) {
      const certificatedCreated = await Certificates.create({
        client_id: clientId,
        numero_serie: certificado.numero_serie,
        estado: certificado.estado,
        tipo: certificado.tipo,
        fecha_inicial: certificado.fecha_inicial,
        fecha_final: certificado.fecha_final,
        certificado: certificado.certificado
      })
      certificados.push(certificatedCreated)
    }
    return certificados
  } catch (error:any) {
    log(`[X] getSATInformation Error [X]: ${error.message}`)
    return {}
  }
}



const getSAT69B = async(rfc:string) => {
  try {
    const response:any = await axios.post(`${URL}/contribuyentes/v1/obtener_contribuyente`, {rfc}, headers)
    return response.data
  } catch (error:any) {
    log(`[X] getSAT69B Error [X]: ${error.message}`)
    return {}
  }
}


const getSAT74 = async(rfc:string, socialReason:string, state:string) => {
  try {
    const body:object = {
      'rfc': rfc,
      'razon_social': socialReason,
      'fecha_autorizacion': '11/09/2023',
      'fecha_publicacion': '19/10/2023',
      'entidad_federativa': state
    }
    const response:any = await axios.post(`${URL}/contribuyentes_74/v1/reduccion_multas`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getSAT74 Error [X]: ${error.message}`)
    return {}
  }
}


const getSAT69L = async(rfc:string, socialReason:string, state:string) => {
  try {
    const body:object = {
      'rfc': rfc,
      'razon_social': socialReason,
      'fecha_publicacion': '01/01/2014',
      'entidad_federativa': state
    }
    const response:any = await axios.post(`${URL}/contribuyentes_69/v1/no_localizados`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getSAT69L Error [X]: ${error.message}`)
    return {}
  }
}


const getJuditialRecord = async(name:string, lastName:string, secondLastName:string) => {
  try {
    const body:object = {
      'nombre': name,
      'paterno': lastName,
      'materno': secondLastName,
      'detalle': true,
      'estado': 'nacional'
    }
    const response:any = await axios.post(`${URL}/antecedentes_judiciales/v2/persona_fisica_nacional`, body, headers3)
    return response.data
  } catch (error:any) {
    log(`[X] getJuditialRecord Error [X]: ${error.message}`)
    return {}
  }
}


const getWeeksWorked = async(curp:string, nss:string) => {
  try {
    let detail:any = {}
    log(`[getWeeksWorked] URL: ${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}`)
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}`, headers2)
    if (response.data && response.data.data && response.data.data.uuid) {
      detail = await getStatusNssHistory(response.data.data.uuid)
      console.log('detail', detail)
      return detail
    } else {
      return response.data
    }
  } catch (error:any) {
    log(`[X] getWeeksWorked Error [X]: ${error.message}`)
    return {}
  }
}


const getStatusNssHistory = async(uuid1:string) => {
  try {
    const body: object = {
      "uuid_nss": uuid1,
      "uuid_historial": uuid1
    }
    const response: any = await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getStatusNssHistory Error [X]: ${error.message}`)
    return {}
  }
}

const getInfonavitData = async() => {
  try {
    const body:any = {
        'info_persona': { 'nss': '' },
        'webhook': ''
    }
    const response:any = await axios.post(`${URL}/credito_infonavit/v1/credito_infonavit`, body, headers2)
    return response.data
  } catch (error:any) {
    console.log('[X] getInfonavitData Error [X]', JSON.stringify(error))
    return {}
  }
}

const getEnrichmentPhone = async(phone:string) => {
  try {
    const body:object = {
      'telefono': phone
    }
    const { data } = await axios.post(`${URL}/enriquecimientoidentidades/v3/telefono`, body, headers4)
    return data
  } catch (error:any) {
    log(`[X] getEnrichmentPhone Error [X]: ${JSON.stringify(error)}`)
    return {}
  }
}


const getEnrichmentName = async(firstName:string, secondName:string, lastName:string, secondLastName:string) => {
  try {
    const body:object = {
      nombre:firstName + ' ' + secondName,
      apellidos:lastName + ' ' + secondLastName
    }
    const response:any = await axios.post(`${URL}/enriquecimientoidentidades/v3/nombre`, body, headers4)
    return response.data
  } catch (error:any) {
    log(`[X] getEnrichmentName Error [X]: ${error.message}`)
    return {}
  }
}

const getGoogleNews = async(fullName:string) => {
  try {
    const body:object = {
      'consulta':fullName,
      'tipo_noticia':'news',
      'pagina':1,
      'numero_resultados': 5,
      'localizacion':'mx',
      'lenguaje':'es'
    }
    const response:any = await axios.post(`${URL}/noticias/v2/busqueda`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getGoogleNews Error [X]: ${error.message}`)
    return {}
  }
}

const fillData = async(clientId:any) => {
  const curpData:any = await Curp.findOne({ where: { client_id: clientId }})
  const client:any = await Clients.findByPk(clientId)
  if (client && curpData) {
    client.name = curpData.nombres.split(' ')[0]
    client.secondName = curpData.nombres.split(' ')[1]
    client.lastName = curpData.apellidos.split(' ')[0]
    client.secondLastName = curpData.apellidos.split(' ')[1]
    client.state = curpData.entidad
    client.dob = new Date(`${curpData.curp.substring(6, 8)}/${curpData.curp.substring(8, 10)}/${curpData.curp.substring(4, 6)}`)
    client.save()
  }
}


export const readIdentification = async (req:any, res:any) => {
    console.log('inicia lectura de ID', req.file)
    try {

    const { client_id } = req.params

    const identificationFromDB:any = await MindeeIdentification.findOne({ where: { client_id: client_id }})
    // log(`Se busca desde la base de datos: ${JSON.stringify(identificationFromDB)}`)
    if (identificationFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', identificationFromDB, 1))
  
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const configurations:any = await Configurations.findOne({ where: { id: 1 }})    
    log(`mindeKey: ${JSON.stringify(configurations)}`)
    const mindeeClient = new mindee.Client({ apiKey: configurations.mindeeKey });
    const inputSource = mindeeClient.docFromPath(req.file.path, 'image/jpeg');
    const apiResponse = mindeeClient.enqueueAndParse(mindee.product.InternationalIdV2,inputSource);
    const data = await apiResponse.then(async (resp:any) => {
      log(`Respuesta directa de consulta de Minee InternationalID: ${JSON.stringify(resp.toString())}`)
      await MindeeIdentification.create({ client_id: client_id, mindeeID: resp.document, identificationPath: req.file.path })
      return resp.document
    })
    return res.status(201).json(returnSuccess('Se obtuvieron correctamente los datos de la identificación, recargar la página', data, 1));
  } catch (error:any) {
    log(`[X] data > controller, readIdentification Error al guardar los datos de la identificación [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al validar la identidad'))
  }
}
  
  export const deleteIdentificationById = async (req:any, res:any) => {
    log(`Inicia deleteIdentificationById ${req.params.id}`)
    try {
      const identification:any = await MindeeIdentification.findOne({ where: { client_id: req.params.id }})
      identification.destroy()
      return res.status(200).json(returnSuccess('Elemento eliminado correctamente', {}, 1))
    } catch (error:any) {
      log(`[X] data > controller, deleteIdentificationById Error al eliminar el registro de la identificación [X]: ${error.message}`)
      return res.status(500).json(returnError('Ocurrió un error interno al eliminar de la identificación'))
    }
  }