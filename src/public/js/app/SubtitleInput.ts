import EventBus from './EventBus.js';

export default class SubtitleInput {
    
    // Fired every time a new subtitle file is uploaded through the <input> tag
    public static readonly EVT_SUBTITLE_FILE_CHANGED: string = 'SubtitleFileChanged';

    private inputElement: HTMLInputElement;
    private subtitleFile: File;
    private eventBus: EventBus;

    constructor(inputEl: HTMLInputElement, eBus: EventBus){
      this.inputElement = inputEl;
      this.eventBus = eBus;

      this.inputElement.addEventListener('change', this.onSubtitleChange.bind(this));
    }

    private onSubtitleChange(evt: Event): void{
      let trg = evt.target as HTMLInputElement;
      if(!trg || !trg.files || !trg.files[0]) throw 'evt.target should not be null';
      let file = trg.files[0];
      if(!file) throw 'evt.target.files should not be null';

      this.subtitleFile = file;

      // In order to allow the upload of a second subtitle file,
      // that is, to switch subtitle file loaded, we have to clear the 
      // input tag used. If we do not do this, the <input type="file"> element
      // will not trigger again this event when a new subtitle file is selected.
      this.inputElement.value = '';
      
      
      this.eventBus.dispatchEvent(new CustomEvent(SubtitleInput.EVT_SUBTITLE_FILE_CHANGED, {
          detail: { subtitleFile: this.subtitleFile }
      }));
    }
}
