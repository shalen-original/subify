import EventBus from './EventBus.js';
import SubtitleInput from './SubtitleInput.js';
import SubtitleEntry from './subtitles/SubtitleEntry.js';
import SubtitleTime from './subtitles/SubtitleTime.js';
import SubtitleImportExport from './subtitles/SubtitleImportExport.js';
import LocalVideo from './LocalVideo.js';
import ErrorModalWindow from './modals/ErrorModalWindow.js';
import TimeInputModalWindow from './modals/TimeInputModalWindow.js';

export default class SubtitleTable{

    // Fired every time something of the currently loaded subtitle is edited
    public static readonly EVT_SUBTITLE_TEXT_CHANGED: string = 'SubtitleTextChanged';

    private tableElement: HTMLTableElement;
    private tableHeaderElement: HTMLTableElement;
    private startupElement: HTMLElement;
    private eventBus: EventBus;
    private subtitles: SubtitleEntry[];
    private previousSubtitleUrl: string | null;

    /* Sidebar controls that act on subtitles*/
    private addLineBtn: HTMLElement;
    private removeLineBtn: HTMLElement;
    private shiftFwdBtn: HTMLElement;
    private shiftBkwBtn: HTMLElement;

    // Subtitle Rable row list
    private tableRowList: HTMLTableRowElement[];

    private currentlySelectedCell: HTMLElement | null;
    private isVideoPlaying: boolean;
    private showModal: (err: string) => void;

    constructor(tableElement: HTMLTableElement, tableHeaderElement: HTMLTableElement, 
                startupElement: HTMLElement, addLineBtn: HTMLElement, removeLineBtn: HTMLElement,
                shiftFwdBtn: HTMLElement, shiftBkwBtn: HTMLElement, eBus: EventBus){
        this.subtitles = [];
        this.eventBus = eBus;
        this.tableElement = tableElement;
        this.tableHeaderElement = tableHeaderElement;
        this.startupElement = startupElement
        this.previousSubtitleUrl = null;
        this.tableRowList = new Array<HTMLTableRowElement>();
        this.currentlySelectedCell = null;

        this.onBtnAddNewLineClick = this.onBtnAddNewLineClick.bind(this);
        this.onBtnRemoveLineClick = this.onBtnRemoveLineClick.bind(this);
        this.onBtnShiftFwdClick = this.onBtnShiftFwdClick.bind(this);
        this.onBtnShiftBkwClick = this.onBtnShiftBkwClick.bind(this);
        this.redrawSubtitleTable = this.redrawSubtitleTable.bind(this);
        this.tdFromString = this.tdFromString.bind(this);
        this.trFromEntry = this.trFromEntry.bind(this);

        this.addLineBtn = addLineBtn;
        this.removeLineBtn = removeLineBtn;
        this.shiftFwdBtn = shiftFwdBtn;
        this.shiftBkwBtn = shiftBkwBtn;

        this.addLineBtn.addEventListener("click", this.onBtnAddNewLineClick);
        this.removeLineBtn.addEventListener("click", this.onBtnRemoveLineClick);
        this.shiftFwdBtn.addEventListener("click", this.onBtnShiftFwdClick);
        this.shiftBkwBtn.addEventListener("click", this.onBtnShiftBkwClick);

        // New subtitle file uploaded
        this.eventBus.addEventListener(SubtitleInput.EVT_SUBTITLE_FILE_CHANGED, this.onSubtitleChange.bind(this));

        // Subtitle track updated
        this.eventBus.addEventListener(LocalVideo.EVT_SUBTITLE_UPDATED, this.onSubTitleTrackUpdate.bind(this));

        // Video playing or not
        this.isVideoPlaying = false;
        this.eventBus.addEventListener(LocalVideo.EVT_VIDEO_PLAY, (_: any) => {this.isVideoPlaying = true;});
        this.eventBus.addEventListener(LocalVideo.EVT_VIDEO_PAUSE, (_: any) => {this.isVideoPlaying = false;});

        // Pression of <ESC> blurs currently selected cell
        window.addEventListener('keyup', evt => {
            if (evt.keyCode == 27 && this.currentlySelectedCell) {
                this.currentlySelectedCell.blur();
            }
        });

        // Utility to show modal error message
        this.showModal = (err: string) => {
            let details = {detail: {msg: err}};
            this.eventBus.dispatchEvent(new CustomEvent(ErrorModalWindow.EVT_ERROR_MODAL_SHOW, details));
        };
    }

