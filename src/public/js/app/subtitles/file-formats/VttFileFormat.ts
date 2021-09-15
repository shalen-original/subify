import SubtitleEntry from './../SubtitleEntry.js'
import SubtitleTime from './../SubtitleTime.js'

export default class VttFileFormat{

    /* Example of the file format:
      1
      00:00:17.452 --> 00:00:19.993
      - The war is over.
      - Winter has come.

      2
      00:00:20.285 --> 00:00:21.701
      - The war is not over.
      
      But actually it is much more complex than this. Look here.
      https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
    */
    
    public static fromText(text: string): SubtitleEntry[]{
        throw 'Functionality not supported';
    }

    public static fromSubtitles(subs: SubtitleEntry[]): string{
        let ans: string = "WEBVTT\n\n";

        subs.forEach(se => {

          let sStart: string = `${se.start.getPaddedHours()}:${se.start.getPaddedMinutes()}:${se.start.getPaddedSeconds()}.${se.start.getPaddedMilliseconds()}`;
          let sEnd: string = `${se.end.getPaddedHours()}:${se.end.getPaddedMinutes()}:${se.end.getPaddedSeconds()}.${se.end.getPaddedMilliseconds()}`;
          ans += `${sStart} --> ${sEnd}\n`;

          ans += `${se.text}\n\n`;
        });

        return ans;
    }

};
