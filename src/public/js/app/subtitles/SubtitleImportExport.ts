import SubtitleEntry from './SubtitleEntry.js';
import SrtFileFormat from './file-formats/SrtFileFormat.js';
import VttFileFormat from './file-formats/VttFileFormat.js';

export default class SubtitleImportExport{

    private static readonly FILE_FORMATS: {[key: string]: any} = {
        'srt' : SrtFileFormat,
        'vtt' : VttFileFormat 
    };

    public static fromFile(subtitleFile: File):Promise<SubtitleEntry[]> {
        return new Promise((resolve, reject) => {
            // Extracting the extension from the file name
            let fname: string = subtitleFile.name;
            let ext: string = fname.substring(fname.lastIndexOf('.') + 1);

            // Reading the file as text and call the appropriate
            // parser for the subtitle format
            let fr:FileReader = new FileReader();
            fr.addEventListener('loadend', evt => {
                let subs = SubtitleImportExport.FILE_FORMATS[ext].fromText(fr.result);
                resolve(subs);
            });
            fr.addEventListener('error', evt => {
                reject("Cannot read file");
            });

            fr.readAsText(subtitleFile);
        });
    };

    public static toBlobUrl(ses: SubtitleEntry[], fileformat: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Converting the list to a string
            let subsString = SubtitleImportExport.FILE_FORMATS[fileformat].fromSubtitles(ses);

            // Storing the string in a blob and generating a URL
            let stype: string = fileformat === 'vtt' ? 'text/vtt': 'text/plain';
            let b: Blob = new Blob([subsString], {type: stype});
            resolve(URL.createObjectURL(b));
        });
    };

}