    private onSubtitleChange(evt: CustomEvent): void{
        this.startupElement.classList.add("hidden");
        this.tableHeaderElement.classList.remove("hidden");
        this.tableElement.classList.remove("hidden");

        SubtitleImportExport.fromFile(evt.detail.subtitleFile)
        .then(lst => {
            this.subtitles = lst;
            this.redrawSubtitleTable();
        });
    }

    private redrawSubtitleTable(): void {
        let oldTBody: HTMLElement = this.tableElement.querySelector("tbody") as HTMLElement;
        let newTBody: HTMLElement = document.createElement("tbody");

        this.subtitles.forEach((el: SubtitleEntry) => {
            newTBody.appendChild(this.trFromEntry(el));
        });

        this.tableElement.replaceChild(newTBody, oldTBody);

        // Used to highlight currently shown subtitle
        let rl = this.tableElement.getElementsByTagName('tr');
        this.tableRowList = Array.prototype.slice.call(rl);
        this.launchSubtitleUpdatedEvent();
    }

    private trFromEntry(el: SubtitleEntry): HTMLTableRowElement{
        let tr: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;

        tr.appendChild(this.tdFromString(el, el.index.toString(), "index"));
        tr.appendChild(this.tdFromString(el, el.start.toString(), "start"));
        tr.appendChild(this.tdFromString(el, el.end.toString(), "end"));
        tr.appendChild(this.tdFromString(el, el.text, "text"));

        return tr;
    }

    private tdFromString(el: SubtitleEntry, txt: string, propertyName: string): HTMLTableDataCellElement{
        // For each cell, the "contenteditable" attribute is added.
        // This allows to edit the subtitle contents. Additionally,
        // two handlers are registered. One is for the "focus" event,
        // which is used to highlight the cell being currently edited.
        // The other is a handler for the "blur" (focus lost) event is registered for
        // every cell: this handler is responsibile for updating the
        // subtitles shown in the video

        let td: HTMLTableDataCellElement;

        td = document.createElement("td") as HTMLTableDataCellElement;
        td.setAttribute("contenteditable", "true");
        td.addEventListener("blur", this.onCellBlur.bind(this, td, el, propertyName));
        td.addEventListener("focus", this.onCellFocus.bind(this, td));
        td.appendChild(document.createTextNode(txt));

        return td;
    }

    private onCellFocus(tc: HTMLElement): void{
        tc.classList.add("editing");
        this.currentlySelectedCell = tc;
    }

    private onCellBlur(tc: HTMLElement, el: SubtitleEntry, propertyToChange: string): void{

        tc.classList.remove("editing");

        // Update the local SubtitleEntry list

        if (propertyToChange == "text"){
            el[propertyToChange] = tc.textContent || '';
        }

        if (propertyToChange == "index"){
            let n = parseInt(tc.textContent || '');

            if (isNaN(n)) {
                tc.innerText = el[propertyToChange] + "";
                this.showModal("The index must be a number!");
            } else {
                el[propertyToChange] = n;
            }
        }

        if (propertyToChange == "start" || propertyToChange == "end"){
            try {
                el[propertyToChange] = SubtitleTime.fromString(tc.textContent || '00:00:00,000');
            } catch (e) {
                tc.innerText = el[propertyToChange] + "";
                this.showModal(`The ${propertyToChange} must be in the format hh:mm:ss,SSS`);
            }
        }

        // Notify the world that subtitles have changed
        this.launchSubtitleUpdatedEvent();
    };

    private launchSubtitleUpdatedEvent(): void{
        let pr: Promise<string> = SubtitleImportExport.toBlobUrl(this.subtitles, "vtt");
        
        // Not completely safe, I know. Other parts of the application may try to use
        // the revoked URL between now and when the new url is published. I like to live
        // dangerously.
        if (this.previousSubtitleUrl)
          URL.revokeObjectURL(this.previousSubtitleUrl);

        pr.then(url => {
          this.previousSubtitleUrl = url;

          let details = {
            detail: {
              fileUrl: url
            }
          };

          this.eventBus.dispatchEvent(new CustomEvent(SubtitleTable.EVT_SUBTITLE_TEXT_CHANGED, details));
        });
    }

    // Subtitle track is updated
    private onSubTitleTrackUpdate(evt: CustomEvent): void {
        let start: number = evt.detail.subStart*1000;
        let end: number = evt.detail.subEnd*1000;

        // TODO: verify if we can find index of current subtitle
        // EDIT: ID of each line is not necessarly unique.
        this.tableRowList.forEach((tr: HTMLTableRowElement) => {
            let trStart = SubtitleTime.fromString(tr.cells[1].innerText).toMilliseconds();
            let trEnd = SubtitleTime.fromString(tr.cells[2].innerText).toMilliseconds();

            if(trStart < start || trEnd > end) { tr.classList.remove('active'); }
            else if(trStart >= start && trEnd <= end) { 
                tr.classList.add('active'); 
                if(this.isVideoPlaying)
                    this.scrollIntoView(tr);
                //tr.scrollIntoView(true);
            }
        });
    }

