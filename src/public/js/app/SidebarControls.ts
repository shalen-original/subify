import EventBus from './EventBus.js';
import SubtitleTable from './SubtitleTable.js';
import SubtitleInput from './SubtitleInput.js';
import SubtitleEntry from './subtitles/SubtitleEntry.js';
import SubtitleTime from './subtitles/SubtitleTime.js';
import SubtitleImportExport from './subtitles/SubtitleImportExport.js';

export default class SidebarControls {

    private eventBus: EventBus;
    private exportButton: HTMLElement;
    private shiftFwdBtn: HTMLElement;
    private shiftBkwBtn: HTMLElement;

    private createNewSubtitlesButton: HTMLElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        let elExp: HTMLElement | null = document.getElementById("btn-export");
        let elNSB: HTMLElement | null = document.getElementById("sat--create-new");

        if (!elExp) throw 'The export button cannot be null';
        if (!elNSB) throw 'The create new subtitles button cannot be null';

        this.exportButton = elExp;
        this.createNewSubtitlesButton = elNSB;

        this.onSubtitleTextChanged = this.onSubtitleTextChanged.bind(this);
        this.onCreateNewSubtitlesButtonClick = this.onCreateNewSubtitlesButtonClick.bind(this);

        this.createNewSubtitlesButton.addEventListener("click", this.onCreateNewSubtitlesButtonClick);
        this.eventBus.addEventListener(SubtitleTable.EVT_SUBTITLE_TEXT_CHANGED, this.onSubtitleTextChanged);
    }

    private onSubtitleTextChanged(evt: CustomEvent): void{
        // Sets the URL of the current version of the subtitles
        // as the link to download when clicking on the "Save" button
        this.exportButton.setAttribute("href", evt.detail.fileUrl || "");
    }

    private async onCreateNewSubtitlesButtonClick(): Promise<void> {
        let cues: SubtitleEntry[] = [];
        cues[0] = new SubtitleEntry();
        cues[0].index = 0;
        cues[0].start = new SubtitleTime();
        cues[0].end = new SubtitleTime();
        cues[0].text = "New entry";
        
        let url: string = await SubtitleImportExport.toBlobUrl(cues, 'srt');
        let blob: Blob = await (await fetch(url)).blob();
        let file: File = new File([blob], "subtitles.srt");
        this.eventBus.dispatchEvent(new CustomEvent(SubtitleInput.EVT_SUBTITLE_FILE_CHANGED, {
            detail: { subtitleFile: file }
        }));
    }

}
