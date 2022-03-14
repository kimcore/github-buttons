export type FileType = 'png' | 'jpeg';
export type ButtonStyle = 'primary' | 'secondary';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    style: ButtonStyle;
    fontSize: number;
    fontWeight: number;
    width: number;
    height: number;
}