    private scrollIntoView(el: Element){
        let elRect: DOMRect = el.getBoundingClientRect();

        if (!el.parentElement)
            throw 'Error: the element to scroll is not in the expected hierarchy'

        let tbodyRect: DOMRect= el.parentElement.getBoundingClientRect();
        let tRect: DOMRect = this.tableElement.getBoundingClientRect();

        if (!tbodyRect)
            throw 'Error: the element to scroll is not in the expected hierarchy'
        
        let elPos: number = elRect.y + elRect.height / 2;
        let threeQuarterTpos: number = tRect.y + (3/4) * tRect.height;
        let oneQuarterTpos: number = tRect.y + (1/4) * tRect.height;

        // If the "el" is below 3/4 of the table, it is scrolled up to
        // 1/4 of the table
        if (elPos < tRect.y || elPos > threeQuarterTpos){
            let scrollDest = this.tableElement.scrollTop + (elPos - oneQuarterTpos);
            this.tableElement.scrollTo({top:scrollDest, behavior: 'smooth'});
        }
    }

    private onBtnAddNewLineClick() {
        if (!this.currentlySelectedCell) {
            this.showModal("Click on the row before which the new line should be inserted");
            return;
        }

        let selectedRow: HTMLElement = this.currentlySelectedCell.parentElement as HTMLElement;
        let selectedTBody: HTMLElement = selectedRow.parentElement as HTMLElement;
        let selectedRowIndex: number = Array.from(selectedTBody.children).indexOf(selectedRow);
        let selectedSubtitleIndex: number = selectedRowIndex;
        let selectedEntry: SubtitleEntry = this.subtitles[selectedSubtitleIndex];

        let newCue: SubtitleEntry = new SubtitleEntry();
        newCue.index = 0;
        newCue.start = selectedEntry.start;
        newCue.end = selectedEntry.end;
        newCue.text = "New entry";

        // Add the new entry in the correct position
        this.subtitles.splice(selectedSubtitleIndex, 0, newCue);
        selectedTBody.insertBefore(this.trFromEntry(newCue), selectedRow);

        let rl = this.tableElement.getElementsByTagName('tr');
        this.tableRowList = Array.prototype.slice.call(rl);
        this.launchSubtitleUpdatedEvent();
    }

    private onBtnRemoveLineClick() {
        if (!this.currentlySelectedCell) {
            this.showModal("Select the row to be deleted before clicking the 'Delete' button");
            return;
        }

        let selectedRow: HTMLElement = this.currentlySelectedCell.parentElement as HTMLElement;
        let selectedTBody: HTMLElement = selectedRow.parentElement as HTMLElement;
        let selectedRowIndex: number = Array.from(selectedTBody.children).indexOf(selectedRow);
        let selectedSubtitleIndex: number = selectedRowIndex;

        // Remove the subtitle line
        this.subtitles.splice(selectedSubtitleIndex, 1);
        selectedTBody.removeChild(selectedRow);
        this.currentlySelectedCell = null;

        let rl = this.tableElement.getElementsByTagName('tr');
        this.tableRowList = Array.prototype.slice.call(rl);
        this.launchSubtitleUpdatedEvent();

    }

    private onBtnShiftFwdClick(){
        let details = { detail: {
            msg: "Insert the amount to shift forward:",
            onSuccess: (st: SubtitleTime) => {
                this.subtitles.forEach(el => {
                    el.start = el.start.add(st);
                    el.end = el.end.add(st);
                });
                this.redrawSubtitleTable();
            },
            onFailure: () => {/* No operation required*/}
        }}

        this.eventBus.dispatchEvent(new CustomEvent(TimeInputModalWindow.EVT_TIME_INPUT_MODAL_SHOW, details));
    }

    private onBtnShiftBkwClick(){
        let details = { detail: {
            msg: "Insert the amount to shift backward:",
            onSuccess: (st: SubtitleTime) => {
                this.subtitles.forEach(el => {
                    el.start = el.start.subtract(st);
                    el.end = el.end.subtract(st);
                });
                this.redrawSubtitleTable();
            },
            onFailure: () => {/* No operation required*/}
        }}

        this.eventBus.dispatchEvent(new CustomEvent(TimeInputModalWindow.EVT_TIME_INPUT_MODAL_SHOW, details));
    }
};
