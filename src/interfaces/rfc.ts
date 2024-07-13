export interface IRFC {
    tipo_busqueda:    string;
    clave_entidad:    string;
    dia_nacimiento:   string;
    mes_nacimiento:   string;
    nombres:          string;
    primer_apellido:  string;
    segundo_apellido: string;
    anio_nacimiento:  string;
    sexo:             string;
}


export interface IRFCResponse {
    status:  string;
    message: string;
    data:    Data;
    code:    number;
}

export interface Data {
    gdata:    string;
    curpdata: Curpdatum[];
    files:    any[];
    guid:     string;
}

export interface Curpdatum {
    parametro:             string;
    fechaNacimiento:       string;
    docProbatorio:         number;
    segundoApellido:       string;
    curp:                  string;
    nombres:               string;
    primerApellido:        string;
    sexo:                  string;
    claveEntidad:          string;
    statusCurp:            string;
    nacionalidad:          string;
    entidad:               string;
    datosDocProbatorio:    DatosDocProbatorio;
    descriptionStatusCurp: string;
}

export interface DatosDocProbatorio {
    entidadRegistro:        string;
    tomo:                   string;
    claveMunicipioRegistro: string;
    anioReg:                string;
    claveEntidadRegistro:   string;
    foja:                   string;
    numActa:                string;
    libro:                  string;
    municipioRegistro:      string;
}
