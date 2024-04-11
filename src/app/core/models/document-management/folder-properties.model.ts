export class FoldersPropertiesModel {

    id?: number;
    name?: string;
    value?: string;

    folder: {
        id: number;
        folderName: string;
        enviroment: string;
        storage: string;
        type: string;
        sizes: 0;
        location: string;
        created: any;
        createdBy: string;
        accessControl: string;
    }

}