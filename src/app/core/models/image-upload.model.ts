import { Observable } from 'rxjs';

export class ImageUpload {
    saveEvent?: Observable<void>;
    nextEvent?: any;
    disabled?: boolean;
    elementImageFieldName?: string; //example fileName in spool form details
    imageFileFieldNames?: string[] = []; //list the name of the fields we want to include when saving the image. They will form the name of the saved image file 
    separator?: string; //character separating the fields of the saved image
}