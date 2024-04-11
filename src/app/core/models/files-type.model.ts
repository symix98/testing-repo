export class FilesType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class DocumentsType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class DocumentSubType {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class Discipline {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class Status {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
}

export class Organizer {
    id?: number;
    name?: string;
    code?: string;
    type?: string;
    description?: string;
}

export class Recipient {
    id?: number;
    name?: string;
    code?: string;
    type?: string;
    description?: string;
}

export class AcceptanceCode {
    id?: number;
    number?: number;
    name?: string;
}

export class Categories {
    id?: number;
    number?: number;
    name?: string;
    targetAcceptNumber?: number;
    result?: string;
}

export class Area {
    id?: number;
    name?: string;
    description?: string;
}

export class SubArea {
    id?: number;
    name?: string;
    description?: string;
    areaId?: number;
}

export class Location {
    id?: number;
    name?: string;
    description?: string;
}

export class Roles {
    roleId?: string;
    description?: string;
}