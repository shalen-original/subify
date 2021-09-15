import SubtitleTime from './SubtitleTime.js';

export default class SubtitleEntry{
    public index: number;
    public start: SubtitleTime;
    public end: SubtitleTime;
    public text: string;
    
    [index: string]: number | string | SubtitleTime;
}
