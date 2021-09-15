export default class SubtitleTime{
    private _hours: number;
    private _minutes: number;
    private _seconds: number;
    private _milliseconds: number;

    constructor(){
        this._hours = 0;
        this._minutes = 0;
        this._seconds = 0;
        this._milliseconds = 0;
    }

    get hours(): number { return this._hours };
    get minutes(): number { return this._minutes };
    get seconds(): number { return this._seconds };
    get milliseconds(): number { return this._milliseconds };

    set hours(hours: number){
        if (!Number.isInteger(hours)) throw 'Number of hours must be an integer';
        if (hours < 0) throw 'Number of hours must be positive';
        this._hours = hours;
    }

    set minutes(minutes: number){
        if (!Number.isInteger(minutes)) throw 'Number of minutes must be an integer';
        if (minutes < 0 || minutes > 59) throw 'Number of minutes must be between 0 and 59, inclusive';
        this._minutes = minutes;
    }

    set seconds(seconds: number){
        if (!Number.isInteger(seconds)) throw 'Number of seconds must be an integer';
        if (seconds < 0 || seconds > 59) throw 'Number of seconds must be between 0 and 59, inclusive';
        this._seconds = seconds;
    }

    set milliseconds(milliseconds: number){
        if (!Number.isInteger(milliseconds)) throw 'Number of milliseconds must be an integer';
        if (milliseconds < 0 || milliseconds > 999) throw 'Number of milliseconds must be between 0 and 999, inclusive';
        this._milliseconds = milliseconds;
    }

    getPaddedHours(): string { return this._hours.toString().padStart(2, "0"); }
    getPaddedMinutes(): string { return this._minutes.toString().padStart(2, "0"); }
    getPaddedSeconds(): string { return this._seconds.toString().padStart(2, "0"); }
    getPaddedMilliseconds(): string { return this._milliseconds.toString().padStart(3, "0"); }

    // Takes a string generated with the toString method
    // and returns a SubtitleTime instance
    public static fromString(str: string): SubtitleTime{
        const re: RegExp = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/;
        if (! str.match(re))
            throw 'The string is not in the expected format';

        const spl: string[] = re.exec(str) || [];

        const ans = new SubtitleTime();
        ans.hours = parseInt(spl[1]);
        ans.minutes = parseInt(spl[2]);
        ans.seconds = parseInt(spl[3]);
        ans.milliseconds = parseInt(spl[4]);

        return ans;
    }

    toMilliseconds(): number{
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60; 
        const msInHours = msInMinute * 60;

        return this._milliseconds + this._seconds * msInSecond + this._minutes * msInMinute + this._hours * msInHours;
    }

    toString(): string{
        let h = this.getPaddedHours();
        let m = this.getPaddedMinutes();
        let s = this.getPaddedSeconds();
        let ms = this.getPaddedMilliseconds();

        return `${h}:${m}:${s},${ms}`;
    }

    add(st: SubtitleTime): SubtitleTime{
        let h, m, s, ms: number;
        h = this.hours + st.hours;
        m = this.minutes + st.minutes;
        s = this.seconds + st.seconds;
        ms = this.milliseconds + st.milliseconds;

        while (ms > 999) { ms -= 1000; s += 1;}
        while (s > 59) {s -= 60; m += 1; }
        while (m > 59) {m -= 60; h += 1; }

        let ans = new SubtitleTime();
        ans.hours = h;
        ans.minutes = m;
        ans.seconds = s;
        ans.milliseconds = ms;

        return ans;
    }

    subtract(st: SubtitleTime): SubtitleTime{
        let h, m, s, ms: number;

        h = this.hours - st.hours;

        m = this.minutes - st.minutes;
        while (m < 0 && h > 0) { h -= 1; m += 60;}

        s = this.seconds - st.seconds;
        while (s < 0 && m > 0) {m -= 1; s += 60;}

        ms = this.milliseconds - st.milliseconds;
        while (ms < 0 && s > 0) {s -= 1; ms += 1000;}

        let ans = new SubtitleTime();
        if (h < 0 || m < 0 || s < 0 || ms < 0)
            return ans;

        ans.hours = h;
        ans.minutes = m;
        ans.seconds = s;
        ans.milliseconds = ms;

        return ans;
    }
};
