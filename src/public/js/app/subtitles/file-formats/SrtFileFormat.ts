import SubtitleEntry from './../SubtitleEntry.js'
import SubtitleTime from './../SubtitleTime.js'

export default class SrtFileFormat{

    /* Example of the file format:
      1
      00:00:17,452 --> 00:00:19,993
      The war is over.
      Winter has come.

      2
      00:00:20,285 --> 00:00:21,701
      The war is not over.

    */
    
    public static fromText(text: string): SubtitleEntry[]{
        const ans: SubtitleEntry[] = [];
        let curr: SubtitleEntry;

        const indexRegex: RegExp = /^\d+$/;
        const timeRegex: RegExp = /^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$/;

        // Changing Windows line endings to Unix ones
        text = text.replace(/\r\n/g, '\n');

        // Splitting on each subtitle entry (usually four lines)
        let tsplitted: string[] = text.split(/\n{2,}/g);

        // Due to how we split and to how a srt file should be formatted (empty
        // row at the end of the file), the last entry of the lines should be an empty line.
        // This is simply discarded.
        let lastLine:string = tsplitted.pop() || "";
        if (lastLine !== "")
          throw `Incorrectly formatted SRT file. The last line should be empty, was ${lastLine}`

        tsplitted.forEach(entry => {
            
            // Creating a new entry
            curr = new SubtitleEntry();

            // Splitting each entry in lines and parsing the lines
            let lines = entry.split(/\n/g);           
            let indexLine = lines[0];
            let timeLine = lines[1];
            let textLines = lines.slice(2, lines.length);

            if (!indexLine.match(indexRegex))
              throw `Index line malformed, value ${indexLine} not recognized`;

            if (!timeLine.match(timeRegex))
              throw `Time line malformed, value ${timeLine} not recognized`;
        
            // Parsing index line
            curr.index = parseInt(indexLine);
            
            // Parsing time line
            let matches = timeRegex.exec(timeLine) || [];
            
            // Extracting start time from time line
            let st: SubtitleTime = new SubtitleTime();
            st.hours = parseInt(matches[1]);
            st.minutes = parseInt(matches[2]);
            st.seconds = parseInt(matches[3]);
            st.milliseconds = parseInt(matches[4]);
            curr.start = st;

            // Extracting end time from time line
            st = new SubtitleTime();
            st.hours = parseInt(matches[5]);
            st.minutes = parseInt(matches[6]);
            st.seconds = parseInt(matches[7]);
            st.milliseconds = parseInt(matches[8]);
            curr.end = st;

            // Parsing the text lines.
            curr.text = textLines.join(`\n`);
          
            // Adding the current entry to the final list
            ans.push(curr);
        });

        return ans;
    }

    public static fromSubtitles(subs: SubtitleEntry[]): string{
        let ans: string = "";

        subs.forEach(se => {
          ans += `${se.index}\n`;
          ans += `${se.start.toString()} --> ${se.end.toString()}\n`;
          ans += `${se.text}\n\n`;
        });

        return ans;
    }

};
